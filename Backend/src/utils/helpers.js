/**
 * Helper Utilities
 * File: utils/helpers.js
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate 6-digit OTP
 */
exports.generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

/**
 * Hash OTP using SHA256
 */
exports.hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Generate JWT Access & Refresh Tokens
 */
exports.generateTokens = (userId, phoneNumber) => {
  const accessToken = jwt.sign(
    {
      userId,
      phoneNumber,
      type: 'access',
    },
    process.env.JWT_SECRET || 'your-secret-key',
    {
      expiresIn: '1h',
      issuer: 'zenshield-backend',
      algorithm: 'HS256',
    }
  );

  const refreshToken = jwt.sign(
    {
      userId,
      phoneNumber,
      type: 'refresh',
    },
    process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
    {
      expiresIn: '30d',
      issuer: 'zenshield-backend',
      algorithm: 'HS256',
    }
  );

  return { accessToken, refreshToken };
};

/**
 * Validate phone number format (10 digits)
 */
exports.validatePhoneFormat = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Format phone number for display
 */
exports.formatPhoneNumber = (phone) => {
  return `+91${phone}`;
};
