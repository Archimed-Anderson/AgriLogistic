/**
 * AGRILOGISTIC LINK - LOGISTICS ENGINE
 * Dataset complexe pour la mise en relation Producteurs, Acheteurs et Transporteurs
 * Le "Uber" de l'agriculture
 */

// ==================== TYPES & INTERFACES ====================

export type LoadStatus = 'Pending' | 'Matched' | 'In Transit' | 'Delivered' | 'Cancelled';
export type TruckStatus = 'Available' | 'Assigned' | 'In Transit' | 'Maintenance' | 'Offline';
export type ProductType =
  | 'Maïs'
  | 'Blé'
  | 'Riz'
  | 'Soja'
  | 'Tomates'
  | 'Pommes de terre'
  | 'Oignons'
  | 'Café'
  | 'Cacao'
  | 'Coton';

// Coordonnées géographiques strictes [latitude, longitude]
export type Coordinates = [number, number];

export interface LocationInfo {
  coordinates: Coordinates;
  address: string;
  city: string;
  region: string;
  country: string;
}

export interface Load {
  id: string;
  productType: ProductType;
  quantity: number; // en tonnes
  unit: 'tonnes' | 'kg' | 'quintaux';

  // Coordonnées strictes
  origin: Coordinates;
  destination: Coordinates;

  // Métadonnées de localisation (pour l'affichage)
  originAddress?: string;
  originCity?: string;
  destinationAddress?: string;
  destinationCity?: string;

  priceOffer: number; // en FCFA
  currency: string;
  status: LoadStatus;
  producerId: string;
  producerName: string;
  producerPhone: string;
  buyerId?: string;
  buyerName?: string;
  pickupDate: string;
  deliveryDate: string;
  specialRequirements?: string[];
  temperature?: {
    min: number;
    max: number;
    unit: 'celsius';
  };
  packaging?: string;
  insurance: boolean;
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
  aiMatchScore: number; // 0-100%
  matchedTruckId?: string;
}

export interface Truck {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverRating: number; // 0-5
  licensePlate: string;
  truckType: 'Camion léger' | 'Camion moyen' | 'Poids lourd' | 'Semi-remorque' | 'Frigorifique';
  capacity: number; // en tonnes

  // Coordonnées strictes
  currentPosition: Coordinates;

  // Métadonnées de localisation
  currentLocationCity?: string;

  status: TruckStatus;
  features: string[]; // ex: ['GPS', 'Refrigeration', 'Hydraulic lift']
  insuranceValid: boolean;
  lastMaintenance: string;
  nextMaintenance: string;
  fuelEfficiency: number; // km/L
  availableFrom: string;
  availableUntil: string;
  preferredRoutes?: string[];
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
  aiMatchScore: number; // 0-100%
  currentLoadId?: string;
}

export interface LogisticsMatch {
  id: string;
  loadId: string;
  truckId: string;
  matchScore: number; // 0-100%
  distance: number; // en km
  estimatedDuration: number; // en heures
  estimatedCost: number; // en FCFA

  // Financial Metrics
  platformMargin: number; // Marge de la plateforme (10-15%)
  carrierRevenue: number; // Revenu du transporteur

  // Ecological Metrics
  co2Saved: number; // kg de CO2 économisé vs trajet standard

  matchFactors: {
    capacityMatch: number;
    locationProximity: number;
    timeAvailability: number;
    specialRequirements: number;
    priceCompatibility: number;
    driverRating: number;
  };
  status: 'Suggested' | 'Accepted' | 'Rejected' | 'Expired';
  createdAt: string;
  expiresAt: string;
}

export interface IoTAlert {
  id: string;
  truckId?: string; // Optional for System alerts
  truckPlate?: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'Vehicle' | 'IoT' | 'System';
  type: 'Engine' | 'Tire' | 'Temperature' | 'Geofence' | 'Fuel' | 'Match' | 'Payment';
  message: string;
  timestamp: string;
  status: 'Open' | 'Resolved' | 'Investigating';
}

