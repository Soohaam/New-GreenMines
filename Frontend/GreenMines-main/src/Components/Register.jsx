import React, { useState } from 'react';
import { TextField, Button, Typography, Container, InputAdornment, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', { name, email, password });
      setMessage('Registration successful! Redirecting to setup 2FA...');
      setError('');
      setTimeout(() => navigate("/setup-2fa"), 2000);
    } catch (error) {
      setError('Registration failed: ' + (error.response?.data?.msg || error.message));
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#342F49] py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <Container
      maxWidth="sm"
      className="register-container bg-gray-900 rounded-md p-10 shadow-lg"
      style={{ minHeight: '50vh' }} // Increase the container height
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        className="register-title text-[#66C5CC] font-bold text-3xl sm:text-4xl lg:text-5xl"
      >
        Register
      </Typography>
      <form noValidate autoComplete="off">
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="register-field"
          style={{
            backgroundColor: '#2E2E2E',
            borderRadius: '5px',
            fontSize: '1rem', // Adjust font size for better visibility
          }}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="register-field"
          style={{
            backgroundColor: '#2E2E2E',
            borderRadius: '5px',
            fontSize: '1rem', // Adjust font size for better visibility
          }}
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  style={{ color: '#66C5CC' }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          className="register-field"
          style={{
            backgroundColor: '#2E2E2E',
            borderRadius: '5px',
            fontSize: '1rem', // Adjust font size for better visibility
          }}
        />
        {error && (
          <Alert severity="error" className="register-alert text-[#F44336]">
            {error}
          </Alert>
        )}
        {message && (
          <Alert severity="success" className="register-alert text-[#66C5CC]">
            {message}
          </Alert>
        )}
        <Button
          variant="contained"
          fullWidth
          onClick={handleRegister}
          className="register-button"
          style={{
            backgroundColor: '#66C5CC',
            color: '#1A202C',
            marginTop: '1rem',
            fontSize: '1.2rem', // Increase button text size
          }}
        >
          Register
        </Button>
      </form>
    </Container>
  </div>
  
  );
}

export default Register;
