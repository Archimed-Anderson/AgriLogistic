import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AdminRole } from '@/domain/admin/permissions';

interface RequireAdminRoleProps {
  children: React.ReactNode;
  minRole?: AdminRole;
  fallback?: string;
}

/**
 * Guard component that requires admin role
 * Optionally checks for minimum role level
 */
export function RequireAdminRole({ 
  children, 
  minRole,
  fallback = '/' 
}: RequireAdminRoleProps) {
  const { user, isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has admin role
  if (!user.adminRole) {
    return <Navigate to={fallback} replace />;
  }
  
  // If minRole is specified, check role level
  if (minRole) {
    const ROLE_LEVELS: Record<AdminRole, number> = {
      [AdminRole.SUPER_ADMIN]: 3,
      [AdminRole.ADMIN]: 2,
      [AdminRole.MANAGER]: 1,
      [AdminRole.SUPPORT]: 0,
    };
    
    const userLevel = ROLE_LEVELS[user.adminRole];
    const requiredLevel = ROLE_LEVELS[minRole];
    
    if (userLevel < requiredLevel) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
}
