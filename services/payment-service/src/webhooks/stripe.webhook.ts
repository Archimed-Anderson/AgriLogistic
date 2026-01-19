import { Router, Request, Response } from 'express';
import stripeService from '../services/stripe.service';
import { Database } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const router = Router();

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';

/**
 * Handle Stripe webhook events
 */
router.post('/stripe', async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    return res.status(400).json({ error: 'Missing Stripe signature' });
  }

  try {
    // Verify webhook signature
    const event = stripeService.verifyWebhookSignature(req.body, signature);

    if (!event) {
      // If webhook secret not configured, try to parse event directly (for testing)
      console.warn('[Webhook] Signature verification skipped - processing event');
    }

    const eventType = event?.type || req.body.type;
    const eventData = event?.data?.object || req.body.data?.object;

    console.log(`[Webhook] Received event: ${eventType}`);

    switch (eventType) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(eventData);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(eventData);
        break;

      case 'charge.refunded':
        await handleRefund(eventData);
        break;

      case 'checkout.session.completed':
        await handleCheckoutCompleted(eventData);
        break;

      case 'payment_intent.created':
        console.log('[Webhook] Payment intent created:', eventData.id);
        break;

      default:
        console.log(`[Webhook] Unhandled event type: ${eventType}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('[Webhook] Error processing webhook:', error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(paymentIntent: any) {
  console.log('[Webhook] Payment succeeded:', paymentIntent.id);

  const orderId = paymentIntent.metadata?.orderId;
  const userId = paymentIntent.metadata?.userId;

  try {
    // Update payment record
    await Database.query(
      `UPDATE payments SET status = $1, stripe_payment_intent_id = $2, updated_at = NOW() 
       WHERE order_id = $3`,
      ['succeeded', paymentIntent.id, orderId]
    );

    // Record transaction
    await Database.query(
      `INSERT INTO payment_transactions (id, payment_id, type, amount, currency, status, created_at)
       SELECT $1, id, 'charge', $2, $3, 'completed', NOW()
       FROM payments WHERE order_id = $4`,
      [uuidv4(), paymentIntent.amount / 100, paymentIntent.currency, orderId]
    );

    // Notify order service
    if (orderId) {
      try {
        await axios.patch(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
          status: 'confirmed',
          reason: 'Payment succeeded',
        }, {
          timeout: 5000,
        });
        console.log('[Webhook] Order status updated to confirmed');
      } catch (error: any) {
        console.error('[Webhook] Failed to update order status:', error.message);
      }
    }

    console.log('[Webhook] Payment record updated');
  } catch (error) {
    console.error('[Webhook] Error handling payment success:', error);
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: any) {
  console.log('[Webhook] Payment failed:', paymentIntent.id);

  const orderId = paymentIntent.metadata?.orderId;
  const failureMessage = paymentIntent.last_payment_error?.message || 'Payment failed';

  try {
    // Update payment record
    await Database.query(
      `UPDATE payments SET status = $1, failure_reason = $2, updated_at = NOW() 
       WHERE order_id = $3`,
      ['failed', failureMessage, orderId]
    );

    // Notify order service
    if (orderId) {
      try {
        await axios.patch(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
          status: 'payment_failed',
          reason: failureMessage,
        }, {
          timeout: 5000,
        });
      } catch (error: any) {
        console.error('[Webhook] Failed to update order status:', error.message);
      }
    }

    console.log('[Webhook] Payment failure recorded');
  } catch (error) {
    console.error('[Webhook] Error handling payment failure:', error);
  }
}

/**
 * Handle refund
 */
async function handleRefund(charge: any) {
  console.log('[Webhook] Refund processed:', charge.id);

  const paymentIntentId = charge.payment_intent;

  try {
    // Get order ID from payment
    const paymentResult = await Database.query(
      'SELECT order_id FROM payments WHERE stripe_payment_intent_id = $1',
      [paymentIntentId]
    );

    if (paymentResult.rows.length > 0) {
      const orderId = paymentResult.rows[0].order_id;

      // Update payment status
      await Database.query(
        `UPDATE payments SET status = $1, refunded_amount = refunded_amount + $2, updated_at = NOW() 
         WHERE order_id = $3`,
        ['refunded', charge.amount_refunded / 100, orderId]
      );

      // Record refund transaction
      await Database.query(
        `INSERT INTO payment_transactions (id, payment_id, type, amount, currency, status, created_at)
         SELECT $1, id, 'refund', $2, $3, 'completed', NOW()
         FROM payments WHERE order_id = $4`,
        [uuidv4(), charge.amount_refunded / 100, charge.currency, orderId]
      );

      // Notify order service
      try {
        await axios.patch(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
          status: 'refunded',
          reason: 'Payment refunded',
        }, {
          timeout: 5000,
        });
      } catch (error: any) {
        console.error('[Webhook] Failed to update order status:', error.message);
      }
    }

    console.log('[Webhook] Refund recorded');
  } catch (error) {
    console.error('[Webhook] Error handling refund:', error);
  }
}

/**
 * Handle Checkout Session completed
 */
async function handleCheckoutCompleted(session: any) {
  console.log('[Webhook] Checkout completed:', session.id);

  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;

  try {
    // Create payment record
    await Database.query(
      `INSERT INTO payments (id, order_id, user_id, amount, currency, status, stripe_session_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       ON CONFLICT (order_id) DO UPDATE SET status = $6, stripe_session_id = $7, updated_at = NOW()`,
      [
        uuidv4(),
        orderId,
        userId,
        session.amount_total / 100,
        session.currency,
        'succeeded',
        session.id,
      ]
    );

    // Notify order service
    if (orderId) {
      try {
        await axios.patch(`${ORDER_SERVICE_URL}/orders/${orderId}/status`, {
          status: 'confirmed',
          reason: 'Checkout completed',
        }, {
          timeout: 5000,
        });
      } catch (error: any) {
        console.error('[Webhook] Failed to update order status:', error.message);
      }
    }

    console.log('[Webhook] Checkout session processed');
  } catch (error) {
    console.error('[Webhook] Error handling checkout completed:', error);
  }
}

export default router;
