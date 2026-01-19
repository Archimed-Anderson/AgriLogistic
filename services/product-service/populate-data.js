const http = require('http');

const products = [
  {
    name: "Blé tendre biologique",
    description: "Blé tendre de qualité supérieure, cultivé selon les normes biologiques européennes. Idéal pour la panification et la production de farines de haute qualité. Rendement moyen de 45 quintaux/hectare.",
    shortDescription: "Blé tendre bio pour panification",
    category: "Céréales",
    price: 285.50,
    originalPrice: 320.00,
    unit: "tonne",
    stock: 150,
    sku: "CER-BLE-BIO-001",
    images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b"],
    tags: ["bio", "céréales", "panification", "agriculture biologique"],
    specifications: { proteine: "12%", humidite: "14%", poids_hectolitre: "78kg/hl" },
    sellerId: "seller-001",
    sellerName: "Ferme Durand - Beauce",
    organic: true,
    featured: true,
    certifications: ["AB", "Bio Cohérence"],
    origin: "Beauce, France",
    harvestDate: "2025-08-15"
  },
  {
    name: "Tomates cerises en grappe",
    description: "Tomates cerises rouges cultivées en serre chauffée, cueillies à maturité parfaite. Saveur sucrée et équilibrée. Production locale respectueuse de l'environnement.",
    shortDescription: "Tomates cerises fraîches de serre",
    category: "Légumes",
    price: 4.50,
    unit: "kg",
    stock: 500,
    sku: "LEG-TOM-CER-001",
    images: ["https://images.unsplash.com/photo-1592924357228-91a4daadcfea"],
    tags: ["légumes", "tomates", "frais", "local"],
    specifications: { calibre: "20-25mm", variete: "Cherry", conservation: "7 jours à 12°C" },
    sellerId: "seller-002",
    sellerName: "Maraîchers de Provence",
    organic: false,
    featured: true,
    origin: "Provence, France"
  },
  {
    name: "Maïs grain humide",
    description: "Maïs grain destiné à l'alimentation animale. Taux d'humidité optimal pour l'ensilage. Variété riche en énergie et en amidon, idéale pour les bovins laitiers et l'engraissement.",
    shortDescription: "Maïs grain pour alimentation animale",
    category: "Fourrage",
    price: 195.00,
    unit: "tonne",
    stock: 300,
    sku: "FOU-MAI-GRA-001",
    images: ["https://images.unsplash.com/photo-1603909075555-6f1f3034a5f0"],
    tags: ["fourrage", "maïs", "alimentation animale", "élevage"],
    specifications: { humidite: "30%", amidon: "68%", energie: "1.05 UFL/kg" },
    sellerId: "seller-003",
    sellerName: "Coopérative Agricole du Sud-Ouest",
    organic: false,
    featured: false,
    origin: "Sud-Ouest, France",
    harvestDate: "2025-10-20"
  },
  {
    name: "Pommes Golden bio",
    description: "Pommes Golden Delicious issues de l'agriculture biologique. Croquantes, sucrées avec une légère acidité. Calibre moyen à gros. Conservation longue durée en chambre froide.",
    shortDescription: "Pommes Golden bio croquantes",
    category: "Fruits",
    price: 2.80,
    originalPrice: 3.20,
    unit: "kg",
    stock: 2000,
    sku: "FRU-POM-GOL-001",
    images: ["https://images.unsplash.com/photo-1568702846914-96b305d2aaeb"],
    tags: ["bio", "fruits", "pommes", "local"],
    specifications: { calibre: "70-80mm", variete: "Golden Delicious", conservation: "6 mois" },
    sellerId: "seller-004",
    sellerName: "Vergers de Normandie",
    organic: true,
    featured: true,
    certifications: ["AB", "Nature & Progrès"],
    origin: "Normandie, France",
    harvestDate: "2025-09-10"
  },
  {
    name: "Lait cru de vache bio",
    description: "Lait cru entier provenant de vaches nourries à l'herbe et aux fourrages biologiques. Non homogénéisé, non pasteurisé. Collecté quotidiennement. Idéal pour la transformation fromagère artisanale.",
    shortDescription: "Lait cru bio pour transformation",
    category: "Produits laitiers",
    price: 0.48,
    unit: "litre",
    stock: 5000,
    sku: "LAI-CRU-VAC-001",
    images: ["https://images.unsplash.com/photo-1563636619-e9143da7973b"],
    tags: ["bio", "lait", "produits laitiers", "transformation"],
    specifications: { matieres_grasses: "4.2%", proteines: "3.4%", cellules: "< 200000/ml" },
    sellerId: "seller-005",
    sellerName: "Ferme Laitière des Alpes",
    organic: true,
    featured: false,
    certifications: ["AB"],
    origin: "Savoie, France"
  },
  {
    name: "Œufs de poules élevées en plein air",
    description: "Œufs extra-frais de poules élevées en plein air avec accès permanent à un parcours herbeux. Alimentation à base de céréales locales sans OGM. Coquille solide, jaune d'œuf orangé.",
    shortDescription: "Œufs plein air extra-frais",
    category: "Œufs",
    price: 0.35,
    unit: "unité",
    stock: 10000,
    sku: "OEU-PLI-AIR-001",
    images: ["https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f"],
    tags: ["œufs", "plein air", "local", "sans OGM"],
    specifications: { code: "1FR", poids_moyen: "63g", fraicheur: "< 9 jours" },
    sellerId: "seller-006",
    sellerName: "Élevage Avicole Martin",
    organic: false,
    featured: true,
    origin: "Bretagne, France"
  },
  {
    name: "Miel de lavande",
    description: "Miel de lavande fine AOC récolté sur les plateaux de Provence. Texture crémeuse, cristallisation fine et régulière. Arôme floral délicat typique de la lavande. Production limitée.",
    shortDescription: "Miel de lavande AOC crémeux",
    category: "Produits transformés",
    price: 12.50,
    unit: "kg",
    stock: 200,
    sku: "TRA-MIE-LAV-001",
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784710"],
    tags: ["miel", "lavande", "AOC", "Provence"],
    specifications: { humidite: "< 18%", HMF: "< 40mg/kg", AOC: "Miel de Provence" },
    sellerId: "seller-007",
    sellerName: "Rucher des Lavandes",
    organic: true,
    featured: true,
    certifications: ["AB", "AOC"],
    origin: "Provence, France",
    harvestDate: "2025-07-01"
  },
  {
    name: "Semences de tournesol bio",
    "description": "Semences certifiées de tournesol oléique pour culture biologique. Variété précoce à haut rendement en huile. Résistance au mildiou et à l'orobanche. Germination garantie 90%.",
    shortDescription: "Semences tournesol bio certifiées",
    category: "Semences",
    price: 85.00,
    unit: "sac de 25kg",
    stock: 50,
    sku: "SEM-TOU-BIO-001",
    images: ["https://images.unsplash.com/photo-1597848212624-e4e9c7bd8a65"],
    tags: ["semences", "tournesol", "bio", "certifié"],
    specifications: { germination: "90%", variete: "Oléique précoce", traitement: "Aucun" },
    sellerId: "seller-008",
    sellerName: "Semencier Bio France",
    organic: true,
    featured: false,
    certifications: ["AB", "Semences biologiques UE"]
  }
];

async function createProduct(product) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(product);
    
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 201) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`Failed to create ${product.name}: ${res.statusCode} - ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('🌾 Starting product data population...\n');
  
  for (const product of products) {
    try {
      const result = await createProduct(product);
      console.log(`✅ Created: ${product.name}`);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n✅ Data population complete!');
}

main();
