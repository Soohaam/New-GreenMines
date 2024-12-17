import React, { useState } from 'react';
import { TextField, Button, Typography, Container, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined, VpnKeyOutlined } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [step, setStep] = useState('login'); 
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('email', JSON.stringify(email));
      setStep('verify');
    } catch (error) {
      setError('Login failed: ' + (error.response?.data?.msg || error.message));
    }
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify-2fa', { email, twoFactorCode });
      const { token} = response.data; // assuming the response includes the user data
      localStorage.setItem('token', token);
      navigate('/profile'); // Navigate to Profile page 
    } catch (error) {
      setError('2FA verification failed: ' + (error.response?.data?.msg || error.message));
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen bg-[#342F49] py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <Container
      maxWidth="sm"
      className="login-container bg-gray-900 rounded-md p-10 shadow-lg"
      style={{ minHeight: '50vh' }} // Increase the height of the container
    >
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        className="login-title text-[#66C5CC] font-bold text-3xl sm:text-4xl lg:text-5xl"
      >
        {step === 'login' ? 'Login' : 'Verify 2FA Code'}
      </Typography>
      <form noValidate autoComplete="off">
        {step === 'login' ? (
          <>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined style={{ color: '#66C5CC' }} />
                  </InputAdornment>
                ),
              }}
              className="login-field"
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
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined style={{ color: '#66C5CC' }} />
                  </InputAdornment>
                ),
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
              className="login-field"
              style={{
                backgroundColor: '#2E2E2E',
                borderRadius: '5px',
                fontSize: '1rem', // Adjust font size for better visibility
              }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              className="login-button"
              style={{
                backgroundColor: '#66C5CC',
                color: '#1A202C',
                marginTop: '1rem',
                fontSize: '1.2rem', // Increase button text size
              }}
            >
              Login
            </Button>
          </>
        ) : (
          <>
            <TextField
              label="2FA Code"
              variant="outlined"
              fullWidth
              margin="normal"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyOutlined style={{ color: '#66C5CC' }} />
                  </InputAdornment>
                ),
              }}
              className="login-field"
              style={{
                backgroundColor: '#2E2E2E',
                borderRadius: '5px',
                fontSize: '1rem', // Adjust font size for better visibility
              }}
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleVerify}
              className="login-button"
              style={{
                backgroundColor: '#66C5CC',
                color: '#1A202C',
                marginTop: '1rem',
                fontSize: '1.2rem', // Increase button text size
              }}
            >
              Verify Code
            </Button>
          </>
        )}
        <Button
          variant="text"
          fullWidth
          onClick={handleForgotPassword}
          className="forgot-password-button"
          style={{
            color: '#66C5CC',
            marginTop: '1rem',
            textTransform: 'capitalize',
            fontSize: '1rem', // Adjust text size for consistency
          }}
        >
          Forgot Password?
        </Button>
        {error && (
          <Typography color="error" align="center" className="login-error mt-2">
            {error}
          </Typography>
        )}
      </form>
    </Container>
  </div>
  

  );
}

export default Login;
