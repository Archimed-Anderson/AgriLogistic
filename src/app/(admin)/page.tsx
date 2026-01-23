import { Navigate } from 'react-router-dom';

/**
 * Admin root page - redirects to dashboard
 */
export default function AdminPage() {
  return <Navigate to="/admin/dashboard" replace />;
}
