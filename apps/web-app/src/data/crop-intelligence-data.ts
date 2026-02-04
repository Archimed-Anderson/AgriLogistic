/**
 * Crop Intelligence Data
 * Dataset pour la surveillance agricole par IA et données satellites
 */

export interface CropZone {
  id: string;
  zoneName: string;
  cropType: 'Maïs' | 'Cacao' | 'Blé' | 'Riz' | 'Café' | 'Manioc' | 'Coton' | 'Soja';
  healthScore: number; // 0-100
  estimatedYield: number; // tonnes/hectare
  lastScan: string; // ISO date
  satelliteImage: string; // Unsplash URL
  aiInsight: string;
  location: {
    region: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  area: number; // hectares
  weatherCondition: 'Ensoleillé' | 'Nuageux' | 'Pluvieux' | 'Sec';
  irrigationStatus: 'Optimal' | 'Insuffisant' | 'Excessif';
}

/**
 * Fonction helper pour déterminer le statut de santé
 */
export function getHealthStatus(score: number): {
  status: 'excellent' | 'good' | 'warning' | 'critical';
  color: string;
  label: string;
} {
  if (score >= 85) {
    return { status: 'excellent', color: 'text-emerald-600 bg-emerald-50', label: 'Excellent' };
  } else if (score >= 70) {
    return { status: 'good', color: 'text-green-600 bg-green-50', label: 'Bon' };
  } else if (score >= 50) {
    return { status: 'warning', color: 'text-orange-600 bg-orange-50', label: 'Attention' };
  } else {
    return { status: 'critical', color: 'text-red-600 bg-red-50', label: 'Critique' };
  }
}

/**
 * Dataset des zones agricoles surveillées
 */
export const cropZonesData: CropZone[] = [
  {
    id: 'zone-001',
    zoneName: 'Delta du Niger',
    cropType: 'Riz',
    healthScore: 92,
    estimatedYield: 4.8,
    lastScan: '2026-01-29T10:30:00Z',
    satelliteImage:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=800&fit=crop&q=80&auto=format', // Aerial farmland Africa
    aiInsight: 'Croissance optimale détectée. Irrigation efficace.',
    location: {
      region: 'Delta du Niger, Nigeria',
      coordinates: { lat: 5.5167, lng: 5.75 },
    },
    area: 1250,
    weatherCondition: 'Ensoleillé',
    irrigationStatus: 'Optimal',
  },
  {
    id: 'zone-002',
    zoneName: 'Plateau Bamiléké',
    cropType: 'Café',
    healthScore: 88,
    estimatedYield: 1.9,
    lastScan: '2026-01-29T09:15:00Z',
    satelliteImage:
      'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=1200&h=800&fit=crop',
    aiInsight: 'Croissance normale. Humidité du sol idéale.',
    location: {
      region: 'Ouest, Cameroun',
      coordinates: { lat: 5.4667, lng: 10.4167 },
    },
    area: 850,
    weatherCondition: 'Nuageux',
    irrigationStatus: 'Optimal',
  },
  {
    id: 'zone-003',
    zoneName: 'Vallée du Rift',
    cropType: 'Maïs',
    healthScore: 76,
    estimatedYield: 5.2,
    lastScan: '2026-01-29T08:45:00Z',
    satelliteImage:
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=800&fit=crop&q=80&auto=format', // Corn field drone view
    aiInsight: 'Légère décoloration détectée. Ajustement fertilisation recommandé.',
    location: {
      region: 'Rift Valley, Kenya',
      coordinates: { lat: -0.0236, lng: 37.9062 },
    },
    area: 2100,
    weatherCondition: 'Ensoleillé',
    irrigationStatus: 'Optimal',
  },
  {
    id: 'zone-004',
    zoneName: 'Bassin du Congo',
    cropType: 'Cacao',
    healthScore: 94,
    estimatedYield: 2.3,
    lastScan: '2026-01-29T11:20:00Z',
    satelliteImage:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&h=800&fit=crop&q=80&auto=format', // Tropical agriculture Africa
    aiInsight: 'Conditions parfaites. Ombrage optimal pour cacao.',
    location: {
      region: "Équateur, Côte d'Ivoire",
      coordinates: { lat: 6.5244, lng: -5.5471 },
    },
    area: 1680,
    weatherCondition: 'Pluvieux',
    irrigationStatus: 'Optimal',
  },
  {
    id: 'zone-005',
    zoneName: 'Plaine de la Bénoué',
    cropType: 'Coton',
    healthScore: 58,
    estimatedYield: 1.4,
    lastScan: '2026-01-28T16:50:00Z',
    satelliteImage:
      'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?w=1200&h=800&fit=crop&q=80&auto=format', // Cotton field aerial
    aiInsight: 'Stress hydrique détecté. Augmentation irrigation urgente recommandée.',
    location: {
      region: 'Nord, Cameroun',
      coordinates: { lat: 9.3, lng: 13.3833 },
    },
    area: 3200,
    weatherCondition: 'Sec',
    irrigationStatus: 'Insuffisant',
  },
  {
    id: 'zone-006',
    zoneName: 'Région des Grands Lacs',
    cropType: 'Blé',
    healthScore: 81,
    estimatedYield: 3.7,
    lastScan: '2026-01-29T07:30:00Z',
    satelliteImage:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop&q=80&auto=format', // Aerial view wheat field
    aiInsight: 'Développement régulier. Surveillance ravageurs active.',
    location: {
      region: 'Tanzanie',
      coordinates: { lat: -6.369, lng: 34.8888 },
    },
    area: 1890,
    weatherCondition: 'Ensoleillé',
    irrigationStatus: 'Optimal',
  },
  {
    id: 'zone-007',
    zoneName: 'Savane du Sahel',
    cropType: 'Manioc',
    healthScore: 45,
    estimatedYield: 8.2,
    lastScan: '2026-01-28T14:10:00Z',
    satelliteImage:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=800&fit=crop&q=80&auto=format', // Green landscape
    aiInsight: 'Maladie foliaire détectée. Traitement fongicide urgent requis.',
    location: {
      region: 'Sahel, Mali',
      coordinates: { lat: 17.5707, lng: -3.9962 },
    },
    area: 980,
    weatherCondition: 'Sec',
    irrigationStatus: 'Insuffisant',
  },
  {
    id: 'zone-008',
    zoneName: 'Hauts Plateaux Éthiopiens',
    cropType: 'Soja',
    healthScore: 86,
    estimatedYield: 2.9,
    lastScan: '2026-01-29T10:05:00Z',
    satelliteImage:
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&h=800&fit=crop&q=80&auto=format', // Agriculture technology drone
    aiInsight: 'Croissance vigoureuse. Taux de protéines optimal prévu.',
    location: {
      region: 'Amhara, Éthiopie',
      coordinates: { lat: 11.5967, lng: 37.3906 },
    },
    area: 1420,
    weatherCondition: 'Nuageux',
    irrigationStatus: 'Optimal',
  },
  {
    id: 'zone-009',
    zoneName: 'Plaine du Nil Blanc',
    cropType: 'Riz',
    healthScore: 72,
    estimatedYield: 4.1,
    lastScan: '2026-01-29T09:40:00Z',
    satelliteImage:
      'https://images.unsplash.com/photo-1492496913980-501348b61469?w=1200&h=800&fit=crop&q=80&auto=format', // Rice paddy aerial
    aiInsight: "Niveau d'eau variable détecté. Régulation recommandée.",
    location: {
      region: 'Nil Blanc, Soudan',
      coordinates: { lat: 15.5007, lng: 32.5599 },
    },
    area: 2750,
    weatherCondition: 'Ensoleillé',
    irrigationStatus: 'Excessif',
  },
  {
    id: 'zone-010',
    zoneName: 'Bassins de la Volta',
    cropType: 'Maïs',
    healthScore: 90,
    estimatedYield: 5.8,
    lastScan: '2026-01-29T11:55:00Z',
    satelliteImage:
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1200&h=800&fit=crop&q=80&auto=format', // Corn field technology
    aiInsight: 'Excellente croissance. Maturation dans les temps prévus.',
    location: {
      region: 'Brong-Ahafo, Ghana',
      coordinates: { lat: 7.9465, lng: -1.0232 },
    },
    area: 1650,
    weatherCondition: 'Pluvieux',
    irrigationStatus: 'Optimal',
  },
];

/**
 * Statistiques globales calculées
 */
export function getCropStatistics() {
  const totalZones = cropZonesData.length;
  const avgHealthScore =
    cropZonesData.reduce((sum, zone) => sum + zone.healthScore, 0) / totalZones;
  const totalArea = cropZonesData.reduce((sum, zone) => sum + zone.area, 0);
  const criticalZones = cropZonesData.filter((zone) => zone.healthScore < 50).length;
  const warningZones = cropZonesData.filter(
    (zone) => zone.healthScore >= 50 && zone.healthScore < 70
  ).length;
  const healthyZones = cropZonesData.filter((zone) => zone.healthScore >= 70).length;

  return {
    totalZones,
    avgHealthScore: Math.round(avgHealthScore),
    totalArea,
    criticalZones,
    warningZones,
    healthyZones,
    totalEstimatedYield: cropZonesData.reduce(
      (sum, zone) => sum + zone.estimatedYield * zone.area,
      0
    ),
  };
}

/**
 * Données d'évolution du rendement sur 6 mois (simulé)
 */
export interface YieldDataPoint {
  month: string;
  rendement: number; // tonnes/hectare
  prediction: number; // tonnes/hectare
}

export const yieldEvolutionData: YieldDataPoint[] = [
  { month: 'Août 2025', rendement: 6.2, prediction: 6.3 },
  { month: 'Sept 2025', rendement: 6.5, prediction: 6.4 },
  { month: 'Oct 2025', rendement: 6.4, prediction: 6.6 },
  { month: 'Nov 2025', rendement: 6.8, prediction: 6.7 },
  { month: 'Déc 2025', rendement: 6.6, prediction: 6.8 },
  { month: 'Jan 2026', rendement: 6.7, prediction: 6.9 },
];

/**
 * Interface pour les alertes critiques IA
 */
export interface CriticalAlert {
  id: string;
  zoneId: string;
  zoneName: string;
  severity: 'critical' | 'warning';
  type: 'disease' | 'water' | 'pest' | 'weather' | 'nutrient';
  message: string;
  detectedAt: string;
  actionRequired: string;
}

/**
 * Alertes critiques générées par l'IA
 */
export const criticalAlerts: CriticalAlert[] = [
  {
    id: 'alert-001',
    zoneId: 'zone-007',
    zoneName: 'Savane du Sahel',
    severity: 'critical',
    type: 'disease',
    message: 'Maladie foliaire détectée - Risque de mildiou',
    detectedAt: '2026-01-28T14:10:00Z',
    actionRequired: 'Application fongicide urgente recommandée dans les 24h',
  },
  {
    id: 'alert-002',
    zoneId: 'zone-005',
    zoneName: 'Plaine de la Bénoué',
    severity: 'critical',
    type: 'water',
    message: 'Stress hydrique sévère détecté',
    detectedAt: '2026-01-28T16:50:00Z',
    actionRequired: "Augmentation immédiate de l'irrigation",
  },
  {
    id: 'alert-003',
    zoneId: 'zone-009',
    zoneName: 'Plaine du Nil Blanc',
    severity: 'warning',
    type: 'water',
    message: "Niveau d'eau variable - Irrigation excessive",
    detectedAt: '2026-01-29T09:40:00Z',
    actionRequired: "Réguler le système d'irrigation pour éviter saturation du sol",
  },
  {
    id: 'alert-004',
    zoneId: 'zone-003',
    zoneName: 'Vallée du Rift',
    severity: 'warning',
    type: 'nutrient',
    message: 'Décoloration foliaire légère observée',
    detectedAt: '2026-01-29T08:45:00Z',
    actionRequired: 'Ajustement de la fertilisation azotée recommandé',
  },
];

/**
 * Obtenir les alertes par sévérité
 */
export function getAlertsBySeverity(severity?: 'critical' | 'warning') {
  if (!severity) return criticalAlerts;
  return criticalAlerts.filter((alert) => alert.severity === severity);
}
