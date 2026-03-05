/**
 * Socket.io Client Service
 * Handles real-time communication with backend
 */

import { io, Socket } from 'socket.io-client';

const SERVER_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket: Socket | null = null;
let userId: string | null = null;

export const socketService = {
  /**
   * Initialize socket connection
   */
  connect: (userIdParam: string) => {
    if (socket?.connected) return socket;

    userId = userIdParam;

    socket = io(SERVER_URL, {
      auth: {
        userId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id);

      // Emit user join event
      socket?.emit('user:join', { userId, phoneNumber: '' });
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return socket;
  },

  /**
   * Get socket instance
   */
  getSocket: () => socket,

  /**
   * Disconnect socket
   */
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  // ============ RIDE EVENTS ============

  /**
   * Emit: Start ride
   */
  startRide: (rideId: string, startLocation: { latitude: number; longitude: number }) => {
    socket?.emit('ride:start', {
      rideId,
      userId,
      startLocation,
    });
  },

  /**
   * Emit: Send location update
   */
  sendLocationUpdate: (
    rideId: string,
    latitude: number,
    longitude: number,
    speed?: number,
    accuracy?: number
  ) => {
    socket?.emit('ride:location', {
      rideId,
      userId,
      latitude,
      longitude,
      speed: speed || 0,
      accuracy: accuracy || 0,
    });
  },

  /**
   * Emit: End ride
   */
  endRide: (rideId: string, endLocation: { latitude: number; longitude: number }) => {
    socket?.emit('ride:end', {
      rideId,
      userId,
      endLocation,
    });
  },

  /**
   * Listen: Ride started
   */
  onRideStarted: (callback: (data: any) => void) => {
    socket?.on('ride:started', callback);
  },

  /**
   * Listen: Location update
   */
  onLocationUpdate: (callback: (data: any) => void) => {
    socket?.on('ride:location-update', callback);
  },

  /**
   * Listen: Ride ended
   */
  onRideEnded: (callback: (data: any) => void) => {
    socket?.on('ride:ended', callback);
  },

  // ============ SOS EVENTS ============

  /**
   * Emit: Trigger SOS alert
   */
  triggerSOS: (
    rideId: string,
    location: { latitude: number; longitude: number },
    message?: string
  ) => {
    socket?.emit('sos:alert', {
      rideId,
      userId,
      location,
      message: message || 'Emergency SOS',
    });
  },

  /**
   * Listen: SOS alert received
   */
  onSOSAlert: (callback: (data: any) => void) => {
    socket?.on('sos:alert', callback);
  },

  /**
   * Listen: SOS acknowledged
   */
  onSOSAcknowledged: (callback: (data: any) => void) => {
    socket?.on('sos:acknowledged', callback);
  },

  // ============ SAFE CIRCLE EVENTS ============

  /**
   * Emit: Add guardian
   */
  addGuardian: (guardianPhone: string) => {
    socket?.emit('safecircle:add-guardian', {
      userId,
      guardianPhone,
    });
  },

  /**
   * Listen: Safe circle updated
   */
  onSafeCircleUpdated: (callback: () => void) => {
    socket?.on('safecircle:updated', callback);
  },

  // ============ GENERIC LISTENERS ============

  /**
   * Listen to custom events
   */
  on: (event: string, callback: (data: any) => void) => {
    socket?.on(event, callback);
  },

  /**
   * Emit custom events
   */
  emit: (event: string, data: any) => {
    socket?.emit(event, data);
  },

  /**
   * Remove listener
   */
  off: (event: string, callback?: (data: any) => void) => {
    if (callback) {
      socket?.off(event, callback);
    } else {
      socket?.off(event);
    }
  },

  /**
   * Check if socket is connected
   */
  isConnected: () => socket?.connected || false,
};

export default socketService;
