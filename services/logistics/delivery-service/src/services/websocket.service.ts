import { Server as SocketServer, Socket } from 'socket.io';
import { RedisClient } from '../config/redis';
import { Database } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  timestamp: string;
}

interface DriverLocation extends GPSLocation {
  driverId: string;
  deliveryId: string;
}

/**
 * Setup WebSocket handlers for real-time GPS tracking
 */
export function setupWebSocket(io: SocketServer): void {
  // Namespace for delivery tracking
  const trackingNamespace = io.of('/tracking');

  trackingNamespace.on('connection', (socket: Socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Driver joins their delivery room
    socket.on('driver:join', async (data: { driverId: string; deliveryId: string }) => {
      const { driverId, deliveryId } = data;
      
      // Join delivery-specific room
      socket.join(`delivery:${deliveryId}`);
      socket.join(`driver:${driverId}`);
      
      console.log(`[WebSocket] Driver ${driverId} joined delivery ${deliveryId}`);
      
      // Store driver connection in Redis
      await RedisClient.set(`driver:socket:${driverId}`, socket.id, 3600);
    });

    // Customer subscribes to delivery updates
    socket.on('customer:subscribe', async (data: { deliveryId: string; customerId: string }) => {
      const { deliveryId, customerId } = data;
      
      socket.join(`delivery:${deliveryId}`);
      console.log(`[WebSocket] Customer ${customerId} subscribed to delivery ${deliveryId}`);
      
      // Send current driver location if available
      const location = await RedisClient.get(`delivery:location:${deliveryId}`);
      if (location) {
        socket.emit('location:current', JSON.parse(location));
      }
    });

    // Driver sends GPS location update
    socket.on('location:update', async (data: DriverLocation) => {
      const { driverId, deliveryId, latitude, longitude, accuracy, speed, heading, timestamp } = data;
      
      const locationData = {
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
        timestamp: timestamp || new Date().toISOString(),
        driverId,
      };

      // Store in Redis for quick access (TTL 1 hour)
      await RedisClient.set(
        `delivery:location:${deliveryId}`,
        JSON.stringify(locationData),
        3600
      );

      // Store in location history (database)
      await Database.query(
        `INSERT INTO delivery_locations (id, delivery_id, driver_id, latitude, longitude, accuracy, speed, heading, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [uuidv4(), deliveryId, driverId, latitude, longitude, accuracy || null, speed || null, heading || null]
      );

      // Broadcast to all subscribers of this delivery
      trackingNamespace.to(`delivery:${deliveryId}`).emit('location:updated', locationData);
      
      // Calculate and emit ETA if destination is known
      const deliveryInfo = await RedisClient.get(`delivery:info:${deliveryId}`);
      if (deliveryInfo) {
        const info = JSON.parse(deliveryInfo);
        if (info.destinationLat && info.destinationLng) {
          const eta = calculateETA(
            { lat: latitude, lng: longitude },
            { lat: info.destinationLat, lng: info.destinationLng },
            speed || 30 // default 30 km/h
          );
          trackingNamespace.to(`delivery:${deliveryId}`).emit('eta:updated', { eta, deliveryId });
        }
      }
    });

    // Driver reports delivery status change
    socket.on('delivery:status', async (data: { deliveryId: string; status: string; notes?: string }) => {
      const { deliveryId, status, notes } = data;
      
      // Broadcast status change
      trackingNamespace.to(`delivery:${deliveryId}`).emit('delivery:statusChanged', {
        deliveryId,
        status,
        notes,
        timestamp: new Date().toISOString(),
      });
      
      console.log(`[WebSocket] Delivery ${deliveryId} status changed to ${status}`);
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  console.log('[WebSocket] GPS tracking namespace initialized');
}

/**
 * Calculate ETA based on current position, destination, and speed
 */
function calculateETA(
  current: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  speedKmh: number
): { minutes: number; distance: number } {
  // Haversine formula for distance
  const R = 6371; // Earth's radius in km
  const dLat = toRad(destination.lat - current.lat);
  const dLng = toRad(destination.lng - current.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(current.lat)) *
      Math.cos(toRad(destination.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const hours = distance / speedKmh;
  const minutes = Math.round(hours * 60);

  return { minutes, distance: Math.round(distance * 100) / 100 };
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default setupWebSocket;
