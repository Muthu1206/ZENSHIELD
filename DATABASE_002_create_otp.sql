/**
 * File: database/migrations/002_create_otp.sql
 * 
 * OTP Verification Table
 * Stores OTP codes with attempt tracking
 */

CREATE TABLE otp_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(15) NOT NULL,
  otp_code VARCHAR(255) NOT NULL,
  attempt_count INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_phone_otp UNIQUE(phone_number)
);

-- Indexes for faster lookups
CREATE INDEX idx_otp_phone ON otp_verifications(phone_number);
CREATE INDEX idx_otp_expires ON otp_verifications(expires_at);
CREATE INDEX idx_otp_verified ON otp_verifications(is_verified, created_at DESC);

-- Auto-clean expired OTPs (optional - run manually or via cron job)
-- DELETE FROM otp_verifications WHERE expires_at < NOW();