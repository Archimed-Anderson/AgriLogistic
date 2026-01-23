/**
 * Analytics Data Hook
 * Manages comprehensive analytics data for performance insights
 */
import { useQuery } from '@tanstack/react-query';
import type { PerformanceMetrics } from '@/types/transporter';

// Mock analytics data
const mockAnalytics: PerformanceMetrics = {
  onTimeDeliveries: 45,
  lateDeliveries: 5,
  onTimeRate: 90,
  averageDelay: 15,
  averageRating: 4.8,
  totalRatings: 120,
  ratingDistribution: {
    1: 2,
    2: 1,
    3: 5,
    4: 12,
    5: 100,
  },
  averageKmPerDelivery: 180,
  emptyKmRate: 12,
  fuelEfficiency: 15.5,
  averageRevenuePerDelivery: 250000,
  averageCostPerKm: 450,
  profitMargin: 28,
  period: 'month',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-01-31'),
};

export function useAnalyticsData() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['transporter', 'analytics', 'performance'],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockAnalytics;
    },
  });

  return {
    metrics,
    isLoading,
  };
}
