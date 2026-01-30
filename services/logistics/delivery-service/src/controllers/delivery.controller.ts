import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../config/database';
import { RedisClient } from '../config/redis';

export class DeliveryController {
  async createDelivery(req: Request, res: Response) {
    const { orderId, pickupAddress, deliveryAddress, customerId, scheduledAt, notes, priority } = req.body;
    const deliveryId = uuidv4();

    try {
      const result = await Database.query(
        `INSERT INTO deliveries (id, order_id, customer_id, status, priority, pickup_address, delivery_address, scheduled_at, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         RETURNING *`,
        [deliveryId, orderId, customerId, 'pending', priority, JSON.stringify(pickupAddress), JSON.stringify(deliveryAddress), scheduledAt, notes]
      );

      // Cache delivery info for tracking
      await RedisClient.set(`delivery:info:${deliveryId}`, JSON.stringify({
        orderId, customerId,
        pickupLat: pickupAddress.latitude, pickupLng: pickupAddress.longitude,
        destinationLat: deliveryAddress.latitude, destinationLng: deliveryAddress.longitude,
      }), 86400);

      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error('Create delivery error:', error);
      res.status(500).json({ success: false, error: 'Failed to create delivery' });
    }
  }

  async getDeliveries(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const status = req.query.status as string;
    const driverId = req.query.driverId as string;

    try {
      let query = 'SELECT * FROM deliveries WHERE 1=1';
      const params: any[] = [];

      if (status) { params.push(status); query += ` AND status = $${params.length}`; }
      if (driverId) { params.push(driverId); query += ` AND driver_id = $${params.length}`; }

      params.push(limit, (page - 1) * limit);
      query += ` ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

      const result = await Database.query(query, params);
      res.json({ success: true, data: result.rows, pagination: { page, limit } });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch deliveries' });
    }
  }

  async getDeliveryById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await Database.query('SELECT * FROM deliveries WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Delivery not found' });
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch delivery' });
    }
  }

  async getDeliveryByOrder(req: Request, res: Response) {
    const { orderId } = req.params;
    try {
      const result = await Database.query('SELECT * FROM deliveries WHERE order_id = $1', [orderId]);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch delivery' });
    }
  }

  async assignDriver(req: Request, res: Response) {
    const { id } = req.params;
    const { driverId } = req.body;

    try {
      const result = await Database.query(
        `UPDATE deliveries SET driver_id = $1, status = 'assigned', updated_at = NOW() WHERE id = $2 RETURNING *`,
        [driverId, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Delivery not found' });

      await Database.query(
        `INSERT INTO delivery_status_history (id, delivery_id, status, notes, created_at) VALUES ($1, $2, $3, $4, NOW())`,
        [uuidv4(), id, 'assigned', `Assigned to driver ${driverId}`]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to assign driver' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    try {
      const result = await Database.query(
        `UPDATE deliveries SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
        [status, id]
      );
      if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Delivery not found' });

      await Database.query(
        `INSERT INTO delivery_status_history (id, delivery_id, status, notes, created_at) VALUES ($1, $2, $3, $4, NOW())`,
        [uuidv4(), id, status, notes]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update status' });
    }
  }

  async getOptimizedRoute(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await Database.query('SELECT * FROM deliveries WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Delivery not found' });

      const delivery = result.rows[0];
      const pickup = JSON.parse(delivery.pickup_address);
      const dropoff = JSON.parse(delivery.delivery_address);

      // Simple direct route (in production, use OSRM or Google Directions API)
      const route = {
        distance: this.calculateDistance(pickup.latitude, pickup.longitude, dropoff.latitude, dropoff.longitude),
        duration: 0,
        waypoints: [
          { lat: pickup.latitude, lng: pickup.longitude, type: 'pickup', address: pickup.street },
          { lat: dropoff.latitude, lng: dropoff.longitude, type: 'dropoff', address: dropoff.street },
        ],
      };
      route.duration = Math.round((route.distance / 40) * 60); // Estimate at 40 km/h

      res.json({ success: true, data: route });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to calculate route' });
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
}

export default DeliveryController;
