import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import deliveryRoutes from './delivery.routes';
import trackingRoutes from './tracking.routes';
import { RedisClient } from '../config/redis';

const router = Router();

// Preserve existing full CRUD under `/logistics/deliveries/*` and `/logistics/tracking/*`
router.use('/deliveries', deliveryRoutes);
router.use('/tracking', trackingRoutes);

const trackSchema = Joi.object({
  deliveryId: Joi.string().uuid().required(),
});

const calculateSchema = Joi.object({
  origin: Joi.object().required(),
  destination: Joi.object().required(),
});

const driverUpsertSchema = Joi.object({
  driverId: Joi.string().min(3).max(64).required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  accuracy: Joi.number().optional(),
  speed: Joi.number().optional(),
  heading: Joi.number().optional(),
});

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });
  next();
};

// GET/POST /logistics/track -> convenience wrapper over tracking data in Redis/DB
router.get('/track', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deliveryId = req.query.deliveryId as string | undefined;
    if (!deliveryId) return res.status(400).json({ success: false, error: 'deliveryId is required' });
    const cached = await RedisClient.get(`delivery:location:${deliveryId}`);
    if (cached) return res.json({ success: true, data: JSON.parse(cached), source: 'realtime' });
    return res.status(404).json({ success: false, error: 'No location data available' });
  } catch (e) {
    next(e);
  }
});

router.post('/track', validate(trackSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deliveryId } = req.body as { deliveryId: string };
    const cached = await RedisClient.get(`delivery:location:${deliveryId}`);
    if (cached) return res.json({ success: true, data: JSON.parse(cached), source: 'realtime' });
    return res.status(404).json({ success: false, error: 'No location data available' });
  } catch (e) {
    next(e);
  }
});

// POST /logistics/calculate -> lightweight estimate (stub)
router.post('/calculate', validate(calculateSchema), async (_req: Request, res: Response) => {
  // This is a minimal calculation stub to keep the API responsive in dev.
  res.json({
    success: true,
    data: {
      distanceKm: 12.3,
      etaMinutes: 28,
      provider: 'stub',
    },
  });
});

// Drivers: store last known driver positions in Redis
router.get('/drivers', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const raw = await RedisClient.get('drivers:last_positions');
    const data = raw ? JSON.parse(raw) : {};
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
});

router.put('/drivers', validate(driverUpsertSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const update = req.body as any;
    const raw = await RedisClient.get('drivers:last_positions');
    const current = raw ? JSON.parse(raw) : {};
    current[update.driverId] = { ...update, updatedAt: new Date().toISOString() };
    await RedisClient.set('drivers:last_positions', JSON.stringify(current), 3600);
    res.json({ success: true, data: current[update.driverId] });
  } catch (e) {
    next(e);
  }
});

export default router;

