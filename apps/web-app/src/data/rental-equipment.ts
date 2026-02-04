/**
 * RENTAL EQUIPMENT DATA - Plateforme Loueur
 *
 * Dataset complet pour location et vente de matériel agricole et de construction
 * B2B/B2C marketplace
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type EquipmentCategory =
  | 'TRACTEURS_ENGINS' // Tracteurs, Moissonneuses, Chargeurs
  | 'MACHINES_TRAITEMENT' // Couveuses, Trieuses, Décortiqueuses
  | 'MAINTENANCE_NETTOYAGE' // Désherbage, Broyeurs, Pulvérisateurs
  | 'MATERIAUX_CONSTRUCTION'; // Presse à briques, Malaxeurs, Compresseurs

export type EquipmentType = 'LOCATION' | 'VENTE' | 'LOCATION_VENTE';

export type EquipmentAvailability = 'DISPONIBLE' | 'LOUE' | 'VENDU' | 'MAINTENANCE';

export interface EquipmentSpecs {
  power?: string; // Puissance (ex: "120 CV", "15 kW")
  weight?: string; // Poids (ex: "3500 kg")
  capacity?: string; // Capacité (ex: "5000 L", "500 briques/h")
  dimensions?: string; // Dimensions (ex: "4.5m × 2.2m × 2.8m")
  fuelType?: string; // Carburant (ex: "Diesel", "Électrique")
  yearBuilt?: number; // Année de fabrication
  brand?: string; // Marque
  model?: string; // Modèle
  certification?: string; // Certification (ex: "CE", "ISO 9001")
}

export interface RentalEquipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  type: EquipmentType;

  // Pricing
  price?: number; // Prix de vente (€)
  dailyRate?: number; // Tarif journalier location (€/jour)
  weeklyRate?: number; // Tarif hebdomadaire (€/semaine)
  monthlyRate?: number; // Tarif mensuel (€/mois)
  deposit?: number; // Caution (€)

  // Availability
  availability: EquipmentAvailability;
  nextAvailableDate?: string; // Prochaine date de disponibilité (ISO 8601)

  // Media
  image: string; // URL image principale (Unsplash)
  images?: string[]; // Galerie d'images

  // Details
  description: string; // Description complète
  specs: EquipmentSpecs; // Spécifications techniques

  // SEO & Metadata
  tags: string[]; // Tags pour recherche
  seoTitle?: string; // Titre SEO
  seoDescription?: string; // Description SEO
  seoKeywords?: string[]; // Mots-clés SEO
  featured?: boolean; // Équipement mis en avant
  discount?: number; // Réduction en % (pour promotions)

  // Stats
  timesRented?: number; // Nombre de locations
  rating?: number; // Note moyenne (0-5)
  reviews?: number; // Nombre d'avis
}

// ============================================================================
// DATASET - 25 ÉQUIPEMENTS
// ============================================================================

export const rentalEquipmentData: RentalEquipment[] = [
  // ==================== TRACTEURS & ENGINS LOURDS (8) ====================
  {
    id: 'eq-001',
    name: 'Tracteur John Deere 6M Series',
    category: 'TRACTEURS_ENGINS',
    type: 'LOCATION_VENTE',
    price: 85000,
    dailyRate: 150,
    weeklyRate: 900,
    monthlyRate: 3000,
    deposit: 2000,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop&q=80&auto=format', // Tractor field
    description:
      'Tracteur polyvalent de 120 CV, idéal pour labour, semis et travaux de manutention. État impeccable, révision complète effectuée.',
    specs: {
      power: '120 CV',
      weight: '4200 kg',
      fuelType: 'Diesel',
      yearBuilt: 2020,
      brand: 'John Deere',
      model: '6120M',
      certification: 'CE',
    },
    tags: ['tracteur', 'agriculture', 'labour', 'john deere', 'polyvalent'],
    featured: true,
    timesRented: 47,
    rating: 4.8,
    reviews: 23,
  },
  {
    id: 'eq-002',
    name: 'Moissonneuse-batteuse New Holland CR8.80',
    category: 'TRACTEURS_ENGINS',
    type: 'LOCATION',
    dailyRate: 800,
    weeklyRate: 5000,
    monthlyRate: undefined,
    deposit: 10000,
    availability: 'DISPONIBLE',
    nextAvailableDate: '2026-02-15T00:00:00Z',
    image:
      'https://images.unsplash.com/photo-1625246394753-b1e36fa03763?w=1200&h=800&fit=crop&q=80&auto=format', // Combine harvester
    description:
      'Moissonneuse-batteuse haute performance pour céréales. Capacité de trémie 10 500 L. Disponible pour saison de récolte.',
    specs: {
      power: '435 CV',
      weight: '15800 kg',
      capacity: '10500 L trémie',
      fuelType: 'Diesel',
      yearBuilt: 2019,
      brand: 'New Holland',
      model: 'CR8.80',
      certification: 'CE',
    },
    tags: ['moissonneuse', 'batteuse', 'récolte', 'céréales', 'new holland'],
    featured: true,
    timesRented: 18,
    rating: 4.9,
    reviews: 12,
  },
  {
    id: 'eq-003',
    name: 'Chargeur sur pneus Caterpillar 938M',
    category: 'TRACTEURS_ENGINS',
    type: 'LOCATION',
    dailyRate: 250,
    weeklyRate: 1500,
    monthlyRate: 5000,
    deposit: 3000,
    availability: 'LOUE',
    nextAvailableDate: '2026-02-10T00:00:00Z',
    image:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop&q=80&auto=format', // Wheel loader
    description:
      'Chargeur compact pour manutention et terrassement. Godet de 2,3 m³. Parfait pour chantiers agricoles et construction.',
    specs: {
      power: '152 CV',
      weight: '11500 kg',
      capacity: '2.3 m³ godet',
      fuelType: 'Diesel',
      yearBuilt: 2021,
      brand: 'Caterpillar',
      model: '938M',
    },
    tags: ['chargeur', 'terrassement', 'manutention', 'caterpillar', 'godet'],
    timesRented: 34,
    rating: 4.7,
    reviews: 18,
  },
  {
    id: 'eq-004',
    name: 'Mini-pelle Kubota KX080-4',
    category: 'TRACTEURS_ENGINS',
    type: 'LOCATION',
    dailyRate: 120,
    weeklyRate: 700,
    monthlyRate: 2200,
    deposit: 1500,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=800&fit=crop&q=80&auto=format', // Excavator
    description:
      'Mini-pelle 8 tonnes pour travaux de terrassement, drainage et fondations. Très maniable, idéale pour espaces restreints.',
    specs: {
      power: '55 CV',
      weight: '8000 kg',
      capacity: '0.28 m³ godet',
      dimensions: '6.2m × 2.3m × 2.6m',
      fuelType: 'Diesel',
      yearBuilt: 2022,
      brand: 'Kubota',
      model: 'KX080-4',
    },
    tags: ['pelle', 'terrassement', 'drainage', 'kubota', 'mini-pelle'],
    timesRented: 56,
    rating: 4.6,
    reviews: 29,
  },
  {
    id: 'eq-005',
    name: 'Tracteur Massey Ferguson 5710',
    category: 'TRACTEURS_ENGINS',
    type: 'VENTE',
    price: 65000,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=1200&h=800&fit=crop&q=80&auto=format', // Tractor aerial
    description:
      'Tracteur agricole 95 CV avec cabine climatisée. Excellent état, 1200 heures au compteur. Idéal exploitation moyenne.',
    specs: {
      power: '95 CV',
      weight: '3800 kg',
      fuelType: 'Diesel',
      yearBuilt: 2021,
      brand: 'Massey Ferguson',
      model: '5710',
    },
    tags: ['tracteur', 'massey ferguson', 'agriculture', 'occasion'],
    rating: 4.5,
    reviews: 8,
  },
  {
    id: 'eq-006',
    name: 'Chargeuse-pelleteuse JCB 3CX',
    category: 'TRACTEURS_ENGINS',
    type: 'LOCATION_VENTE',
    price: 72000,
    dailyRate: 180,
    weeklyRate: 1100,
    monthlyRate: 3800,
    deposit: 2500,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1572981889563-c82f1f6d5dd0?w=1200&h=800&fit=crop&q=80&auto=format', // Construction equipment
    description:
      'Équipement 2-en-1: chargeur frontal et pelle arrière. Polyvalence maximale pour tout type de chantier.',
    specs: {
      power: '109 CV',
      weight: '8500 kg',
      capacity: '1.0 m³ (godet chargeur) / 0.26 m³ (godet pelle)',
      fuelType: 'Diesel',
      yearBuilt: 2020,
      brand: 'JCB',
      model: '3CX',
    },
    tags: ['chargeuse', 'pelleteuse', 'jcb', '2-en-1', 'polyvalent'],
    featured: true,
    timesRented: 41,
    rating: 4.8,
    reviews: 21,
  },
  {
    id: 'eq-007',
    name: 'Télescopique Manitou MLT 625',
    category: 'TRACTEURS_ENGINS',
    type: 'LOCATION',
    dailyRate: 200,
    weeklyRate: 1200,
    monthlyRate: 4000,
    deposit: 2000,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=1200&h=800&fit=crop&q=80&auto=format', // Telehandler
    description:
      'Chariot télescopique agricole. Hauteur de levage 6m, capacité 2500 kg. Parfait pour stockage et manutention.',
    specs: {
      power: '75 CV',
      weight: '5200 kg',
      capacity: '2500 kg à 6m',
      fuelType: 'Diesel',
      yearBuilt: 2021,
      brand: 'Manitou',
      model: 'MLT 625',
    },
    tags: ['télescopique', 'manutention', 'manitou', 'levage', 'stockage'],
    timesRented: 38,
    rating: 4.7,
    reviews: 19,
  },
  {
    id: 'eq-008',
    name: 'Bulldozer Komatsu D51',
    category: 'TRACTEURS_ENGINS',
    type: 'LOCATION',
    dailyRate: 350,
    weeklyRate: 2100,
    monthlyRate: 7000,
    deposit: 5000,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=1200&h=800&fit=crop&q=80&auto=format', // Bulldozer
    description:
      'Bulldozer chenillé pour gros travaux de terrassement et nivellement. Lame droite 3,4m. Location minimum 1 semaine.',
    specs: {
      power: '105 CV',
      weight: '11200 kg',
      capacity: '3.4m lame',
      fuelType: 'Diesel',
      yearBuilt: 2019,
      brand: 'Komatsu',
      model: 'D51PX-22',
    },
    tags: ['bulldozer', 'terrassement', 'komatsu', 'nivellement', 'chenilles'],
    timesRented: 22,
    rating: 4.6,
    reviews: 14,
  },

  // ==================== MACHINES DE TRAITEMENT (6) ====================
  {
    id: 'eq-009',
    name: 'Couveuse Automatique Brinsea OvaEasy 190',
    category: 'MACHINES_TRAITEMENT',
    type: 'VENTE',
    price: 4500,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1200&h=800&fit=crop&q=80&auto=format', // Farming equipment
    description:
      'Couveuse professionnelle automatique 190 œufs. Retournement automatique, contrôle température et humidité digital.',
    specs: {
      capacity: '190 œufs',
      power: '150 W',
      dimensions: '71cm × 48cm × 30cm',
      brand: 'Brinsea',
      model: 'OvaEasy 190 Advance',
      certification: 'CE',
    },
    tags: ['couveuse', 'aviculture', 'automatique', 'œufs', 'élevage'],
    rating: 4.9,
    reviews: 45,
  },
  {
    id: 'eq-010',
    name: 'Trieuse à Grains Petkus K531',
    category: 'MACHINES_TRAITEMENT',
    type: 'LOCATION_VENTE',
    price: 18500,
    dailyRate: 80,
    weeklyRate: 480,
    monthlyRate: 1600,
    deposit: 1000,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=800&fit=crop&q=80&auto=format', // Grain processing
    description:
      'Nettoyeuse-trieuse pour céréales et légumineuses. Débit 5 tonnes/heure. Séparation par densité et calibre.',
    specs: {
      capacity: '5000 kg/h',
      power: '7.5 kW',
      dimensions: '2.8m × 1.2m × 2.1m',
      weight: '850 kg',
      fuelType: 'Électrique',
      brand: 'Petkus',
      model: 'K531',
    },
    tags: ['trieuse', 'grains', 'céréales', 'nettoyage', 'tri'],
    timesRented: 29,
    rating: 4.7,
    reviews: 16,
  },
  {
    id: 'eq-011',
    name: 'Décortiqueuse de Riz Engelberg',
    category: 'MACHINES_TRAITEMENT',
    type: 'VENTE',
    price: 8900,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1536304929831-ee1ca9d10249?w=1200&h=800&fit=crop&q=80&auto=format', // Rice processing
    description:
      'Décortiqueuse professionnelle pour riz paddy. Rendement 500-800 kg/h avec taux de brisure minimal.',
    specs: {
      capacity: '500-800 kg/h',
      power: '15 CV',
      dimensions: '1.5m × 0.8m × 1.4m',
      weight: '420 kg',
      fuelType: 'Diesel ou Électrique',
      model: 'Engelberg EC-500',
    },
    tags: ['décortiqueuse', 'riz', 'transformation', 'paddy', 'céréales'],
    rating: 4.8,
    reviews: 34,
  },
  {
    id: 'eq-012',
    name: 'Presse à Huile Zhengzhou 6YL-120',
    category: 'MACHINES_TRAITEMENT',
    type: 'LOCATION_VENTE',
    price: 12000,
    dailyRate: 60,
    weeklyRate: 360,
    monthlyRate: 1200,
    deposit: 800,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=1200&h=800&fit=crop&q=80&auto=format', // Oil press machinery
    description:
      "Extracteur d'huile multi-graines (arachide, tournesol, soja). Capacité 200 kg/h. Système de filtrage intégré.",
    specs: {
      capacity: '200 kg/h',
      power: '11 kW',
      weight: '900 kg',
      dimensions: '1.9m × 0.75m × 1.6m',
      fuelType: 'Électrique',
      brand: 'Zhengzhou',
      model: '6YL-120',
    },
    tags: ['presse', 'huile', 'extraction', 'arachide', 'tournesol'],
    timesRented: 31,
    rating: 4.6,
    reviews: 18,
  },
  {
    id: 'eq-013',
    name: 'Séchoir à Maïs Riela GTR 1800',
    category: 'MACHINES_TRAITEMENT',
    type: 'LOCATION',
    dailyRate: 120,
    weeklyRate: 720,
    monthlyRate: 2400,
    deposit: 1500,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=800&fit=crop&q=80&auto=format', // Drying equipment
    description:
      'Séchoir mobile à grains. Capacité 18 tonnes. Brûleur gaz propane. Ventilation ajustable.',
    specs: {
      capacity: '18000 kg',
      power: '25 kW + Brûleur 250 kW',
      fuelType: 'Gaz propane',
      dimensions: '6m × 2.5m × 3.2m',
      brand: 'Riela',
      model: 'GTR 1800',
    },
    tags: ['séchoir', 'maïs', 'grains', 'séchage', 'récolte'],
    featured: true,
    timesRented: 24,
    rating: 4.7,
    reviews: 15,
  },
  {
    id: 'eq-014',
    name: 'Ensacheuse Automatique FAWEMA 450',
    category: 'MACHINES_TRAITEMENT',
    type: 'VENTE',
    price: 22000,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200&h=800&fit=crop&q=80&auto=format', // Packaging machine
    description:
      "Machine d'ensachage automatique pour sacs 5-50 kg. Pesée électronique, cadence 12 sacs/minute.",
    specs: {
      capacity: '12 sacs/min (5-50 kg)',
      power: '5.5 kW',
      weight: '650 kg',
      dimensions: '2.4m × 1.1m × 2.2m',
      fuelType: 'Électrique',
      brand: 'FAWEMA',
      model: '450 PRO',
    },
    tags: ['ensacheuse', 'conditionnement', 'automatique', 'pesée', 'emballage'],
    rating: 4.8,
    reviews: 27,
  },

  // ==================== MAINTENANCE & NETTOYAGE (5) ====================
  {
    id: 'eq-015',
    name: 'Désherbeur Thermique Ripagreen RPGT-4',
    category: 'MAINTENANCE_NETTOYAGE',
    type: 'LOCATION_VENTE',
    price: 6800,
    dailyRate: 45,
    weeklyRate: 270,
    monthlyRate: 900,
    deposit: 500,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=800&fit=crop&q=80&auto=format', // Farming field
    description:
      'Désherbeur thermique à gaz pour désherbage écologique grande surface. 4 brûleurs orientables.',
    specs: {
      power: '140 kW (4x35 kW)',
      capacity: 'Largeur 1.2m',
      fuelType: 'Gaz propane',
      weight: '180 kg',
      brand: 'Ripagreen',
      model: 'RPGT-4',
    },
    tags: ['désherbeur', 'thermique', 'écologique', 'gaz', 'désherbage'],
    timesRented: 52,
    rating: 4.7,
    reviews: 31,
  },
  {
    id: 'eq-016',
    name: 'Broyeur de Branches GreenMech Arbtrak 150',
    category: 'MAINTENANCE_NETTOYAGE',
    type: 'LOCATION',
    dailyRate: 90,
    weeklyRate: 540,
    monthlyRate: 1800,
    deposit: 1000,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=800&fit=crop&q=80&auto=format', // Wood chipper
    description:
      'Broyeur forestier remorquable. Diamètre max 150mm. Goulotte orientable 360°. Idéal élagage et entretien.',
    specs: {
      capacity: 'Branches Ø 150mm max',
      power: '25 CV',
      weight: '850 kg',
      fuelType: 'Diesel',
      brand: 'GreenMech',
      model: 'Arbtrak 150',
    },
    tags: ['broyeur', 'branches', 'élagage', 'forestier', 'bois'],
    timesRented: 67,
    rating: 4.8,
    reviews: 42,
  },
  {
    id: 'eq-017',
    name: 'Pulvérisateur Trainé Kuhn Metris 4102',
    category: 'MAINTENANCE_NETTOYAGE',
    type: 'LOCATION',
    dailyRate: 100,
    weeklyRate: 600,
    monthlyRate: 2000,
    deposit: 1200,
    availability: 'LOUE',
    nextAvailableDate: '2026-02-12T00:00:00Z',
    image:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop&q=80&auto=format', // Sprayer
    description:
      'Pulvérisateur traîné 2000L, rampe 18m. Régulation électronique, GPS compatible. Pour grandes cultures.',
    specs: {
      capacity: '2000 L',
      power: 'Rampe 18m',
      weight: '1800 kg',
      brand: 'Kuhn',
      model: 'Metris 4102',
    },
    tags: ['pulvérisateur', 'traitement', 'phytosanitaire', 'rampe', 'kuhn'],
    timesRented: 43,
    rating: 4.6,
    reviews: 25,
  },
  {
    id: 'eq-018',
    name: 'Nettoyeur Haute Pression Kärcher HD 10/25-4 S',
    category: 'MAINTENANCE_NETTOYAGE',
    type: 'LOCATION_VENTE',
    price: 3200,
    dailyRate: 25,
    weeklyRate: 150,
    monthlyRate: 500,
    deposit: 300,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1581093458791-9d42e31e9770?w=1200&h=800&fit=crop&q=80&auto=format', // Pressure washer
    description:
      'Nettoyeur haute pression professionnel eau froide. 250 bars, 1000 L/h. Pour lavage matériel agricole.',
    specs: {
      power: '250 bars / 1000 L/h',
      fuelType: 'Électrique 400V',
      weight: '95 kg',
      brand: 'Kärcher',
      model: 'HD 10/25-4 S',
    },
    tags: ['nettoyeur', 'haute pression', 'karcher', 'lavage', 'professionnel'],
    timesRented: 89,
    rating: 4.9,
    reviews: 56,
  },
  {
    id: 'eq-019',
    name: 'Balayeuse Autoportée Dulevo 1100',
    category: 'MAINTENANCE_NETTOYAGE',
    type: 'LOCATION',
    dailyRate: 80,
    weeklyRate: 480,
    monthlyRate: 1600,
    deposit: 800,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=1200&h=800&fit=crop&q=80&auto=format', // Sweeper
    description:
      'Balayeuse compacte pour cours, entrepôts et allées. Largeur balayage 1,1m, trémie 60L.',
    specs: {
      capacity: 'Largeur 1.1m / Trémie 60L',
      power: 'Batterie 12V',
      fuelType: 'Électrique',
      weight: '185 kg',
      brand: 'Dulevo',
      model: '1100',
    },
    tags: ['balayeuse', 'nettoyage', 'autoportée', 'cours', 'entrepôt'],
    timesRented: 36,
    rating: 4.5,
    reviews: 19,
  },

  // ==================== MATÉRIAUX DE CONSTRUCTION (6) ====================
  {
    id: 'eq-020',
    name: 'Presse à Briques Hydraulique QT4-40',
    category: 'MATERIAUX_CONSTRUCTION',
    type: 'VENTE',
    price: 28000,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1200&h=800&fit=crop&q=80&auto=format', // Brick making machine
    description:
      'Machine de fabrication de briques et pavés semi-automatique. Production 3600-4000 briques/jour. Moules interchangeables.',
    specs: {
      capacity: '3600-4000 briques/jour',
      power: '26 kW',
      dimensions: '4.5m × 2.8m × 2.6m',
      weight: '3200 kg',
      fuelType: 'Électrique + Hydraulique',
      model: 'QT4-40',
      certification: 'ISO 9001',
    },
    tags: ['presse', 'briques', 'pavés', 'construction', 'hydraulique'],
    featured: true,
    rating: 4.9,
    reviews: 38,
  },
  {
    id: 'eq-021',
    name: 'Malaxeur à Béton Imer Koine 35',
    category: 'MATERIAUX_CONSTRUCTION',
    type: 'LOCATION_VENTE',
    price: 4500,
    dailyRate: 35,
    weeklyRate: 210,
    monthlyRate: 700,
    deposit: 400,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=1200&h=800&fit=crop&q=80&auto=format', // Concrete mixer
    description:
      'Bétonnière professionnelle 350L basculante. Moteur électrique triphasé. Châssis renforcé.',
    specs: {
      capacity: '350 L',
      power: '2.2 kW',
      fuelType: 'Électrique 380V',
      weight: '165 kg',
      brand: 'Imer',
      model: 'Koine 35',
    },
    tags: ['malaxeur', 'béton', 'bétonnière', 'construction', 'mortier'],
    timesRented: 124,
    rating: 4.7,
    reviews: 68,
  },
  {
    id: 'eq-022',
    name: 'Compresseur Atlas Copco XAS 185',
    category: 'MATERIAUX_CONSTRUCTION',
    type: 'LOCATION',
    dailyRate: 75,
    weeklyRate: 450,
    monthlyRate: 1500,
    deposit: 800,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1572981889563-c82f1f6d5dd0?w=1200&h=800&fit=crop&q=80&auto=format', // Air compressor
    description:
      'Compresseur portable diesel 10 bars, débit 10,5 m³/min. Pour marteau-piqueur et outils pneumatiques.',
    specs: {
      capacity: '10.5 m³/min à 10 bars',
      power: '93 CV',
      fuelType: 'Diesel',
      weight: '1850 kg',
      brand: 'Atlas Copco',
      model: 'XAS 185',
    },
    tags: ['compresseur', 'air', 'pneumatique', 'diesel', 'portatif'],
    timesRented: 78,
    rating: 4.8,
    reviews: 45,
  },
  {
    id: 'eq-023',
    name: 'Niveleuse Laser Topcon RL-H5A',
    category: 'MATERIAUX_CONSTRUCTION',
    type: 'LOCATION_VENTE',
    price: 3800,
    dailyRate: 30,
    weeklyRate: 180,
    monthlyRate: 600,
    deposit: 300,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop&q=80&auto=format', // Laser level
    description:
      'Niveau laser rotatif auto-nivelant. Portée 800m diamètre. Précision ±1,5mm/30m. Coffret complet.',
    specs: {
      capacity: 'Portée 800m (Ø)',
      power: 'Batterie rechargeable',
      weight: '2.5 kg',
      brand: 'Topcon',
      model: 'RL-H5A',
      certification: 'IP66',
    },
    tags: ['niveau', 'laser', 'topographie', 'nivelage', 'précision'],
    timesRented: 91,
    rating: 4.9,
    reviews: 53,
  },
  {
    id: 'eq-024',
    name: 'Échafaudage Roulant Altrad Speedscaf',
    category: 'MATERIAUX_CONSTRUCTION',
    type: 'LOCATION',
    dailyRate: 40,
    weeklyRate: 240,
    monthlyRate: 800,
    deposit: 600,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&h=800&fit=crop&q=80&auto=format', // Scaffolding
    description:
      'Échafaudage mobile aluminium hauteur de travail 6m. Montage rapide sans outils. Plancher 1,35 × 2,46m.',
    specs: {
      capacity: 'Hauteur de travail 6m',
      dimensions: 'Plancher 1.35m × 2.46m',
      weight: '120 kg',
      brand: 'Altrad',
      model: 'Speedscaf 6m',
      certification: 'EN 1004',
    },
    tags: ['échafaudage', 'roulant', 'aluminium', 'hauteur', 'mobile'],
    timesRented: 156,
    rating: 4.6,
    reviews: 82,
  },
  {
    id: 'eq-025',
    name: 'Pompe à Chape Turbosol TCE 400',
    category: 'MATERIAUX_CONSTRUCTION',
    type: 'LOCATION',
    dailyRate: 85,
    weeklyRate: 510,
    monthlyRate: 1700,
    deposit: 900,
    availability: 'DISPONIBLE',
    image:
      'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1200&h=800&fit=crop&q=80&auto=format', // Screed pump
    description:
      'Pompe à chape liquide et mortier. Débit 40 L/min, hauteur de refoulement 50m. Pour sols et chapes.',
    specs: {
      capacity: '40 L/min',
      power: '4 kW',
      dimensions: 'Refoulement 50m hauteur',
      fuelType: 'Électrique 380V',
      weight: '210 kg',
      brand: 'Turbosol',
      model: 'TCE 400',
    },
    tags: ['pompe', 'chape', 'mortier', 'refoulement', 'construction'],
    timesRented: 48,
    rating: 4.7,
    reviews: 28,
  },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Obtenir statistiques globales
 */
