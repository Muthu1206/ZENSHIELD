# 🚀 ZenSHIELD Backend - Quick Start Guide

## 📋 Overview

This guide will help you set up the ZenSHIELD backend with Node.js, Express, and PostgreSQL for mobile number verification and OTP authentication.

---

## ⚙️ Prerequisites

Before starting, ensure you have:
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/download/))
- **Twilio Account** ([Sign up here](https://www.twilio.com))
- **Git** for version control
- **Postman** or **Thunder Client** for API testing

---

## 📦 Step 1: Project Setup

### 1.1 Create Backend Folder
```bash
mkdir zenshield-backend
cd zenshield-backend
```

### 1.2 Initialize Node.js Project
```bash
npm init -y
```

### 1.3 Install Dependencies
```bash
npm install express cors dotenv jsonwebtoken bcrypt postgresql pg
npm install twilio axios morgan helmet express-rate-limit
npm install -D nodemon
```

### 1.4 Create Folder Structure
```bash
# Create directories
mkdir -p src/{config,controllers,routes,middleware,services,utils,database/migrations}

# Or manually create:
src/
├── config/
├── controllers/
│   └── authController.js
├── routes/
│   └── authRoutes.js
├── middleware/
│   └── auth.js
├── services/
│   └── smsService.js
├── utils/
│   └── helpers.js
├── database/
│   └── migrations/
│       ├── 001_create_users.sql
│       ├── 002_create_otp.sql
│       ├── 003_create_sessions.sql
│       └── 004_create_safe_circle.sql
└── server.js
```

---

## 🗄️ Step 2: Database Setup

### 2.1 Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE zenshield;

# Or use GUI (pgAdmin)
```

### 2.2 Run Migrations

```bash
# Connect to database
psql -U postgres -d zenshield

# Create users table
\i path/to/001_create_users.sql

# Create OTP table
\i path/to/002_create_otp.sql

# Create sessions table
\i path/to/003_create_sessions.sql

# Create safe circle table
\i path/to/004_create_safe_circle.sql

# Verify tables
\dt
```

Or run all at once:
```bash
psql -U postgres -d zenshield -f ./database/migrations/001_create_users.sql
psql -U postgres -d zenshield -f ./database/migrations/002_create_otp.sql
psql -U postgres -d zenshield -f ./database/migrations/003_create_sessions.sql
psql -U postgres -d zenshield -f ./database/migrations/004_create_safe_circle.sql
```

---

## 📱 Step 3: Twilio Setup

### 3.1 Create Twilio Account
1. Go to [twilio.com](https://www.twilio.com)
2. Sign up for free trial
3. Verify your phone number
4. Go to **Console Dashboard**

### 3.2 Get Credentials
1. Note your **Account SID**
2. Note your **Auth Token**
3. Go to **Phone Numbers** → **Manage Numbers** → **Buy a Number**
4. Choose a phone number (for SMS)

### 3.3 Test SMS (Optional)
```bash
# In Twilio Console > Messaging > Try it out
# Send test SMS to your phone
```

---

## 🔑 Step 4: Environment Setup

### 4.1 Create .env File
```bash
# In your backend root directory
cp .env.example .env
```

### 4.2 Edit .env with Your Values
```env
# Database
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/zenshield

# JWT Secrets (generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=abc123def456ghi789jkl...
REFRESH_TOKEN_SECRET=xyz789uvw456rst123opq...

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Frontend CORS
CORS_ORIGIN=http://localhost:5173

# Other Settings
NODE_ENV=development
PORT=5000
OTP_EXPIRY_MINUTES=10
MAX_OTP_ATTEMPTS=5
```

### 4.3 Add .env to .gitignore
```bash
# In .gitignore
.env
.env.local
.env.*.local
```

---

## 📝 Step 5: Create Backend Files

Copy all the provided files to your backend:
- `BACKEND_server.js` → `src/server.js`
- `BACKEND_authController.js` → `src/controllers/authController.js`
- `BACKEND_authRoutes.js` → `src/routes/authRoutes.js`
- `BACKEND_middleware.js` → `src/middleware/auth.js`
- `BACKEND_helpers.js` → `src/utils/helpers.js`
- `BACKEND_smsService.js` → `src/services/smsService.js`

---

## ✅ Step 6: Update package.json Scripts

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "lint": "eslint src/"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-rate-limit": "^6.7.0",
    "helmet": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "morgan": "^1.10.0",
    "pg": "^8.10.0",
    "postgresql": "^0.0.1",
    "twilio": "^3.79.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

---

## 🏃 Step 7: Run the Backend

### 7.1 Start Development Server
```bash
npm run dev
```

### 7.2 Expected Output
```
🚀 ZenSHIELD Backend running on port 5000
📝 Environment: development
🔗 API Base URL: http://localhost:5000/api
```

---

## 🧪 Step 8: Test API Endpoints

### 8.1 Send OTP

**Using Postman/Thunder Client:**

```http
POST http://localhost:5000/api/auth/send-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully. Valid for 10 minutes.",
  "expiresIn": 600
}
```

### 8.2 Verify OTP

```http
POST http://localhost:5000/api/auth/verify-otp
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "otp": "123456"
}
```

**Expected Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "userExists": false,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phoneNumber": "9876543210",
    "name": null
  }
}
```

