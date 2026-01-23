/**
 * Marketplace API Endpoints
 */

import apiClient from './client';
import type { Product, Order, Review, MarketAnalysis, FlashSale } from '@/types/farmer/marketplace';

export const marketplaceAPI = {
  /**
   * Get products
   */
  getProducts: async (filters?: { category?: string; status?: string }): Promise<Product[]> => {
    const response = await apiClient.get('/api/farmer/marketplace/products', {
      params: filters,
    });
    return response.data;
  },

  /**
   * Create product
   */
  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post('/api/farmer/marketplace/products', product);
    return response.data;
  },

  /**
   * Update product
   */
  updateProduct: async (productId: string, updates: Partial<Product>): Promise<Product> => {
    const response = await apiClient.patch(`/api/farmer/marketplace/products/${productId}`, updates);
    return response.data;
  },

  /**
   * Get orders
   */
  getOrders: async (status?: Order['status']): Promise<Order[]> => {
    const response = await apiClient.get('/api/farmer/marketplace/orders', {
      params: { status },
    });
    return response.data;
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (orderId: string, status: Order['status']): Promise<Order> => {
    const response = await apiClient.patch(`/api/farmer/marketplace/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  },

  /**
   * Get product reviews
   */
  getReviews: async (productId?: string): Promise<Review[]> => {
    const response = await apiClient.get('/api/farmer/marketplace/reviews', {
      params: { productId },
    });
    return response.data;
  },

  /**
   * Respond to review
   */
  respondToReview: async (reviewId: string, response: string): Promise<Review> => {
    const result = await apiClient.post(`/api/farmer/marketplace/reviews/${reviewId}/respond`, {
      response,
    });
    return result.data;
  },

  /**
   * Get market analysis for product
   */
  getMarketAnalysis: async (productId: string): Promise<MarketAnalysis> => {
    const response = await apiClient.get(`/api/farmer/marketplace/analysis/${productId}`);
    return response.data;
  },

  /**
   * Update product price
   */
  updatePrice: async (productId: string, price: number): Promise<Product> => {
    const response = await apiClient.patch(`/api/farmer/marketplace/products/${productId}/price`, {
      price,
    });
    return response.data;
  },

  /**
   * Get flash sales
   */
  getFlashSales: async (): Promise<FlashSale[]> => {
    const response = await apiClient.get('/api/farmer/marketplace/flash-sales');
    return response.data;
  },

  /**
   * Create flash sale
   */
  createFlashSale: async (flashSale: Partial<FlashSale>): Promise<FlashSale> => {
    const response = await apiClient.post('/api/farmer/marketplace/flash-sales', flashSale);
    return response.data;
  },
};
