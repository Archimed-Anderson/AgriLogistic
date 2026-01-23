import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  adminUsersRepository, 
  ListUsersParams,
  CreateUserDto,
  UpdateUserDto 
} from '@/infrastructure/api/admin/admin-users.repository';
import { toast } from 'sonner';

/**
 * Query keys for admin users
 */
export const adminUsersKeys = {
  all: ['admin', 'users'] as const,
  lists: () => [...adminUsersKeys.all, 'list'] as const,
  list: (params: ListUsersParams) => [...adminUsersKeys.lists(), params] as const,
  details: () => [...adminUsersKeys.all, 'detail'] as const,
  detail: (id: string) => [...adminUsersKeys.details(), id] as const,
};

/**
 * Hook to fetch users list with pagination and filters
 */
export function useAdminUsers(params: ListUsersParams = {}) {
  return useQuery({
    queryKey: adminUsersKeys.list(params),
    queryFn: () => adminUsersRepository.listUsers(params),
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to fetch a single user
 */
export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminUsersKeys.detail(userId),
    queryFn: () => adminUsersRepository.getUser(userId),
    enabled: !!userId,
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDto) => adminUsersRepository.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() });
      toast.success('Utilisateur créé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserDto }) =>
      adminUsersRepository.updateUser(userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.detail(variables.userId) });
      toast.success('Utilisateur modifié avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminUsersRepository.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() });
      toast.success('Utilisateur supprimé avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

/**
 * Hook to suspend a user
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminUsersRepository.suspendUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.detail(userId) });
      toast.success('Utilisateur suspendu');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

/**
 * Hook to activate a user
 */
export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminUsersRepository.activateUser(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.detail(userId) });
      toast.success('Utilisateur activé');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

/**
 * Hook to assign role to user
 */
export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminUsersRepository.assignRole(userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.detail(variables.userId) });
      toast.success('Rôle assigné avec succès');
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}

/**
 * Hook to reset user password
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: (userId: string) => adminUsersRepository.resetPassword(userId),
    onSuccess: (data) => {
      toast.success(`Mot de passe temporaire: ${data.temporaryPassword}`);
    },
    onError: (error: Error) => {
      toast.error(`Erreur: ${error.message}`);
    },
  });
}
