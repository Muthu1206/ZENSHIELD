/**
 * File: database/migrations/005_create_rides.sql
 * 
 * Rides Table - Real-time ride tracking
 */

CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_location JSONB, -- {latitude, longitude, address}
  end_location JSONB,
  destination VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'emergency'
  distance_km DECIMAL(10, 2),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_rides_user ON rides(user_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_started ON rides(started_at DESC);
