/**
 * Logistics Types
 */

export interface Delivery {
  id: string;
  deliveryNumber: string;
  orderId: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'failed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  items: DeliveryItem[];
  pickup: {
    address: string;
    coordinates: [number, number];
    contactName: string;
    contactPhone: string;
    scheduledTime: Date;
    actualTime?: Date;
  };
  dropoff: {
    address: string;
    coordinates: [number, number];
    contactName: string;
    contactPhone: string;
    scheduledTime: Date;
    actualTime?: Date;
  };
  carrier?: {
    id: string;
    name: string;
    phone: string;
    vehicleType: string;
    licensePlate: string;
  };
  route?: {
    distance: number; // km
    duration: number; // minutes
    optimized: boolean;
    waypoints: [number, number][];
  };
  tracking: {
    currentLocation?: [number, number];
    lastUpdate?: Date;
    eta?: Date;
    progress: number; // 0-100
  };
  cost: {
    baseRate: number;
    distanceCharge: number;
    fuelSurcharge: number;
    total: number;
  };
  proof?: {
    signature?: string;
    photo?: string;
    timestamp?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryItem {
  productId: string;
  productName: string;
  quantity: number;
  weight: number; // kg
  volume?: number; // m³
  fragile: boolean;
  temperature?: 'ambient' | 'refrigerated' | 'frozen';
}

export interface Route {
  id: string;
  name: string;
  deliveries: string[]; // delivery IDs
  carrier?: {
    id: string;
    name: string;
  };
  status: 'planned' | 'active' | 'completed';
  optimization: {
    algorithm: 'nearest_neighbor' | 'genetic' | 'ant_colony';
    score: number; // 0-100
    totalDistance: number;
    totalDuration: number;
    savings: {
      distance: number; // km saved
      time: number; // minutes saved
      cost: number; // XOF saved
    };
  };
  waypoints: RouteWaypoint[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export interface RouteWaypoint {
  deliveryId: string;
  sequence: number;
  coordinates: [number, number];
  address: string;
  type: 'pickup' | 'dropoff';
  scheduledTime: Date;
  actualTime?: Date;
  status: 'pending' | 'completed' | 'skipped';
}

export interface Carrier {
  id: string;
  name: string;
  type: 'independent' | 'company';
  contact: {
    phone: string;
    email: string;
  };
  vehicles: Vehicle[];
  rating: {
    average: number;
    count: number;
  };
  stats: {
    totalDeliveries: number;
    onTimeRate: number; // percentage
    successRate: number; // percentage
  };
  availability: {
    available: boolean;
    currentDeliveries: number;
    maxCapacity: number;
  };
  pricing: {
    baseRate: number;
    perKmRate: number;
    perHourRate: number;
  };
}

export interface Vehicle {
  id: string;
  type: 'motorcycle' | 'van' | 'truck' | 'refrigerated_truck';
  licensePlate: string;
  capacity: {
    weight: number; // kg
    volume: number; // m³
  };
  features: string[]; // 'GPS', 'refrigeration', 'lift_gate', etc.
  status: 'active' | 'maintenance' | 'inactive';
}

export interface TransportCost {
  deliveryId: string;
  breakdown: {
    baseRate: number;
    distance: number; // km
    distanceRate: number; // XOF per km
    distanceCost: number;
    duration: number; // minutes
    timeRate?: number; // XOF per hour
    timeCost?: number;
    fuelSurcharge: number;
    tolls?: number;
    other?: number;
  };
  total: number;
  currency: string;
}
