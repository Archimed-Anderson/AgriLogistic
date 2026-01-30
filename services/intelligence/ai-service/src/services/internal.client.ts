import axios from 'axios';

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://order-service:3003';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3002';

export class InternalServiceClient {
  static async getSalesHistory(productId: string, days: number = 90): Promise<any[]> {
    try {
      const response = await axios.get(`${ORDER_SERVICE_URL}/orders/stats/${productId}`, {
        params: { days }
      });
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('[InternalServiceClient] Error fetching sales history:', error);
      return [];
    }
  }

  static async getPriceHistory(productId: string, days: number = 60): Promise<any[]> {
    try {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}/price-history`, {
        params: { days }
      });
      return response.data.success ? response.data.data : [];
    } catch (error) {
      console.error('[InternalServiceClient] Error fetching price history:', error);
      return [];
    }
  }

  static async getCurrentProductPrice(productId: string): Promise<number> {
    try {
      const response = await axios.get(`${PRODUCT_SERVICE_URL}/products/${productId}`);
      return response.data.success ? response.data.data.product.price : 0;
    } catch (error) {
      console.error('[InternalServiceClient] Error fetching product price:', error);
      return 0;
    }
  }
}
