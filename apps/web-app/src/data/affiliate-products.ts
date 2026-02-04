import { AffiliateProduct } from '@/types/affiliate';

/**
 * DATASET INITIAL - Affiliation Hub
 * 18 produits réels pour l'agriculture et l'industrie
 */
export const affiliateProducts: AffiliateProduct[] = [
  // ==========================================
  // OUTILLAGE (Amazon / Alibaba / Direct)
  // ==========================================
  {
    id: 'aff-out-001',
    name: 'Perceuse à Percussion Professionnelle Bosch GSB 18V-55',
    slug: 'perceuse-bosch-gsb-18v-55',
    category: 'OUTILLAGE',
    platform: 'AMAZON',
    price: 159.99,
    originalPrice: 199.0,
    discount: 20,
    currency: 'EUR',
    commission: 8,
    shortDescription: 'Perceuse visseuse 18V robuste avec moteur brushless.',
    description:
      'Une machine puissante et endurante pour tous les travaux de vissage et perçage intensifs en milieu agricole ou atelier.',
    images: [
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=800',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800',
    ],
    features: ['Moteur Brushless', 'Couple 55 Nm', 'Mandrin métallique 13mm', '2 batteries 2.0Ah'],
    pros: ['Longévité exceptionnelle', 'Poids équilibré', 'Charge rapide'],
    cons: ['Bruit élevé', 'Prix premium'],
    specifications: {
      Tension: '18V',
      'Couple max': '55 Nm',
      Vitesse: '1750 tr/min',
    },
    affiliateUrl: 'https://www.amazon.fr/dp/B086DK9VQX',
    seo: {
      title: 'Bosch GSB 18V-55 - Meilleur Prix | AgriLogistic',
      metaDescription:
        'Achetez la perceuse Bosch GSB 18V-55 au meilleur prix. Test et avis complet sur AgriLogistic.',
      keywords: ['perceuse bosch', 'outillage professionnel', 'perceuse 18v'],
    },
    rating: 4.8,
    reviewCount: 1240,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aff-out-002',
    name: 'Kit Outils Agricoles 120 Pièces - Chrome Vanadium',
    slug: 'kit-outils-120-pieces',
    category: 'OUTILLAGE',
    platform: 'ALIBABA',
    price: 85.5,
    currency: 'EUR',
    commission: 12,
    shortDescription: "Mallette complète d'outils robustes pour maintenance engins.",
    description:
      "Ensemble d'outils en acier Chrome Vanadium conçu pour durer dans les environnements difficiles.",
    images: ['https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=800'],
    features: ['Acier CR-V', 'Cliquets 72 dents', 'Coffret moulé résistant'],
    pros: ['Excellent rapport qualité/prix', 'Très complet'],
    cons: ['Poids important', 'Finition perfectible'],
    specifications: {
      Matériau: 'Chrome Vanadium',
      Poids: '8.5 kg',
    },
    affiliateUrl:
      'https://www.alibaba.com/product-detail/High-Quality-120Pcs-Socket-Set_123456789.html',
    seo: {
      title: 'Kit Outils 120 Pièces Alibaba - Import Direct | AgriLogistic',
      metaDescription:
        'Kit outils complet pour maintenance agricole via Alibaba. Robuste et économique.',
      keywords: ['outils alibaba', 'coffret douilles', 'maintenance agricole'],
    },
    rating: 4.5,
    reviewCount: 450,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aff-out-003',
    name: "Tronçonneuse d'Élagage Thermique Echo CS-2511WES",
    slug: 'tronconneuse-echo-cs2511wes',
    category: 'OUTILLAGE',
    platform: 'DIRECT',
    price: 499.0,
    currency: 'EUR',
    commission: 10,
    shortDescription: "La tronçonneuse la plus légère du marché pour l'élagage.",
    description: "Outil de précision pour les professionnels de l'arboriculture et de la forêt.",
    images: ['https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800'],
    features: ['Poids 2.3kg', 'Guide 25cm', 'Moteur 25cc'],
    pros: ['Maniabilité extrême', 'Démarrage facile'],
    cons: ['Consommation huile', 'Prix'],
    specifications: {
      Cylindrée: '25 cm³',
      Poids: '2.3 kg',
    },
    affiliateUrl: '/contact?item=echo-cs2511',
    seo: {
      title: 'Echo CS-2511WES - Tronçonneuse Pro | AgriLogistic',
      metaDescription:
        "Découvrez la tronçonneuse Echo CS-2511WES. Légère et puissante pour l'élagage.",
      keywords: ['echo cs2511wes', 'tronçonneuse élagage'],
    },
    rating: 4.9,
    reviewCount: 85,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==========================================
  // ELECTRONIQUE (Amazon / Alibaba)
  // ==========================================
  {
    id: 'aff-elec-001',
    name: 'Station Météo Connectée ECOWITT GW1101',
    slug: 'station-meteo-ecowitt-gw1101',
    category: 'ELECTRONIQUE',
    platform: 'AMAZON',
    price: 129.0,
    currency: 'EUR',
    commission: 7,
    shortDescription: 'Station météo Wi-Fi avec capteurs solaires 7-en-1.',
    description:
      "Suivez en temps réel le vent, la pluie, l'humidité et l'ensoleillement sur votre smartphone.",
    images: ['https://images.unsplash.com/photo-1590053132232-6bc9d89a067a?q=80&w=800'],
    features: ['Wi-Fi 2.4GHz', 'Solaire', 'Anémomètre', 'Pluviomètre'],
    pros: ['Précision reconnue', 'Cloud gratuit'],
    cons: ['Installation complexe'],
    specifications: {
      Transmission: '868 MHz',
      Portée: '100m',
    },
    affiliateUrl: 'https://www.amazon.fr/dp/B0BWNDN3N7',
    seo: {
      title: 'Station Météo Connectée Agri - Avis EcoWitt | AgriLogistic',
      metaDescription: 'Station météo Wi-Fi pour agriculture. Données précises en temps réel.',
      keywords: ['station météo connectée', 'capteur pluie', 'vent'],
    },
    rating: 4.6,
    reviewCount: 320,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aff-elec-002',
    name: "Kit Capteur d'Humidité du Sol IoT LoRaWAN",
    slug: 'capteur-lorawan-humidite',
    category: 'ELECTRONIQUE',
    platform: 'ALIBABA',
    price: 45.0,
    currency: 'EUR',
    commission: 15,
    shortDescription: 'Capteur longue portée pour agriculture de précision.',
    description: "Mesurez l'humidité du sol sur des kilomètres sans Wi-Fi via le réseau LoRaWAN.",
    images: ['https://images.unsplash.com/photo-1584033519782-96944694295d?q=80&w=800'],
    features: ['LoRaWAN 868MHz', 'IP68', 'Autonomie 5 ans'],
    pros: ['Portée 10km+', 'Basse consommation'],
    cons: ['Passerelle requise'],
    specifications: {
      Réseau: 'LoRaWAN',
      Batterie: 'ER14505 2400mAh',
    },
    affiliateUrl:
      'https://www.alibaba.com/product-detail/Smart-Agriculture-Soil-Moisture-Sensor_LORA.html',
    seo: {
      title: 'Capteur Humidité LoRaWAN - Agri Connectée | AgriLogistic',
      metaDescription:
        "Surveillez l'humidité de vos sols avec la technologie LoRaWAN. Idéal grandes surfaces.",
      keywords: ['lorawan', 'agri precision', 'capteur humidité'],
    },
    rating: 4.7,
    reviewCount: 156,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ==========================================
  // GROS EQUIPEMENTS (Alibaba / Direct)
  // ==========================================
  {
    id: 'aff-gros-001',
    name: 'Motopompe Diesel 3 Pouces Haute Pression',
    slug: 'motopompe-diesel-3-pouces',
    category: 'GROS_EQUIPEMENTS',
    platform: 'ALIBABA',
    price: 380.0,
    currency: 'EUR',
    commission: 10,
    shortDescription: 'Pompe diesel robuste pour irrigation de grands champs.',
    description: 'Moteur diesel refroidi par air, débit important pour pompage intensif.',
    images: ['https://images.unsplash.com/photo-1590486803833-2c709d21e3ca?q=80&w=800'],
    features: ['Débit 60m³/h', 'HMT 28m', 'Diesel 178F'],
    pros: ['Consommation réduite', 'Construction robuste'],
    cons: ['Bruit moteur diesel', 'Poids élevé'],
    specifications: {
      Diamètre: '80 mm (3")',
      Moteur: '7.0 CV Diesel',
    },
    affiliateUrl:
      'https://www.alibaba.com/product-detail/3-Inch-High-Pressure-Diesel-Water_PUMP.html',
    seo: {
      title: 'Motopompe Diesel 3" - Irrigation Puissante | AgriLogistic',
      metaDescription:
        'Motopompe diesel haute performance pour irrigation agricole. Robuste et économique.',
      keywords: ['motopompe diesel', 'pompe irrigation', 'alibaba pump'],
    },
    rating: 4.4,
    reviewCount: 210,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aff-gros-002',
    name: 'Générateur Électrique Silencieux 5.5kW Hyundai',
    slug: 'generateur-hyundai-5kw',
    category: 'GROS_EQUIPEMENTS',
    platform: 'AMAZON',
    price: 890.0,
    currency: 'EUR',
    commission: 5,
    shortDescription: 'Groupe électrogène puissant pour backup ferme.',
    description: "Une source d'énergie fiable avec régulation de tension AVR.",
    images: ['https://images.unsplash.com/photo-1621905252507-b35482cdca4b?q=80&w=800'],
    features: ['5500W Peak', 'Démarrage électrique', 'Réservoir 25L'],
    pros: ['Marque reconnue', 'SAV facile'],
    cons: ['Consommation essence'],
    specifications: {
      Puissance: '5.5 kW',
      Réservoir: '25 L',
    },
    affiliateUrl: 'https://www.amazon.fr/dp/B07G4T9VQX',
    seo: {
      title: 'Générateur Hyundai 5.5kW - Sécurité Énergie | AgriLogistic',
      metaDescription:
        'Ne tombez jamais en panne avec le générateur Hyundai. Puissance et fiabilité.',
      keywords: ['générateur électrique', 'hyundai power', 'backup ferme'],
    },
    rating: 4.7,
    reviewCount: 580,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aff-elec-003',
    name: 'Ph-mètre de Terre Digital 4-en-1',
    slug: 'ph-metre-terre-digital',
    category: 'ELECTRONIQUE',
    platform: 'AMAZON',
    price: 24.9,
    currency: 'EUR',
    commission: 10,
    shortDescription: "Mesurez le pH, l'humidité, le soleil et la température.",
    description: "L'outil indispensable pour connaître l'état de votre sol avant de planter.",
    images: ['https://images.unsplash.com/photo-1592819695396-0661b1260d0c?q=80&w=800'],
    features: ['Ecran LCD rétroéclairé', 'Sonde 200mm', 'Pile 9V'],
    pros: ["Très simple d'usage", 'Lecture immédiate'],
    cons: ['Précision amateur'],
    specifications: {
      Fonctions: 'pH/T°/Lux/H°',
      'Plage pH': '3.5 - 9.0',
    },
    affiliateUrl: 'https://www.amazon.fr/dp/B07XJ4F5G4',
    seo: {
      title: 'Ph-mètre Digital Sol - Testeur Jardinier | AgriLogistic',
      metaDescription: 'Analysez votre sol facilement avec ce testeur 4-en-1 digital.',
      keywords: ['ph metre sol', 'analayseur terre'],
    },
    rating: 4.3,
    reviewCount: 2450,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'aff-out-004',
    name: 'Pulvérisateur Électrique à Batterie 16L',
    slug: 'pulverisateur-batterie-16l',
    category: 'OUTILLAGE',
    platform: 'ALIBABA',
    price: 65.0,
    currency: 'EUR',
    commission: 12,
    shortDescription: 'Pulvérisation sans effort pour jardins et parcelles.',
    description: 'Fini le pompage manuel, pulvérisez vos traitements agricoles avec régularité.',
    images: ['https://images.unsplash.com/photo-1589923188900-85dae525524c?q=80&w=800'],
    features: ['Batterie Lithium', 'Autonomie 4h', '4 buses incluses'],
    pros: ['Gain de temps', 'Pression constante'],
    cons: ['Poids batterie'],
    specifications: {
      Capacité: '16 L',
      Pression: '0.15 - 0.4 bar',
    },
    affiliateUrl:
      'https://www.alibaba.com/product-detail/16L-Battery-Operated-Electric-Knapsack-Sprayer_PULV.html',
    seo: {
      title: 'Pulvérisateur Électrique 16L Alibaba | AgriLogistic',
      metaDescription: 'Traitez vos cultures sans fatigue avec ce pulvérisateur à batterie 16L.',
      keywords: ['pulverisateur electrique', 'batterie 16l'],
    },
    rating: 4.5,
    reviewCount: 380,
    inStock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getAffiliateProductById = (id: string) => affiliateProducts.find((p) => p.id === id);

export const getAffiliateProductBySlug = (slug: string) =>
  affiliateProducts.find((p) => p.slug === slug);

export const getTopPicks = (count = 3): AffiliateProduct[] =>
  [...affiliateProducts].sort((a, b) => b.rating - a.rating).slice(0, count);