export function getRentalStatistics() {
  const total = rentalEquipmentData.length;
  const available = rentalEquipmentData.filter((eq) => eq.availability === 'DISPONIBLE').length;
  const rented = rentalEquipmentData.filter((eq) => eq.availability === 'LOUE').length;
  const sold = rentalEquipmentData.filter((eq) => eq.availability === 'VENDU').length;

  const forRent = rentalEquipmentData.filter(
    (eq) => eq.type === 'LOCATION' || eq.type === 'LOCATION_VENTE'
  ).length;

  const forSale = rentalEquipmentData.filter(
    (eq) => eq.type === 'VENTE' || eq.type === 'LOCATION_VENTE'
  ).length;

  const avgRating =
    rentalEquipmentData.filter((eq) => eq.rating).reduce((sum, eq) => sum + (eq.rating || 0), 0) /
    rentalEquipmentData.filter((eq) => eq.rating).length;

  return {
    total,
    available,
    rented,
    sold,
    forRent,
    forSale,
    avgRating: Number(avgRating.toFixed(1)),
  };
}

/**
 * Filtrer par catégorie
 */
export function filterByCategory(category: EquipmentCategory) {
  return rentalEquipmentData.filter((eq) => eq.category === category);
}

/**
 * Filtrer par type (LOCATION/VENTE)
 */
