const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
//const authMiddleware = require('../middleware/auth');

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-2fa', authController.verifyTwoFactor);
router.post('/2fa/enable', authController.enableTwoFactor);
//router.get('/2fa/setup', authMiddleware, authController.setupTwoFactor);

module.exports = router;
