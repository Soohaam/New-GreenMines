import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

function Enable2FA() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEnable2FA = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/2fa/enable', { email });
      setMessage(response.data.msg);
      setError('');
      navigate('/');
    } catch (error) {
      setError('Failed to enable 2FA: ' + (error.response?.data?.msg || error.message));
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-[#342F49] py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
    <Container
      maxWidth="sm"
      className="enable-2fa-container bg-gray-900 rounded-md p-10 shadow-lg"
      style={{ minHeight: '50vh' }} // Adjusted container height for a smaller form
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        className="enable-2fa-title text-[#66C5CC] font-bold text-3xl sm:text-4xl"
      >
        Enable 2FA
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="enable-2fa-field"
        style={{
          backgroundColor: '#2E2E2E',
          borderRadius: '5px',
          fontSize: '1rem', // Adjust font size for better visibility
        }}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleEnable2FA}
        className="enable-2fa-button"
        style={{
          backgroundColor: '#66C5CC',
          color: '#1A202C',
          marginTop: '1rem',
          fontSize: '1.2rem', // Increase button text size
        }}
      >
        Enable 2FA
      </Button>
      {message && (
        <Alert severity="success" className="enable-2fa-alert text-[#66C5CC] mt-2">
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" className="enable-2fa-alert text-[#F44336] mt-2">
          {error}
        </Alert>
      )}
    </Container>
  </div>
  
  );
}

export default Enable2FA;
