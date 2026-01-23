/**
 * Marketplace Types
 */

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  price: number;
  suggestedPrice?: number;
  priceHistory: PricePoint[];
  stock: number;
  unit: string;
  origin: {
    fieldId: string;
    fieldName: string;
    harvestDate: Date;
    coordinates: [number, number];
  };
  certifications: string[];
  ratings: {
    average: number;
    count: number;
    distribution: { stars: number; count: number }[];
  };
  status: 'available' | 'low_stock' | 'out_of_stock' | 'flash_sale';
  views: number;
  sales: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricePoint {
  date: Date;
  price: number;
  marketAverage?: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    avatar?: string;
  };
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  deliveryDate?: Date;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customer: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: Date;
  response?: {
    text: string;
    createdAt: Date;
  };
}

export interface MarketAnalysis {
  productId: string;
  productName: string;
  yourPrice: number;
  marketAverage: number;
  competitors: {
    seller: string;
    price: number;
    stock: number;
    rating: number;
  }[];
  priceRecommendation: {
    min: number;
    optimal: number;
    max: number;
    reasoning: string;
  };
  demandTrend: 'increasing' | 'stable' | 'decreasing';
  seasonality: number; // 0-100
}

export interface FlashSale {
  id: string;
  productId: string;
  productName: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  stock: number;
  sold: number;
  startDate: Date;
  endDate: Date;
  status: 'scheduled' | 'active' | 'ended';
}
