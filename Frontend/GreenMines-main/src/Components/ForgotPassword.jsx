import React, { useState } from 'react';
import { TextField, Button, Typography, Container, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Fade } from '@mui/material';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:5000/api/forgot-password', { email });
      setSuccess('Password reset link sent to your email.');
      setTimeout(() => navigate('/login'), 3000); 
    } catch (error) {
      setError('Failed to send password reset link: ' + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#342F49] py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
  <Container
    maxWidth="sm"
    className="forgot-password-container bg-gray-900 rounded-md p-10 shadow-lg"
    style={{ minHeight: '60vh' }} // Adjusted container height for balance
  >
    <Typography
      variant="h4"
      align="center"
      gutterBottom
      className="forgot-password-title text-[#66C5CC] font-bold text-3xl sm:text-4xl"
    >
      Forgot Password
    </Typography>
    <form noValidate autoComplete="off">
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="forgot-password-field"
        style={{
          backgroundColor: '#2E2E2E',
          borderRadius: '5px',
          fontSize: '1rem', // Adjust font size for better visibility
        }}
      />
      {error && (
        <Typography
          color="error"
          align="center"
          style={{ marginTop: '20px', color: '#F87171' }}
          className="forgot-password-error"
        >
          {error}
        </Typography>
      )}
      {success && (
        <Typography
          color="primary"
          align="center"
          style={{ marginTop: '20px', color: '#66C5CC' }}
          className="forgot-password-success"
        >
          {success}
        </Typography>
      )}
      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleSubmit}
        style={{
          marginTop: '20px',
          backgroundColor: '#66C5CC',
          color: '#1A202C',
          fontSize: '1.4rem', // Increased button font size
        }}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Request Password Reset'
        )}
      </Button>
    </form>
  </Container>
</div>

  );
}

export default ForgotPassword;
