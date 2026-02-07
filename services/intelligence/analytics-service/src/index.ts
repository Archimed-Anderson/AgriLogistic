import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import analyticsRoutes from './routes/analytics.routes';
import eventsRoutes from './routes/events.routes';
import { ClickHouseClient } from './config/clickhouse';
import { RedisClient } from './config/redis';
import { KafkaConsumer } from './events/kafka.consumer';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3015;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/health', async (_req: Request, res: Response) => {
  const clickhouseHealthy = await ClickHouseClient.isHealthy();
  const redisHealthy = await RedisClient.isHealthy();
  const overallHealthy = clickhouseHealthy && redisHealthy;
  res.status(overallHealthy ? 200 : 503).json({
    status: overallHealthy ? 'healthy' : 'degraded',
    service: 'analytics-service',
    timestamp: new Date().toISOString(),
    dependencies: {
      clickhouse: clickhouseHealthy ? 'up' : 'down',
      redis: redisHealthy ? 'up' : 'down',
      kafka: KafkaConsumer.isConnected() ? 'up' : 'down',
    },
  });
});

app.get('/live', (_req, res) => res.json({ status: 'alive' }));

app.use('/analytics', analyticsRoutes);
app.use('/events', eventsRoutes);

app.use((_req, res) => res.status(404).json({ success: false, error: 'Not found' }));
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal error' });
});

const startServer = async () => {
  try {
    await ClickHouseClient.initialize();
    await RedisClient.initialize();
    await KafkaConsumer.connect();

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`📊 Analytics Service on port ${PORT}`);
      console.log(`🗄️ ClickHouse: Connected`);
      console.log(`📨 Kafka: ${KafkaConsumer.isConnected() ? 'Connected' : 'Disconnected'}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await KafkaConsumer.disconnect();
  await ClickHouseClient.close();
  await RedisClient.close();
  process.exit(0);
});

startServer();
export default app;
