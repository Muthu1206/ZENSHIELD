# 🛡️ ZenSHIELD Backend Setup Guide

## Quick Start (5 minutes)

### 1. Prerequisites
```bash
# Install Node.js 16+
https://nodejs.org/

# Install PostgreSQL 12+
https://www.postgresql.org/download/

# Create Twilio account (for SMS)
https://www.twilio.com/
```

### 2. Database Setup

```bash
# Open PostgreSQL terminal
psql -U postgres

# Create database
CREATE DATABASE zenshield;

# Exit
\q
```

Run migrations:
```bash
psql -U postgres -d zenshield -f database/migrations/001_create_users.sql
psql -U postgres -d zenshield -f database/migrations/002_create_otp.sql
psql -U postgres -d zenshield -f database/migrations/003_create_sessions.sql
psql -U postgres -d zenshield -f database/migrations/004_create_safe_circle.sql
psql -U postgres -d zenshield -f database/migrations/005_create_rides.sql
psql -U postgres -d zenshield -f database/migrations/006_create_sos_alerts.sql
psql -U postgres -d zenshield -f database/migrations/007_create_location_history.sql
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your credentials
# Add your Twilio credentials, JWT secrets, etc.
```

### 4. Run Backend

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

Backend will run on: **http://localhost:5000**
WebSocket available at: **ws://localhost:5000**

---

## Real-time Features

### 1. **Location Tracking** 📍
- GPS updates every 10 seconds during ride
- Real-time broadcast to Safe Circle via WebSocket
- Location history stored in database

### 2. **SOS Alerts** 🚨
- Instant notification to emergency contacts
- SMS sent via Twilio
- Alert stored with timestamp and location

### 3. **Live Ride Monitoring** 🚗
- Start/end ride management
- Active ride tracking
- Ride completion with distance calculation

---

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP via SMS
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/complete-registration` - Complete user profile
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Rides
- `POST /api/rides/start` - Start new ride
- `POST /api/rides/:rideId/end` - End ride
- `GET /api/rides/:rideId` - Get ride details

### Emergency
- `POST /api/emergency/sos` - Trigger SOS alert
- `GET /api/emergency/sos-history` - Get SOS history

---

## WebSocket Events

### Client → Server
```javascript
// Join as user
socket.emit('user:join', { userId, phoneNumber });

// Start ride
socket.emit('ride:start', { rideId, userId, startLocation });

// Send location update
socket.emit('ride:location', { 
  rideId, userId, latitude, longitude, speed, accuracy 
});

// End ride
socket.emit('ride:end', { rideId, userId, endLocation });

// Trigger SOS
socket.emit('sos:alert', { rideId, userId, location, message });
```

### Server → Client
```javascript
// Ride started
io.on('ride:started', (data) => { ... });

// Location updated
io.on('ride:location-update', (data) => { ... });

// Ride ended
io.on('ride:ended', (data) => { ... });

// SOS alert
io.on('sos:alert', (data) => { ... });

// Users online count
io.on('users:online', (data) => { ... });
```

---

## File Structure

```
backend/
├── src/
│   ├── server.js              # Main server with Socket.io
│   ├── controllers/
│   │   └── authController.js  # Auth logic
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   ├── ridesRoutes.js     # Ride endpoints
│   │   └── emergencyRoutes.js # SOS endpoints
│   ├── middleware/
│   │   └── auth.js            # JWT & validation middleware
│   ├── services/
│   │   └── smsService.js      # Twilio SMS integration
│   └── utils/
│       └── helpers.js         # Utility functions
├── package.json
├── .env.example
└── README.md
```

---

## Testing with cURL

### Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210","otp":"123456"}'
```

### Start Ride
```bash
curl -X POST http://localhost:5000/api/rides/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "startLocation":{"latitude":28.5355,"longitude":77.3910},
    "destination":"Airport"
  }'
```

### Trigger SOS
```bash
curl -X POST http://localhost:5000/api/emergency/sos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "rideId":"ride-uuid",
    "latitude":28.5355,
    "longitude":77.3910,
    "message":"Help needed!"
  }'
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection | postgresql://user:pass@localhost/zenshield |
| `JWT_SECRET` | JWT signing key | abc123xyz |
| `TWILIO_ACCOUNT_SID` | Twilio account ID | AC1234567890 |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | 1234567890abcdef |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | +1234567890 |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development/production |

---

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Make sure PostgreSQL is running
```bash
# Windows
pg_ctl -D "C:\Program Files\PostgreSQL\14\data" start

# Mac
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### SMS not sending
- Check Twilio credentials in `.env`
- Verify phone number format (+91 for India)
- Check Twilio account balance

### JWT Token Error
- Ensure `JWT_SECRET` is set in `.env`
- Regenerate tokens: `openssl rand -base64 32`

---

## Deployment

### Heroku
```bash
heroku create zenshield-backend
heroku config:set JWT_SECRET=your-secret
heroku config:set TWILIO_ACCOUNT_SID=your-sid
git push heroku main
```

### AWS EC2 / DigitalOcean
1. Install Node.js and PostgreSQL on server
2. Clone repository
3. Set environment variables
4. Run `npm install && npm start`
5. Use PM2 for process management

---

## Support & Issues
- Report bugs in GitHub Issues
- Check logs: `npm run dev`
- Enable debug mode: `DEBUG=*
