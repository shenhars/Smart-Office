import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, TextField, Button, Typography, Box, Paper, Link, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material';
import { authStore } from '../stores/AuthStore';

const Login = observer(() => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Added for registration
  const [role, setRole] = useState('Member');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    // reset errors
    setEmailError(null);
    setPasswordError(null);
    setNameError(null);
    setServerError(null);

    // basic client-side validation
    let hasError = false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      hasError = true;
    }

    // Password checks. For registration we enforce complexity rules.
    const pwErrors: string[] = [];
    if (!password) {
      pwErrors.push('Password is required');
    } else {
      if (password.length < 6) pwErrors.push('Password must be at least 6 characters.');
      if (isRegister) {
        if (!/[^A-Za-z0-9]/.test(password)) pwErrors.push('Password must include at least one non-alphanumeric character.');
        if (!/\d/.test(password)) pwErrors.push("Password must include at least one digit ('0'-'9').");
        if (!/[A-Z]/.test(password)) pwErrors.push("Password must include at least one uppercase letter ('A'-'Z').");
      }
    }
    if (pwErrors.length) {
      setPasswordError(pwErrors.join('\n'));
      hasError = true;
    }

    if (isRegister && !name) {
      setNameError('Full name is required');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    if (isRegister) {
      const res = await authStore.register(email, password, name, role) as any;
      if (res && res.success) {
        setIsRegister(false);
      } else {
        // Prefer field-specific errors when present (e.g. DuplicateUserName)
        if (res && Array.isArray(res.errors) && res.errors.length) {
          const dup = res.errors.find((e: any) => (e.code && e.code.toLowerCase() === 'duplicateusername') || (e.description && /already/i.test(e.description)));
          if (dup) {
            setEmailError(dup.description || 'Email already exists');
          } else {
            setServerError(res.message || res.errors.map((e: any) => e.description || JSON.stringify(e)).join('; '));
          }
        } else {
          setServerError(res?.message || 'Registration failed');
        }
      }
    } else {
      const res = await authStore.login(email, password) as any;
      if (res && res.success) {
        // login succeeded; AuthStore updates state
      } else {
        setServerError(res?.message || 'Login failed');
      }
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            {isRegister ? 'Create Account' : 'Smart Office Login'}
          </Typography>
          
          {isRegister && (
            <>
            <TextField
              fullWidth label="Full Name" margin="normal"
              value={name} onChange={(e) => setName(e.target.value)}
              error={!!nameError}
              helperText={nameError || ''}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value as string)}
              >
                <MenuItem value="Member">Member</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
            </>
          )}
          
          <TextField
            fullWidth label="Email" margin="normal"
            value={email} onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError || ''}
          />
          <TextField
            fullWidth label="Password" type="password" margin="normal"
            value={password} onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError || ''}
          />
          
          <Button
            fullWidth variant="contained" color="primary" sx={{ mt: 3 }}
            onClick={handleAuth}
            disabled={loading}
          >
            {isRegister ? 'Register' : 'Sign In'}
          </Button>

          {serverError && (
            <Box sx={{ mt: 2 }}>
              <Alert severity="error">{serverError}</Alert>
            </Box>
          )}

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component="button" variant="body2" onClick={() => {
              setIsRegister(!isRegister);
              setServerError(null);
            }}>
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
});

export default Login;