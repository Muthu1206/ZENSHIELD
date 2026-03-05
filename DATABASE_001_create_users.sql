/**
 * DATABASE SETUP GUIDE
 * 
 * Step 1: Install PostgreSQL
 * - Windows: https://www.postgresql.org/download/windows/
 * - Mac: brew install postgresql
 * - Linux: sudo apt-get install postgresql
 * 
 * Step 2: Create Database
 * psql -U postgres
 * CREATE DATABASE zenshield;
 * 
 * Step 3: Run all SQL migration files below in order
 * psql -U postgres -d zenshield -f 001_create_users.sql
 * psql -U postgres -d zenshield -f 002_create_otp.sql
 * psql -U postgres -d zenshield -f 003_create_sessions.sql
 * etc...
 * 
 * File: database/migrations/001_create_users.sql
 */

-- Extension for UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  profile_image_url VARCHAR(255),
  safe_word VARCHAR(50),
  voice_monitoring_enabled BOOLEAN DEFAULT TRUE,
  location_sharing_enabled BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);