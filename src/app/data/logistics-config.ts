/**
 * AGRILOGISTIC LINK - CONFIGURATION
 * Constantes et paramètres de configuration pour le module de logistique
 */

// ==================== SCORING WEIGHTS ====================

/**
 * Poids des facteurs dans le calcul du score AI (total = 100%)
 */
export const MATCH_SCORE_WEIGHTS = {
  CAPACITY: 25,           // Correspondance de capacité
  LOCATION: 20,           // Proximité géographique
  TIME: 20,               // Disponibilité temporelle
  REQUIREMENTS: 15,       // Exigences spéciales
  PRICE: 10,              // Compatibilité prix
  DRIVER_RATING: 10,      // Note du conducteur
} as const;

// ==================== DISTANCE THRESHOLDS ====================

/**
 * Seuils de distance pour le scoring de proximité (en km)
 */
export const DISTANCE_THRESHOLDS = {
  VERY_CLOSE: 50,         // < 50 km : score maximal
  CLOSE: 150,             // 50-150 km : score élevé
  MEDIUM: 300,            // 150-300 km : score moyen
  FAR: Infinity,          // > 300 km : score faible
} as const;

/**
 * Scores attribués selon la distance
 */
export const DISTANCE_SCORES = {
  VERY_CLOSE: 20,
  CLOSE: 15,
  MEDIUM: 10,
  FAR: 5,
} as const;

// ==================== TIME THRESHOLDS ====================

/**
 * Seuils de temps pour le scoring de disponibilité (en jours)
 */
export const TIME_THRESHOLDS = {
  IMMEDIATE: 1,           // ≤ 1 jour : score maximal
  SOON: 3,                // 1-3 jours : score élevé
  NEAR: 7,                // 3-7 jours : score moyen
  LATER: Infinity,        // > 7 jours : score faible
} as const;

/**
 * Scores attribués selon la disponibilité temporelle
 */
export const TIME_SCORES = {
  IMMEDIATE: 20,
  SOON: 15,
  NEAR: 10,
  LATER: 5,
} as const;

// ==================== CAPACITY THRESHOLDS ====================

/**
 * Ratios de capacité optimaux (charge / capacité camion)
 */
export const CAPACITY_RATIOS = {
  OPTIMAL_MIN: 0.7,       // 70% minimum pour ratio optimal
  OPTIMAL_MAX: 1.0,       // 100% maximum (pas de surcharge)
  ACCEPTABLE_MIN: 0.5,    // 50% minimum acceptable
} as const;

/**
 * Scores attribués selon le ratio de capacité
 */
export const CAPACITY_SCORES = {
  OPTIMAL: 25,            // 70-100% : score maximal
  ACCEPTABLE: 20,         // 50-70% : score acceptable
  SUBOPTIMAL: 15,         // < 50% : score faible
  OVERLOAD: 0,            // > 100% : impossible
} as const;

// ==================== PRICE THRESHOLDS ====================

/**
 * Ratios de prix (prix offert / coût estimé)
 */
export const PRICE_RATIOS = {
  EXCELLENT: 1.2,         // ≥ 120% : excellent
  GOOD: 1.0,              // 100-120% : bon
  ACCEPTABLE: 0.8,        // 80-100% : acceptable
  LOW: 0,                 // < 80% : faible
} as const;

/**
 * Scores attribués selon le ratio de prix
 */
export const PRICE_SCORES = {
  EXCELLENT: 10,
  GOOD: 8,
  ACCEPTABLE: 5,
  LOW: 2,
} as const;

// ==================== PRICING ====================

/**
 * Tarification par défaut
 */
export const PRICING = {
  BASE_RATE_PER_KM: 150,          // FCFA par km
  BASE_RATE_PER_TONNE: 50,        // FCFA par tonne
  FUEL_SURCHARGE: 0.15,           // 15% de surcharge carburant
  INSURANCE_RATE: 0.02,           // 2% pour assurance
  REFRIGERATION_SURCHARGE: 0.25,  // 25% pour réfrigération
  EXPRESS_SURCHARGE: 0.30,        // 30% pour livraison express
} as const;

// ==================== TRUCK TYPES ====================

/**
 * Types de camions disponibles avec leurs caractéristiques
 */
