/**
 * Authentication Routes
 * File: routes/authRoutes.js
 * 
 * Endpoints:
 * - POST /send-otp
 * - POST /verify-otp
 * - POST /complete-registration
 * - POST /refresh-token
 * - POST /logout
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validatePhone, validateOTP } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

module.exports = (pool) => {
  // Send OTP
  router.post('/send-otp', validatePhone, (req, res, next) => {
    authController.sendOTP(req, res, next, pool);
  });

  // Verify OTP
  router.post('/verify-otp', validatePhone, validateOTP, (req, res, next) => {
    authController.verifyOTP(req, res, next, pool);
  });

  // Complete Registration
  router.post('/complete-registration', authenticate, (req, res, next) => {
    authController.completeRegistration(req, res, next, pool);
  });

  // Refresh Token
  router.post('/refresh-token', (req, res, next) => {
    authController.refreshToken(req, res, next, pool);
  });

  // Logout
  router.post('/logout', authenticate, (req, res, next) => {
    authController.logout(req, res, next, pool);
  });

  return router;
};