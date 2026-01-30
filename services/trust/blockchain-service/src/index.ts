import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import blockchainRoutes from './routes/blockchain.routes';
import { BlockchainService } from './services/blockchain.service';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3009;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Health checks
app.get('/health', async (_req: Request, res: Response) => {
  const fabricEnabled = (process.env.FABRIC_ENABLED || 'false').toLowerCase() === 'true';
  const blockchainConnected = BlockchainService.isConnected();
  const overallHealthy = !fabricEnabled || blockchainConnected;

  res.status(overallHealthy ? 200 : 503).json({
    status: overallHealthy ? 'healthy' : 'degraded',
    service: 'blockchain-service',
    timestamp: new Date().toISOString(),
    network: {
      hyperledger: fabricEnabled ? (blockchainConnected ? 'connected' : 'disconnected') : 'disabled',
      channel: process.env.FABRIC_CHANNEL || 'AgroLogistic-channel',
    },
    mode: fabricEnabled ? 'fabric' : 'simulation',
  });
});

app.get('/live', (_req, res) => res.json({ status: 'alive' }));

// Routes
app.use('/blockchain', blockchainRoutes);

// 404 handler
app.use((_req, res) => res.status(404).json({ success: false, error: 'Not found' }));

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal error' });
});

const startServer = async () => {
  try {
    // Initialize blockchain connection
    const connected = await BlockchainService.initialize();
    if (!connected) {
      console.warn('⚠️ Running without blockchain connection - simulation mode enabled');
    }

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`⛓️ Blockchain Service on port ${PORT}`);
      console.log(`🔗 Hyperledger: ${connected ? 'Connected' : 'Simulation Mode'}`);
      console.log(`📜 Channel: ${process.env.FABRIC_CHANNEL || 'AgroLogistic-channel'}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('Failed to start:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await BlockchainService.disconnect();
  process.exit(0);
});

startServer();
export default app;
