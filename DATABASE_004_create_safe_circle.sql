/**
 * File: database/migrations/004_create_safe_circle.sql
 * 
 * Safe Circle Contacts Table
 * Stores emergency contacts and safe people
 */

CREATE TABLE safe_circle_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contact_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(15) NOT NULL,
  contact_email VARCHAR(100),
  relation VARCHAR(50), -- 'mother', 'father', 'friend', 'brother', 'sister', etc.
  is_emergency_contact BOOLEAN DEFAULT FALSE,
  notification_enabled BOOLEAN DEFAULT TRUE,
  address TEXT,
  city VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_safe_circle_user ON safe_circle_contacts(user_id);
CREATE INDEX idx_safe_circle_emergency ON safe_circle_contacts(is_emergency_contact) WHERE is_emergency_contact = TRUE;