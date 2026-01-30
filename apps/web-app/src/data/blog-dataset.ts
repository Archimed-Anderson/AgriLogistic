export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  image: string;
  featured: boolean;
}

export const BLOG_DATASET: BlogPost[] = [
  // --- FEATURED POSTS (6 items) ---
  {
    "id": "1",
    "slug": "ia-transformation-rendements-afrique",
    "title": "Comment l'IA transforme la prédiction des rendements en Afrique de l'Ouest",
    "excerpt": "Découvrez comment les algorithmes de deep learning d'AgriLogistic permettent aux coopératives d'anticiper les récoltes avec une précision de 98%, sécurisant ainsi les contrats d'approvisionnement.",
    "content": "Full content here...",
    "category": "Intelligence Artificielle",
    "author": {
      "name": "Dr. Amadou Diallo",
      "role": "Chief Data Scientist",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Amadou"
    },
    "publishedAt": "2026-01-24",
    "readTime": "6 min",
    "image": "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop",
    "featured": true
  },
  {
    "id": "2",
    "slug": "digital-twins-agriculture",
    "title": "Jumeaux Numériques : Modéliser le futur de vos parcelles",
    "excerpt": "Comment les Digital Twins permettent de simuler l'impact du changement climatique sur vos cultures 5 ans à l'avance et d'adapter vos stratégies dès aujourd'hui.",
    "content": "Click here to read more...",
    "category": "Technologie",
    "author": {
      "name": "Jean-Marc Traoré",
      "role": "CTO",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=JeanMarc"
    },
    "publishedAt": "2026-01-10",
    "readTime": "9 min",
    "image": "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2070&auto=format&fit=crop",
    "featured": true
  },
  {
    "id": "3",
    "slug": "cooperatives-digitalisation",
    "title": "Transformation Digitale des Coopératives Cacao",
    "excerpt": "Étude de cas : Comment la coopérative de San Pédro a augmenté ses revenus de 25% grâce à la digitalisation complète de ses flux logistiques avec AgriLogistic.",
    "content": "...",
    "category": "Cas Clients",
    "author": {
      "name": "Kofi Annan",
      "role": "Partnership Manager",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Kofi"
    },
    "publishedAt": "2025-12-15",
    "readTime": "8 min",
    "image": "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?q=80&w=2069&auto=format&fit=crop",
    "featured": true
  },
  {
    "id": "4",
    "slug": "women-in-agtech",
    "title": "Les Femmes dans l'AgTech : Leaders de l'innovation",
    "excerpt": "Portraits de 5 femmes entrepreneures qui changent le visage de l'agriculture technologique en Afrique. Leur impact sur l'adoption des nouvelles technologies.",
    "content": "...",
    "category": "Impact Social",
    "author": {
      "name": "Aminata Ly",
      "role": "Impact Officer",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Aminata"
    },
    "publishedAt": "2025-12-05",
    "readTime": "6 min",
    "image": "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop",
    "featured": true
  },
  {
    "id": "5",
    "slug": "agritech-trends-2026",
    "title": "AgriTech 2026 : Projections et Futur",
    "excerpt": "Vision à long terme : L'agriculture autonome, les fermes verticales en Afrique et l'essor des bio-intrants. Préparez votre entreprise aux défis de demain.",
    "content": "...",
    "category": "Innovation",
    "author": {
      "name": "Jean-Marc Traoré",
      "role": "CTO",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=JeanMarc"
    },
    "publishedAt": "2025-11-15",
    "readTime": "8 min",
    "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    "featured": true
  },
  {
    "id": "6",
    "slug": "logistique-4-0-chaine-froid",
    "title": "Logistique 4.0 : Maîtriser la chaîne du froid",
    "excerpt": "Comment les capteurs IoT d'AgriLogistic garantissent l'intégrité des produits périssables (fruits, légumes) sur des milliers de kilomètres de routes difficiles.",
    "content": "...",
    "category": "Logistique",
    "author": {
      "name": "Marc Durand",
      "role": "Head of Logistics",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc"
    },
    "publishedAt": "2026-01-26",
    "readTime": "7 min",
    "image": "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop",
    "featured": true
  },

  // --- STANDARD POSTS (18 items) ---
  {
    "id": "7",
    "slug": "blockchain-export-conformite-eudr",
    "title": "Blockchain et Exportation : Garantir la conformité EUDR",
    "excerpt": "Le nouveau règlement européen sur la déforestation (EUDR) impose une traçabilité stricte. Voici comment la blockchain AgriLogistic automatise vos certificats.",
    "content": "Full content here...",
    "category": "Blockchain",
    "author": {
      "name": "Sarah Kone",
      "role": "Compliance Expert",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    "publishedAt": "2026-01-21",
    "readTime": "5 min",
    "image": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2232&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "8",
    "slug": "optimisation-logistique-pertes-agricoles",
    "title": "Optimisation du Dernier Kilomètre",
    "excerpt": "AgriLogistic Link connecte les transporteurs en temps réel pour sauver 30% des récoltes habituellement perdues post-récolte.",
    "content": "Full content here...",
    "category": "Logistique",
    "author": {
      "name": "Marc Durand",
      "role": "Head of Logistics",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc"
    },
    "publishedAt": "2026-01-18",
    "readTime": "4 min",
    "image": "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2070&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "9",
    "slug": "agriculture-regenerative-ia-guide",
    "title": "Agriculture Régénérative : L'IA comme Guide",
    "excerpt": "Passer au durable ne signifie pas sacrifier la rentabilité. Découvrez nos modèles de recommandation pour la santé des sols.",
    "content": "Full content here...",
    "category": "Transition Durable",
    "author": {
      "name": "Dr. Elena Gomez",
      "role": "Agronomist",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
    },
    "publishedAt": "2026-01-15",
    "readTime": "7 min",
    "image": "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=2340&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "10",
    "slug": "finance-inclsuive-mobile-money",
    "title": "Finance Inclusive : Le Mobile Money Agricole",
    "excerpt": "Intégration des paiements mobiles pour sécuriser les transactions et construire un historique de crédit pour les non-bancarisés.",
    "content": "...",
    "category": "Finance",
    "author": {
      "name": "Aïcha Diallo",
      "role": "FinTech Lead",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Aicha"
    },
    "publishedAt": "2026-01-08",
    "readTime": "5 min",
    "image": "https://images.unsplash.com/photo-1565514020176-dbf2277cc168?q=80&w=2070&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "11",
    "slug": "drones-surveillance-automatique",
    "title": "Flottes de Drones Autonomes",
    "excerpt": "Déploiement de drones solaires pour la surveillance continue et la détection précoce des maladies sur les grandes plantations.",
    "content": "...",
    "category": "Technologie",
    "author": {
      "name": "Pierre Dubois",
      "role": "Drone Specialist",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre"
    },
    "publishedAt": "2026-01-05",
    "readTime": "6 min",
    "image": "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2070&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "12",
    "slug": "iot-irrigation-intelligente",
    "title": "IoT et Irrigation Intelligente",
    "excerpt": "Économiser 40% d'eau avec des capteurs connectés LoRaWAN pour un pilotage précis de l'irrigation goutte-à-goutte.",
    "content": "...",
    "category": "Technologie",
    "author": {
      "name": "Elena Gomez",
      "role": "Agronomist",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
    },
    "publishedAt": "2026-01-02",
    "readTime": "4 min",
    "image": "https://images.unsplash.com/photo-1629814493406-3b999c086f62?q=80&w=2664&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "13",
    "slug": "supply-chain-resilience",
    "title": "Résilience de la Supply Chain",
    "excerpt": "Stratégies pour diversifier les sources d'approvisionnement et mitiguer les risques climatiques et géopolitiques.",
    "content": "...",
    "category": "Logistique",
    "author": {
      "name": "Marc Durand",
      "role": "Head of Logistics",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc"
    },
    "publishedAt": "2025-12-28",
    "readTime": "7 min",
    "image": "https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=2070&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "14",
    "slug": "certifications-bio-digitales",
    "title": "Certifications Bio Digitales",
    "excerpt": "Comment la digitalisation audits permet d'accélérer l'obtention des labels Bio et Fairtrade et de réduire les coûts de certification.",
    "content": "...",
    "category": "Blockchain",
    "author": {
      "name": "Sarah Kone",
      "role": "Compliance Expert",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    "publishedAt": "2025-12-25",
    "readTime": "5 min",
    "image": "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "15",
    "slug": "meteo-precision-microclimats",
    "title": "Météo de Précision : Microclimats",
    "excerpt": "Utiliser les données satellites pour prévoir les événements météorologiques extrêmes à l'échelle de la parcelle.",
    "content": "...",
    "category": "Intelligence Artificielle",
    "author": {
      "name": "Amadou Diallo",
      "role": "Chief Data Scientist",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Amadou"
    },
    "publishedAt": "2025-12-20",
    "readTime": "6 min",
    "image": "https://images.unsplash.com/photo-1580193769210-b8d1c049a7d9?q=80&w=2074&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "16",
    "slug": "api-integration-erp",
    "title": "Intégration API : Connecter AgriLogistic",
    "excerpt": "Guide technique pour les DSI : Synchroniser SAP/Oracle avec les données terrain AgriLogistic pour une gestion centralisée.",
    "content": "...",
    "category": "Technologie",
    "author": {
      "name": "David Chen",
      "role": "Lead Architect",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
    },
    "publishedAt": "2025-12-10",
    "readTime": "10 min",
    "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "17",
    "slug": "assurance-indicielle-climat",
    "title": "Assurance Indicielle Paramétrique",
    "excerpt": "Nouveaux modèles d'assurance basés sur les données satellites pour une indemnisation automatique en cas de sécheresse.",
    "content": "...",
    "category": "Finance",
    "author": {
      "name": "Aïcha Diallo",
      "role": "FinTech Lead",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Aicha"
    },
    "publishedAt": "2025-12-01",
    "readTime": "7 min",
    "image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "18",
    "slug": "analyse-sols-spectrometrie",
    "title": "Analyse de Sols par Spectrométrie",
    "excerpt": "Le laboratoire dans la poche : Analyser la composition chimique des sols en 5 minutes sur le terrain pour ajuster la fertilisation.",
    "content": "...",
    "category": "Technologie",
    "author": {
      "name": "Elena Gomez",
      "role": "Agronomist",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
    },
    "publishedAt": "2025-11-28",
    "readTime": "5 min",
    "image": "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2070&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "19",
    "slug": "tracabilite-poisson-peche",
    "title": "Traçabilité de la Pêche Durable",
    "excerpt": "Extension de la plateforme AgriLogistic aux filières halieutiques pour lutter contre la pêche illégale et valoriser les prises durables.",
    "content": "...",
    "category": "Blockchain",
    "author": {
      "name": "Sarah Kone",
      "role": "Compliance Expert",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    "publishedAt": "2025-11-25",
    "readTime": "6 min",
    "image": "https://images.unsplash.com/photo-1534947230467-3c58f9630730?q=80&w=2670&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "20",
    "slug": "cafe-specialite-export",
    "title": "Café de Spécialité & Terroir",
    "excerpt": "Comment les torréfacteurs utilisent les données AgriLogistic pour raconter l'histoire unique de chaque grain et justifier un prix premium.",
    "content": "...",
    "category": "Cas Clients",
    "author": {
      "name": "Marc Durand",
      "role": "Head of Logistics",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc"
    },
    "publishedAt": "2025-11-20",
    "readTime": "4 min",
    "image": "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2071&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "21",
    "slug": "formation-agriculteurs-mobile",
    "title": "E-Learning : Former 1M de Fermiers",
    "excerpt": "Déploiement de modules de formation vidéo low-bandwidth pour diffuser les bonnes pratiques agricoles à grande échelle.",
    "content": "...",
    "category": "Impact Social",
    "author": {
      "name": "Aminata Ly",
      "role": "Impact Officer",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Aminata"
    },
    "publishedAt": "2025-11-10",
    "readTime": "5 min",
    "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "22",
    "slug": "credit-agricole-scoring",
    "title": "Crédit Agricole : Nouveau Scoring",
    "excerpt": "Remplacer les garanties matérielles par de la donnée agronomique pour débloquer le financement des intrants.",
    "content": "...",
    "category": "Finance",
    "author": {
      "name": "Aïcha Diallo",
      "role": "FinTech Lead",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Aicha"
    },
    "publishedAt": "2025-11-01",
    "readTime": "6 min",
    "image": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "23",
    "slug": "bio-controle-insectes",
    "title": "Bio-contrôle : L'alternative aux pesticides",
    "excerpt": "Utiliser des drones pour larguer des insectes bénéfiques et combattre les ravageurs de manière écologique.",
    "content": "...",
    "category": "Technologie",
    "author": {
      "name": "Pierre Dubois",
      "role": "Drone Specialist",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre"
    },
    "publishedAt": "2025-10-25",
    "readTime": "5 min",
    "image": "https://images.unsplash.com/photo-1533241243501-443b7dc22f5d?q=80&w=2070&auto=format&fit=crop",
    "featured": false
  },
  {
    "id": "24",
    "slug": "data-sovereignty-agriculture",
    "title": "Souveraineté des Données Agricoles",
    "excerpt": "Pourquoi la propriété de la donnée est cruciale pour les nations africaines et comment AgriLogistic protège ces actifs stratégiques.",
    "content": "...",
    "category": "Innovation",
    "author": {
      "name": "Jean-Marc Traoré",
      "role": "CTO",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=JeanMarc"
    },
    "publishedAt": "2025-10-20",
    "readTime": "9 min",
    "image": "https://images.unsplash.com/photo-1558494949-ef010dbacc31?q=80&w=2000&auto=format&fit=crop",
    "featured": false
  }
];


