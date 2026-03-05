# 🛡️ ZenSHIELD - Women's Safety Mobile App

**Complete Real-time Safety Platform with Location Tracking, SOS Alerts, and Voice SafeWord Detection**

---

## 📋 Project Structure

```
ZenSHIELD/
│
├── frontend/                    # React + Vite Mobile App
│   ├── src/
│   │   ├── app/
│   │   │   ├── screens/         # UI Screens
│   │   │   ├── components/      # Reusable components
│   │   │   └── context/         # State management
│   │   ├── services/
│   │   │   ├── api.ts          # REST API client
│   │   │   └── socketService.ts # WebSocket client
│   │   └── styles/              # CSS & Tailwind
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # Node.js + Express + Socket.io
│   ├── src/
│   │   ├── server.js            # Main server with Socket.io
│   │   ├── controllers/         # Business logic
│   │   ├── routes/              # API endpoints
│   │   ├── middleware/          # Auth & validation
│   │   ├── services/            # Twilio SMS, etc.
│   │   └── utils/               # Helpers
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── database/                    # PostgreSQL Migrations
    └── migrations/
        ├── 001_create_users.sql
        ├── 002_create_otp.sql
        ├── 003_create_sessions.sql
        ├── 004_create_safe_circle.sql
        ├── 005_create_rides.sql
        ├── 006_create_sos_alerts.sql
        └── 007_create_location_history.sql
```

---

## 🚀 Quick Start (15 minutes)

