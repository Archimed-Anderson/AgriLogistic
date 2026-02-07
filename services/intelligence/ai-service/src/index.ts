import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai.routes';
import { Database } from './config/database';
import { RedisClient } from './config/redis';
import { RecommendationService } from './services/recommendation.service';
import { ForecastService } from './services/forecast.service';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));

app.get('/health', async (_req: Request, res: Response) => {
  const dbHealthy = await Database.isHealthy();
  const redisHealthy = await RedisClient.isHealthy();
  const overallHealthy = dbHealthy && redisHealthy;
  res.status(overallHealthy ? 200 : 503).json({
    status: overallHealthy ? 'healthy' : 'degraded',
    service: 'ai-service',
    timestamp: new Date().toISOString(),
    database: dbHealthy,
    redis: redisHealthy,
    models: {
      recommendation: RecommendationService.isReady(),
      forecast: ForecastService.isReady(),
    },
  });
});

app.get('/live', (_req, res) => res.json({ status: 'alive' }));

app.use('/ai', aiRoutes);

app.use((_req, res) => res.status(404).json({ success: false, error: 'Not found' }));
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal error' });
});

const startServer = async () => {
  try {
    await Database.initialize();
    await RedisClient.initialize();
    
    // Initialize ML models
    await RecommendationService.initialize();
    await ForecastService.initialize();

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🤖 AI Service on port ${PORT}`);
      console.log(`🧠 Models: Recommendation ✓, Forecast ✓`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await Database.close();
  await RedisClient.close();
  process.exit(0);
});

startServer();
export default app;
