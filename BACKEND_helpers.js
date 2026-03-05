/**
 * Helper Utilities
 * File: utils/helpers.js
 * 
 * Includes:
 * - OTP Generation
 * - Password Hashing
 * - JWT Token Generation
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
    process.env.JWT_SECRET,
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
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '30d',
      issuer: 'zenshield-backend',
      algorithm: 'HS256',
    }
  );

  return { accessToken, refreshToken };
};

/**
 * Verify JWT Token
 */
exports.verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Validate phone number format (Indian)
 */
exports.validatePhoneFormat = (phone) => {
  // 10 digits, no + or country code in input
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Format phone number for display
 */
exports.formatPhoneNumber = (phone) => {
  return `+91${phone}`;
};

/**
 * Hash password using bcrypt
 */
exports.hashPassword = async (password) => {
  const salt = await require('bcrypt').genSalt(12);
  return require('bcrypt').hash(password, salt);
};

/**
 * Compare password with hash
 */
exports.comparePassword = async (password, hash) => {
  return require('bcrypt').compare(password, hash);
};