export interface PredictiveData {
  date: string;
  demand: number; // Loads count forecast
  supply: number; // Truck capacity forecast
  priceIndex: number; // Market price trend
}

export interface LogisticsAnalytics {
  totalLoads: number;
  activeLoads: number;
  completedLoads: number;
  totalTrucks: number;
  availableTrucks: number;
  matchRate: number; // %
  averageMatchTime: number; // en minutes
  totalRevenue: number;
  averageDistance: number; // en km
  fleetEfficiency: number; // New: 0-100%
  co2TotalSaved: number; // New: kg
  topRoutes: Array<{
    origin: string;
    destination: string;
    frequency: number;
  }>;
  topProducts: Array<{
    product: ProductType;
    volume: number;
  }>;
}

// ==================== MOCK DATA GENERATION ====================

const cities: LocationInfo[] = [
  {
    coordinates: [5.36, -4.0083],
    address: '123 Route Agricole',
    city: 'Abidjan',
    region: 'Lagunes',
    country: "Côte d'Ivoire",
  },
  {
    coordinates: [6.827, -5.2893],
    address: '45 Avenue des Plantations',
    city: 'Yamoussoukro',
    region: 'Yamoussoukro',
    country: "Côte d'Ivoire",
  },
  {
    coordinates: [7.6898, -5.0305],
    address: '78 Boulevard du Commerce',
    city: 'Bouaké',
    region: 'Vallée du Bandama',
    country: "Côte d'Ivoire",
  },
  {
    coordinates: [9.4569, -5.5169],
    address: '12 Rue des Exportateurs',
    city: 'Korhogo',
    region: 'Savanes',
    country: "Côte d'Ivoire",
  },
  {
    coordinates: [4.7591, -6.571],
    address: '89 Quartier Portuaire',
    city: 'San-Pédro',
    region: 'Bas-Sassandra',
    country: "Côte d'Ivoire",
  },
  {
    coordinates: [6.1373, -1.2255],
    address: '34 Zone Industrielle',
    city: 'Kumasi',
    region: 'Ashanti',
    country: 'Ghana',
  },
  {
    coordinates: [5.6037, -0.187],
    address: '56 Commercial District',
    city: 'Accra',
    region: 'Greater Accra',
    country: 'Ghana',
  },
  {
    coordinates: [12.3714, -1.5197],
    address: '23 Marché Central',
    city: 'Ouagadougou',
    region: 'Centre',
    country: 'Burkina Faso',
  },
  {
    coordinates: [6.1256, 1.2229],
    address: '67 Port Autonome',
    city: 'Lomé',
    region: 'Maritime',
    country: 'Togo',
  },
  {
    coordinates: [6.3703, 2.3912],
    address: '90 Zone Franche',
    city: 'Cotonou',
    region: 'Littoral',
    country: 'Bénin',
  },
];

const products: ProductType[] = [
  'Maïs',
  'Blé',
  'Riz',
  'Soja',
  'Tomates',
  'Pommes de terre',
  'Oignons',
  'Café',
  'Cacao',
  'Coton',
];

const truckTypes = [
  'Camion léger',
  'Camion moyen',
  'Poids lourd',
  'Semi-remorque',
  'Frigorifique',
] as const;

const specialRequirements = [
  'Température contrôlée',
  'Livraison express',
  'Manutention délicate',
  'Emballage spécial',
  'Traçabilité GPS',
  'Certification bio',
  'Déchargement assisté',
];

const truckFeatures = [
  'GPS en temps réel',
  'Réfrigération',
  'Hayon élévateur',
  'Bâche étanche',
  'Système anti-vol',
  'Caméra embarquée',
  'Compartiments multiples',
];

