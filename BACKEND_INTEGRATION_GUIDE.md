# ZenSHIELD - Backend & Database Integration Guide

## 📋 Table of Contents
1. [Current App Architecture](#current-app-architecture)
2. [Database Design](#database-design)
3. [Backend Integration Plan](#backend-integration-plan)
4. [Mobile Number & OTP Verification](#mobile-number--otp-verification)
5. [Implementation Steps](#implementation-steps)
6. [Security Considerations](#security-considerations)

---

## Current App Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v7
- **State Management**: Context API (AppContext)
- **UI Components**: Radix UI + Custom Components
- **Styling**: Tailwind CSS + Inline Styles
- **Animations**: Motion (Framer Motion)
- **Build Tool**: Vite

### Current App Structure
```
src/
├── app/
│   ├── App.tsx                 # Main app component
│   ├── routes.tsx              # Route definitions
│   ├── context/
│   │   └── AppContext.tsx      # Global state (username, phone, ride info, etc.)
│   ├── components/
│   │   ├── BottomNav.tsx       # Navigation
│   │   ├── SafetyGauge.tsx
│   │   ├── MockMap.tsx
│   │   └── ui/                 # Reusable UI components
│   └── screens/
│       ├── SplashScreen.tsx
│       ├── LoginScreen.tsx     # Auth entry point (NEEDS BACKEND)
│       ├── PermissionScreen.tsx
│       ├── HomeScreen.tsx
│       ├── StartRideScreen.tsx
│       ├── LiveRideScreen.tsx
│       ├── SOSScreen.tsx
│       ├── EvidenceScreen.tsx
│       ├── HeatmapScreen.tsx
│       ├── SafeCircleScreen.tsx
│       ├── VoiceSafeWordScreen.tsx
│       └── AIAnalysisScreen.tsx
├── styles/
│   ├── index.css
│   ├── tailwind.css
│   ├── theme.css
│   └── fonts.css
└── main.tsx

```

### Current State Management (AppContext)
```typescript
interface AppState {
  username: string;
  phone: string;
  safeWord: string;
  voiceMonitoring: boolean;
  currentRide: RideInfo;
  isSOSActive: boolean;
  permissions: { location, camera, microphone, contacts };
}
```

---

## 📊 Database Design

### Recommended Tech Stack
- **Backend**: Node.js + Express.js / Python Flask / Laravel
- **Database**: PostgreSQL (recommended) or MongoDB
- **Authentication**: JWT tokens
- **SMS Gateway**: Twilio / AWS SNS / Firebase Cloud Messaging

### Database Schema

#### 1. **Users Table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  password_hash VARCHAR(255),
  profile_image_url VARCHAR(255),
  safe_word VARCHAR(50),
  voice_monitoring_enabled BOOLEAN DEFAULT true,
  location_sharing_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

#### 2. **OTP Verification Table**
```sql
CREATE TABLE otp_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone_number VARCHAR(15) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  attempt_count INT DEFAULT 0,
  max_attempts INT DEFAULT 5,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_phone_otp ON otp_verifications(phone_number);
CREATE INDEX idx_expires_at ON otp_verifications(expires_at);
```

#### 3. **Sessions Table** (Token Management)
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_token VARCHAR(500),
  refresh_token VARCHAR(500),
  device_info JSON,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

#### 4. **Rides Table**
```sql
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_number VARCHAR(20),
  driver_contact VARCHAR(15),
  pickup_location POINT,
  dropoff_location POINT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  duration_minutes INT,
  route_data JSON,
  safety_alerts JSON ARRAY,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. **Safe Circle Contacts Table**
```sql
CREATE TABLE safe_circle_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contact_name VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(15) NOT NULL,
  contact_email VARCHAR(100),
  relation VARCHAR(50),
  is_emergency_contact BOOLEAN DEFAULT false,
  notification_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. **SOS Alerts Table**
```sql
CREATE TABLE sos_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES rides(id),
  location POINT,
  alert_type VARCHAR(50), -- 'voice_trigger', 'manual', 'suspicious_behavior'
  message TEXT,
  contacts_notified JSON ARRAY,
  evidence_file_urls VARCHAR(255) ARRAY,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 7. **Location Tracking Table**
```sql
CREATE TABLE location_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES rides(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  accuracy INT,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_ride_timestamp ON location_history(user_id, ride_id, timestamp);
```

---

## 🔧 Backend Integration Plan

### Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                           │
│                   (This App)                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST APIs
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   API Gateway                               │
│              (Express.js / Django)                          │
├──────────────────────────────────────────────────────────────┤
│  ✓ Authentication Routes      /auth/*                       │
│  ✓ User Routes                /users/*                      │
│  ✓ Ride Routes                /rides/*                      │
│  ✓ SOS Routes                 /sos/*                        │
│  ✓ Safe Circle Routes         /safe-circle/*               │
│  ✓ Location Routes            /location/*                   │
│  ✓ Evidence Routes            /evidence/*                   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼────┐ ┌────▼──────┐ ┌──▼────────┐
│ PostgreSQL │ │  AWS S3   │ │  Twilio   │
│ Database   │ │  (Files)  │ │  (SMS)    │
└────────────┘ └───────────┘ └───────────┘
```

### Required NPM Packages for Backend
```bash
# Express.js Backend Setup
npm install express cors dotenv jsonwebtoken bcrypt
npm install postgresql pg morgan helmet express-rate-limit
npm install twilio axios nodemailer
npm install multer aws-sdk uuid
npm install joi@latest
```

---

## 📱 Mobile Number & OTP Verification

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     STEP 1: Phone Entry                     │
│                                                              │
│  User enters phone number → Frontend validation             │
│  (Must be 10 digits, Indian number)                        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ POST /auth/send-otp
                 │ { phoneNumber: "9876543210" }
                 │
┌────────────────▼────────────────────────────────────────────┐
│                     BACKEND Processing                      │
│                                                              │
│  1. Validate phone format                                   │
│  2. Check if user exists                                    │
│  3. Delete previous OTP (if expired)                        │
│  4. Generate 6-digit OTP                                    │
│  5. Store in DB with 10-min expiry                         │
│  6. Send via Twilio/SMS Gateway                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Response: { success: true, message: "OTP sent" }
                 │
┌────────────────▼────────────────────────────────────────────┐
│                     STEP 2: OTP Entry                       │
│                                                              │
│  Show OTP input screen (4/6 digits)                        │
│  User enters OTP                                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ POST /auth/verify-otp
                 │ { phoneNumber: "9876543210", otp: "123456" }
                 │
┌────────────────▼────────────────────────────────────────────┐
│                     BACKEND Verification                    │
│                                                              │
│  1. Check OTP exists and not expired                        │
│  2. Check attempt count < max_attempts                      │
│  3. Compare OTP hash                                        │
│  4. Mark OTP as verified                                    │
│  5. Generate JWT tokens (access + refresh)                │
│  6. Create session record                                   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Response: { 
                 │   success: true,
                 │   accessToken: "eyJhbGc...",
                 │   refreshToken: "eyJhbGc...",
                 │   userExists: true/false
                 │ }
                 │
┌────────────────▼────────────────────────────────────────────┐
│                STEP 3: User Registration                    │
│                (if new user)                                 │
│                                                              │
│  Show name entry screen                                    │
│  User enters name                                          │
│  Store user in DB                                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ POST /auth/complete-registration
                 │ { name: "Priya", phoneNumber: "9876543210" }
                 │ Headers: { Authorization: "Bearer <token>" }
                 │
├────────────────────────────────────────────────────────────┤
│  → User successfully authenticated                          │
│  → Stored JWT tokens in secure storage                     │
│  → Proceed to Permissions Screen                           │
└────────────────────────────────────────────────────────────┘
```

---

## 🔐 API Endpoints

### Authentication Endpoints

#### 1. **Send OTP**
```
POST /auth/send-otp
Content-Type: application/json

Request:
{
  "phoneNumber": "9876543210",
  "countryCode": "+91"
}

Response (Success):
{
  "success": true,
  "message": "OTP sent successfully",
  "expiresIn": 600  -- in seconds
}

Response (Error):
{
  "success": false,
  "error": "Invalid phone number",
  "errorCode": "INVALID_PHONE"
}
```

#### 2. **Verify OTP**
```
POST /auth/verify-otp
Content-Type: application/json

Request:
{
  "phoneNumber": "9876543210",
  "otp": "123456"
}

Response (Success):
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userExists": false,  -- true if user already registered
  "user": {
    "id": "uuid",
    "phoneNumber": "9876543210",
    "name": null
  }
}

Response (Error):
{
  "success": false,
  "error": "Invalid or expired OTP",
  "errorCode": "INVALID_OTP",
  "attemptsRemaining": 3
}
```

#### 3. **Complete Registration**
```
POST /auth/complete-registration
Authorization: Bearer <accessToken>
Content-Type: application/json

Request:
{
  "name": "Priya Kumar",
  "email": "priya@example.com",
  "emergencyContacts": [
    { "name": "Mom", "phone": "9999999999" },
    { "name": "Sister", "phone": "8888888888" }
  ]
}

Response (Success):
{
  "success": true,
  "message": "Registration completed",
  "user": {
    "id": "uuid",
    "phoneNumber": "9876543210",
    "name": "Priya Kumar",
    "email": "priya@example.com"
  }
}
```

#### 4. **Refresh Token**
```
POST /auth/refresh-token
Content-Type: application/json

Request:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (Success):
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

#### 5. **Logout**
```
POST /auth/logout
Authorization: Bearer <accessToken>

Response (Success):
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 🚀 Implementation Steps

### Phase 1: Backend Setup (Week 1)

#### 1.1 Create Node.js Backend with Express
```bash
mkdir zenshield-backend
cd zenshield-backend
npm init -y
npm install express cors dotenv jsonwebtoken bcrypt postgresql pg
npm install twilio axios morgan helmet express-rate-limit
npm install -D nodemon
```

#### 1.2 Create Backend Folder Structure
```
zenshield-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── twilio.js
│   │   └── jwt.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── rideController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── rideRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── otpService.js
│   │   └── smsService.js
│   ├── utils/
│   │   ├── generateOTP.js
│   │   ├── hashPassword.js
│   │   └── validators.js
│   ├── models/
│   │   ├── User.js
│   │   ├── OTPVerification.js
│   │   └── Session.js
│   ├── database/
│   │   └── migrations/
│   │       ├── 001_create_users.sql
│   │       ├── 002_create_otp.sql
│   │       └── 003_create_sessions.sql
│   └── server.js
├── .env
├── .env.example
├── package.json
└── README.md
```

### Phase 2: Frontend Integration (Week 2)

#### 2.1 Create API Service Layer
Create new file: `src/services/api.ts`

```typescript
// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  async sendOTP(phoneNumber: string) {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    });
    return response.json();
  },

  async verifyOTP(phoneNumber: string, otp: string) {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp })
    });
    return response.json();
  },

  async completeRegistration(name: string, token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/complete-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name })
    });
    return response.json();
  }
};
```

#### 2.2 Update AppContext for Auth
```typescript
// Add to AppContext.tsx
interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
}
```

#### 2.3 Update LoginScreen to Use Backend
Replace the mock `setTimeout()` calls with actual API calls.

### Phase 3: Security & Testing (Week 3)

#### 3.1 Implement Security Measures
- JWT token validation
- HTTPS enforcement
- Rate limiting on OTP endpoints
- Device fingerprinting
- Secure token storage

#### 3.2 Add Error Handling
- Network error handling
- Token expiration handling
- OTP expiration notifications

---

## 🔒 Security Considerations

### 1. **Password & Token Security**
- ✅ Use bcrypt for password hashing (salt rounds: 12)
- ✅ Store JWT tokens securely
- ✅ Implement token rotation
- ✅ Set short expiration times (15 min access, 7 days refresh)

### 2. **OTP Security**
- ✅ Generate cryptographically secure 6-digit OTP
- ✅ Hash OTP before storing in DB
- ✅ Set 10-minute expiration
- ✅ Limit OTP verification attempts (max 5)
- ✅ Rate limit OTP send endpoint (max 3 per 24 hours)

### 3. **API Security**
- ✅ Use HTTPS only
- ✅ Implement CORS properly
- ✅ Add request validation
- ✅ Use helmet.js for security headers
- ✅ Implement rate limiting
- ✅ Add request timeout

### 4. **Data Protection**
- ✅ Encrypt sensitive data in transit (TLS)
- ✅ Encrypt PII at rest
- ✅ Implement access control (user can only access their data)
- ✅ Audit logging for security events
- ✅ GDPR compliance

### 5. **Phone Number in Frontend**
```typescript
// NEVER log or expose phone numbers
// NEVER store in localStorage without encryption
// Use secure storage methods:

