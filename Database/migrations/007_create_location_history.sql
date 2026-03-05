/**
 * File: database/migrations/007_create_location_history.sql
 * 
 * Location History Table - Track all location points during rides
 */

CREATE TABLE location_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(5, 2),
  speed DECIMAL(5, 2),
  bearing DECIMAL(5, 2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast queries
CREATE INDEX idx_location_ride ON location_history(ride_id);
CREATE INDEX idx_location_user ON location_history(user_id);
CREATE INDEX idx_location_timestamp ON location_history(timestamp DESC);
CREATE INDEX idx_location_coords ON location_history(latitude, longitude);
