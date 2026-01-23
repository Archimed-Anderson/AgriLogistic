import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminDashboardRepository } from '@/infrastructure/api/admin/admin-dashboard.repository';

/**
 * Query keys for admin dashboard
 */
export const adminDashboardKeys = {
  all: ['admin', 'dashboard'] as const,
  metrics: (dateRange?: { from: string; to: string }) => 
    [...adminDashboardKeys.all, 'metrics', dateRange] as const,
  alerts: () => [...adminDashboardKeys.all, 'alerts'] as const,
  activity: (limit: number) => [...adminDashboardKeys.all, 'activity', limit] as const,
};

/**
 * Hook to fetch dashboard metrics
 */
export function useAdminDashboardMetrics(dateRange?: { from: string; to: string }) {
  return useQuery({
    queryKey: adminDashboardKeys.metrics(dateRange),
    queryFn: () => adminDashboardRepository.getMetrics(dateRange),
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Auto-refresh every minute
  });
}

/**
 * Hook to fetch system alerts
 */
export function useSystemAlerts() {
  return useQuery({
    queryKey: adminDashboardKeys.alerts(),
    queryFn: () => adminDashboardRepository.getAlerts(),
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}

/**
 * Hook to dismiss an alert
 */
export function useDismissAlert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (alertId: string) => adminDashboardRepository.dismissAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDashboardKeys.alerts() });
    },
  });
}

/**
 * Hook to fetch recent activity
 */
export function useRecentActivity(limit: number = 10) {
  return useQuery({
    queryKey: adminDashboardKeys.activity(limit),
    queryFn: () => adminDashboardRepository.getRecentActivity(limit),
    staleTime: 30000, // 30 seconds
  });
}