// Option 1: SessionStorage (cleared on browser close)
sessionStorage.setItem('temp_phone', phoneNumber);

// Option 2: IndexedDB with encryption
// Option 3: Keep in React state only
```

---

## 📝 Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/zenshield
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
OTP_EXPIRY_MINUTES=10
MAX_OTP_ATTEMPTS=5
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ZenSHIELD
```

---

## 📞 Twilio SMS Setup

### 1. Create Twilio Account
- Go to twilio.com
- Sign up/Login
- Get Account SID and Auth Token
- Buy a phone number for SMS

### 2. Backend SMS Service
```typescript
// src/services/smsService.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOTPSMS = async (phoneNumber: string, otp: string) => {
  try {
    const message = await client.messages.create({
      body: `Your ZenSHIELD verification code is: ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`
    });
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error };
  }
};
```

---

## 🧪 Testing Checklist

### Manual Testing
- [ ] Phone number validation (accept only 10 digits)
- [ ] OTP generation (6 digits)
- [ ] OTP expiration (10 minutes)
- [ ] OTP attempt limit (5 attempts)
- [ ] Token refresh functionality
- [ ] Logout functionality
- [ ] Error messages display correctly

### Automated Testing
- [ ] Unit tests for OTP generation
- [ ] Unit tests for password hashing
- [ ] Integration tests for auth endpoints
- [ ] E2E tests for login flow

---

## 🚢 Deployment Checklist

- [ ] Database migrations run on production
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Monitoring & logging configured
- [ ] Backup strategy implemented
- [ ] Security audit completed

---

## 📚 Next Steps

1. **Set up PostgreSQL locally** (Week 1)
2. **Create Express.js backend** (Week 1-2)
3. **Implement OTP service** (Week 2)
4. **Update LoginScreen component** (Week 2)
5. **Add token storage in AppContext** (Week 2-3)
6. **Implement error handling** (Week 3)
7. **Security testing** (Week 3)
8. **Deploy to production** (Week 4)

---

**Ready to start? Let me know which part you'd like to build first!**
