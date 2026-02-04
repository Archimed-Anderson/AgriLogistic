import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission, AdminPermission, AdminRole } from '@/domain/admin/permissions';

interface RequirePermissionProps {
  permission: AdminPermission;
  children: React.ReactNode;
  fallback?: string;
}

/**
 * Guard component that requires a specific permission
 * Redirects to fallback route if user doesn't have permission
 */
export function RequirePermission({
  permission,
  children,
  fallback = '/admin/dashboard',
}: RequirePermissionProps) {
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (!user.adminRole) {
    return <Navigate to="/" replace />;
  }

  // Check if user has the required permission
  if (!hasPermission(user.adminRole as AdminRole, permission)) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
