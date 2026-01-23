/**
 * Buyer Dashboard Hook
 * Manages dashboard data with React Query
 */
import { useQuery } from '@tanstack/react-query';
import type { 
  BuyerDashboard, 
  BuyerStats, 
  PriceAlert, 
  SeasonalProduct, 
  SpendingCategory,
  Product,
  Order,
  Supplier
} from '@/types/buyer';

// Mock data
const mockStats: BuyerStats = {
  totalSpent: 4500000,
  totalOrders: 156,
  averageOrderValue: 288461,
  suppliersCount: 12,
  savedThisMonth: 350000,
  pendingOrders: 3,
};

const mockPriceAlerts: PriceAlert[] = [
  {
    id: 'pa-001',
    productId: 'p-001',
    product: {
      id: 'p-001',
      name: 'Tomates Bio',
      category: 'vegetables',
      subcategory: 'tomates',
      description: 'Tomates bio cultivées localement',
      images: ['/products/tomatoes.jpg'],
      pricePerKg: 1850,
      unit: 'kg',
      minOrderQuantity: 5,
      availableQuantity: 500,
      supplierId: 's-001',
      supplier: {} as Supplier,
      origin: 'Casamance, Sénégal',
      certifications: [],
      qualityScore: 4.8,
      seasonality: [5, 6, 7, 8, 9, 10],
      isOrganic: true,
      isFavorite: true,
    },
    previousPrice: 2200,
    currentPrice: 1850,
    changePercent: -15.9,
    alertType: 'drop',
    createdAt: new Date(),
  },
  {
    id: 'pa-002',
    productId: 'p-002',
    product: {
      id: 'p-002',
      name: 'Mangues Kent',
      category: 'fruits',
      subcategory: 'mangues',
      description: 'Mangues Kent premium export',
      images: ['/products/mangoes.jpg'],
      pricePerKg: 2500,
      unit: 'kg',
      minOrderQuantity: 10,
      availableQuantity: 1000,
      supplierId: 's-002',
      supplier: {} as Supplier,
      origin: 'Ziguinchor, Sénégal',
      certifications: [],
      qualityScore: 4.9,
      seasonality: [4, 5, 6, 7],
      isOrganic: false,
      isFavorite: true,
    },
    previousPrice: 2800,
    currentPrice: 2500,
    changePercent: -10.7,
    alertType: 'drop',
    createdAt: new Date(),
  },
];

const mockSpending: SpendingCategory[] = [
  { category: 'vegetables', amount: 1500000, percentage: 33.3, trend: 'up', trendPercent: 12 },
  { category: 'fruits', amount: 1200000, percentage: 26.7, trend: 'stable', trendPercent: 2 },
  { category: 'dairy', amount: 800000, percentage: 17.8, trend: 'down', trendPercent: -5 },
  { category: 'meat', amount: 600000, percentage: 13.3, trend: 'up', trendPercent: 8 },
  { category: 'cereals', amount: 400000, percentage: 8.9, trend: 'stable', trendPercent: 1 },
];

const mockSeasonalProducts: SeasonalProduct[] = [
  {
    product: {
      id: 'p-003',
      name: 'Fraises de Niayes',
      category: 'fruits',
      subcategory: 'fraises',
      description: 'Fraises fraîches de la région des Niayes',
      images: ['/products/strawberries.jpg'],
      pricePerKg: 4500,
      unit: 'kg',
      minOrderQuantity: 2,
      availableQuantity: 200,
      supplierId: 's-003',
      supplier: {} as Supplier,
      origin: 'Niayes, Sénégal',
      certifications: [],
      qualityScore: 4.7,
      seasonality: [1, 2, 3, 4],
      isOrganic: true,
      isFavorite: false,
    },
    peakMonth: 2,
    availabilityStart: 1,
    availabilityEnd: 4,
    isCurrentlySeasonal: true,
  },
  {
    product: {
      id: 'p-004',
      name: 'Oignons de Potou',
      category: 'vegetables',
      subcategory: 'oignons',
      description: 'Oignons violets de Potou',
      images: ['/products/onions.jpg'],
      pricePerKg: 800,
      unit: 'kg',
      minOrderQuantity: 20,
      availableQuantity: 5000,
      supplierId: 's-004',
      supplier: {} as Supplier,
      origin: 'Potou, Sénégal',
      certifications: [],
      qualityScore: 4.5,
      seasonality: [1, 2, 3, 11, 12],
      isOrganic: false,
      isFavorite: true,
    },
    peakMonth: 1,
    availabilityStart: 11,
    availabilityEnd: 3,
    isCurrentlySeasonal: true,
  },
];

export function useBuyerDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['buyer', 'dashboard'],
    queryFn: async (): Promise<BuyerDashboard> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        stats: mockStats,
        priceAlerts: mockPriceAlerts,
        recommendations: [],
        recentOrders: [],
        favoriteSuppliers: [],
        seasonalProducts: mockSeasonalProducts,
        spendingByCategory: mockSpending,
        newArrivals: [],
      };
    },
  });

  return {
    dashboard: data,
    stats: data?.stats,
    priceAlerts: data?.priceAlerts || [],
    seasonalProducts: data?.seasonalProducts || [],
    spending: data?.spendingByCategory || [],
    isLoading,
    error,
  };
}