export const TRUCK_TYPES = {
  LIGHT: {
    name: 'Camion léger',
    minCapacity: 2,
    maxCapacity: 5,
    avgFuelEfficiency: 8,
  },
  MEDIUM: {
    name: 'Camion moyen',
    minCapacity: 5,
    maxCapacity: 13,
    avgFuelEfficiency: 6,
  },
  HEAVY: {
    name: 'Poids lourd',
    minCapacity: 10,
    maxCapacity: 25,
    avgFuelEfficiency: 4,
  },
  SEMI: {
    name: 'Semi-remorque',
    minCapacity: 20,
    maxCapacity: 40,
    avgFuelEfficiency: 3,
  },
  REFRIGERATED: {
    name: 'Frigorifique',
    minCapacity: 8,
    maxCapacity: 23,
    avgFuelEfficiency: 5,
  },
} as const;

// ==================== PRODUCT CATEGORIES ====================

/**
 * Catégories de produits avec leurs exigences
 */
export const PRODUCT_CATEGORIES = {
  CEREALS: {
    name: 'Céréales',
    products: ['Maïs', 'Blé', 'Riz', 'Soja'],
    requiresRefrigeration: false,
    avgDensity: 0.75, // tonnes/m³
  },
  VEGETABLES: {
    name: 'Légumes',
    products: ['Tomates', 'Pommes de terre', 'Oignons'],
    requiresRefrigeration: true,
    avgDensity: 0.6,
  },
  CASH_CROPS: {
    name: 'Cultures de rente',
    products: ['Café', 'Cacao', 'Coton'],
    requiresRefrigeration: false,
    avgDensity: 0.5,
  },
} as const;

// ==================== STATUS DEFINITIONS ====================

/**
 * Définitions des statuts de chargement
 */
export const LOAD_STATUSES = {
  PENDING: {
    value: 'Pending',
    label: 'En attente',
    color: '#FF9800',
    icon: '⏳',
  },
  MATCHED: {
    value: 'Matched',
    label: 'Matché',
    color: '#4CAF50',
    icon: '✓',
  },
  IN_TRANSIT: {
    value: 'In Transit',
    label: 'En transit',
    color: '#2196F3',
    icon: '🚛',
  },
  DELIVERED: {
    value: 'Delivered',
    label: 'Livré',
    color: '#4CAF50',
    icon: '✓✓',
  },
  CANCELLED: {
    value: 'Cancelled',
    label: 'Annulé',
    color: '#F44336',
    icon: '✗',
  },
} as const;

/**
 * Définitions des statuts de camion
 */
export const TRUCK_STATUSES = {
  AVAILABLE: {
    value: 'Available',
    label: 'Disponible',
    color: '#4CAF50',
    icon: '✓',
  },
  ASSIGNED: {
    value: 'Assigned',
    label: 'Assigné',
    color: '#2196F3',
    icon: '📋',
  },
  IN_TRANSIT: {
    value: 'In Transit',
    label: 'En transit',
    color: '#2196F3',
    icon: '🚛',
  },
  MAINTENANCE: {
    value: 'Maintenance',
    label: 'Maintenance',
    color: '#FF9800',
    icon: '🔧',
  },
  OFFLINE: {
    value: 'Offline',
    label: 'Hors ligne',
    color: '#9E9E9E',
    icon: '⚫',
  },
} as const;

/**
 * Définitions des statuts de match
 */
export const MATCH_STATUSES = {
  SUGGESTED: {
    value: 'Suggested',
    label: 'Suggéré',
    color: '#667eea',
    icon: '💡',
  },
  ACCEPTED: {
    value: 'Accepted',
    label: 'Accepté',
    color: '#4CAF50',
    icon: '✓',
  },
  REJECTED: {
    value: 'Rejected',
    label: 'Rejeté',
    color: '#F44336',
    icon: '✗',
  },
  EXPIRED: {
    value: 'Expired',
    label: 'Expiré',
    color: '#9E9E9E',
    icon: '⏰',
  },
} as const;

// ==================== TIMEOUTS & LIMITS ====================

/**
 * Délais et limites
 */
export const LIMITS = {
  MATCH_EXPIRY_HOURS: 24,         // Expiration des matches après 24h
  MAX_MATCHES_PER_LOAD: 5,        // Maximum 5 matches par chargement
  MIN_MATCH_SCORE: 50,            // Score minimum pour suggérer un match
  REFRESH_INTERVAL_MS: 30000,     // Rafraîchissement toutes les 30s
  MAX_SEARCH_RADIUS_KM: 500,      // Rayon de recherche maximum
} as const;

