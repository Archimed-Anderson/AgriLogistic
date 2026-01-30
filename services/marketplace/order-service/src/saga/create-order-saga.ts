import { OrderSaga } from './order-saga';
import axios from 'axios';

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3006';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface CreateOrderData {
  orderId: string;
  userId: string;
  items: OrderItem[];
  paymentMethod: string;
  totalAmount: number;
  shippingAddress: any;
}

/**
 * Creates a saga workflow for order creation
 * Steps:
 * 1. Validate inventory availability
 * 2. Reserve inventory
 * 3. Process payment
 * 4. Create order record
 * 5. Send confirmation notification
 */
export function createOrderSaga(data: CreateOrderData): OrderSaga {
  const saga = new OrderSaga();

  // Step 1: Validate inventory
  saga.addStep({
    name: 'validate_inventory',
    execute: async () => {
      console.log('[CreateOrderSaga] Validating inventory...');
      
      try {
        const response = await axios.post(`${PRODUCT_SERVICE_URL}/inventory/validate`, {
          items: data.items,
        }, {
          timeout: 5000,
        });
        
        if (!response.data.available) {
          throw new Error('Some items are not available in stock');
        }
        
        return response.data;
      } catch (error) {
        // If product service is unavailable, continue (for demo purposes)
        if (error.code === 'ECONNREFUSED') {
          console.warn('[CreateOrderSaga] Product service unavailable, skipping validation');
          return { available: true, simulated: true };
        }
        throw error;
      }
    },
    compensate: async () => {
      // No compensation needed for validation
      console.log('[CreateOrderSaga] No compensation needed for validation');
    },
  });

  // Step 2: Reserve inventory
  saga.addStep({
    name: 'reserve_inventory',
    execute: async () => {
      console.log('[CreateOrderSaga] Reserving inventory...');
      
      try {
        const response = await axios.post(`${PRODUCT_SERVICE_URL}/inventory/reserve`, {
          orderId: data.orderId,
          items: data.items,
        }, {
          timeout: 5000,
        });
        
        return response.data;
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.warn('[CreateOrderSaga] Product service unavailable, simulating reservation');
          return { reserved: true, reservationId: `sim-${data.orderId}`, simulated: true };
        }
        throw error;
      }
    },
    compensate: async () => {
      console.log('[CreateOrderSaga] Releasing inventory reservation...');
      
      try {
        await axios.post(`${PRODUCT_SERVICE_URL}/inventory/release`, {
          orderId: data.orderId,
        }, {
          timeout: 5000,
        });
      } catch (error) {
        console.error('[CreateOrderSaga] Failed to release inventory:', error.message);
      }
    },
  });

  // Step 3: Process payment
  saga.addStep({
    name: 'process_payment',
    execute: async () => {
      console.log('[CreateOrderSaga] Processing payment...');
      
      try {
        const response = await axios.post(`${PAYMENT_SERVICE_URL}/payments/charge`, {
          orderId: data.orderId,
          userId: data.userId,
          amount: data.totalAmount,
          currency: 'EUR',
          paymentMethod: data.paymentMethod,
        }, {
          timeout: 10000,
        });
        
        return response.data;
      } catch (error) {
        if (error.code === 'ECONNREFUSED') {
          console.warn('[CreateOrderSaga] Payment service unavailable, simulating payment');
          return {
            success: true,
            paymentId: `pay-${data.orderId}`,
            status: 'succeeded',
            simulated: true,
          };
        }
        throw error;
      }
    },
    compensate: async () => {
      console.log('[CreateOrderSaga] Refunding payment...');
      
      try {
        await axios.post(`${PAYMENT_SERVICE_URL}/payments/refund`, {
          orderId: data.orderId,
        }, {
          timeout: 10000,
        });
      } catch (error) {
        console.error('[CreateOrderSaga] Failed to refund payment:', error.message);
      }
    },
  });

  // Step 4: Create order record (this is local, no external call needed)
  saga.addStep({
    name: 'create_order_record',
    execute: async () => {
      console.log('[CreateOrderSaga] Creating order record...');
      // Order record creation is handled by the caller
      // This step just returns success to continue the saga
      return {
        orderId: data.orderId,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
    },
    compensate: async () => {
      console.log('[CreateOrderSaga] Marking order as cancelled...');
      // Order cancellation is handled by the caller
    },
  });

  // Step 5: Send notification
  saga.addStep({
    name: 'send_notification',
    execute: async () => {
      console.log('[CreateOrderSaga] Sending order confirmation...');
      
      try {
        const response = await axios.post(`${NOTIFICATION_SERVICE_URL}/notifications/send`, {
          type: 'order_confirmation',
          userId: data.userId,
          data: {
            orderId: data.orderId,
            totalAmount: data.totalAmount,
            items: data.items.length,
          },
        }, {
          timeout: 5000,
        });
        
        return response.data;
      } catch (error) {
        // Notification failure should not fail the order
        console.warn('[CreateOrderSaga] Notification service unavailable, skipping');
        return { sent: false, simulated: true };
      }
    },
    compensate: async () => {
      // No compensation needed for notification
      console.log('[CreateOrderSaga] No compensation needed for notification');
    },
  });

  return saga;
}

export default createOrderSaga;
