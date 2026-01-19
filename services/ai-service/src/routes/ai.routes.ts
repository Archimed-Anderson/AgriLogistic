import { Router, Request, Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import { ForecastService } from '../services/forecast.service';

const router = Router();

// Get personalized recommendations
router.get('/recommendations/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
    const recommendations = await RecommendationService.getRecommendations(userId, limit);
    res.json({ success: true, data: recommendations });
  } catch (error) { next(error); }
});

// Get similar products
router.get('/similar/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 6, 20);
    const similar = await RecommendationService.getSimilarProducts(productId, limit);
    res.json({ success: true, data: similar });
  } catch (error) { next(error); }
});

// Record user interaction
router.post('/interactions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, productId, action } = req.body;
    if (!userId || !productId || !action) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    await RecommendationService.recordInteraction(userId, productId, action);
    res.status(201).json({ success: true });
  } catch (error) { next(error); }
});

// Forecast demand
router.get('/forecast/demand/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const days = Math.min(parseInt(req.query.days as string) || 30, 90);
    const forecast = await ForecastService.forecastDemand(productId, days);
    res.json({ success: true, data: forecast });
  } catch (error) { next(error); }
});

// Forecast price
router.get('/forecast/price/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const days = Math.min(parseInt(req.query.days as string) || 14, 30);
    const forecast = await ForecastService.forecastPrice(productId, days);
    res.json({ success: true, data: forecast });
  } catch (error) { next(error); }
});

// Health check for ML models
router.get('/models/status', async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      recommendation: { ready: RecommendationService.isReady(), type: 'collaborative-filtering' },
      forecast: { ready: ForecastService.isReady(), type: 'time-series-regression' },
    },
  });
});

export default router;
