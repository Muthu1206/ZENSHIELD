/**
 * Rides Routes - Real-time Ride Management
 */

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

module.exports = (pool, io) => {
  // POST /api/rides/start - Start a new ride
  router.post('/start', authenticate, async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { startLocation, destination } = req.body;

      if (!startLocation) {
        return res.status(400).json({
          success: false,
          error: 'startLocation is required',
        });
      }

      // Store ride in database
      const rideResult = await pool.query(
        `INSERT INTO rides (user_id, start_location, destination, status, started_at)
         VALUES ($1, $2, $3, 'active', NOW())
         RETURNING id, user_id, start_location, started_at, status`,
        [userId, JSON.stringify(startLocation), destination || null]
      );

      const ride = rideResult.rows[0];

      // Emit via Socket.io
      io.to(`user:${userId}`).emit('ride:started', {
        rideId: ride.id,
        location: startLocation,
        timestamp: new Date(),
      });

      res.json({
        success: true,
        message: 'Ride started successfully',
        ride: {
          id: ride.id,
          status: ride.status,
          startedAt: ride.started_at,
        },
      });
    } catch (error) {
      console.error('Start Ride Error:', error);
      next(error);
    }
  });

  // POST /api/rides/:rideId/end - End a ride
  router.post('/:rideId/end', authenticate, async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { rideId } = req.params;
      const { endLocation } = req.body;

      // Update ride in database
      const rideResult = await pool.query(
        `UPDATE rides 
         SET status = 'completed', end_location = $1, ended_at = NOW()
         WHERE id = $2 AND user_id = $3
         RETURNING id, status, ended_at`,
        [JSON.stringify(endLocation || {}), rideId, userId]
      );

      if (rideResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Ride not found',
        });
      }

      const ride = rideResult.rows[0];

      // Emit via Socket.io
      io.to(`ride:${rideId}`).emit('ride:ended', {
        rideId,
        endLocation,
        timestamp: new Date(),
      });

      res.json({
        success: true,
        message: 'Ride ended successfully',
        ride: {
          id: ride.id,
          status: ride.status,
          endedAt: ride.ended_at,
        },
      });
    } catch (error) {
      console.error('End Ride Error:', error);
      next(error);
    }
  });

  // GET /api/rides/:rideId - Get ride details
  router.get('/:rideId', authenticate, async (req, res, next) => {
    try {
      const { rideId } = req.params;

      const rideResult = await pool.query(
        `SELECT * FROM rides WHERE id = $1`,
        [rideId]
      );

      if (rideResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Ride not found',
        });
      }

      res.json({
        success: true,
        ride: rideResult.rows[0],
      });
    } catch (error) {
      console.error('Get Ride Error:', error);
      next(error);
    }
  });

  return router;
};
