/**
 * File: database/migrations/003_create_sessions.sql
 * 
 * Sessions Table
 */

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token VARCHAR(500),
  refresh_token VARCHAR(500),
  device_info JSONB,
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_active ON sessions(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