// Fonction pour calculer le score de compatibilité AI
function calculateAIMatchScore(load: Load, truck: Truck): number {
  const factors = {
    capacityMatch: 0,
    locationProximity: 0,
    timeAvailability: 0,
    specialRequirements: 0,
    priceCompatibility: 0,
    driverRating: 0,
  };

  // 1. Capacité (25%)
  const capacityRatio = load.quantity / truck.capacity;
  if (capacityRatio >= 0.7 && capacityRatio <= 1.0) {
    factors.capacityMatch = 25;
  } else if (capacityRatio >= 0.5 && capacityRatio < 0.7) {
    factors.capacityMatch = 20;
  } else if (capacityRatio > 1.0) {
    factors.capacityMatch = 0;
  } else {
    factors.capacityMatch = 15;
  }

  // 2. Proximité géographique (20%)
  const distance = calculateDistance(truck.currentPosition, load.origin);
  if (distance < 50) {
    factors.locationProximity = 20;
  } else if (distance < 150) {
    factors.locationProximity = 15;
  } else if (distance < 300) {
    factors.locationProximity = 10;
  } else {
    factors.locationProximity = 5;
  }

  // 3. Disponibilité temporelle (20%)
  const pickupDate = new Date(load.pickupDate);
  const availableFrom = new Date(truck.availableFrom);
  const timeDiff = Math.abs(pickupDate.getTime() - availableFrom.getTime()) / (1000 * 60 * 60 * 24);
  if (timeDiff <= 1) {
    factors.timeAvailability = 20;
  } else if (timeDiff <= 3) {
    factors.timeAvailability = 15;
  } else if (timeDiff <= 7) {
    factors.timeAvailability = 10;
  } else {
    factors.timeAvailability = 5;
  }

  // 4. Exigences spéciales (15%)
  if (load.specialRequirements && load.specialRequirements.length > 0) {
    const matchedRequirements = load.specialRequirements.filter((req) =>
      truck.features.some((feature) => feature.toLowerCase().includes(req.toLowerCase()))
    );
    factors.specialRequirements =
      (matchedRequirements.length / load.specialRequirements.length) * 15;
  } else {
    factors.specialRequirements = 15;
  }

  // 5. Compatibilité prix (10%)
  const estimatedCost = distance * 150; // 150 FCFA/km
  const priceRatio = load.priceOffer / estimatedCost;
  if (priceRatio >= 1.2) {
    factors.priceCompatibility = 10;
  } else if (priceRatio >= 1.0) {
    factors.priceCompatibility = 8;
  } else if (priceRatio >= 0.8) {
    factors.priceCompatibility = 5;
  } else {
    factors.priceCompatibility = 2;
  }

  // 6. Note du conducteur (10%)
  factors.driverRating = (truck.driverRating / 5) * 10;

  // Score total
  return Math.round(
    factors.capacityMatch +
      factors.locationProximity +
      factors.timeAvailability +
      factors.specialRequirements +
      factors.priceCompatibility +
      factors.driverRating
  );
}

// Fonction pour calculer la distance entre deux points (formule de Haversine)
function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const [lat1, lon1] = point1;
  const [lat2, lon2] = point2;

  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Génération des chargements (Loads)
