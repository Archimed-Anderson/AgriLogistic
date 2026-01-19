import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notification.routes';
import contactRoutes from './routes/contact.routes';
import { Database } from './config/database';
import { RedisClient } from './config/redis';
import { NotificationQueue } from './services/queue.service';
import { metricsMiddleware, metricsEndpoint } from './middleware/metrics.middleware';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3006;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(metricsMiddleware);

app.get('/metrics', metricsEndpoint);

app.get('/health', async (_req: Request, res: Response) => {
  const dbHealthy = await Database.isHealthy();
  const redisHealthy = await RedisClient.isHealthy();
  res.status(dbHealthy && redisHealthy ? 200 : 503).json({
    status: dbHealthy && redisHealthy ? 'healthy' : 'degraded',
    service: 'notification-service',
    timestamp: new Date().toISOString(),
    providers: {
      email: !!process.env.SENDGRID_API_KEY,
      sms: !!process.env.TWILIO_ACCOUNT_SID,
      push: !!process.env.FIREBASE_PROJECT_ID,
    },
  });
});

app.get('/live', (_req, res) => res.json({ status: 'alive' }));
app.get('/ready', async (_req, res) => {
  const ready = await Database.isHealthy();
  res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not ready' });
});

app.use('/notifications', notificationRoutes);
app.use('/contact', contactRoutes);

app.use((_req, res) => res.status(404).json({ success: false, error: 'Not found' }));
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal error' });
});

const startServer = async () => {
  try {
    await Database.initialize();
    await RedisClient.initialize();
    await NotificationQueue.initialize();

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`📧 Notification Service on port ${PORT}`);
      console.log(`📱 Channels: Email${process.env.SENDGRID_API_KEY ? '✓' : '○'} SMS${process.env.TWILIO_ACCOUNT_SID ? '✓' : '○'} Push${process.env.FIREBASE_PROJECT_ID ? '✓' : '○'}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await NotificationQueue.close();
  await Database.close();
  await RedisClient.close();
  process.exit(0);
});

startServer();
export default app;
