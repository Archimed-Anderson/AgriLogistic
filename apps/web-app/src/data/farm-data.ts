export interface FarmPlot {
  id: string;
  name: string;
  crop: string; // Culture
  variety: string;
  stage: string; // Stade phénologique
  area: number; // Hectares
  plantingDate: string;
  harvestPrognosis: string;
  healthScore: number; // 0-100 (NDVI-like)
  moisture: number; // % Humidité du sol
  image: string;
  coordinates: [number, number]; // [lat, lon]
  status: 'optimal' | 'warning' | 'critical';
  alerts: number;
}

export interface WeatherData {
  location: string;
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: {
    day: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
    rainProb: number;
  }[];
}

export interface FarmArticle {
  id: string;
  title: string;
  excerpt: string;
  category: 'Technologie' | 'Innovation' | 'Tutoriel' | 'Marché' | 'Bio' | 'Économie'; // Union type for better filtering
  readTime: string;
  imageUrl: string;
  author: string;
  date: string;
  sourceUrl: string;
  featured?: boolean;
}

export interface FarmVideo {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId: string;
  duration: string;
}

// Données des Parcelles (Plots)
export const farmPlots: FarmPlot[] = [
  {
    id: 'PLOT-A-001',
    name: 'Parcelle Nord - Maïs',
    crop: 'Maïs',
    variety: 'Maïs Hybride F1',
    stage: 'Floraison',
    area: 2.5,
    plantingDate: '2025-11-15',
    harvestPrognosis: 'Février 2026',
    healthScore: 90, // Excellent
    moisture: 45, // %
    image:
      'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop',
    coordinates: [5.36, -4.0083], // Zone Abidjan
    status: 'optimal',
    alerts: 0,
  },
  {
    id: 'PLOT-B-045',
    name: 'Serre Tomates - B',
    crop: 'Tomates',
    variety: 'Cœur de Bœuf',
    stage: 'Récolte',
    area: 0.8,
    plantingDate: '2025-10-01',
    harvestPrognosis: 'En cours',
    healthScore: 75, // Moyen
    moisture: 60, // %
    image:
      'https://images.unsplash.com/photo-1524334228333-0f6db392f8a1?q=80&w=800&auto=format&fit=crop',
    coordinates: [5.365, -4.01],
    status: 'warning',
    alerts: 2,
  },
  {
    id: 'PLOT-C-102',
    name: 'Plantation Cacao',
    crop: 'Cacao',
    variety: 'Forastero',
    stage: 'Végétatif',
    area: 15.0,
    plantingDate: '2020-05-20',
    harvestPrognosis: 'Novembre 2026',
    healthScore: 95, // Excellent
    moisture: 80, // %
    image:
      'https://images.unsplash.com/photo-1549419149-c12c3f875e54?q=80&w=800&auto=format&fit=crop',
    coordinates: [6.8276, -5.2893], // Zone Yamoussoukro
    status: 'optimal',
    alerts: 0,
  },
];

// Données Météo (Abidjan / Yamoussoukro)
export const farmWeather: WeatherData = {
  location: 'Yamoussoukro, CI',
  current: {
    temp: 28,
    condition: 'Partiellement nuageux',
    humidity: 72,
    windSpeed: 12, // km/h
  },
  forecast: [
    {
      day: "Aujourd'hui",
      tempHigh: 31,
      tempLow: 24,
      condition: 'Orageux',
      rainProb: 65,
    },
    {
      day: 'Demain',
      tempHigh: 30,
      tempLow: 23,
      condition: 'Nuageux',
      rainProb: 30,
    },
    {
      day: 'Mercredi',
      tempHigh: 32,
      tempLow: 24,
      condition: 'Ensoleillé',
      rainProb: 10,
    },
  ],
};

