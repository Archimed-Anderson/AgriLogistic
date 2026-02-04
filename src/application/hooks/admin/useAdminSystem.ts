import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSystemRepository } from '@/infrastructure/api/admin/admin-system.repository';
import { toast } from 'sonner';

/**
 * Query keys for admin system
 */
export const adminSystemKeys = {
  all: ['admin', 'system'] as const,
  health: () => [...adminSystemKeys.all, 'health'] as const,
  metrics: () => [...adminSystemKeys.all, 'metrics'] as const,
  logs: (params: { limit?: number; level?: string }) =>
    [...adminSystemKeys.all, 'logs', params] as const,
};

/**
 * Hook to fetch services health
 */
export function useServicesHealth() {
  return useQuery({
    queryKey: adminSystemKeys.health(),
    queryFn: () => adminSystemRepository.getServicesHealth(),
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}

/**
 * Hook to fetch system metrics
 */
export function useSystemMetrics() {
  return useQuery({
    queryKey: adminSystemKeys.metrics(),
    queryFn: () => adminSystemRepository.getMetrics(),
    staleTime: 5000, // 5 seconds
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });
}

/**
 * Hook to fetch system logs
 */
export function useSystemLogs(params: { limit?: number; level?: string } = {}) {
  return useQuery({
    queryKey: adminSystemKeys.logs(params),
    queryFn: () => adminSystemRepository.getLogs(params),
    staleTime: 10000, // 10 seconds
  });
}

/**
 * Hook to restart a service
 */
export function useRestartService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceName: string) => adminSystemRepository.restartService(serviceName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSystemKeys.health() });
      toast.success('Service redémarré avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
