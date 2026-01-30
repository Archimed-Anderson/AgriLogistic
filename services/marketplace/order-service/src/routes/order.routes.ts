import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { OrderController } from '../controllers/order.controller';

const router = Router();
const orderController = new OrderController();

// Validation schemas
const createOrderSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  items: Joi.array().items(Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().positive().required(),
    name: Joi.string().optional(),
  })).min(1).required(),
  paymentMethod: Joi.string().valid('card', 'paypal', 'bank_transfer').required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().optional(),
  }).required(),
  notes: Joi.string().optional().allow(''),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid(
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
  ).required(),
  reason: Joi.string().optional(),
});

// Validation middleware
const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.details[0].message,
      });
      return;
    }
    next();
  };
};

// Routes

/**
 * GET /orders
 * Get all orders with pagination and filtering
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.getOrders(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /orders/:id
 * Get a specific order by ID
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.getOrderById(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /orders/user/:userId
 * Get all orders for a specific user
 */
router.get('/user/:userId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.getOrdersByUser(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /orders
 * Create a new order (uses Saga pattern for distributed transaction)
 */
router.post('/', validate(createOrderSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.createOrder(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /orders/:id/status
 * Update order status
 */
router.patch('/:id/status', validate(updateOrderStatusSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.updateOrderStatus(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /orders/:id/cancel
 * Cancel an order
 */
router.post('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.cancelOrder(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /orders/:id/history
 * Get order status history
 */
router.get('/:id/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.getOrderHistory(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /orders/stats/:productId
 * Get sales statistics (Internal)
 */
router.get('/stats/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderController.getSalesStats(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
