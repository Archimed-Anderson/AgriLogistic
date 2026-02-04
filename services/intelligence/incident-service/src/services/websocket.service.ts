import { Server as SocketServer, Socket } from 'socket.io';
import { RedisClient } from '../config/redis';

const WAR_ROOM_CHANNEL = 'war-room:incidents';
const WAR_ROOM_METRICS_CHANNEL = 'war-room:metrics';

export function setupWarRoomWebSocket(io: SocketServer): void {
  const warRoomNs = io.of('/war-room');

  warRoomNs.on('connection', (socket: Socket) => {
    console.log(`[War Room] Client connected: ${socket.id}`);

    socket.on('join', () => {
      socket.join('war-room');
      socket.emit('joined', { room: 'war-room' });
    });

    socket.on('disconnect', () => {
      console.log(`[War Room] Client disconnected: ${socket.id}`);
    });
  });

  // Redis Pub/Sub: subscribe to incident events → broadcast via Socket.io
  RedisClient.initSubscriber().then(async (sub) => {
    if (!sub) return;

    await sub.subscribe(WAR_ROOM_CHANNEL, (message: string) => {
      try {
        const data = JSON.parse(message);
        warRoomNs.to('war-room').emit('incident:new', data);
        warRoomNs.to('war-room').emit('incident:update', data);
      } catch (e) {
        console.error('[War Room] Redis message parse error:', e);
      }
    });

    await sub.subscribe(WAR_ROOM_METRICS_CHANNEL, (message: string) => {
      try {
        const data = JSON.parse(message);
        warRoomNs.to('war-room').emit('metrics:update', data);
      } catch (e) {
        console.error('[War Room] Metrics parse error:', e);
      }
    });

    console.log('✅ War Room Redis Pub/Sub subscriber active');
  });

  console.log('[War Room] WebSocket namespace /war-room initialized');
}

export function publishIncidentToRedis(event: Record<string, any>): void {
  RedisClient.publish(WAR_ROOM_CHANNEL, JSON.stringify(event));
}

export function publishMetricsToRedis(metrics: Record<string, any>): void {
  RedisClient.publish(WAR_ROOM_METRICS_CHANNEL, JSON.stringify(metrics));
}
