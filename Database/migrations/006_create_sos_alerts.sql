/**
 * File: database/migrations/006_create_sos_alerts.sql
 * 
 * SOS Alerts Table - Emergency alerts
 */

CREATE TABLE sos_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES rides(id) ON DELETE SET NULL,
  location JSONB, -- {latitude, longitude}
  message TEXT,
  status VARCHAR(50) DEFAULT 'triggered', -- 'triggered', 'responded', 'acknowledged'
  emergency_contacts_notified INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sos_alerts_user ON sos_alerts(user_id);
CREATE INDEX idx_sos_alerts_ride ON sos_alerts(ride_id);
CREATE INDEX idx_sos_alerts_status ON sos_alerts(status);
CREATE INDEX idx_sos_alerts_created ON sos_alerts(created_at DESC);
