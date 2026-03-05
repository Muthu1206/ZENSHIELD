/**
 * ZenSHIELD Backend - Real-time Express.js Server with Socket.io
 * 
 * Features:
 * - OTP Authentication
 * - Real-time Location Tracking
 * - SOS Alerts
 * - Live Ride Monitoring
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const http = require('http');
const socketIO = require('socket.io');

// Import routes
const authRoutes = require('./routes/authRoutes');
const ridesRoutes = require('./routes/ridesRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');

// ============ INITIALIZE ============

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
});

// ============ DATABASE SETUP ============

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('error', (err) => {
  console.error('Database error:', err);
});

// ============ MIDDLEWARE ============

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Logging
app.use(morgan('combined'));

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
});

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // max 3 OTP requests per hour
  skipSuccessfulRequests: true,
  keyGenerator: (req) => req.body.phoneNumber || req.ip,
});

app.use('/api/', limiter);
app.use('/api/auth/send-otp', otpLimiter);

// ============ SOCKET.IO REAL-TIME EVENTS ============

// Track active rides and users
const activeRides = new Map(); // rideId -> { userId, location, status }
const connectedUsers = new Map(); // userId -> { socketId, ... }

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // User joins (identification)
  socket.on('user:join', (data) => {
    const { userId, phoneNumber } = data;
    connectedUsers.set(userId, {
      socketId: socket.id,
      phoneNumber,
      joinedAt: new Date(),
    });
    
    socket.userId = userId;
    socket.join(`user:${userId}`); // Join private room

    console.log(`👤 User ${userId} joined`);
    io.emit('users:online', { onlineCount: connectedUsers.size });
  });

  // ========== RIDE EVENTS ==========

  // Start tracking ride
  socket.on('ride:start', async (data) => {
    try {
      const { rideId, userId, startLocation } = data;

      // Store ride
      activeRides.set(rideId, {
        userId,
        location: startLocation,
        status: 'active',
        startedAt: new Date(),
        locations: [startLocation],
      });

      // Join ride room
      socket.join(`ride:${rideId}`);

      console.log(`🚗 Ride ${rideId} started`);

      // Broadcast to all guardians
      io.to(`user:${userId}`).emit('ride:started', {
        rideId,
        location: startLocation,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Ride start error:', error);
      socket.emit('error', { message: 'Failed to start ride' });
    }
  });

  // Location update
  socket.on('ride:location', (data) => {
    try {
      const { rideId, userId, latitude, longitude, speed, accuracy } = data;

      const ride = activeRides.get(rideId);
      if (ride) {
        ride.location = { latitude, longitude };
        ride.speed = speed;
        ride.accuracy = accuracy;
        ride.lastUpdate = new Date();

        if (ride.locations.length < 1000) {
          ride.locations.push({ latitude, longitude, timestamp: new Date() });
        }
      }

      // Broadcast to all in ride room (guardians + user)
      io.to(`ride:${rideId}`).emit('ride:location-update', {
        rideId,
        latitude,
        longitude,
        speed,
        accuracy,
        timestamp: new Date(),
      });

      console.log(`📍 Location update for ride ${rideId}: ${latitude}, ${longitude}`);
    } catch (error) {
      console.error('Location update error:', error);
    }
  });

  // End ride
  socket.on('ride:end', (data) => {
    try {
      const { rideId, userId, endLocation } = data;

      const ride = activeRides.get(rideId);
      if (ride) {
        ride.status = 'completed';
        ride.endedAt = new Date();
      }

      io.to(`ride:${rideId}`).emit('ride:ended', {
        rideId,
        endLocation,
        timestamp: new Date(),
      });

      // Clean up ride
      setTimeout(() => {
        activeRides.delete(rideId);
        socket.leave(`ride:${rideId}`);
      }, 5000);

      console.log(`✅ Ride ${rideId} completed`);
    } catch (error) {
      console.error('Ride end error:', error);
    }
  });

  // ========== SOS EVENTS ==========

  // SOS Alert
  socket.on('sos:alert', async (data) => {
    try {
      const { rideId, userId, location, message } = data;

      console.log(`🚨 SOS Alert from user ${userId}:`, location);

      // Broadcast to all guardians
      io.to(`user:${userId}`).emit('sos:alert', {
        userId,
        rideId,
        location,
        message,
        timestamp: new Date(),
      });

      // Mark ride as emergency
      if (activeRides.has(rideId)) {
        const ride = activeRides.get(rideId);
        ride.status = 'emergency';
      }

      // Send SMS notification (will be done by REST API)
      socket.emit('sos:acknowledged', { status: 'sent' });
    } catch (error) {
      console.error('SOS alert error:', error);
      socket.emit('error', { message: 'Failed to send SOS alert' });
    }
  });

  // ========== SAFE CIRCLE EVENTS ==========

  // Add guardian
  socket.on('safecircle:add-guardian', (data) => {
    const { userId, guardianPhone } = data;
    console.log(`➕ Guardian added: ${guardianPhone} for user ${userId}`);
    io.to(`user:${userId}`).emit('safecircle:updated');
  });

  // ========== DISCONNECT ==========

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);

    // Find and remove user
    for (let [userId, userData] of connectedUsers.entries()) {
      if (userData.socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`👤 User ${userId} left`);
        break;
      }
    }

    io.emit('users:online', { onlineCount: connectedUsers.size });
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// ============ REST API ROUTES ============

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime(),
    activeRides: activeRides.size,
    connectedUsers: connectedUsers.size,
  });
});

// API Routes
app.use('/api/auth', authRoutes(pool));
app.use('/api/rides', ridesRoutes(pool, io));
app.use('/api/emergency', emergencyRoutes(pool, io));

// ============ ERROR HANDLING ============

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    error: message,
    errorCode: err.errorCode || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🛡️  ZenSHIELD Backend Running         ║
╠════════════════════════════════════════╣
║  Port: ${PORT}                            ║
║  Mode: ${process.env.NODE_ENV || 'development'} ║
║  API: http://localhost:${PORT}/api      ║
║  WS: ws://localhost:${PORT}              ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: closing server');
  server.close(() => {
    pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });
});

module.exports = { app, io, server };
