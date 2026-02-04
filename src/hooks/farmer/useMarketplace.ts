/**
 * Marketplace Data Hook
 */
import { useQuery } from '@tanstack/react-query';
import type { Product, Order, Review, MarketAnalysis, FlashSale } from '@/types/farmer/marketplace';

// Mock data
const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Tomates Bio',
    category: 'Légumes',
    description: 'Tomates biologiques cultivées sans pesticides',
    images: ['/products/tomatoes.jpg'],
    price: 2500,
    suggestedPrice: 2800,
    priceHistory: [
      { date: new Date('2024-01-01'), price: 2300, marketAverage: 2400 },
      { date: new Date('2024-01-15'), price: 2500, marketAverage: 2600 },
    ],
    stock: 150,
    unit: 'kg',
    origin: {
      fieldId: '1',
      fieldName: 'Champ Nord',
      harvestDate: new Date('2024-01-20'),
      coordinates: [2.3522, 48.8566],
    },
    certifications: ['Bio', 'Local', 'Qualité Premium'],
    ratings: {
      average: 4.8,
      count: 24,
      distribution: [
        { stars: 5, count: 18 },
        { stars: 4, count: 5 },
        { stars: 3, count: 1 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
    },
    status: 'available',
    views: 342,
    sales: 89,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date(),
  },
  {
    id: 'p2',
    name: 'Salades Fraîches',
    category: 'Légumes',
    description: 'Salades croquantes récoltées du jour',
    images: ['/products/lettuce.jpg'],
    price: 1200,
    stock: 45,
    unit: 'pièce',
    origin: {
      fieldId: '2',
      fieldName: 'Champ Sud',
      harvestDate: new Date(),
      coordinates: [2.3542, 48.8556],
    },
    certifications: ['Local'],
    ratings: {
      average: 4.5,
      count: 12,
      distribution: [
        { stars: 5, count: 8 },
        { stars: 4, count: 3 },
        { stars: 3, count: 1 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
    },
    status: 'low_stock',
    views: 156,
    sales: 34,
    priceHistory: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
];

const mockOrders: Order[] = [
  {
    id: 'o1',
    orderNumber: 'ORD-2024-001',
    customer: {
      id: 'c1',
      name: 'Marie Dupont',
      email: 'marie@example.com',
      phone: '+33 6 12 34 56 78',
      location: 'Paris',
    },
    items: [
      {
        productId: 'p1',
        productName: 'Tomates Bio',
        productImage: '/products/tomatoes.jpg',
        quantity: 5,
        price: 2500,
        total: 12500,
      },
    ],
    subtotal: 12500,
    shipping: 500,
    tax: 0,
    total: 13000,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'Carte bancaire',
    shippingAddress: {
      street: '123 Rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    },
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date(),
  },
];

const mockReviews: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    productName: 'Tomates Bio',
    customer: {
      id: 'c1',
      name: 'Marie Dupont',
    },
    rating: 5,
    title: 'Excellentes tomates!',
    comment: 'Très fraîches et savoureuses. Je recommande vivement!',
    helpful: 12,
    verified: true,
    createdAt: new Date('2024-01-21'),
  },
];

const mockMarketAnalysis: MarketAnalysis[] = [
  {
    productId: 'p1',
    productName: 'Tomates Bio',
    yourPrice: 2500,
    marketAverage: 2600,
    competitors: [
      { seller: 'Ferme Martin', price: 2700, stock: 200, rating: 4.6 },
      { seller: 'Bio Jardin', price: 2550, stock: 150, rating: 4.7 },
      { seller: 'Maraîcher Local', price: 2400, stock: 100, rating: 4.3 },
    ],
    priceRecommendation: {
      min: 2400,
      optimal: 2800,
      max: 3000,
      reasoning: 'Demande forte, qualité supérieure, certification bio',
    },
    demandTrend: 'increasing',
    seasonality: 85,
  },
];

const mockFlashSales: FlashSale[] = [];

export function useMarketplace() {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['farmer', 'marketplace', 'products'],
    queryFn: async () => mockProducts,
    staleTime: 60000,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['farmer', 'marketplace', 'orders'],
    queryFn: async () => mockOrders,
    staleTime: 30000,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['farmer', 'marketplace', 'reviews'],
    queryFn: async () => mockReviews,
    staleTime: 60000,
  });

  const { data: marketAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['farmer', 'marketplace', 'analysis'],
    queryFn: async () => mockMarketAnalysis,
    staleTime: 300000,
  });

  const { data: flashSales, isLoading: flashSalesLoading } = useQuery({
    queryKey: ['farmer', 'marketplace', 'flashsales'],
    queryFn: async () => mockFlashSales,
    staleTime: 60000,
  });

  return {
    products,
    orders,
    reviews,
    marketAnalysis,
    flashSales,
    isLoading:
      productsLoading || ordersLoading || reviewsLoading || analysisLoading || flashSalesLoading,
  };
}
