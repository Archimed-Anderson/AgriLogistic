import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Database } from '../config/database';
import { RedisClient } from '../config/redis';
import { createOrderSaga } from '../saga/create-order-saga';
import { incrementOrdersCreated, incrementOrdersFailed, incrementOrdersCompleted } from '../middleware/metrics.middleware';

export class OrderController {
  /**
   * Create a new order using Saga pattern
   */
  async createOrder(req: Request, res: Response) {
    const orderId = uuidv4();
    const { userId, items, paymentMethod, shippingAddress, notes } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    try {
      // Create saga workflow
      const saga = createOrderSaga({
        orderId,
        userId,
        items,
        paymentMethod,
        totalAmount,
        shippingAddress,
      });

      // Listen for saga events
      saga.on('step:complete', (stepName, result) => {
        console.log(`[OrderController] Saga step ${stepName} completed`, result);
      });

      saga.on('saga:error', (error) => {
        console.error(`[OrderController] Saga failed`, error);
        incrementOrdersFailed();
      });

      // Execute saga
      const sagaResult = await saga.execute();

      if (sagaResult.success) {
        // Save order to database
        const result = await Database.query(
          `INSERT INTO orders (
            id, user_id, status, total_amount, payment_method, 
            shipping_address, notes, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
          RETURNING *`,
          [
            orderId,
            userId,
            'confirmed',
            totalAmount,
            paymentMethod,
            JSON.stringify(shippingAddress),
            notes || null,
          ]
        );

        // Save order items
        for (const item of items) {
          await Database.query(
            `INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW())`,
            [uuidv4(), orderId, item.productId, item.quantity, item.price]
          );
        }

        // Save initial status history
        await Database.query(
          `INSERT INTO order_status_history (id, order_id, status, changed_by, notes, created_at)
           VALUES ($1, $2, $3, $4, $5, NOW())`,
          [uuidv4(), orderId, 'confirmed', userId, 'Order created']
        );

        // Cache order for quick access
        await RedisClient.set(`order:${orderId}`, JSON.stringify(result.rows[0]), 3600);

        incrementOrdersCreated();

        res.status(201).json({
          success: true,
          data: {
            orderId,
            status: 'confirmed',
            totalAmount,
            items: items.length,
            sagaSteps: sagaResult.steps.map(s => s.name),
          },
        });
      } else {
        incrementOrdersFailed();

        res.status(400).json({
          success: false,
          error: 'Order creation failed',
          message: sagaResult.error,
          failedSteps: sagaResult.steps.filter(s => s.error).map(s => s.name),
        });
      }
    } catch (error: any) {
      incrementOrdersFailed();
      console.error('[OrderController] Create order error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Failed to create order',
      });
    }
  }

  /**
   * Get all orders with pagination
   */
  async getOrders(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = (page - 1) * limit;
    const status = req.query.status as string;

    try {
      let query = 'SELECT * FROM orders WHERE 1=1';
      const params: any[] = [];

      if (status) {
        params.push(status);
        query += ` AND status = $${params.length}`;
      }

      query += ' ORDER BY created_at DESC';
      params.push(limit, offset);
      query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

      const result = await Database.query(query, params);

      // Get total count
      const countResult = await Database.query(
        'SELECT COUNT(*) FROM orders' + (status ? ' WHERE status = $1' : ''),
        status ? [status] : []
      );

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          page,
          limit,
          total: parseInt(countResult.rows[0].count),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
        },
      });
    } catch (error: any) {
      console.error('[OrderController] Get orders error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch orders',
      });
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      // Check cache first
      const cached = await RedisClient.get(`order:${id}`);
      if (cached) {
        return res.json({
          success: true,
          data: JSON.parse(cached),
          cached: true,
        });
      }

      const result = await Database.query('SELECT * FROM orders WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
        });
      }

      // Get order items
      const itemsResult = await Database.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [id]
      );

      const order = {
        ...result.rows[0],
        items: itemsResult.rows,
      };

      // Cache for 1 hour
      await RedisClient.set(`order:${id}`, JSON.stringify(order), 3600);

      res.json({
        success: true,
        data: order,
      });
    } catch (error: any) {
      console.error('[OrderController] Get order error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch order',
      });
    }
  }

  /**
   * Get orders by user ID
   */
  async getOrdersByUser(req: Request, res: Response) {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = (page - 1) * limit;

    try {
      const result = await Database.query(
        'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [userId, limit, offset]
      );

      const countResult = await Database.query(
        'SELECT COUNT(*) FROM orders WHERE user_id = $1',
        [userId]
      );

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          page,
          limit,
          total: parseInt(countResult.rows[0].count),
          totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
        },
      });
    } catch (error: any) {
      console.error('[OrderController] Get user orders error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch orders',
      });
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status, reason } = req.body;
    const changedBy = req.headers['x-user-id'] as string || 'system';

    try {
      // Update order
      const result = await Database.query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
        });
      }

      // Add to status history
      await Database.query(
        `INSERT INTO order_status_history (id, order_id, status, changed_by, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [uuidv4(), id, status, changedBy, reason || `Status changed to ${status}`]
      );

      // Invalidate cache
      await RedisClient.del(`order:${id}`);

      if (status === 'delivered') {
        incrementOrdersCompleted();
      }

      res.json({
        success: true,
        data: result.rows[0],
      });
    } catch (error: any) {
      console.error('[OrderController] Update status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update order status',
      });
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(req: Request, res: Response) {
    const { id } = req.params;
    const { reason } = req.body;
    const changedBy = req.headers['x-user-id'] as string || 'system';

    try {
      // Check if order can be cancelled
      const checkResult = await Database.query(
        'SELECT status FROM orders WHERE id = $1',
        [id]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
        });
      }

      const currentStatus = checkResult.rows[0].status;
      if (['shipped', 'delivered', 'cancelled', 'refunded'].includes(currentStatus)) {
        return res.status(400).json({
          success: false,
          error: `Cannot cancel order with status: ${currentStatus}`,
        });
      }

      // TODO: Trigger cancellation saga (refund, release inventory)

      // Update order
      const result = await Database.query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        ['cancelled', id]
      );

      // Add to status history
      await Database.query(
        `INSERT INTO order_status_history (id, order_id, status, changed_by, notes, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [uuidv4(), id, 'cancelled', changedBy, reason || 'Order cancelled']
      );

      // Invalidate cache
      await RedisClient.del(`order:${id}`);

      res.json({
        success: true,
        data: result.rows[0],
        message: 'Order cancelled successfully',
      });
    } catch (error: any) {
      console.error('[OrderController] Cancel order error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel order',
      });
    }
  }

  /**
   * Get order status history
   */
  async getOrderHistory(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const result = await Database.query(
        'SELECT * FROM order_status_history WHERE order_id = $1 ORDER BY created_at DESC',
        [id]
      );

      res.json({
        success: true,
        data: result.rows,
      });
    } catch (error: any) {
      console.error('[OrderController] Get history error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch order history',
      });
    }
  }
}

export default OrderController;
