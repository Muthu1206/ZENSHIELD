/**
 * ZenSHIELD Backend - Express.js OTP Authentication
 * 
 * Setup Instructions:
 * 1. npm init -y
 * 2. npm install express cors dotenv jsonwebtoken bcrypt pg postgresql twilio axios morgan helmet express-rate-limit joi
 * 3. npm install -D nodemon @types/node
 * 
 * File: server.js (or src/server.js)
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

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
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // max 3 OTP requests per hour
  skipSuccessfulRequests: true,
  keyGenerator: (req) => req.body.phoneNumber || req.ip,
});

app.use('/api/', limiter);
app.use('/api/auth/send-otp', otpLimiter);

// ============ DATABASE SETUP ============

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// ============ ROUTES ============

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes(pool));
app.use('/api/users', userRoutes(pool));

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

app.listen(PORT, () => {
  console.log(`🚀 ZenSHIELD Backend running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
    process.exit(0);
  });
});

module.exports = app;