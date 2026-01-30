import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import orderRoutes from './routes/order.routes';
import { Database } from './config/database';
import { RedisClient } from './config/redis';
import { metricsMiddleware, metricsEndpoint } from './middleware/metrics.middleware';
import { requestLogger } from './middleware/logger.middleware';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use(requestLogger);
app.use(metricsMiddleware);

// Metrics endpoint for Prometheus
app.get('/metrics', metricsEndpoint);

// Health check
app.get('/health', async (_req: Request, res: Response) => {
  const dbHealthy = await Database.isHealthy();
  const redisHealthy = await RedisClient.isHealthy();
  
  const status = dbHealthy && redisHealthy ? 'healthy' : 'degraded';
  const statusCode = status === 'healthy' ? 200 : 503;
  
  res.status(statusCode).json({
    status,
    service: 'order-service',
    timestamp: new Date().toISOString(),
    dependencies: {
      database: dbHealthy ? 'up' : 'down',
      redis: redisHealthy ? 'up' : 'down',
    },
  });
});

// Readiness probe
app.get('/ready', async (_req: Request, res: Response) => {
  const dbReady = await Database.isHealthy();
  const redisReady = await RedisClient.isHealthy();
  
  if (dbReady && redisReady) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

// Liveness probe
app.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'alive' });
});

// Routes
app.use('/orders', orderRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
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
    // Initialize database connection
    const dbConnected = await Database.initialize();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Initialize Redis connection
    const redisConnected = await RedisClient.initialize();
    if (!redisConnected) {
      console.warn('⚠️ Redis not available - some features may be limited');
    }

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Order Service running on port ${PORT}`);
      console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💚 Database: Connected`);
      console.log(`📦 Redis: ${redisConnected ? 'Connected' : 'Disconnected'}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
      console.log(`📊 Metrics: http://localhost:${PORT}/metrics`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await Database.close();
  await RedisClient.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await Database.close();
  await RedisClient.close();
  process.exit(0);
});

startServer();

export default app;