### 8.3 Complete Registration

```http
POST http://localhost:5000/api/auth/complete-registration
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "name": "Priya Kumar",
  "email": "priya@example.com",
  "emergencyContacts": [
    { "name": "Mom", "phone": "9999999999" }
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration completed successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "phoneNumber": "9876543210",
    "name": "Priya Kumar",
    "email": "priya@example.com"
  }
}
```

---

## 🔌 Step 9: Connect Frontend to Backend

### 9.1 Update Frontend .env
```env
# .env in frontend root
VITE_API_URL=http://localhost:5000/api
```

### 9.2 Update LoginScreen.tsx

Replace the mock `setTimeout()` with actual API calls:

```typescript
const handleSendOTP = async () => {
  if (phoneInput.length < 10) return;
  setLoading(true);
  
  const result = await apiClient.sendOTP(phoneInput);
  
  if (result.success) {
    setStep("otp");
  } else {
    alert(result.error);
  }
  
  setLoading(false);
};

const handleVerifyOTP = async () => {
  if (otpInput.length < 4) return;
  setLoading(true);
  
  const result = await apiClient.verifyOTP(phoneInput, otpInput);
  
  if (result.success) {
    setTokens(result.accessToken, result.refreshToken);
    setPhone(phoneInput);
    setStep("name");
  } else {
    alert(result.error);
  }
  
  setLoading(false);
};

const handleSetName = async () => {
  if (!nameInput.trim()) return;
  setLoading(true);
  
  const result = await apiClient.completeRegistration(nameInput.trim(), auth.accessToken);
  
  if (result.success) {
    setUsername(nameInput.trim());
    navigate("/permissions");
  } else {
    alert(result.error);
  }
  
  setLoading(false);
};
```

---

## 🚀 Step 10: Run Both Frontend & Backend

### Terminal 1 - Backend
```bash
cd zenshield-backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd zenshield-frontend
npm run dev
```

### Access App
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 📝 Database Query Examples

### Check if user exists
```sql
SELECT * FROM users WHERE phone_number = '9876543210';
```

### View OTP records
```sql
SELECT phone_number, is_verified, expires_at, created_at 
FROM otp_verifications 
ORDER BY created_at DESC LIMIT 10;
```

### View active sessions
```sql
SELECT user_id, ip_address, created_at 
FROM sessions 
WHERE is_active = TRUE AND expires_at > NOW();
```

### Check safe circle contacts
```sql
SELECT * FROM safe_circle_contacts WHERE user_id = 'user-uuid';
```

---

## 🔒 Security Checklist

- [ ] .env file created and in .gitignore
- [ ] JWT secrets are long and random (min 32 chars)
- [ ] Twilio credentials secured in .env
- [ ] Database password is strong
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Phone numbers not logged in production
- [ ] OTPs never stored in plain text
- [ ] Error messages don't leak sensitive info

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
# Windows: Services > PostgreSQL
# Mac: brew services list | grep postgresql
# Linux: sudo systemctl status postgresql

# Verify connection string in .env
DATABASE_URL=postgresql://user:password@localhost:5432/zenshield
```

### Twilio SMS Not Sending
- Verify Account SID and Auth Token
- Check phone number is correct (with +91 for India)
- Ensure Twilio account has SMS credits
- Check Twilio logs for errors

### CORS Errors
- Verify CORS_ORIGIN in .env matches frontend URL
- Check headers include Content-Type: application/json
- Ensure Authorization header format: `Bearer token`

### Port Already in Use
```bash
# Find process using port 5000 and kill it
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

---

## 📚 Next Steps

1. **Add Ride Management APIs** - Create endpoints for starting/ending rides
2. **Add Location Tracking** - Store GPS coordinates in database
3. **Add SOS Alert System** - Send alerts to safe circle contacts
4. **Add Evidence Storage** - Upload videos/images to AWS S3
5. **Add AI Analysis** - Process ride data for safety patterns
6. **Add Payment Gateway** - Premium features subscription

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review error messages in terminal/console
3. Check database logs: `SELECT * FROM logs;`
4. Test API endpoints with Postman

---

**Happy Coding! 🎉**