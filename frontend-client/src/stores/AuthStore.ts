import { makeAutoObservable } from 'mobx';

// Minimal JWT payload parser to avoid build-time interop issues with the
// `jwt-decode` package in the production build. This is sufficient for
// extracting simple claims like role.
function parseJwt(token: string | null): any | null {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

class AuthStore {
  token: string | null = localStorage.getItem('token');
  isAuthenticated: boolean = !!localStorage.getItem('token'); // THIS LINE FIXES TS2339

  get userRole(): string | null {
    const payload = parseJwt(this.token);
    if (!payload) return null;
    return (
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      payload['role'] ||
      null
    );
  }

  constructor() {
    makeAutoObservable(this);
  }

  async login(email: string, password: string) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        // Persist token before flipping authenticated flag so reactions/readers
        // that read from localStorage will see the token immediately.
        localStorage.setItem('token', data.token);
        this.isAuthenticated = true;
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    localStorage.removeItem('token');
  }

  async register(email: string, password: string, name: string, role: string) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role })
      });

      if (response.ok) {
        alert("Registration successful! Please login.");
        return true;
      } else {
        const errorData = await response.json();
        console.error("Registration failed", errorData);
        return false;
      }
    } catch (error) {
      console.error("Connection error", error);
      return false;
    }
  }
}

export const authStore = new AuthStore();