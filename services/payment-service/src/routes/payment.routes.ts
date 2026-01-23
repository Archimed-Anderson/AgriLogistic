import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import stripeService from '../services/stripe.service';
import { Database } from '../config/database';

const router = Router();

// Validation schemas
const createPaymentSchema = Joi.object({
  orderId: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('EUR'),
  paymentMethod: Joi.string().valid('card', 'paypal', 'bank_transfer').required(),
  customerEmail: Joi.string().email().optional(),
});

const refundSchema = Joi.object({
  amount: Joi.number().positive().optional(),
  reason: Joi.string().optional(),
});

const checkoutSchema = Joi.object({
  orderId: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required(),
  items: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    amount: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(1).required(),
  })).min(1).required(),
  successUrl: Joi.string().uri().required(),
  cancelUrl: Joi.string().uri().required(),
});

// Validation middleware
const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: error.details[0].message,
      });
    }
    next();
  };
};

/**
 * POST /payments/charge
 * Create a payment intent to charge a customer
 */
router.post('/charge', validate(createPaymentSchema), async (req: Request, res: Response) => {
  const { orderId, userId, amount, currency, paymentMethod, customerEmail } = req.body;

  try {
    // Create payment record
    const paymentId = uuidv4();
    await Database.query(
      `INSERT INTO payments (id, order_id, user_id, amount, currency, payment_method, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [paymentId, orderId, userId, amount, currency || 'EUR', paymentMethod, 'pending']
    );

    // Create Stripe payment intent
    const result = await stripeService.createPaymentIntent({
      amount,
      currency: currency || 'EUR',
      orderId,
      userId,
      customerEmail,
    });

    // Update payment with Stripe ID
    await Database.query(
      `UPDATE payments SET stripe_payment_intent_id = $1, updated_at = NOW() WHERE id = $2`,
      [result.paymentIntentId, paymentId]
    );

    res.status(201).json({
      success: true,
      data: {
        paymentId,
        paymentIntentId: result.paymentIntentId,
        clientSecret: result.clientSecret,
        status: result.status,
        amount: result.amount,
        currency: result.currency,
        simulated: 'simulated' in (result as any) ? (result as any).simulated : false,
      },
    });
  } catch (error: any) {
    console.error('[PaymentRoutes] Charge error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment processing failed',
      message: error.message,
    });
  }
});

/**
 * POST /payments/confirm/:paymentIntentId
 * Confirm a payment intent
 */
router.post('/confirm/:paymentIntentId', async (req: Request, res: Response) => {
  const { paymentIntentId } = req.params;
  const { paymentMethodId } = req.body;

  try {
    const result = await stripeService.confirmPayment(paymentIntentId, paymentMethodId);

    // Update payment status
    await Database.query(
      `UPDATE payments SET status = $1, updated_at = NOW() WHERE stripe_payment_intent_id = $2`,
      [result.status, paymentIntentId]
    );

    res.json({
      success: result.success,
      data: result,
    });
  } catch (error: any) {
    console.error('[PaymentRoutes] Confirm error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment confirmation failed',
      message: error.message,
    });
  }
});

/**
 * POST /payments/refund/:orderId
 * Refund a payment
 */
router.post('/refund/:orderId', validate(refundSchema), async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { amount, reason } = req.body;

  try {
    // Get payment record
    const paymentResult = await Database.query(
      'SELECT * FROM payments WHERE order_id = $1 AND status = $2',
      [orderId, 'succeeded']
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No successful payment found for this order',
      });
    }

    const payment = paymentResult.rows[0];

    // Create refund
    const result = await stripeService.createRefund({
      paymentIntentId: payment.stripe_payment_intent_id,
      amount,
      reason,
    });

    // Update payment status
    await Database.query(
      `UPDATE payments SET status = $1, refunded_amount = $2, updated_at = NOW() WHERE order_id = $3`,
      ['refunded', amount || payment.amount, orderId]
    );

    // Record transaction
    await Database.query(
      `INSERT INTO payment_transactions (id, payment_id, type, amount, currency, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [uuidv4(), payment.id, 'refund', amount || payment.amount, payment.currency, 'completed']
    );

    res.json({
      success: true,
      data: {
        refundId: result.refundId,
        status: result.status,
        amount: result.amount,
        currency: result.currency,
      },
    });
  } catch (error: any) {
    console.error('[PaymentRoutes] Refund error:', error);
    res.status(500).json({
      success: false,
      error: 'Refund processing failed',
      message: error.message,
    });
  }
});

/**
 * POST /payments/checkout
 * Create a Stripe Checkout Session
 */
router.post('/checkout', validate(checkoutSchema), async (req: Request, res: Response) => {
  const { orderId, userId, items, successUrl, cancelUrl } = req.body;

  try {
    const result = await stripeService.createCheckoutSession({
      orderId,
      userId,
      items,
      successUrl,
      cancelUrl,
    });

    // Create payment record
    await Database.query(
      `INSERT INTO payments (id, order_id, user_id, amount, currency, payment_method, status, stripe_session_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
      [
        uuidv4(),
        orderId,
        userId,
        items.reduce((sum: number, item: any) => sum + item.amount * item.quantity, 0),
        'EUR',
        'card',
        'pending',
        result.sessionId,
      ]
    );

    res.json({
      success: true,
      data: {
        sessionId: result.sessionId,
        url: result.url,
      },
    });
  } catch (error: any) {
    console.error('[PaymentRoutes] Checkout error:', error);
    res.status(500).json({
      success: false,
      error: 'Checkout session creation failed',
      message: error.message,
    });
  }
});

/**
 * GET /payments/:orderId
 * Get payment status for an order
 */
router.get('/:orderId', async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const result = await Database.query(
      'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1',
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error: any) {
    console.error('[PaymentRoutes] Get payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment',
    });
  }
});

/**
 * GET /payments/:orderId/transactions
 * Get payment transactions for an order
 */
router.get('/:orderId/transactions', async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const result = await Database.query(
      `SELECT pt.* FROM payment_transactions pt
       INNER JOIN payments p ON pt.payment_id = p.id
       WHERE p.order_id = $1
       ORDER BY pt.created_at DESC`,
      [orderId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error: any) {
    console.error('[PaymentRoutes] Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions',
    });
  }
});

export default router;
