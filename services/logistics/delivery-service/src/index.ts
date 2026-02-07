import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import deliveryRoutes from './routes/delivery.routes';
import trackingRoutes from './routes/tracking.routes';
import logisticsRoutes from './routes/logistics.routes';
import { Database } from './config/database';
import { RedisClient } from './config/redis';
import { metricsMiddleware, metricsEndpoint } from './middleware/metrics.middleware';
import { setupWebSocket } from './services/websocket.service';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3017;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(metricsMiddleware);

// Metrics endpoint
app.get('/metrics', metricsEndpoint);

// Health check
app.get('/health', async (_req: Request, res: Response) => {
  const dbHealthy = await Database.isHealthy();
  const redisHealthy = await RedisClient.isHealthy();
  
  res.status(dbHealthy && redisHealthy ? 200 : 503).json({
    status: dbHealthy && redisHealthy ? 'healthy' : 'degraded',
    service: 'delivery-service',
    timestamp: new Date().toISOString(),
    dependencies: {
      database: dbHealthy ? 'up' : 'down',
      redis: redisHealthy ? 'up' : 'down',
      websocket: 'up',
    },
  });
});

app.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'alive' });
});

app.get('/ready', async (_req: Request, res: Response) => {
  const dbReady = await Database.isHealthy();
  res.status(dbReady ? 200 : 503).json({ status: dbReady ? 'ready' : 'not ready' });
});

// Routes
app.use('/deliveries', deliveryRoutes);
app.use('/tracking', trackingRoutes);
app.use('/logistics', logisticsRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const startServer = async () => {
  try {
    const dbConnected = await Database.initialize();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    await RedisClient.initialize();

    // Setup WebSocket for real-time GPS tracking
    setupWebSocket(io);

    httpServer.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚚 Delivery Service running on port ${PORT}`);
      console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💚 Database: Connected`);
      console.log(`🌐 WebSocket: Enabled`);
      console.log(`📍 GPS Tracking: Active`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  console.log('SIGTERM received');
  await Database.close();
  await RedisClient.close();
  process.exit(0);
});

startServer();

export { io };
export default app;
