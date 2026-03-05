/**
 * Authentication & Validation Middleware
 * File: middleware/auth.js and middleware/validation.js
 */

const jwt = require('jsonwebtoken');
const { validatePhoneFormat } = require('../utils/helpers');

// ============ AUTHENTICATION MIDDLEWARE ============

exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Missing or invalid authorization header',
        errorCode: 'UNAUTHORIZED',
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = {
        id: decoded.userId,
        phoneNumber: decoded.phoneNumber,
        type: decoded.type,
      };

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Access token has expired',
          errorCode: 'TOKEN_EXPIRED',
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Invalid access token',
        errorCode: 'INVALID_TOKEN',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication error',
      errorCode: 'AUTH_ERROR',
    });
  }
};

// ============ VALIDATION MIDDLEWARE ============

exports.validatePhone = (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      error: 'Phone number is required',
      errorCode: 'MISSING_PHONE',
    });
  }

  if (!validatePhoneFormat(phoneNumber)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid phone number format. Must be 10 digits.',
      errorCode: 'INVALID_PHONE_FORMAT',
    });
  }

  next();
};

exports.validateOTP = (req, res, next) => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({
      success: false,
      error: 'OTP is required',
      errorCode: 'MISSING_OTP',
    });
  }

  if (!/^[0-9]{4,6}$/.test(otp)) {
    return res.status(400).json({
      success: false,
      error: 'OTP must be 4-6 digits',
      errorCode: 'INVALID_OTP_FORMAT',
    });
  }

  next();
};

exports.validateName = (req, res, next) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      error: 'Name is required',
      errorCode: 'MISSING_NAME',
    });
  }

  if (name.trim().length < 2 || name.trim().length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Name must be between 2 and 100 characters',
      errorCode: 'INVALID_NAME_LENGTH',
    });
  }

  next();
};

// ============ ERROR HANDLER ============

exports.errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = err.statusCode || 500;
  let errorMessage = err.message || 'Internal server error';
  let errorCode = err.errorCode || 'INTERNAL_ERROR';

  // Database errors
  if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    errorMessage = 'Database connection failed';
    errorCode = 'DB_CONNECTION_ERROR';
  }

  // PostgreSQL unique violation
  if (err.code === '23505') {
    statusCode = 409;
    errorMessage = 'Resource already exists';
    errorCode = 'DUPLICATE_RECORD';
  }

  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    errorCode,
    ...(process.env.NODE_ENV === 'development' && { 
      details: err.message,
      stack: err.stack
    }),
  });
};