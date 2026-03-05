/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validatePhone, validateOTP, authenticate } = require('../middleware/auth');

module.exports = (pool) => {
  // POST /api/auth/send-otp
  router.post('/send-otp', validatePhone, (req, res, next) => {
    authController.sendOTP(req, res, next, pool);
  });

  // POST /api/auth/verify-otp
  router.post('/verify-otp', validatePhone, validateOTP, (req, res, next) => {
    authController.verifyOTP(req, res, next, pool);
  });

  // POST /api/auth/complete-registration
  router.post('/complete-registration', authenticate, (req, res, next) => {
    authController.completeRegistration(req, res, next, pool);
  });

  // POST /api/auth/refresh-token
  router.post('/refresh-token', (req, res, next) => {
    authController.refreshToken(req, res, next, pool);
  });

  // POST /api/auth/logout
  router.post('/logout', authenticate, (req, res, next) => {
    authController.logout(req, res, next, pool);
  });

  return router;
};
