const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');
const { authenticate } = require('../middleware/auth');

// Disabled old email/password registration - now using OTP only
// router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.me);
router.get('/verify', authController.verify);
router.post('/request-otp', otpController.requestOtp);
router.post('/verify-otp', otpController.verifyOtp);
module.exports = router; 