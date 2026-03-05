/**
 * Authentication Middleware
 */

const jwt = require('jsonwebtoken');
const { validatePhoneFormat } = require('../utils/helpers');

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
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

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
