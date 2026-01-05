import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Container, TextField, Button, Typography, Box, Paper, Link, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { authStore } from '../stores/AuthStore';

const Login = observer(() => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Added for registration
  const [role, setRole] = useState('Member');

  const handleAuth = async () => {
    if (isRegister) {
      const ok = await authStore.register(email, password, name, role);
      if (ok) setIsRegister(false); // Move to login after successful registration
    } else {
      await authStore.login(email, password);
    }
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
          />
          <TextField
            fullWidth label="Password" type="password" margin="normal"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button
            fullWidth variant="contained" color="primary" sx={{ mt: 3 }}
            onClick={handleAuth}
          >
            {isRegister ? 'Register' : 'Sign In'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link component="button" variant="body2" onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
});

export default Login;