// ==================== NOTIFICATIONS ====================

/**
 * Configuration des notifications
 */
export const NOTIFICATIONS = {
  NEW_MATCH_THRESHOLD: 80,        // Notifier si score > 80%
  PRICE_ALERT_THRESHOLD: 1.5,     // Alerter si prix > 150% du coût estimé
  DISTANCE_ALERT_KM: 400,         // Alerter si distance > 400 km
  EXPIRY_WARNING_HOURS: 6,        // Avertir 6h avant expiration
} as const;

// ==================== ANALYTICS ====================

/**
 * Configuration des analytics
 */
export const ANALYTICS = {
  DEFAULT_TIME_RANGE: '7d',       // Période par défaut : 7 jours
  CHART_REFRESH_MS: 60000,        // Rafraîchir les graphiques toutes les 60s
  TOP_ITEMS_COUNT: 5,             // Nombre d'items dans les tops
  PERFORMANCE_THRESHOLD: 85,      // Seuil de performance (%)
} as const;

// ==================== GEOLOCATION ====================

/**
 * Configuration de géolocalisation
 */
export const GEOLOCATION = {
  DEFAULT_ZOOM: 7,                // Zoom par défaut sur la carte
  MARKER_CLUSTER_RADIUS: 80,      // Rayon de clustering des marqueurs
  UPDATE_INTERVAL_MS: 10000,      // Mise à jour position toutes les 10s
  ACCURACY_THRESHOLD_M: 100,      // Précision minimale : 100m
} as const;

// ==================== VALIDATION ====================

/**
 * Règles de validation
 */
export const VALIDATION = {
  MIN_QUANTITY_TONNES: 0.5,       // Quantité minimale : 500 kg
  MAX_QUANTITY_TONNES: 50,        // Quantité maximale : 50 tonnes
  MIN_PRICE_FCFA: 10000,          // Prix minimum : 10 000 FCFA
  MAX_PRICE_FCFA: 50000000,       // Prix maximum : 50 M FCFA
  MIN_DRIVER_RATING: 0,           // Note minimale
  MAX_DRIVER_RATING: 5,           // Note maximale
  PHONE_REGEX: /^\+225\s?\d{8,10}$/, // Format téléphone ivoirien
} as const;

// ==================== FEATURES ====================

/**
 * Features disponibles pour les camions
 */
export const TRUCK_FEATURES = [
  'GPS en temps réel',
  'Réfrigération',
  'Hayon élévateur',
  'Bâche étanche',
  'Système anti-vol',
  'Caméra embarquée',
  'Compartiments multiples',
  'Suspension pneumatique',
  'Tracking température',
  'Alarme intrusion',
] as const;

/**
 * Exigences spéciales disponibles
 */
export const SPECIAL_REQUIREMENTS = [
  'Température contrôlée',
  'Livraison express',
  'Manutention délicate',
  'Emballage spécial',
  'Traçabilité GPS',
  'Certification bio',
  'Déchargement assisté',
  'Livraison de nuit',
  'Escorte sécurisée',
  'Assurance premium',
] as const;

// ==================== EXPORT ====================

/**
 * Configuration complète du module
 */
export const LINK_CONFIG = {
  matchScoreWeights: MATCH_SCORE_WEIGHTS,
  distanceThresholds: DISTANCE_THRESHOLDS,
  distanceScores: DISTANCE_SCORES,
  timeThresholds: TIME_THRESHOLDS,
  timeScores: TIME_SCORES,
  capacityRatios: CAPACITY_RATIOS,
  capacityScores: CAPACITY_SCORES,
  priceRatios: PRICE_RATIOS,
  priceScores: PRICE_SCORES,
  pricing: PRICING,
  truckTypes: TRUCK_TYPES,
  productCategories: PRODUCT_CATEGORIES,
  loadStatuses: LOAD_STATUSES,
  truckStatuses: TRUCK_STATUSES,
  matchStatuses: MATCH_STATUSES,
  limits: LIMITS,
  notifications: NOTIFICATIONS,
  analytics: ANALYTICS,
  geolocation: GEOLOCATION,
  validation: VALIDATION,
  truckFeatures: TRUCK_FEATURES,
  specialRequirements: SPECIAL_REQUIREMENTS,
} as const;

export default LINK_CONFIG;
