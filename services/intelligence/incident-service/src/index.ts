import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { Database } from './config/database';
import { RedisClient } from './config/redis';
import { initKafkaProducer, initKafkaConsumer } from './config/kafka';
import {
  setupWarRoomWebSocket,
  publishMetricsToRedis,
  publishIncidentToRedis,
} from './services/websocket.service';
import incidentsRoutes from './routes/incidents.routes';
import { Pool } from 'pg';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3018;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', async (_req: Request, res: Response) => {
  const dbOk = await Database.isHealthy();
  const redisOk = await RedisClient.isHealthy();
  res.status(dbOk && redisOk ? 200 : 503).json({
    status: dbOk && redisOk ? 'healthy' : 'degraded',
    service: 'incident-service',
    dependencies: { database: dbOk, redis: redisOk },
  });
});

app.get('/live', (_req: Request, res: Response) => {
  res.json({ status: 'alive' });
});

app.use('/api/v1/incidents', incidentsRoutes);

// Métriques mock (toutes les 30s) → Redis Pub/Sub → Socket.io
function startMetricsEmitter() {
  setInterval(() => {
    publishMetricsToRedis({
      activeTransactions: Math.floor(1200 + Math.random() * 100),
      trucksEnRoute: Math.floor(85 + Math.random() * 15),
      escrowPending: Math.floor(330 + Math.random() * 30),
      systemHealth: 99.9 + Math.random() * 0.1,
    });
  }, 30000);
}

async function ensureIncidentsTable() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5435'),
    database: process.env.DB_NAME || 'AgriLogistic_orders',
    user: process.env.DB_USER || 'AgriLogistic',
    password: process.env.DB_PASSWORD || 'AgriLogistic_secure_2026',
  });
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS incidents (
        id VARCHAR(36) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        location_lat FLOAT NOT NULL,
        location_lng FLOAT NOT NULL,
        region VARCHAR(100) NOT NULL,
        severity SMALLINT NOT NULL DEFAULT 50,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        metadata JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    await pool.end();
  } catch (e) {
    console.warn('Ensure incidents table:', e);
  }
}

const startServer = async () => {
  await ensureIncidentsTable();

  const dbOk = await Database.initialize();
  if (!dbOk) {
    console.error('❌ Database failed');
    process.exit(1);
  }

  const redisOk = await RedisClient.initialize();
  if (!redisOk) {
    console.error('❌ Redis failed');
    process.exit(1);
  }

  await initKafkaProducer();
  await initKafkaConsumer((event) => publishIncidentToRedis(event));

  setupWarRoomWebSocket(io);
  startMetricsEmitter();

  httpServer.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚨 Incident Service (War Room) on port ${PORT}`);
    console.log(`   WebSocket: ws://localhost:${PORT}/war-room`);
    console.log(`   API: http://localhost:${PORT}/api/v1/incidents`);
    console.log('=================================');
  });
};

process.on('SIGTERM', async () => {
  await Database.close();
  await RedisClient.close();
  process.exit(0);
});

startServer().catch((e) => {
  console.error('Start failed:', e);
  process.exit(1);
});
