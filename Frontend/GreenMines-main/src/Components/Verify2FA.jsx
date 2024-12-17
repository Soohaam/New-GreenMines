import React, { useState } from 'react';
import { TextField, Button, Typography, Container, InputAdornment, IconButton, Alert } from '@mui/material';
import { Lock, LockOpen } from '@mui/icons-material';
import axios from 'axios';

function Verify2FA() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify-2fa', { code });
      setMessage(response.data.msg);
    } catch (error) {
      setMessage('Verification failed: ' + (error.response?.data?.msg || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-[#342F49] py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
  <Container
    maxWidth="sm"
    className="verify-2fa-container bg-gray-900 rounded-md p-10 shadow-lg"
    style={{ minHeight: '50vh' }} // Adjusted container height for a balanced form
  >
    <Typography
      variant="h4"
      align="center"
      gutterBottom
      className="verify-2fa-title text-[#66C5CC] font-bold text-3xl sm:text-4xl"
    >
      Verify Two-Factor Authentication
    </Typography>
    <div className="verify-2fa-icon flex justify-center mb-6">
      <Lock fontSize="large" style={{ color: '#66C5CC' }} />
    </div>
    <TextField
      label="2FA Code"
      variant="outlined"
      fullWidth
      margin="normal"
      value={code}
      onChange={(e) => setCode(e.target.value)}
      className="verify-2fa-field"
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
      className="verify-2fa-button"
      style={{
        backgroundColor: '#66C5CC',
        color: '#1A202C',
        marginTop: '1rem',
        fontSize: '1.2rem', // Increase button text size
      }}
    >
      Verify Code
    </Button>
    {message && (
      <Alert
        severity={message.includes('failed') ? 'error' : 'success'}
        className="verify-2fa-alert text-[#66C5CC] mt-2"
      >
        {message}
      </Alert>
    )}
  </Container>
</div>

  );
}

export default Verify2FA;
