import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import 'express-async-errors';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import buyerRoutes from './routes/buyer.routes';
import transporterRoutes from './routes/transporter.routes';
import { Database } from './config/database';
import { getRedisService } from './services/redis.service';

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(`⚠️  Could not load .env file from ${envPath}`);
  console.warn('💡 Using environment variables from system or defaults');
} else {
  console.log(`✅ Environment variables loaded from .env`);
}

const app: Application = express();
const PORT = process.env.PORT || 3001;
let dbConnected: boolean = false;
let redisConnected: boolean = false;

// Middleware
// Configure Helmet for local development - disable CSP upgrade-insecure-requests
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "upgrade-insecure-requests": null, // Allow HTTP in development
    },
  },
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: dbConnected ? 'healthy' : 'degraded',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    dependencies: {
      database: dbConnected ? 'connected' : 'disconnected',
      redis: redisConnected ? 'connected' : 'disconnected',
    },
  });
});

// API Routes with /api/v1 prefix
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/buyer', buyerRoutes);
app.use('/api/v1/transporter', transporterRoutes);

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
    const env = (process.env.NODE_ENV || 'development').toLowerCase();
    const requireDb = (process.env.REQUIRE_DB || '').toLowerCase() === 'true' || env === 'production';

    // Test database connection
    dbConnected = await Database.testConnection();
    if (!dbConnected) {
      const msg = '❌ Failed to connect to database';
      if (requireDb) {
        console.error(msg);
        process.exit(1);
      } else {
        console.warn(`${msg} (continuing in degraded mode)`);
      }
    }

    // Initialize Redis connection
    try {
      const redisService = getRedisService();
      await redisService.connect();
      redisConnected = true;
      console.log('✅ Redis: Connected');
    } catch (error) {
      redisConnected = false;
      console.warn('⚠️  Redis connection failed (continuing without Redis):', error);
      // Continue without Redis - some features won't work but service can still run
    }

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Auth Service running on port ${PORT}`);
      console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💚 Database: ${dbConnected ? 'Connected' : 'Disconnected (degraded)'}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 API Base: http://localhost:${PORT}/api/v1`);
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
  const redisService = getRedisService();
  await redisService.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await Database.close();
  const redisService = getRedisService();
  await redisService.disconnect();
  process.exit(0);
});

startServer();

export default app;
