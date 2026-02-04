/**
 * AGRILOGISTIC LINK - INDEX
 * Point d'entrée centralisé pour tous les exports du module
 */

import { VALIDATION, PRICING, LINK_CONFIG } from '../data/logistics-config';
import {
  mockLoads,
  mockTrucks,
  mockMatches,
  mockAnalytics,
  calculateAIMatchScore,
  calculateDistance,
  type Load,
  type Truck,
  type LoadStatus,
  type TruckStatus,
} from '../data/logistics-operations';

// ==================== DATA & TYPES ====================
export {
  mockLoads,
  mockTrucks,
  mockMatches,
  mockAnalytics,
  calculateAIMatchScore,
  calculateDistance,
  type Load,
  type Truck,
  type LogisticsMatch,
  type LogisticsAnalytics,
  type LoadStatus,
  type TruckStatus,
  type ProductType,
  type Coordinates,
  type GeoCoordinates,
} from '../data/logistics-operations';

// ==================== CONFIGURATION ====================
export {
  default as LINK_CONFIG,
  MATCH_SCORE_WEIGHTS,
  DISTANCE_THRESHOLDS,
  DISTANCE_SCORES,
  TIME_THRESHOLDS,
  TIME_SCORES,
  CAPACITY_RATIOS,
  CAPACITY_SCORES,
  PRICE_RATIOS,
  PRICE_SCORES,
  PRICING,
  TRUCK_TYPES,
  PRODUCT_CATEGORIES,
  LOAD_STATUSES,
  TRUCK_STATUSES,
  MATCH_STATUSES,
  LIMITS,
  NOTIFICATIONS,
  ANALYTICS,
  GEOLOCATION,
  VALIDATION,
  TRUCK_FEATURES,
  SPECIAL_REQUIREMENTS,
} from '../data/logistics-config';

// ==================== COMPONENTS ====================
export { default as LinkHubPage } from './page';
export { default as LinkMonitorPage } from '../admin/link-monitor/page';

// ==================== VERSION ====================
export const LINK_VERSION = '1.0.0';
export const LINK_BUILD_DATE = '2026-01-30';

// ==================== METADATA ====================
export const LINK_METADATA = {
  name: 'AgriLogistic Link',
  description: "Hub de mise en relation 360° - Le Uber de l'agriculture",
  version: LINK_VERSION,
  buildDate: LINK_BUILD_DATE,
  author: 'AgriLogistic Team',
  features: [
    'Matching AI intelligent (6 facteurs)',
    'Tracking GPS en temps réel',
    'Dashboard analytics complet',
    'Notifications push',
    'Chat intégré',
    'Paiement sécurisé',
  ],
  stats: {
    loads: 50,
    trucks: 30,
    cities: 10,
    products: 10,
  },
};

// ==================== HELPERS ====================

/**
 * Formatte un prix en FCFA
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatte une distance en km
 */
export const formatDistance = (km: number): string => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
};

/**
 * Formatte une durée en heures
 */
