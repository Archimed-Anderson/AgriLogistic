import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes';
import webhookRoutes from './webhooks/stripe.webhook';
import { Database } from './config/database';
import { metricsMiddleware, metricsEndpoint } from './middleware/metrics.middleware';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// Raw body for Stripe webhooks (must be before json parser)
app.use('/webhooks/stripe', express.raw({ type: 'application/json' }));

// JSON body parser for other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use(metricsMiddleware);

// Metrics endpoint for Prometheus
app.get('/metrics', metricsEndpoint);

// Health check
app.get('/health', async (_req: Request, res: Response) => {
  const dbHealthy = await Database.isHealthy();
  const status = dbHealthy ? 'healthy' : 'degraded';
  
  res.status(dbHealthy ? 200 : 503).json({
    status,
    service: 'payment-service',
    timestamp: new Date().toISOString(),
    dependencies: {
      database: dbHealthy ? 'up' : 'down',
      stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not configured',
    },
  });
});

// Liveness probe
app.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness probe
app.get('/ready', async (_req: Request, res: Response) => {
  const dbReady = await Database.isHealthy();
  
  if (dbReady) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
});

// Routes
app.use('/payments', paymentRoutes);
app.use('/webhooks', webhookRoutes);

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

    // Verify Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('⚠️ Stripe secret key not configured - payment processing will be simulated');
    }

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Payment Service running on port ${PORT}`);
      console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💚 Database: Connected`);
      console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : 'Simulated'}`);
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
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await Database.close();
  process.exit(0);
});

startServer();

export default app;
