/**
 * Buyer Analytics Hook
 * Manages spending analytics and insights
 */
import { useQuery } from '@tanstack/react-query';

export interface SpendingByCategory {
  category: string;
  amount: number;
  percentage: number;
  trend: number;
  color: string;
}

export interface SpendingBySupplier {
  supplierId: string;
  supplierName: string;
  amount: number;
  orderCount: number;
  avgOrderValue: number;
}

export interface MonthlySpending {
  month: string;
  amount: number;
  orderCount: number;
}

export interface BuyerAnalytics {
  totalSpending: number;
  totalOrders: number;
  avgOrderValue: number;
  savingsRealized: number;
  spendingByCategory: SpendingByCategory[];
  spendingBySupplier: SpendingBySupplier[];
  monthlySpending: MonthlySpending[];
  topProducts: { name: string; quantity: number; amount: number }[];
}

const mockAnalytics: BuyerAnalytics = {
  totalSpending: 12500000,
  totalOrders: 156,
  avgOrderValue: 80128,
  savingsRealized: 850000,
  spendingByCategory: [
    { category: 'Légumes', amount: 5200000, percentage: 42, trend: 5.2, color: '#10b981' },
    { category: 'Fruits', amount: 3800000, percentage: 30, trend: -2.1, color: '#f59e0b' },
    {
      category: 'Produits laitiers',
      amount: 2100000,
      percentage: 17,
      trend: 8.5,
      color: '#3b82f6',
    },
    { category: 'Viande', amount: 900000, percentage: 7, trend: 1.2, color: '#ef4444' },
    { category: 'Céréales', amount: 500000, percentage: 4, trend: 12.0, color: '#8b5cf6' },
  ],
  spendingBySupplier: [
    {
      supplierId: 's-001',
      supplierName: 'Ferme Bio Casamance',
      amount: 4500000,
      orderCount: 48,
      avgOrderValue: 93750,
    },
    {
      supplierId: 's-002',
      supplierName: 'Coopérative Niayes',
      amount: 3200000,
      orderCount: 42,
      avgOrderValue: 76190,
    },
    {
      supplierId: 's-004',
      supplierName: 'Ferme Kolda',
      amount: 2800000,
      orderCount: 35,
      avgOrderValue: 80000,
    },
    {
      supplierId: 's-003',
      supplierName: 'Verger du Fleuve',
      amount: 2000000,
      orderCount: 31,
      avgOrderValue: 64516,
    },
  ],
  monthlySpending: [
    { month: 'Août', amount: 980000, orderCount: 12 },
    { month: 'Sept', amount: 1150000, orderCount: 15 },
    { month: 'Oct', amount: 1280000, orderCount: 18 },
    { month: 'Nov', amount: 1420000, orderCount: 20 },
    { month: 'Déc', amount: 1680000, orderCount: 24 },
    { month: 'Jan', amount: 1450000, orderCount: 19 },
  ],
  topProducts: [
    { name: 'Tomates Bio', quantity: 2500, amount: 4625000 },
    { name: 'Oignons Violets', quantity: 1800, amount: 1440000 },
    { name: 'Mangues Kent', quantity: 1200, amount: 3000000 },
    { name: 'Carottes Niayes', quantity: 2000, amount: 1200000 },
    { name: 'Arachides', quantity: 1500, amount: 1800000 },
  ],
};

export function useBuyerAnalytics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['buyer', 'analytics'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return mockAnalytics;
    },
  });

  return {
    analytics: data,
    isLoading,
    error,
  };
}
