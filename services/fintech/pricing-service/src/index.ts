import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import pricingRoutes from './routes/pricing.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3012;

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Main Routes
app.use('/pricing', pricingRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'pricing-service', uptime: process.uptime() });
});

// Error Management
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[PricingService Error]:', err);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 Pricing Service running on ${PORT}`);
  console.log(`=================================`);
});

export default app;
