import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initDatabase } from './config/database';
import productionsRoutes from './routes/productions.routes';
import irrigationRoutes from './routes/irrigation.routes';

const app = express();
const PORT = process.env.PORT || 3018;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'production-service' });
});

app.use('/api/v1/productions', productionsRoutes);
app.use('/productions', productionsRoutes);
app.use('/api/v1/irrigation', irrigationRoutes);
app.use('/irrigation', irrigationRoutes);

const start = async () => {
  try {
    await initDatabase();
  } catch (err) {
    console.error('⚠️ Database unavailable (degraded mode):', (err as Error).message);
    if (process.env.REQUIRE_DB === 'true' || process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
  app.listen(PORT, () => {
    console.log(`🌾 Production Service on port ${PORT}`);
  });
};

start();
