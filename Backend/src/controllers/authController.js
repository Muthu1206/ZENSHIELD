/**
 * Authentication Controller
 * File: controllers/authController.js
 * 
 * Handles all authentication logic:
 * - OTP Generation & Validation
 * - Token Management
 * - User Registration
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendOTPSMS } = require('../services/smsService');
const { generateOTP, generateTokens, hashOTP } = require('../utils/helpers');

// ============ SEND OTP ============

exports.sendOTP = async (req, res, next, pool) => {
  try {
    const { phoneNumber } = req.body;

    // Delete any existing OTP for this number
    await pool.query(
      'DELETE FROM otp_verifications WHERE phone_number = $1 AND expires_at < NOW()',
      [phoneNumber]
    );

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await pool.query(
      `INSERT INTO otp_verifications (phone_number, otp_code, expires_at, is_verified)
       VALUES ($1, $2, $3, false)
       ON CONFLICT (phone_number) 
       DO UPDATE SET otp_code = $2, expires_at = $3, attempt_count = 0, is_verified = false`,
      [phoneNumber, hashedOTP, expiresAt]
    );

    // Send SMS via Twilio
    const smsResult = await sendOTPSMS(phoneNumber, otp);

    if (!smsResult.success) {
      console.error('SMS Error:', smsResult.error);
      return res.status(500).json({
        success: false,
        error: 'Failed to send OTP via SMS',
        errorCode: 'SMS_SEND_FAILED',
      });
    }

    // Log OTP for development (REMOVE IN PRODUCTION)
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 OTP for ${phoneNumber}: ${otp}`);
    }

    res.json({
      success: true,
      message: 'OTP sent successfully. Valid for 10 minutes.',
      expiresIn: 600,
    });
  } catch (error) {
    console.error('Send OTP Error:', error);
    next(error);
  }
};

// ============ VERIFY OTP ============

exports.verifyOTP = async (req, res, next, pool) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Get OTP record from database
    const otpResult = await pool.query(
      `SELECT * FROM otp_verifications 
       WHERE phone_number = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [phoneNumber]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'OTP not found. Please request a new OTP.',
        errorCode: 'OTP_NOT_FOUND',
      });
    }

    const otpRecord = otpResult.rows[0];

    // Check if OTP is expired
    if (new Date() > new Date(otpRecord.expires_at)) {
      return res.status(400).json({
        success: false,
        error: 'OTP has expired. Please request a new OTP.',
        errorCode: 'OTP_EXPIRED',
      });
    }

    // Check attempt limit
    if (otpRecord.attempt_count >= otpRecord.max_attempts) {
      return res.status(400).json({
        success: false,
        error: 'Maximum OTP attempts exceeded. Please request a new OTP.',
        errorCode: 'MAX_ATTEMPTS_EXCEEDED',
      });
    }

    // Verify OTP hash
    const hashedInputOTP = hashOTP(otp);
    const otpMatches = hashedInputOTP === otpRecord.otp_code;

    if (!otpMatches) {
      // Increment attempt count
      const newAttemptCount = otpRecord.attempt_count + 1;
      await pool.query(
        'UPDATE otp_verifications SET attempt_count = $1 WHERE id = $2',
        [newAttemptCount, otpRecord.id]
      );

      const attemptsRemaining = otpRecord.max_attempts - newAttemptCount;

      return res.status(400).json({
        success: false,
        error: 'Invalid OTP. Please try again.',
        errorCode: 'INVALID_OTP',
        attemptsRemaining: Math.max(0, attemptsRemaining),
      });
    }

    // Mark OTP as verified
    await pool.query(
      'UPDATE otp_verifications SET is_verified = true, verified_at = NOW() WHERE id = $1',
      [otpRecord.id]
    );

    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM users WHERE phone_number = $1',
      [phoneNumber]
    );

    const userExists = userResult.rows.length > 0;
    let userId;

    if (!userExists) {
      // Create new user (temporarily without name)
      const createUserResult = await pool.query(
        `INSERT INTO users (phone_number, name, is_active)
         VALUES ($1, 'User', true)
         RETURNING id, phone_number`,
        [phoneNumber]
      );
      userId = createUserResult.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(userId, phoneNumber);

    // Store session
    const sessionExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await pool.query(
      `INSERT INTO sessions (user_id, access_token, refresh_token, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId, accessToken, refreshToken, sessionExpiry]
    );

    res.json({
      success: true,
      message: userExists ? 'Login successful' : 'OTP verified. Complete your profile.',
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600, // 1 hour
      userExists,
      user: {
        id: userId,
        phoneNumber,
        name: userExists ? userResult.rows[0].name : null,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    next(error);
  }
};

// ============ COMPLETE REGISTRATION ============

exports.completeRegistration = async (req, res, next, pool) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const { name, email, emergencyContacts } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Name is required',
        errorCode: 'VALIDATION_ERROR',
      });
    }

    // Update user profile
    const updateResult = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, phone_number, name, email`,
      [name.trim(), email || null, userId]
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    const user = updateResult.rows[0];

    // Add emergency contacts if provided
    if (emergencyContacts && Array.isArray(emergencyContacts) && emergencyContacts.length > 0) {
      for (const contact of emergencyContacts) {
        await pool.query(
          `INSERT INTO safe_circle_contacts 
           (user_id, contact_name, contact_phone, contact_email, is_emergency_contact)
           VALUES ($1, $2, $3, $4, true)`,
          [userId, contact.name || 'Contact', contact.phone, contact.email || null]
        );
      }
    }

    res.json({
      success: true,
      message: 'Registration completed successfully',
      user: {
        id: user.id,
        phoneNumber: user.phone_number,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Complete Registration Error:', error);
    next(error);
  }
};

// ============ REFRESH TOKEN ============

exports.refreshToken = async (req, res, next, pool) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
        errorCode: 'MISSING_REFRESH_TOKEN',
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const { accessToken, newRefreshToken } = generateTokens(decoded.userId, decoded.phoneNumber);

      res.json({
        success: true,
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired refresh token',
        errorCode: 'INVALID_REFRESH_TOKEN',
      });
    }
  } catch (error) {
    console.error('Refresh Token Error:', error);
    next(error);
  }
};

// ============ LOGOUT ============

exports.logout = async (req, res, next, pool) => {
  try {
    const userId = req.user.id;

    // Invalidate session
    await pool.query(
      'UPDATE sessions SET is_active = false WHERE user_id = $1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout Error:', error);
    next(error);
  }
};
