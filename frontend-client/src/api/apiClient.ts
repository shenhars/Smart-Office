// src/api/apiClient.ts
export const BASE_URL_AUTH = "http://localhost:5000/api";
export const BASE_URL_RESOURCE = "http://localhost:5002/api";

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }), // Auto-attach JWT 
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    // Include response text when throwing for better debugging
    const errText = await response.text().catch(() => '');
    const msg = errText ? `API Request Failed: ${errText}` : 'API Request Failed';
    throw new Error(msg);
  }

  // Some endpoints return no content (204) or an empty body. Safely parse JSON only when present.
  const text = await response.text().catch(() => '');
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    // If parsing fails, return raw text for callers to handle as needed
    return text;
  }
};