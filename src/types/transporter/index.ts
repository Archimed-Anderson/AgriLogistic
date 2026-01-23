/**
 * Transporter Domain Types
 * Type definitions for the transporter dashboard system
 */

// ============================================================================
// KPIs & Dashboard
// ============================================================================

export interface TransporterKPIs {
  // Revenue metrics
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number; // Percentage
  
  // Delivery metrics
  activeDeliveries: number;
  completedToday: number;
  completedWeek: number;
  completedMonth: number;
  
  // Distance & efficiency
  kmToday: number;
  kmWeek: number;
  kmMonth: number;
  fuelEfficiency: number; // L/100km
  
  // Performance
  onTimeRate: number; // Percentage
  customerSatisfaction: number; // 1-5 stars
  averageRating: number;
  totalRatings: number;
}

export interface RevenueBreakdown {
  date: string;
  marketplace: number;
  rental: number;
  services: number;
  bonuses: number;
  total: number;
}

// ============================================================================
// Routes & Optimization
// ============================================================================

export interface Waypoint {
  id: string;
  type: 'pickup' | 'delivery' | 'waypoint';
  address: string;
  coordinates: [number, number]; // [lng, lat]
  timeWindow?: {
    start: Date;
    end: Date;
  };
  duration: number; // Minutes at location
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface Route {
  id: string;
  name: string;
  waypoints: Waypoint[];
  optimized: boolean;
  totalDistance: number; // km
  totalDuration: number; // minutes
  estimatedCost: RouteCost;
  vehicleId?: string;
  status: 'draft' | 'planned' | 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface RouteCost {
  fuel: number;
  tolls: number;
  wear: number; // Vehicle wear and tear
  labor: number;
  total: number;
  currency: string;
}

export interface RouteOptimizationParams {
  waypoints: Waypoint[];
  vehicleConstraints: VehicleConstraints;
  optimizeFor: 'distance' | 'time' | 'cost';
  respectTimeWindows: boolean;
  allowReordering: boolean;
}

export interface VehicleConstraints {
  maxWeight: number; // kg (PTAC)
  maxVolume: number; // m³
  hasRefrigeration: boolean;
  maxHeight: number; // m
  maxWidth: number; // m
  maxLength: number; // m
}

// ============================================================================
// Shipments & Deliveries
// ============================================================================

export type ShipmentStatus = 
  | 'pending'      // À prendre
  | 'in_transit'   // En route
  | 'delivered'    // Livré
  | 'problem';     // Problème

export interface Shipment {
  id: string;
  orderId: string;
  status: ShipmentStatus;
  
  // Pickup details
  pickupAddress: string;
  pickupCoordinates: [number, number];
  pickupContact: Contact;
  pickupTimeWindow?: TimeWindow;
  pickupDate?: Date;
  
  // Delivery details
  deliveryAddress: string;
  deliveryCoordinates: [number, number];
  deliveryContact: Contact;
  deliveryTimeWindow?: TimeWindow;
  deliveryDate?: Date;
  
  // Cargo details
  cargo: CargoDetails;
  
  // Documents
  documents: ShipmentDocument[];
  
  // Proof of delivery
  proofOfDelivery?: DeliveryProof;
  
  // Ratings
  rating?: ShipmentRating;
  
  // Financial
  price: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'overdue';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface Contact {
  name: string;
  phone: string;
  email?: string;
  company?: string;
}

export interface TimeWindow {
  start: Date;
  end: Date;
}

export interface CargoDetails {
  description: string;
  weight: number; // kg
  volume: number; // m³
  quantity: number;
  unit: string;
  requiresRefrigeration: boolean;
  temperatureRange?: {
    min: number;
    max: number;
  };
  fragile: boolean;
  hazardous: boolean;
  specialInstructions?: string;
}

export interface ShipmentDocument {
  id: string;
  type: 'cmr' | 'invoice' | 'delivery_note' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
}

export interface DeliveryProof {
  photos: DeliveryPhoto[];
  signature?: string; // Base64 image
  recipientName: string;
  deliveredAt: Date;
  location: [number, number]; // GPS coordinates
  notes?: string;
}

export interface DeliveryPhoto {
  id: string;
  url: string;
  location: [number, number];
  takenAt: Date;
}

export interface ShipmentRating {
  transporterRating: number; // 1-5 stars
  transporterComment?: string;
  clientRating: number;
  clientComment?: string;
  createdAt: Date;
}

// ============================================================================
// Fleet & Vehicles
// ============================================================================

export interface Vehicle {
  id: string;
  name: string;
  type: 'truck' | 'van' | 'tractor' | 'refrigerated' | 'flatbed';
  licensePlate: string;
  
  // Specifications
  specifications: VehicleConstraints;
  
  // IoT & Tracking
  iotDevice?: IoTDevice;
  currentLocation?: [number, number];
  
  // Status
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_service';
  
  // Maintenance
  maintenanceSchedule: MaintenanceSchedule[];
  nextMaintenance?: Date;
  
  // Costs
  costs: VehicleCosts;
  
  // Documents
  documents: VehicleDocument[];
  
  // Metadata
  purchaseDate: Date;
  mileage: number; // km
  hoursOfOperation: number;
}

export interface IoTDevice {
  deviceId: string;
  connected: boolean;
  lastUpdate: Date;
  data: {
    fuelLevel: number; // Percentage
    temperature?: number; // °C
    speed: number; // km/h
    engineStatus: 'on' | 'off' | 'idle';
    batteryVoltage: number;
  };
}

export interface MaintenanceSchedule {
  id: string;
  type: 'oil_change' | 'tire_rotation' | 'inspection' | 'repair' | 'other';
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  cost?: number;
  status: 'scheduled' | 'completed' | 'overdue';
  notes?: string;
}

export interface VehicleCosts {
  insurance: number; // Annual
  registration: number; // Annual
  maintenance: number; // YTD
  fuel: number; // YTD
  repairs: number; // YTD
  total: number; // YTD
}

export interface VehicleDocument {
  id: string;
  type: 'insurance' | 'registration' | 'inspection' | 'other';
  name: string;
  url: string;
  expiryDate?: Date;
  uploadedAt: Date;
}

// ============================================================================
// Finance & Invoicing
// ============================================================================

export interface FinancialMetrics {
  // Revenue
  totalRevenue: number;
  revenueByType: {
    deliveries: number;
    bonuses: number;
    commissions: number;
  };
  
  // Costs
  totalCosts: number;
  costsByType: {
    fuel: number;
    maintenance: number;
    insurance: number;
    tolls: number;
    other: number;
  };
  
  // Profit
  grossProfit: number;
  netProfit: number;
  profitMargin: number; // Percentage
  
  // Period
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  
  // Line items
  items: InvoiceItem[];
  
  // Amounts
  subtotal: number;
  tax: number;
  taxRate: number; // Percentage
  total: number;
  currency: string;
  
  // Status
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  
  // Dates
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  
  // Payment
  paymentMethod?: 'stripe' | 'mobile_money' | 'bank_transfer' | 'cash';
  paymentReference?: string;
  
  // Documents
  pdfUrl?: string;
  
  // Metadata
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ============================================================================
// Marketplace & Loads
// ============================================================================

export interface Load {
  id: string;
  title: string;
  description: string;
  
  // Locations
  pickupLocation: string;
  pickupCoordinates: [number, number];
  deliveryLocation: string;
  deliveryCoordinates: [number, number];
  distance: number; // km
  
  // Cargo
  cargo: CargoDetails;
  
  // Timing
  pickupDate: Date;
  deliveryDate: Date;
  timeWindow?: TimeWindow;
  
  // Financial
  offeredPrice: number;
  currency: string;
  paymentTerms: string;
  
  // Bidding
  biddingEnabled: boolean;
  currentBid?: number;
  minBid?: number;
  bids: Bid[];
  
  // Shipper
  shipperId: string;
  shipperName: string;
  shipperRating: number;
  
  // Status
  status: 'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  
  // Metadata
  postedAt: Date;
  expiresAt?: Date;
}

export interface Bid {
  id: string;
  loadId: string;
  transporterId: string;
  transporterName: string;
  amount: number;
  currency: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: Date;
}

// ============================================================================
// Analytics & Performance
// ============================================================================

export interface PerformanceMetrics {
  // Punctuality
  onTimeDeliveries: number;
  lateDeliveries: number;
  onTimeRate: number; // Percentage
  averageDelay: number; // Minutes
  
  // Customer satisfaction
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  
  // Efficiency
  averageKmPerDelivery: number;
  emptyKmRate: number; // Percentage
  fuelEfficiency: number; // L/100km
  
  // Financial
  averageRevenuePerDelivery: number;
  averageCostPerKm: number;
  profitMargin: number; // Percentage
  
  // Period
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
}

export interface ProfitabilityZone {
  zone: string;
  coordinates: [number, number];
  deliveries: number;
  revenue: number;
  costs: number;
  profit: number;
  profitMargin: number;
}

// ============================================================================
// Notifications & Alerts
// ============================================================================

export interface OpportunityAlert {
  id: string;
  type: 'nearby_load' | 'optimal_route' | 'price_surge' | 'urgent_delivery';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: Date;
  createdAt: Date;
  read: boolean;
}

export interface TrafficAlert {
  id: string;
  type: 'congestion' | 'accident' | 'roadwork' | 'weather' | 'closure';
  severity: 'low' | 'medium' | 'high';
  location: string;
  coordinates: [number, number];
  description: string;
  affectedRoutes: string[];
  estimatedDelay: number; // Minutes
  startTime: Date;
  endTime?: Date;
}
