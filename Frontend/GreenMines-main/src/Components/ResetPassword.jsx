import React, { useState } from 'react';
import { TextField, Button, Typography, Container, InputAdornment, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/reset-password', { token, password });
      setSuccess(response.data.msg);
      setError('');
      
      window.alert('Password reset successful! You will be redirected to the login page.');
      navigate('/login');
    } catch (error) {
      setError('Reset password failed: ' + (error.response?.data?.msg || error.message));
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-[#342F49] py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
  <Container
    maxWidth="sm"
    className="reset-password-container bg-gray-900 rounded-md p-10 shadow-lg"
    style={{ minHeight: '60vh' }} // Adjusted container height for balanced form
  >
    <Typography
      variant="h4"
      align="center"
      gutterBottom
      className="reset-password-title text-[#66C5CC] font-bold text-3xl sm:text-4xl"
    >
      Reset Password
    </Typography>
    <form noValidate autoComplete="off">
      <TextField
        label="New Password"
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
        className="reset-password-field"
        style={{
          backgroundColor: '#2E2E2E',
          borderRadius: '5px',
          fontSize: '1rem', // Adjust font size for better visibility
        }}
      />
      <TextField
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        variant="outlined"
        fullWidth
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
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
        className="reset-password-field"
        style={{
          backgroundColor: '#2E2E2E',
          borderRadius: '5px',
          fontSize: '1rem', // Adjust font size for better visibility
        }}
      />
      {error && (
        <Alert severity="error" className="reset-password-alert mt-2 text-[#66C5CC]">
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" className="reset-password-alert mt-2 text-[#66C5CC]">
          {success}
        </Alert>
      )}
      <Button
        variant="contained"
        fullWidth
        onClick={handleResetPassword}
        className="reset-password-button"
        style={{
          backgroundColor: '#66C5CC',
          color: '#1A202C',
          marginTop: '1rem',
          fontSize: '1.2rem', // Increased button font size
        }}
      >
        Reset Password
      </Button>
    </form>
  </Container>
</div>

  );
}

export default ResetPassword;
