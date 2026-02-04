import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@presentation/contexts/AuthContext';

/**
 * Route guard: ensures the user is authenticated.
 * Redirects to /auth and preserves the intended destination in location state.
 */
export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border border-[#EEF2F7] bg-white p-6 shadow-sm">
          <div className="text-sm text-gray-600">Chargement…</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