### Prerequisites
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **PostgreSQL** 12+ ([Download](https://www.postgresql.org/))
- **Twilio Account** ([Sign up](https://www.twilio.com/))
- **Git** ([Download](https://git-scm.com/))

### Step 1: Database Setup

```bash
# Create PostgreSQL database
psql -U postgres
CREATE DATABASE zenshield;
\q

# Run migrations
cd database/migrations
psql -U postgres -d zenshield -f 001_create_users.sql
psql -U postgres -d zenshield -f 002_create_otp.sql
psql -U postgres -d zenshield -f 003_create_sessions.sql
psql -U postgres -d zenshield -f 004_create_safe_circle.sql
psql -U postgres -d zenshield -f 005_create_rides.sql
psql -U postgres -d zenshield -f 006_create_sos_alerts.sql
psql -U postgres -d zenshield -f 007_create_location_history.sql
```

### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# - DATABASE_URL=postgresql://postgres:password@localhost:5432/zenshield
# - JWT_SECRET=generate-a-random-key
# - TWILIO_ACCOUNT_SID=your-sid
# - TWILIO_AUTH_TOKEN=your-token
# - TWILIO_PHONE_NUMBER=+1234567890
nano .env

# Start backend
npm run dev
# Backend will run on http://localhost:5000
```

### Step 3: Frontend Setup

```bash
# From root directory
npm install

# Update .env for frontend
# VITE_API_URL=http://localhost:5000/api

# Start frontend
npm run dev
# Frontend will run on http://localhost:5173
```

Both server and app will now communicate in real-time. 🎉

---

## 🎯 Core Features

### 1. **Authentication** 🔐
- OTP-based login via SMS (Twilio)
- JWT token management
- Secure session storage
- User registration with profile setup

### 2. **Real-time Location Tracking** 📍
- GPS updates every 10 seconds
- Live location broadcast to Safe Circle
- Location history stored per ride
- Accuracy & speed tracking

### 3. **SOS Alert System** 🚨
- One-tap emergency trigger
- Instant SMS notification to guardians
- Real-time location in alert
- SOS history logging
- Status tracking (triggered/responded/acknowledged)

### 4. **Live Ride Monitoring** 🚗
- Start/end ride management
- Active ride tracking
- Distance calculation
- Ride completion records

### 5. **Safe Circle Management** 👥
- Add emergency contacts
- Toggle notifications per contact
- Contact relationships
- Emergency contact priority

### 6. **Voice SafeWord Detection** 🎤
- Web Speech API integration
- Configurable custom safe words
- Offline voice detection
- Auto-trigger SOS on detection

### 7. **Mobile App Support** 📱
- Capacitor wrapper for iOS & Android
- Native permissions management
- Offline capability
- PWA support

---

## 📱 WebSocket Events (Real-time)

### Ride Events
```
Emit:
  - ride:start → Start new ride
  - ride:location → Send GPS update
  - ride:end → End active ride

Listen:
  - ride:started → Ride created on server
  - ride:location-update → Location broadcast to guardians
  - ride:ended → Ride completed
```

### SOS Events
```
Emit:
  - sos:alert → Trigger emergency alert

Listen:
  - sos:alert → Alert received by guardians
  - sos:acknowledged → Server confirmed alert
```

### Safe Circle Events
```
Emit:
  - safecircle:add-guardian → Add new guardian

Listen:
  - safecircle:updated → Circle updated
  - users:online → Online users count
```

---

## 🔌 REST API Endpoints

### Authentication
```
POST /api/auth/send-otp
  Body: { phoneNumber: "9876543210" }

POST /api/auth/verify-otp
  Body: { phoneNumber: "9876543210", otp: "123456" }

POST /api/auth/complete-registration
  Body: { name: "Priya", email: "priya@example.com" }
  Header: Authorization: Bearer {token}

POST /api/auth/refresh-token
  Body: { refreshToken: "..." }

POST /api/auth/logout
  Header: Authorization: Bearer {token}
```

### Rides
```
POST /api/rides/start
  Body: { startLocation: { latitude, longitude }, destination }
  Header: Authorization: Bearer {token}

POST /api/rides/:rideId/end
  Body: { endLocation: { latitude, longitude } }
  Header: Authorization: Bearer {token}

GET /api/rides/:rideId
  Header: Authorization: Bearer {token}
```

### Emergency
```
POST /api/emergency/sos
  Body: { rideId, latitude, longitude, message }
  Header: Authorization: Bearer {token}

GET /api/emergency/sos-history
  Header: Authorization: Bearer {token}
```

---

## 🛠️ Development Commands

```bash
# Frontend
npm run dev        # Start Vite dev server
npm run build      # Build for production
npm run preview    # Preview production build

# Backend
cd backend
npm run dev        # Start with nodemon
npm start          # Start production

# Mobile build
npx cap sync       # Sync with native projects
npx cap open android  # Open Android Studio
npx cap open ios      # Open Xcode
```

---

## 🔑 Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173

DATABASE_URL=postgresql://username:password@localhost:5432/zenshield
JWT_SECRET=your-secret-here
REFRESH_TOKEN_SECRET=your-refresh-secret-here

TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 🧪 Testing

### Using Thunder Client / Postman

1. **Send OTP**
   - POST: http://localhost:5000/api/auth/send-otp
   - Body: `{"phoneNumber":"9876543210"}`

2. **Verify OTP**
   - POST: http://localhost:5000/api/auth/verify-otp
   - Body: `{"phoneNumber":"9876543210","otp":"123456"}`

3. **Start Ride**
   - POST: http://localhost:5000/api/rides/start
   - Headers: `Authorization: Bearer {token}`
   - Body: `{"startLocation":{"latitude":28.5,"longitude":77.3},"destination":"Airport"}`

4. **Send Location Update** (via WebSocket)
   - Connect to ws://localhost:5000
   - Emit: `ride:location` with {rideId, latitude, longitude, speed, accuracy}

5. **Trigger SOS**
   - POST: http://localhost:5000/api/emergency/sos
   - Headers: `Authorization: Bearer {token}`
   - Body: `{"rideId":"..","latitude":28.5,"longitude":77.3,"message":"Help!"}`

---

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Backend (Heroku)
```bash
cd backend
heroku create zenshield-backend
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

### Database (AWS RDS)
1. Create PostgreSQL instance on AWS RDS
2. Update DATABASE_URL to RDS connection string
3. Run migrations on RDS

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `connect ECONNREFUSED` | PostgreSQL not running. Start with `pg_ctl start` |
| `Cannot find module 'socket.io-client'` | Run `npm install socket.io-client` |
| `JWT token error` | Check JWT_SECRET is set and matches |
| `SMS not sending` | Verify Twilio credentials and account balance |
| `CORS error` | Update CORS_ORIGIN in backend .env |

---

## 📖 Documentation

- [Backend API Docs](./backend/README.md)
- [Database Schema](./database/migrations/)
- [Frontend Architecture](./src/README.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🆘 Support

- Report bugs: [GitHub Issues](https://github.com/yourusername/zenshield/issues)
- Email: support@zenshield.app
- Documentation: [ZenSHIELD Docs](https://docs.zenshield.app)

---

**Built with ❤️ for women's safety** 🛡️
