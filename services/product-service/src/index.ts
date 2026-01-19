import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import 'express-async-errors';
import productRoutes from './routes/product.routes';
import { Database } from './config/database';
import { ElasticsearchService } from './config/elasticsearch';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
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
    status: 'healthy',
    service: 'product-service',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/products', productRoutes);

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
    // Test database connection
    const dbConnected = await Database.testConnection();
    if (!dbConnected) {
      console.error('❌ Failed to connect to database');
      process.exit(1);
    }

    // Test Elasticsearch connection
    const esConnected = await ElasticsearchService.testConnection();
    if (!esConnected) {
      console.warn('⚠️ Elasticsearch not available - search features will be limited');
    } else {
      // Initialize Elasticsearch index
      await ElasticsearchService.initializeProductsIndex();
    }

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Product Service running on port ${PORT}`);
      console.log(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`💚 Database: Connected`);
      console.log(`🔍 Elasticsearch: ${esConnected ? 'Connected' : 'Disconnected'}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
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
  await ElasticsearchService.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await Database.close();
  await ElasticsearchService.close();
  process.exit(0);
});

startServer();

export default app;


