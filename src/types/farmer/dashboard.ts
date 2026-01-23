/**
 * Farmer Dashboard Types
 * Type definitions for the modernized farmer dashboard
 */

// Dashboard KPIs
export interface DashboardKPIs {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  activeOrders: number;
  pendingOrders: number;
  completedOrders: number;
  equipmentRented: number;
  rentalRevenue: number;
  marketplaceRevenue: number;
  servicesRevenue: number;
  totalCrops: number;
  activeCrops: number;
  harvestReady: number;
}

// Revenue Data
export interface RevenueData {
  date: string;
  marketplace: number;
  rental: number;
  services: number;
  total: number;
}

// Agricultural Task
export interface AgriTask {
  id: string;
  title: string;
  description: string;
  type: 'planting' | 'harvesting' | 'treatment' | 'irrigation' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  dueDate: Date;
  assignedTo?: string;
  cropId?: string;
  fieldId?: string;
  estimatedDuration: number; // in hours
  completedAt?: Date;
}

// Weather Data
export interface WeatherData {
  date: Date;
  temperature: {
    min: number;
    max: number;
    current: number;
  };
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  windSpeed: number;
  windDirection: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
  uvIndex: number;
}

// Weather Alert
export interface WeatherAlert {
  id: string;
  type: 'frost' | 'drought' | 'flood' | 'storm' | 'heatwave';
  severity: 'info' | 'warning' | 'danger';
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  affectedCrops?: string[];
  recommendations: string[];
}

// AI Recommendation
export interface AIRecommendation {
  id: string;
  type: 'market' | 'crop' | 'equipment' | 'weather' | 'financial';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  action: string;
  impact: {
    type: 'revenue' | 'cost' | 'efficiency' | 'risk';
    value: number;
    unit: string;
  };
  confidence: number; // 0-100
  validUntil: Date;
  metadata?: Record<string, any>;
}

// Farm Field
export interface FarmField {
  id: string;
  name: string;
  area: number; // in hectares
  coordinates: [number, number][]; // polygon coordinates
  soilType: string;
  currentCrop?: string;
  lastPlanted?: Date;
  nextPlanned?: Date;
  irrigationSystem?: string;
  sensors?: IoTSensor[];
}

// IoT Sensor
export interface IoTSensor {
  id: string;
  type: 'soil_moisture' | 'temperature' | 'humidity' | 'ph' | 'nutrients';
  location: {
    fieldId: string;
    coordinates: [number, number];
  };
  status: 'active' | 'inactive' | 'maintenance';
  lastReading: {
    value: number;
    unit: string;
    timestamp: Date;
  };
  batteryLevel?: number;
}

// Product
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  images: string[];
  price: number;
  suggestedPrice?: number;
  stock: number;
  unit: string;
  origin: {
    fieldId: string;
    harvestDate: Date;
    coordinates: [number, number];
  };
  certifications: string[];
  ratings: {
    average: number;
    count: number;
  };
  status: 'available' | 'low_stock' | 'out_of_stock';
}

// Order
export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    location: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: Date;
  deliveryDate?: Date;
  deliveryAddress: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

// Equipment
export interface Equipment {
  id: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  status: 'available' | 'rented' | 'maintenance' | 'retired';
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  rentalPrice: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  location?: {
    coordinates: [number, number];
    lastUpdated: Date;
  };
  usage: {
    totalHours: number;
    lastService: Date;
    nextService: Date;
  };
  currentRental?: {
    renterId: string;
    startDate: Date;
    endDate: Date;
  };
}

// Analytics Data
export interface AnalyticsData {
  period: 'day' | 'week' | 'month' | 'year';
  metrics: {
    revenue: TimeSeriesData[];
    costs: TimeSeriesData[];
    profit: TimeSeriesData[];
    orders: TimeSeriesData[];
    customers: TimeSeriesData[];
  };
  comparisons: {
    previousPeriod: number;
    yearOverYear: number;
    benchmark: number;
  };
}

export interface TimeSeriesData {
  timestamp: Date;
  value: number;
}

// Notification
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'order' | 'weather' | 'equipment' | 'market' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}
