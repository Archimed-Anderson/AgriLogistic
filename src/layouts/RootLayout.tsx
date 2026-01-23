import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";

import { useAuth } from "@presentation/contexts/AuthContext";
import { ConsentBanner } from "@components/ConsentBanner";
import { BackendStatus } from "@components/BackendStatus";
import { trackPageView } from "@/app/lib/analytics/ga";

import { Navbar } from "@components/Navbar";
import { Sidebar } from "@components/Sidebar";

import type { UserRole } from "@domain/enums/user-role.enum";

export function RootLayout() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentRoute = location.pathname || "/";
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [showBackendStatus, setShowBackendStatus] = useState(false);
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

  // SPA page views (GA4) - uniquement si consentement donné et GA initialisé.
  useEffect(() => {
    trackPageView(gaMeasurementId, currentRoute);
  }, [gaMeasurementId, currentRoute]);

  const showSidebar =
    isAuthenticated && (currentRoute.startsWith("/admin") || currentRoute.startsWith("/customer"));

  const getSidebarType = (): "admin" | "customer" => (currentRoute.startsWith("/admin") ? "admin" : "customer");

  const handleNavigate = (route: string) => {
    navigate(route);
    setSidebarMobileOpen(false);
    window.scrollTo(0, 0);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const userRole: UserRole | undefined = user?.role;
  const userPermissions = user?.permissions.toArray();

  return (
    <div className="min-h-screen bg-[#F6F7F9] text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        notificationCount={3}
        isAuthenticated={isAuthenticated}
        adminMode={adminMode}
        onAdminModeChange={setAdminMode}
        userLabel={user ? user.email.value : undefined}
        showSidebarToggle={showSidebar}
        onSidebarToggle={() => setSidebarMobileOpen((v) => !v)}
        onLogout={async () => {
          await logout();
          navigate("/");
        }}
      />

      {showSidebar ? (
        <div className="relative h-[calc(100vh-4rem)] md:flex">
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            type={getSidebarType()}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            mobileOpen={sidebarMobileOpen}
            onMobileOpenChange={setSidebarMobileOpen}
            userRole={userRole}
            userPermissions={userPermissions}
            onLogout={async () => {
              await logout();
              navigate("/");
            }}
          />
          <main className="w-full md:flex-1 overflow-y-auto bg-[#F6F7F9] dark:bg-gray-950">
            <div className="mx-auto p-6 max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        <main className="w-full">
          <Outlet />
        </main>
      )}

      <ConsentBanner />
      {showBackendStatus && <BackendStatus onClose={() => setShowBackendStatus(false)} />}

      {/* Floating backend status button */}
      <button
        onClick={() => setShowBackendStatus(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full bg-gray-800 p-3 text-white shadow-lg hover:bg-gray-700 transition-colors"
        title="Vérifier l'état du backend"
        disabled={isLoading}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      <Toaster position="top-right" />
    </div>
  );
}

