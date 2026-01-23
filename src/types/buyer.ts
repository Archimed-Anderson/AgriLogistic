/**
 * Buyer Module Types
 * Types for the professional buyer dashboard
 */

// ========== Core Entities ==========

export interface Supplier {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  rating: number;
  totalOrders: number;
  reliabilityScore: number;
  certifications: Certificate[];
  specialties: string[];
  contactEmail: string;
  contactPhone: string;
  avatarUrl?: string;
  isVerified: boolean;
  memberSince: Date;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  images: string[];
  pricePerKg: number;
  pricePerUnit?: number;
  unit: 'kg' | 'piece' | 'bunch' | 'box' | 'crate';
  minOrderQuantity: number;
  availableQuantity: number;
  supplierId: string;
  supplier: Supplier;
  origin: string;
  harvestDate?: Date;
  expiryDate?: Date;
  certifications: Certificate[];
  nutritionalInfo?: NutritionalInfo;
  qualityScore: number;
  seasonality: SeasonMonth[];
  isOrganic: boolean;
  isFavorite: boolean;
  traceabilityId?: string;
}

export type ProductCategory = 
  | 'fruits'
  | 'vegetables'
  | 'cereals'
  | 'dairy'
  | 'meat'
  | 'poultry'
  | 'seafood'
  | 'herbs'
  | 'spices'
  | 'oils'
  | 'honey'
  | 'other';

export type SeasonMonth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface Certificate {
  id: string;
  type: CertificationType;
  name: string;
  issuer: string;
  issuedAt: Date;
  expiresAt?: Date;
  documentUrl?: string;
  verified: boolean;
}

export type CertificationType = 
  | 'organic'
  | 'aop'
  | 'igp'
  | 'label_rouge'
  | 'fair_trade'
  | 'global_gap'
  | 'haccp'
  | 'iso_22000'
  | 'other';

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitamins?: Record<string, number>;
  minerals?: Record<string, number>;
}

// ========== Orders ==========

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  supplierId: string;
  supplier: Supplier;
  totalAmount: number;
  currency: string;
  deliveryAddress: Address;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  notes?: string;
  timeline: OrderEvent[];
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface OrderEvent {
  id: string;
  type: OrderEventType;
  timestamp: Date;
  description: string;
  actor?: string;
}

export type OrderEventType = 
  | 'created'
  | 'confirmed'
  | 'payment_received'
  | 'preparing'
  | 'quality_check'
  | 'shipped'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'
  | 'issue_reported'
  | 'issue_resolved';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: [number, number];
}

// ========== Dashboard ==========

export interface BuyerDashboard {
  stats: BuyerStats;
  priceAlerts: PriceAlert[];
  recommendations: Product[];
  recentOrders: Order[];
  favoriteSuppliers: Supplier[];
  seasonalProducts: SeasonalProduct[];
  spendingByCategory: SpendingCategory[];
  newArrivals: Product[];
}

export interface BuyerStats {
  totalSpent: number;
  totalOrders: number;
  averageOrderValue: number;
  suppliersCount: number;
  savedThisMonth: number;
  pendingOrders: number;
}

export interface PriceAlert {
  id: string;
  productId: string;
  product: Product;
  previousPrice: number;
  currentPrice: number;
  changePercent: number;
  alertType: 'drop' | 'increase' | 'threshold';
  createdAt: Date;
}

export interface SeasonalProduct {
  product: Product;
  peakMonth: SeasonMonth;
  availabilityStart: SeasonMonth;
  availabilityEnd: SeasonMonth;
  isCurrentlySeasonal: boolean;
}

export interface SpendingCategory {
  category: ProductCategory;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

// ========== Marketplace Search ==========

export interface MarketplaceFilters {
  query?: string;
  categories?: ProductCategory[];
  priceRange?: [number, number];
  origin?: string[];
  certifications?: CertificationType[];
  supplierId?: string;
  isOrganic?: boolean;
  maxDistance?: number;
  sortBy?: 'price' | 'rating' | 'distance' | 'freshness';
  sortOrder?: 'asc' | 'desc';
}

export interface MarketplaceSearchResult {
  products: Product[];
  totalCount: number;
  facets: SearchFacets;
  page: number;
  pageSize: number;
}

export interface SearchFacets {
  categories: FacetItem[];
  origins: FacetItem[];
  certifications: FacetItem[];
  priceRanges: FacetItem[];
}

export interface FacetItem {
  value: string;
  label: string;
  count: number;
}

// ========== Traceability ==========

export interface Traceability {
  id: string;
  productId: string;
  blockchainHash?: string;
  journey: TraceabilityStep[];
  certificates: Certificate[];
  qualityTests: QualityTest[];
}

export interface TraceabilityStep {
  id: string;
  type: TraceabilityStepType;
  location: string;
  coordinates: [number, number];
  timestamp: Date;
  description: string;
  actor: string;
  documents?: string[];
  verified: boolean;
}

export type TraceabilityStepType = 
  | 'planting'
  | 'growing'
  | 'treatment'
  | 'harvest'
  | 'processing'
  | 'packaging'
  | 'storage'
  | 'transport'
  | 'delivery';

export interface QualityTest {
  id: string;
  type: string;
  result: 'pass' | 'fail' | 'warning';
  value?: number;
  unit?: string;
  testedAt: Date;
  testedBy: string;
  documentUrl?: string;
}

// ========== Collections ==========

export interface ProductCollection {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  products: Product[];
  curator?: string;
  tags: string[];
}