export const mockLoads: Load[] = Array.from({ length: 50 }, (_, i) => {
  const originCity = cities[Math.floor(Math.random() * cities.length)];
  let destinationCity = cities[Math.floor(Math.random() * cities.length)];
  while (destinationCity.city === originCity.city) {
    destinationCity = cities[Math.floor(Math.random() * cities.length)];
  }

  const product = products[Math.floor(Math.random() * products.length)];
  const quantity = Math.floor(Math.random() * 45) + 5; // 5-50 tonnes
  const distance = calculateDistance(originCity.coordinates, destinationCity.coordinates);
  const basePrice = distance * 150 * quantity; // 150 FCFA/km/tonne
  const priceVariation = 0.8 + Math.random() * 0.4; // ±20%

  const statuses: LoadStatus[] = ['Pending', 'Matched', 'In Transit', 'Delivered'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  const pickupDate = new Date();
  pickupDate.setDate(pickupDate.getDate() + Math.floor(Math.random() * 14));

  const deliveryDate = new Date(pickupDate);
  deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 5) + 1);

  const hasSpecialReq = Math.random() > 0.6;
  const numReqs = hasSpecialReq ? Math.floor(Math.random() * 3) + 1 : 0;
  const selectedReqs = hasSpecialReq
    ? Array.from(
        { length: numReqs },
        () => specialRequirements[Math.floor(Math.random() * specialRequirements.length)]
      )
    : undefined;

  const needsTemp = ['Tomates', 'Café', 'Cacao'].includes(product);

  return {
    id: `LOAD-${String(i + 1).padStart(4, '0')}`,
    productType: product,
    quantity,
    unit: 'tonnes',
    origin: originCity.coordinates,
    destination: destinationCity.coordinates,
    originAddress: originCity.address,
    originCity: originCity.city,
    destinationAddress: destinationCity.address,
    destinationCity: destinationCity.city,
    priceOffer: Math.round(basePrice * priceVariation),
    currency: 'FCFA',
    status,
    producerId: `PROD-${Math.floor(Math.random() * 1000)}`,
    producerName: `Producteur ${
      ['Kouassi', 'Diallo', 'Traoré', 'Yao', 'Koné'][Math.floor(Math.random() * 5)]
    }`,
    producerPhone: `+225 ${Math.floor(Math.random() * 90000000) + 10000000}`,
    buyerId: status !== 'Pending' ? `BUY-${Math.floor(Math.random() * 500)}` : undefined,
    buyerName:
      status !== 'Pending'
        ? `Acheteur ${['SARL', 'SA', 'EURL'][Math.floor(Math.random() * 3)]} ${
            ['AgriCom', 'FoodTrade', 'ExportPro'][Math.floor(Math.random() * 3)]
          }`
        : undefined,
    pickupDate: pickupDate.toISOString(),
    deliveryDate: deliveryDate.toISOString(),
    specialRequirements: selectedReqs,
    temperature: needsTemp
      ? {
          min: 2,
          max: 8,
          unit: 'celsius',
        }
      : undefined,
    packaging: ['Sacs', 'Palettes', 'Conteneurs', 'Vrac'][Math.floor(Math.random() * 4)],
    insurance: Math.random() > 0.3,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    aiMatchScore: 0,
    updatedAt: new Date().toISOString(),
  };
});