// Contenu Éditorial "Vrai" (Source: World Bank, FAO, CTA)
export const farmArticles: FarmArticle[] = [
  {
    id: 'ART-001',
    title: "L'Agriculture de Précision en Afrique de l'Ouest",
    excerpt:
      "Dossier Complet : Comment les capteurs IoT et les drones transforment les petites exploitations familiales en Côte d'Ivoire.",
    category: 'Innovation',
    readTime: '8 min',
    imageUrl:
      'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800&auto=format&fit=crop', // Drone
    author: 'Tech Afrique',
    date: '29 Jan 2026',
    sourceUrl: 'https://www.cta.int/en/digitalization',
    featured: true,
  },
  {
    id: 'ART-002',
    title: "Guide : Installer son premier système d'irrigation solaire",
    excerpt:
      "Tutoriel étape par étape pour réduire vos coûts énergétiques et optimiser l'utilisation de l'eau pendant la saison sèche.",
    category: 'Tutoriel',
    readTime: '12 min',
    imageUrl:
      'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=800&auto=format&fit=crop', // Irrigation
    author: 'AgriTuto',
    date: '25 Jan 2026',
    sourceUrl: '#',
  },
  {
    id: 'ART-003',
    title: 'Marché du Cacao 2026 : Tendances et Prévisions',
    excerpt:
      'Analyse des prix bord champ et impact des nouvelles régulations européennes sur la traçabilité.',
    category: 'Marché',
    readTime: '5 min',
    imageUrl:
      'https://images.unsplash.com/photo-1615811361269-669f444d99ad?q=80&w=800&auto=format&fit=crop', // Cocoa
    author: 'Le Marché Vert',
    date: '22 Jan 2026',
    sourceUrl: '#',
  },
  {
    id: 'ART-004',
    title: 'Innovation : Des bio-pesticides à base de Neem',
    excerpt:
      'Une alternative écologique et économique pour protéger vos cultures maraîchères contre les ravageurs.',
    category: 'Bio',
    readTime: '6 min',
    imageUrl:
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop', // Plants/Neem
    author: 'BioIvoire',
    date: '20 Jan 2026',
    sourceUrl: '#',
  },
  {
    id: 'ART-005',
    title: 'Comment financer vos équipements agricoles ?',
    excerpt:
      'Les nouvelles solutions de micro-crédit digital disponibles pour les agriculteurs ivoiriens en 2026.',
    category: 'Marché',
    readTime: '7 min',
    imageUrl:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop', // Finance/Money
    author: 'FinAgri',
    date: '18 Jan 2026',
    sourceUrl: '#',
  },
  {
    id: 'ART-006',
    title: 'Rotation des cultures : Maximiser la fertilité des sols',
    excerpt:
      'Techniques anciennes et modernes pour préserver la santé de vos sols sans engrais chimiques excessifs.',
    category: 'Bio',
    readTime: '9 min',
    imageUrl:
      'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=800&auto=format&fit=crop', // Aerial field
    author: 'EcoTerre',
    date: '15 Jan 2026',
    sourceUrl: '#',
  },
  {
    id: 'ART-007',
    title: 'Robotique Agricole : Ce qui change en 2026',
    excerpt: 'Découverte des petits robots désherbeurs autonomes adaptés aux cultures tropicales.',
    category: 'Innovation',
    readTime: '6 min',
    imageUrl:
      'https://images.unsplash.com/photo-1628135899933-7255aa0df67f?q=80&w=800&auto=format&fit=crop', // Robot/Tech
    author: 'FuturAgri',
    date: '12 Jan 2026',
    sourceUrl: '#',
  },
  {
    id: 'ART-008',
    title: 'Tutoriel : Créer son propre compost organique',
    excerpt: 'Transformez vos déchets agricoles en or noir pour vos plantations. Guide complet.',
    category: 'Tutoriel',
    readTime: '15 min',
    imageUrl:
      'https://images.unsplash.com/photo-1584450150058-2082faecbd24?q=80&w=800&auto=format&fit=crop', // Compost/Soil
    author: 'AgriTuto',
    date: '10 Jan 2026',
    sourceUrl: '#',
  },
];

// Liens Vidéos
export const farmVideos: FarmVideo[] = [
  {
    id: 'VID-001',
    title: 'Pourquoi digitaliser votre ferme ?',
    thumbnail:
      'https://images.unsplash.com/photo-1594771804886-715c0e2136e6?q=80&w=800&auto=format&fit=crop',
    // Smart Farming (Generic)
    youtubeId: '7885M6I5qgE',
    duration: '5:20',
  },
  {
    id: 'VID-002',
    title: 'Démo Capteurs AgriDeep',
    thumbnail:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
    youtubeId: 'xZ4U3d8o8rU',
    duration: '3:45',
  },
];