export const formatDuration = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  if (hours < 24) {
    return `${hours.toFixed(1)}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `${days}j ${remainingHours.toFixed(0)}h`;
};

/**
 * Formatte une date relative (ex: "Il y a 2h")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  return then.toLocaleDateString('fr-FR');
};

/**
 * Obtient la couleur selon le score AI
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#4CAF50'; // Vert
  if (score >= 60) return '#8BC34A'; // Vert clair
  if (score >= 40) return '#FF9800'; // Orange
  return '#F44336'; // Rouge
};

/**
 * Obtient le label selon le score AI
 */
export const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Très bon';
  if (score >= 60) return 'Bon';
  if (score >= 40) return 'Moyen';
  return 'Faible';
};

/**
 * Valide un numéro de téléphone ivoirien
 */
export const validatePhone = (phone: string): boolean => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

/**
 * Valide une quantité
 */
export const validateQuantity = (quantity: number): boolean => {
  return quantity >= VALIDATION.MIN_QUANTITY_TONNES && quantity <= VALIDATION.MAX_QUANTITY_TONNES;
};

/**
 * Valide un prix
 */
export const validatePrice = (price: number): boolean => {
  return price >= VALIDATION.MIN_PRICE_FCFA && price <= VALIDATION.MAX_PRICE_FCFA;
};

/**
 * Calcule le coût estimé d'un trajet
 */
export const calculateEstimatedCost = (
  distance: number,
  quantity: number,
  hasRefrigeration: boolean = false,
  isExpress: boolean = false
): number => {
  let cost = distance * PRICING.BASE_RATE_PER_KM * quantity;

  // Surcharge carburant
  cost *= 1 + PRICING.FUEL_SURCHARGE;

  // Surcharge réfrigération
  if (hasRefrigeration) {
    cost *= 1 + PRICING.REFRIGERATION_SURCHARGE;
  }

  // Surcharge express
  if (isExpress) {
    cost *= 1 + PRICING.EXPRESS_SURCHARGE;
  }

  // Assurance
  cost *= 1 + PRICING.INSURANCE_RATE;

  return Math.round(cost);
};

/**
 * Filtre les loads par statut
 */
export const filterLoadsByStatus = (loads: Load[], status: LoadStatus | 'all'): Load[] => {
  if (status === 'all') return loads;
  return loads.filter((load) => load.status === status);
};

/**
 * Filtre les trucks par statut
 */
export const filterTrucksByStatus = (trucks: Truck[], status: TruckStatus | 'all'): Truck[] => {
  if (status === 'all') return trucks;
  return trucks.filter((truck) => truck.status === status);
};

/**
 * Recherche dans les loads
 */
export const searchLoads = (loads: Load[], query: string): Load[] => {
  const lowerQuery = query.toLowerCase();
  return loads.filter(
    (load) =>
      load.productType.toLowerCase().includes(lowerQuery) ||
      load.originCity?.toLowerCase().includes(lowerQuery) ||
      load.destinationCity?.toLowerCase().includes(lowerQuery) ||
      load.producerName.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Recherche dans les trucks
 */
export const searchTrucks = (trucks: Truck[], query: string): Truck[] => {
  const lowerQuery = query.toLowerCase();
  return trucks.filter(
    (truck) =>
      truck.driverName.toLowerCase().includes(lowerQuery) ||
      truck.currentLocationCity?.toLowerCase().includes(lowerQuery) ||
      truck.truckType.toLowerCase().includes(lowerQuery) ||
      truck.licensePlate.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Trie les loads par score AI (décroissant)
 */
export const sortLoadsByScore = (loads: Load[]): Load[] => {
  return [...loads].sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
};

/**
 * Trie les trucks par score AI (décroissant)
 */
export const sortTrucksByScore = (trucks: Truck[]): Truck[] => {
  return [...trucks].sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
};

/**
 * Obtient les statistiques d'un ensemble de loads
 */
export const getLoadStats = (loads: Load[]) => {
  return {
    total: loads.length,
    pending: loads.filter((l) => l.status === 'Pending').length,
    matched: loads.filter((l) => l.status === 'Matched').length,
    inTransit: loads.filter((l) => l.status === 'In Transit').length,
    delivered: loads.filter((l) => l.status === 'Delivered').length,
    totalValue: loads.reduce((sum, l) => sum + l.priceOffer, 0),
    avgScore: loads.reduce((sum, l) => sum + (l.aiMatchScore || 0), 0) / loads.length,
  };
};

/**
 * Obtient les statistiques d'un ensemble de trucks
 */
export const getTruckStats = (trucks: Truck[]) => {
  return {
    total: trucks.length,
    available: trucks.filter((t) => t.status === 'Available').length,
    assigned: trucks.filter((t) => t.status === 'Assigned').length,
    inTransit: trucks.filter((t) => t.status === 'In Transit').length,
    maintenance: trucks.filter((t) => t.status === 'Maintenance').length,
    totalCapacity: trucks.reduce((sum, t) => sum + t.capacity, 0),
    avgRating: trucks.reduce((sum, t) => sum + t.driverRating, 0) / trucks.length,
  };
};

// ==================== DEFAULT EXPORT ====================
export default {
  version: LINK_VERSION,
  buildDate: LINK_BUILD_DATE,
  metadata: LINK_METADATA,
  config: LINK_CONFIG,
  data: {
    loads: mockLoads,
    trucks: mockTrucks,
    matches: mockMatches,
    analytics: mockAnalytics,
  },
  utils: {
    calculateAIMatchScore,
    calculateDistance,
    calculateEstimatedCost,
    formatPrice,
    formatDistance,
    formatDuration,
    formatRelativeTime,
    getScoreColor,
    getScoreLabel,
    validatePhone,
    validateQuantity,
    validatePrice,
    filterLoadsByStatus,
    filterTrucksByStatus,
    searchLoads,
    searchTrucks,
    sortLoadsByScore,
    sortTrucksByScore,
    getLoadStats,
    getTruckStats,
  },
};