// Génération des camions (Trucks)
export const mockTrucks: Truck[] = Array.from({ length: 30 }, (_, i) => {
  const currentCity = cities[Math.floor(Math.random() * cities.length)];
  const truckType = truckTypes[Math.floor(Math.random() * truckTypes.length)];

  let capacity: number;
  switch (truckType) {
    case 'Camion léger':
      capacity = Math.floor(Math.random() * 3) + 2; // 2-5 tonnes
      break;
    case 'Camion moyen':
      capacity = Math.floor(Math.random() * 8) + 5; // 5-13 tonnes
      break;
    case 'Poids lourd':
      capacity = Math.floor(Math.random() * 15) + 10; // 10-25 tonnes
      break;
    case 'Semi-remorque':
      capacity = Math.floor(Math.random() * 20) + 20; // 20-40 tonnes
      break;
    case 'Frigorifique':
      capacity = Math.floor(Math.random() * 15) + 8; // 8-23 tonnes
      break;
  }

  const statuses: TruckStatus[] = ['Available', 'Assigned', 'In Transit', 'Maintenance'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  const numFeatures = Math.floor(Math.random() * 4) + 2;
  const selectedFeatures = Array.from(
    new Set(
      Array.from(
        { length: numFeatures },
        () => truckFeatures[Math.floor(Math.random() * truckFeatures.length)]
      )
    )
  );

  const availableFrom = new Date();
  availableFrom.setDate(availableFrom.getDate() + Math.floor(Math.random() * 7));

  const availableUntil = new Date(availableFrom);
  availableUntil.setDate(availableUntil.getDate() + Math.floor(Math.random() * 30) + 30);

  const lastMaintenance = new Date();
  lastMaintenance.setDate(lastMaintenance.getDate() - Math.floor(Math.random() * 90));

  const nextMaintenance = new Date(lastMaintenance);
  nextMaintenance.setDate(nextMaintenance.getDate() + 180);

  return {
    id: `TRUCK-${String(i + 1).padStart(4, '0')}`,
    driverId: `DRV-${Math.floor(Math.random() * 10000)}`,
    driverName: `${
      ['Mamadou', 'Kouadio', 'Sékou', 'Aya', 'Fatou'][Math.floor(Math.random() * 5)]
    } ${['Diallo', 'Koné', 'Touré', 'Bamba', 'Sanogo'][Math.floor(Math.random() * 5)]}`,
    driverPhone: `+225 ${Math.floor(Math.random() * 90000000) + 10000000}`,
    driverRating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10, // 3.5-5.0
    licensePlate: `CI-${Math.floor(Math.random() * 9000) + 1000}-${
      ['AB', 'CD', 'EF', 'GH'][Math.floor(Math.random() * 4)]
    }`,
    truckType,
    capacity,
    currentPosition: currentCity.coordinates,
    currentLocationCity: currentCity.city,
    status,
    features: selectedFeatures,
    insuranceValid: Math.random() > 0.1,
    lastMaintenance: lastMaintenance.toISOString(),
    nextMaintenance: nextMaintenance.toISOString(),
    fuelEfficiency: Math.round((3 + Math.random() * 5) * 10) / 10, // 3-8 km/L
    availableFrom: availableFrom.toISOString(),
    availableUntil: availableUntil.toISOString(),
    preferredRoutes:
      Math.random() > 0.5
        ? [
            `${cities[Math.floor(Math.random() * cities.length)].city} - ${
              cities[Math.floor(Math.random() * cities.length)].city
            }`,
          ]
        : undefined,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    aiMatchScore: 0,
    currentLoadId:
      status === 'Assigned' || status === 'In Transit'
        ? `LOAD-${String(Math.floor(Math.random() * 50) + 1).padStart(4, '0')}`
        : undefined,
  };
});

// Calcul des scores AI pour chaque chargement et camion
mockLoads.forEach((load) => {
  if (load.status === 'Pending') {
    // Trouver le meilleur camion disponible
    const availableTrucks = mockTrucks.filter((t) => t.status === 'Available');
    if (availableTrucks.length > 0) {
      const scores = availableTrucks.map((truck) => ({
        truck,
        score: calculateAIMatchScore(load, truck),
      }));
      scores.sort((a, b) => b.score - a.score);
      load.aiMatchScore = scores[0].score;
      load.matchedTruckId = scores[0].truck.id;
    }
  }
});

mockTrucks.forEach((truck) => {
  if (truck.status === 'Available') {
    // Trouver le meilleur chargement disponible
    const pendingLoads = mockLoads.filter((l) => l.status === 'Pending');
    if (pendingLoads.length > 0) {
      const scores = pendingLoads.map((load) => ({
        load,
        score: calculateAIMatchScore(load, truck),
      }));
      scores.sort((a, b) => b.score - a.score);
      truck.aiMatchScore = scores[0].score;
    }
  }
});

// Génération des matches
export const mockMatches: LogisticsMatch[] = mockLoads
  .filter((load) => load.matchedTruckId)
  .map((load, i) => {
    const truck = mockTrucks.find((t) => t.id === load.matchedTruckId)!;
    const distance = calculateDistance(load.origin, load.destination);
    const estimatedDuration = distance / 60; // Moyenne 60 km/h
    const estimatedCost = distance * 150 * load.quantity;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    return {
      id: `MATCH-${String(i + 1).padStart(4, '0')}`,
      loadId: load.id,
      truckId: truck.id,
      matchScore: load.aiMatchScore || 0,
      distance,
      estimatedDuration,
      estimatedCost,

      // New Metrics
      platformMargin: estimatedCost * 0.12, // 12% margin
      carrierRevenue: estimatedCost * 0.88,
      co2Saved: distance * 0.15, // 0.15kg saved per km optimized

      matchFactors: {
        capacityMatch: (load.quantity / truck.capacity) * 25,
        locationProximity: Math.max(
          0,
          20 - calculateDistance(truck.currentPosition, load.origin) / 10
        ),
        timeAvailability: 15,
        specialRequirements: 12,
        priceCompatibility: 8,
        driverRating: (truck.driverRating / 5) * 10,
      },
      status: ['Suggested', 'Accepted', 'Rejected'][Math.floor(Math.random() * 3)] as any,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
  });

// Analytics
export const mockAnalytics: LogisticsAnalytics = {
  totalLoads: mockLoads.length,
  activeLoads: mockLoads.filter(
    (l) => l.status === 'Pending' || l.status === 'Matched' || l.status === 'In Transit'
  ).length,
  completedLoads: mockLoads.filter((l) => l.status === 'Delivered').length,
  totalTrucks: mockTrucks.length,
  availableTrucks: mockTrucks.filter((t) => t.status === 'Available').length,
  matchRate: (mockMatches.filter((m) => m.status === 'Accepted').length / mockLoads.length) * 100,
  averageMatchTime: 45, // minutes
  totalRevenue: mockLoads
    .filter((l) => l.status === 'Delivered')
    .reduce((sum, l) => sum + l.priceOffer, 0),
  averageDistance: mockMatches.reduce((sum, m) => sum + m.distance, 0) / mockMatches.length,
  topRoutes: [
    { origin: 'Abidjan', destination: 'Yamoussoukro', frequency: 12 },
    { origin: 'Bouaké', destination: 'Korhogo', frequency: 8 },
    { origin: 'San-Pédro', destination: 'Abidjan', frequency: 15 },
  ],
  topProducts: [
    { product: 'Cacao', volume: 450 },
    { product: 'Café', volume: 380 },
    { product: 'Maïs', volume: 620 },
  ],
  fleetEfficiency: 87, // 87%
  co2TotalSaved: 12500, // kg
};

// IoT Alerts Generation
export const mockIoTAlerts: IoTAlert[] = [
  // Generate Vehicle/IoT Alerts
  ...Array.from({ length: 12 }, (_, i) => {
    const truck = mockTrucks[Math.floor(Math.random() * mockTrucks.length)];
    const types: IoTAlert['type'][] = ['Engine', 'Tire', 'Temperature', 'Fuel'];
    const type = types[Math.floor(Math.random() * types.length)];

    let severity: IoTAlert['severity'] = 'info';
    if (type === 'Engine') severity = 'critical';
    if (type === 'Tire' || type === 'Temperature') severity = 'warning';

    // Sync Truck Status if critical
    if (severity === 'critical') {
      truck.status = 'Maintenance';
    }

    return {
      id: `ALERT-${String(i + 1).padStart(4, '0')}`,
      truckId: truck.id,
      truckPlate: truck.licensePlate,
      category: type === 'Temperature' ? 'IoT' : 'Vehicle',
      severity,
      type,
      message:
        type === 'Engine'
          ? 'Surchauffe moteur détectée'
          : type === 'Tire'
            ? 'Pression anormale pneu AG'
            : type === 'Temperature'
              ? 'Rupture chaîne de froid'
              : 'Niveau carburant bas',
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Open',
    } as IoTAlert;
  }),
  // Generate System Alerts
  ...Array.from({ length: 5 }, (_, i) => {
    return {
      id: `SYS-${String(i + 1).padStart(4, '0')}`,
      category: 'System',
      severity: 'info',
      type: 'Match',
      message: 'Nouveau chargement compatible détecté pour la zone Abidjan',
      timestamp: new Date(Date.now() - Math.random() * 4 * 60 * 60 * 1000).toISOString(),
      status: 'Open',
    } as IoTAlert;
  }),
];

// Predictive Data Generation (Last 7 days + Next 7 days)
export const mockPredictiveData: PredictiveData[] = Array.from({ length: 14 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 7 + i);

  // Trend: Slight increase
  const baseDemand = 40 + i * 2;
  const baseSupply = 45 + Math.sin(i) * 5;

  return {
    date: date.toISOString().split('T')[0],
    demand: Math.round(baseDemand + Math.random() * 10),
    supply: Math.round(baseSupply + Math.random() * 10),
    priceIndex: 100 + (baseDemand / baseSupply - 1) * 20,
  };
});

// Export des fonctions utilitaires
export { calculateAIMatchScore, calculateDistance };
