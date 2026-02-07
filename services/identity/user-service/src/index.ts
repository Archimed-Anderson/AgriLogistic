import './tracing';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import usersRoutes from './routes/users.routes';
import { Database } from './config/database';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3013;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/health', async (_req: Request, res: Response) => {
  const dbHealthy = await Database.isHealthy();
  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'healthy' : 'degraded',
    service: 'user-service',
    timestamp: new Date().toISOString(),
    dependencies: { database: dbHealthy ? 'up' : 'down' },
  });
});

app.use('/users', usersRoutes);

app.use((_req: Request, res: Response) => res.status(404).json({ success: false, error: 'Route not found' }));
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

const startServer = async () => {
  const ok = await Database.initialize();
  if (!ok) process.exit(1);

  app.listen(PORT, () => {
    console.log('=================================');
    console.log(`👤 User Service running on port ${PORT}`);
    console.log(`📝 Health check: http://localhost:${PORT}/health`);
    console.log('=================================');
  });
};

process.on('SIGTERM', async () => {
  await Database.close();
  process.exit(0);
});
process.on('SIGINT', async () => {
  await Database.close();
  process.exit(0);
});

startServer();

export default app;