export function filterByType(type: EquipmentType) {
  if (type === 'LOCATION') {
    return rentalEquipmentData.filter(
      (eq) => eq.type === 'LOCATION' || eq.type === 'LOCATION_VENTE'
    );
  }
  if (type === 'VENTE') {
    return rentalEquipmentData.filter((eq) => eq.type === 'VENTE' || eq.type === 'LOCATION_VENTE');
  }
  return rentalEquipmentData.filter((eq) => eq.type === type);
}

/**
 * Filtrer disponibles uniquement
 */
export function getAvailableEquipment() {
  return rentalEquipmentData.filter((eq) => eq.availability === 'DISPONIBLE');
}

/**
 * Recherche par mots-clés dans tags et nom
 */
export function searchEquipment(query: string) {
  const lowerQuery = query.toLowerCase();
  return rentalEquipmentData.filter(
    (eq) =>
      eq.name.toLowerCase().includes(lowerQuery) ||
      eq.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      eq.description.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Équipements en vedette
 */
export function getFeaturedEquipment() {
  return rentalEquipmentData.filter((eq) => eq.featured === true);
}

/**
 * Trier par note
 */
export function sortByRating(descending = true) {
  return [...rentalEquipmentData].sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    return descending ? ratingB - ratingA : ratingA - ratingB;
  });
}

/**
 * Trier par prix (location ou vente)
 */
export function sortByPrice(descending = false) {
  return [...rentalEquipmentData].sort((a, b) => {
    const priceA = a.price || a.dailyRate || 0;
    const priceB = b.price || b.dailyRate || 0;
    return descending ? priceB - priceA : priceA - priceB;
  });
}

/**
 * Obtenir par ID
 */
export function getEquipmentById(id: string) {
  return rentalEquipmentData.find((eq) => eq.id === id);
}

/**
 * Équipements recommandés (basé sur catégorie)
 */
export function getRecommendedEquipment(currentId: string, limit = 4) {
  const current = getEquipmentById(currentId);
  if (!current) return [];

  return rentalEquipmentData
    .filter(
      (eq) =>
        eq.id !== currentId && eq.category === current.category && eq.availability === 'DISPONIBLE'
    )
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit);
}
