import Stripe from 'stripe';

// Initialize Stripe with optional secret key (for simulation mode)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_simulation';
const isSimulated = !process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

interface PaymentIntentData {
  amount: number;
  currency: string;
  orderId: string;
  userId: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

interface RefundData {
  paymentIntentId: string;
  amount?: number;
  reason?: string;
}

export class StripeService {
  /**
   * Create a payment intent
   */
  async createPaymentIntent(data: PaymentIntentData) {
    console.log('[StripeService] Creating payment intent', { orderId: data.orderId, amount: data.amount });

    if (isSimulated) {
      return this.simulatePaymentIntent(data);
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100), // Convert to cents
        currency: data.currency || 'eur',
        metadata: {
          orderId: data.orderId,
          userId: data.userId,
          ...data.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
        receipt_email: data.customerEmail,
      });

      return {
        success: true,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
      };
    } catch (error: any) {
      console.error('[StripeService] Failed to create payment intent:', error);
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  /**
   * Confirm a payment intent
   */
  async confirmPayment(paymentIntentId: string, paymentMethodId?: string) {
    console.log('[StripeService] Confirming payment', { paymentIntentId });

    if (isSimulated) {
      return {
        success: true,
        paymentIntentId,
        status: 'succeeded',
        simulated: true,
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return {
        success: paymentIntent.status === 'succeeded',
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
      };
    } catch (error: any) {
      console.error('[StripeService] Failed to confirm payment:', error);
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  /**
   * Retrieve a payment intent
   */
  async getPaymentIntent(paymentIntentId: string) {
    if (isSimulated) {
      return {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 0,
        simulated: true,
      };
    }

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
        created: new Date(paymentIntent.created * 1000),
      };
    } catch (error: any) {
      console.error('[StripeService] Failed to retrieve payment intent:', error);
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  /**
   * Create a refund
   */
  async createRefund(data: RefundData) {
    console.log('[StripeService] Creating refund', { paymentIntentId: data.paymentIntentId });

    if (isSimulated) {
      return {
        success: true,
        refundId: `re_simulated_${Date.now()}`,
        status: 'succeeded',
        amount: data.amount || 0,
        simulated: true,
      };
    }

    try {
      const refund = await stripe.refunds.create({
        payment_intent: data.paymentIntentId,
        amount: data.amount ? Math.round(data.amount * 100) : undefined,
        reason: data.reason as any || 'requested_by_customer',
      });

      return {
        success: refund.status === 'succeeded',
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100,
        currency: refund.currency,
      };
    } catch (error: any) {
      console.error('[StripeService] Failed to create refund:', error);
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: Buffer, signature: string): Stripe.Event | null {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.warn('[StripeService] Webhook secret not configured');
      return null;
    }

    try {
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error: any) {
      console.error('[StripeService] Webhook signature verification failed:', error);
      return null;
    }
  }

  /**
   * Create a Checkout Session
   */
  async createCheckoutSession(data: {
    orderId: string;
    userId: string;
    items: { name: string; amount: number; quantity: number }[];
    successUrl: string;
    cancelUrl: string;
  }) {
    console.log('[StripeService] Creating checkout session', { orderId: data.orderId });

    if (isSimulated) {
      return {
        success: true,
        sessionId: `cs_simulated_${Date.now()}`,
        url: data.successUrl,
        simulated: true,
      };
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: data.items.map((item) => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.amount * 100),
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url: data.successUrl,
        cancel_url: data.cancelUrl,
        metadata: {
          orderId: data.orderId,
          userId: data.userId,
        },
      });

      return {
        success: true,
        sessionId: session.id,
        url: session.url,
      };
    } catch (error: any) {
      console.error('[StripeService] Failed to create checkout session:', error);
      throw new Error(`Stripe error: ${error.message}`);
    }
  }

  /**
   * Simulate a payment intent for testing
   */
  private simulatePaymentIntent(data: PaymentIntentData) {
    const paymentIntentId = `pi_simulated_${Date.now()}`;

    return {
      success: true,
      paymentIntentId,
      clientSecret: `${paymentIntentId}_secret_simulated`,
      status: 'succeeded',
      amount: data.amount,
      currency: data.currency || 'eur',
      simulated: true,
    };
  }
}

export default new StripeService();
