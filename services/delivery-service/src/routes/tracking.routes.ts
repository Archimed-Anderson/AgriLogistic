import { Router, Request, Response, NextFunction } from 'express';
import { Database } from '../config/database';
import { RedisClient } from '../config/redis';

const router = Router();

// Get live location for a delivery
router.get('/:deliveryId/location', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deliveryId } = req.params;
    
    // Try Redis first for real-time location
    const cachedLocation = await RedisClient.get(`delivery:location:${deliveryId}`);
    if (cachedLocation) {
      return res.json({ success: true, data: JSON.parse(cachedLocation), source: 'realtime' });
    }
    
    // Fallback to last known location from database
    const result = await Database.query(
      `SELECT * FROM delivery_locations WHERE delivery_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [deliveryId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'No location data available' });
    }
    
    res.json({ success: true, data: result.rows[0], source: 'database' });
  } catch (error) { next(error); }
});

// Get location history for a delivery
router.get('/:deliveryId/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deliveryId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
    
    const result = await Database.query(
      `SELECT * FROM delivery_locations WHERE delivery_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [deliveryId, limit]
    );
    
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) { next(error); }
});

// Get ETA for a delivery
router.get('/:deliveryId/eta', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deliveryId } = req.params;
    
    const deliveryInfo = await RedisClient.get(`delivery:info:${deliveryId}`);
    const currentLocation = await RedisClient.get(`delivery:location:${deliveryId}`);
    
    if (!deliveryInfo || !currentLocation) {
      return res.status(404).json({ success: false, error: 'Delivery or location not found' });
    }
    
    const info = JSON.parse(deliveryInfo);
    const location = JSON.parse(currentLocation);
    
    // Calculate distance and ETA
    const distance = calculateDistance(
      location.latitude, location.longitude,
      info.destinationLat, info.destinationLng
    );
    const speedKmh = location.speed || 30;
    const etaMinutes = Math.round((distance / speedKmh) * 60);
    
    res.json({
      success: true,
      data: {
        deliveryId,
        distanceKm: Math.round(distance * 100) / 100,
        etaMinutes,
        estimatedArrival: new Date(Date.now() + etaMinutes * 60000).toISOString(),
        currentSpeed: speedKmh,
      },
    });
  } catch (error) { next(error); }
});

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default router;
