// ===================================================
// TYPES & INTERFACES - Loueur 2.0
// Everything-as-a-Service Architecture
// ===================================================

export interface Equipment {
  id: string;
  name: string;
  model: string;
  brand: string;
  category: EquipmentCategory;
  subcategory?: string;
  images: string[];
  thumbnail3D?: string;
  pricePerDay: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  dynamicPricing: {
    peak: number;
    offPeak: number;
    weekend: number;
  };
  location: {
    address: string;
    city: string;
    region: string;
    postalCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  distance?: number;
  rating: number;
  totalRentals: number;
  status: EquipmentStatus;
  owner: OwnerProfile;
  description: string;
  specifications: Record<string, any>;
  features: string[];
  iotEnabled: boolean;
  iotData?: IoTData;
  maintenance: MaintenanceRecord[];
  insurance: InsuranceDetails;
  availability: AvailabilityCalendar;
  reliabilityScore: number;
  certifications: string[];
  tags: string[];
}

export type EquipmentCategory =
  | "Tracteur"
  | "Couveuse"
  | "Remorque"
  | "Scie"
  | "Pulvérisateur"
  | "Outil"
  | "Moissonneuse"
  | "Semoir"
  | "Drone"
  | "Autre";

export type EquipmentStatus = "available" | "reserved" | "in-use" | "maintenance" | "unavailable";

export interface OwnerProfile {
  id: string;
  name: string;
  type: "individual" | "cooperative" | "company";
  avatar?: string;
  verified: boolean;
  rating: number;
  totalEquipments: number;
  memberSince: Date;
  responseTime: string;
  acceptanceRate: number;
  badges: string[];
}

export interface IoTData {
  enabled: boolean;
  sensors: {
    gps: boolean;
    fuel: boolean;
    engine: boolean;
    temperature: boolean;
    vibration: boolean;
  };
  currentData?: {
    location: { lat: number; lng: number };
    fuelLevel: number;
    engineHours: number;
    temperature: number;
    lastUpdate: Date;
  };
  alerts: IoTAlert[];
}

export interface IoTAlert {
  id: string;
  type: "maintenance" | "fuel" | "location" | "performance";
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface MaintenanceRecord {
  id: string;
  date: Date;
  type: "preventive" | "corrective" | "inspection";
  description: string;
  cost: number;
  performedBy: string;
  nextScheduled?: Date;
}

export interface InsuranceDetails {
  provider: string;
  policyNumber: string;
  coverage: string[];
  expiryDate: Date;
  deductible: number;
  maxClaim: number;
}

export interface AvailabilityCalendar {
  blockedDates: Date[];
  reservedDates: { start: Date; end: Date }[];
  flexibleDates: Date[];
}

export interface Reservation {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipment: Equipment;
  renterProfile: RenterProfile;
  owner: OwnerProfile;
  startDate: Date;
  endDate: Date;
  days: number;
  basePrice: number;
  extras: ReservationExtra[];
  totalPrice: number;
  deposit: number;
  status: ReservationStatus;
  paymentStatus: "pending" | "partial" | "paid" | "refunded";
  paymentPlan?: PaymentPlan;
  contract: ContractDetails;
  delivery?: DeliveryDetails;
  insurance: ReservationInsurance;
  tracking?: TrackingData;
  requestDate: Date;
  confirmedDate?: Date;
  feedback?: FeedbackData;
}

export type ReservationStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled"
  | "disputed";

export interface RenterProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  verified: boolean;
  creditScore: number;
  rentHistory: number;
  rating: number;
  badges: string[];
}

export interface ReservationExtra {
  id: string;
  type: "operator" | "delivery" | "insurance" | "maintenance" | "installation" | "training";
  name: string;
  price: number;
  selected: boolean;
}

export interface PaymentPlan {
  type: "full" | "split" | "usage-based" | "subscription";
  schedule: PaymentSchedule[];
  method: "card" | "bank" | "crypto" | "wallet";
}

export interface PaymentSchedule {
  amount: number;
  dueDate: Date;
  status: "pending" | "paid" | "overdue";
}

export interface ContractDetails {
  id: string;
  type: "standard" | "custom";
  terms: string[];
  digitalSignature: {
    renter: { signed: boolean; date?: Date; ip?: string };
    owner: { signed: boolean; date?: Date; ip?: string };
  };
  documentUrl: string;
}

export interface DeliveryDetails {
  required: boolean;
  type: "standard" | "express";
  address: string;
  estimatedTime: string;
  cost: number;
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  tracking?: TrackingData;
  installation: boolean;
}

export interface ReservationInsurance {
  included: boolean;
  type: "basic" | "premium" | "comprehensive";
  coverage: string[];
  deductible: number;
  cost: number;
}

export interface TrackingData {
  status:
    | "pending"
    | "preparing"
    | "in-transit"
    | "delivered"
    | "in-use"
    | "returning"
    | "returned";
  currentLocation: { lat: number; lng: number };
  history: TrackingEvent[];
  estimatedArrival?: Date;
  geofence?: { center: { lat: number; lng: number }; radius: number };
}

export interface TrackingEvent {
  timestamp: Date;
  location: { lat: number; lng: number };
  status: string;
  notes?: string;
}

export interface FeedbackData {
  rating: number;
  comment: string;
  photos?: string[];
  tags: string[];
  date: Date;
  response?: {
    text: string;
    date: Date;
  };
}

export interface AIRecommendation {
  equipmentId: string;
  score: number;
  reasons: string[];
  matchFactors: {
    cropType?: number;
    landSize?: number;
    budget?: number;
    experience?: number;
    season?: number;
  };
}

export interface UserPreferences {
  favoriteCategories: EquipmentCategory[];
  priceRange: { min: number; max: number };
  preferredBrands: string[];
  maxDistance: number;
  notifications: {
    priceDrops: boolean;
    newAvailability: boolean;
    recommendations: boolean;
  };
  savedSearches: SavedSearch[];
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
  alertsEnabled: boolean;
}

export interface SearchFilters {
  query?: string;
  category?: EquipmentCategory;
  priceRange?: { min: number; max: number };
  location?: { lat: number; lng: number; radius: number };
  availability?: { start: Date; end: Date };
  features?: string[];
  iotEnabled?: boolean;
  minRating?: number;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "distance" | "rating";
}

export interface AnalyticsData {
  owner: OwnerAnalytics;
  renter: RenterAnalytics;
  platform: PlatformAnalytics;
}

export interface OwnerAnalytics {
  totalRevenue: number;
  activeRentals: number;
  completedRentals: number;
  occupancyRate: number;
  averageRating: number;
  revenueByMonth: { month: string; revenue: number }[];
  topEquipments: { id: string; name: string; revenue: number }[];
  maintenanceCosts: number;
  profitMargin: number;
  trends: {
    bookings: number;
    revenue: number;
    satisfaction: number;
  };
}

export interface RenterAnalytics {
  totalSpent: number;
  totalRentals: number;
  favoriteCategories: { category: string; count: number }[];
  costSavings: number;
  costComparison: {
    rental: number;
    purchase: number;
    savings: number;
  };
  usagePatterns: {
    seasonality: { season: string; rentals: number }[];
    duration: { days: number; count: number }[];
  };
  recommendations: AIRecommendation[];
}

export interface PlatformAnalytics {
  totalEquipments: number;
  totalUsers: number;
  totalTransactions: number;
  averageTransactionValue: number;
  topCategories: { category: string; count: number }[];
  userGrowth: { month: string; users: number }[];
  revenueGrowth: { month: string; revenue: number }[];
  marketTrends: {
    demandForecas: { period: string; demand: number }[];
    pricingTrends: { category: string; averagePrice: number }[];
  };
}
