/**
 * AGRILOGISTIC LINK - EXEMPLE D'INTÉGRATION ROUTING
 * Ce fichier montre comment intégrer les pages Link Hub dans votre application
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import des pages AgriLogistic Link
import LinkHubPage from '@/app/link-hub/page';
import LinkMonitorPage from '@/app/admin/link-monitor/page';

// Composants de protection des routes
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiresAdmin?: boolean }> = ({
  children,
  requiresAdmin = false,
}) => {
  // TODO: Remplacer par votre logique d'authentification
  const isAuthenticated = true; // Vérifier si l'utilisateur est connecté
  const isAdmin = true; // Vérifier si l'utilisateur est admin

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiresAdmin && !isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

// Configuration des routes
export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== ROUTES PUBLIQUES ==================== */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ==================== AGRILOGISTIC LINK - HUB PUBLIC ==================== */}
        <Route
          path="/link-hub"
          element={
            <ProtectedRoute>
              <LinkHubPage />
            </ProtectedRoute>
          }
        />

        {/* ==================== ADMIN - LINK MONITOR ==================== */}
        <Route
          path="/admin/link-monitor"
          element={
            <ProtectedRoute requiresAdmin>
              <LinkMonitorPage />
            </ProtectedRoute>
          }
        />

        {/* ==================== AUTRES ROUTES ADMIN ==================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiresAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================== 404 ==================== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

// Composants placeholder (à remplacer par vos vrais composants)
const HomePage = () => <div>Home Page</div>;
const LoginPage = () => <div>Login Page</div>;
const RegisterPage = () => <div>Register Page</div>;
const AdminDashboard = () => <div>Admin Dashboard</div>;
const NotFoundPage = () => <div>404 - Page Not Found</div>;

export default AppRoutes;
