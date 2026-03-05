/**
 * Emergency/SOS Routes
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { sendSOSSMS } = require('../services/smsService');

module.exports = (pool, io) => {
  // POST /api/emergency/sos - Trigger SOS alert
  router.post('/sos', authenticate, async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { rideId, latitude, longitude, message } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({
          success: false,
          error: 'GPS location is required',
        });
      }

      // Get user details
      const userResult = await pool.query(
        'SELECT phone_number, name FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
        });
      }

      const user = userResult.rows[0];

      // Get safe circle contacts
      const contactsResult = await pool.query(
        `SELECT contact_phone, contact_name FROM safe_circle_contacts 
         WHERE user_id = $1 AND is_emergency_contact = true`,
        [userId]
      );

      // Store SOS alert in database
      await pool.query(
        `INSERT INTO sos_alerts (user_id, ride_id, location, message, status, created_at)
         VALUES ($1, $2, $3, $4, 'triggered', NOW())`,
        [userId, rideId || null, JSON.stringify({ latitude, longitude }), message || 'Emergency SOS']
      );

      // Broadcast SOS via Socket.io
      io.to(`user:${userId}`).emit('sos:alert', {
        userId,
        rideId,
        latitude,
        longitude,
        message,
        timestamp: new Date(),
      });

      // Send SMS to all guardians
      const smsPromises = contactsResult.rows.map((contact) =>
        sendSOSSMS(contact.contact_phone, {
          name: user.name,
          latitude,
          longitude,
        })
      );

      await Promise.all(smsPromises);

      res.json({
        success: true,
        message: 'SOS alert sent to all guardians',
        contactsNotified: contactsResult.rows.length,
      });
    } catch (error) {
      console.error('SOS Alert Error:', error);
      next(error);
    }
  });

  // GET /api/emergency/sos-history - Get SOS history
  router.get('/sos-history', authenticate, async (req, res, next) => {
    try {
      const userId = req.user.id;

      const alertsResult = await pool.query(
        `SELECT id, ride_id, location, message, status, created_at 
         FROM sos_alerts 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 50`,
        [userId]
      );

      res.json({
        success: true,
        alerts: alertsResult.rows,
      });
    } catch (error) {
      console.error('Get SOS History Error:', error);
      next(error);
    }
  });

  return router;
};
