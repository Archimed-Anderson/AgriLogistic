import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { AuthProviderComponent, useAuth } from "@presentation/contexts/AuthContext";
import { ConsentBanner } from "./components/ConsentBanner";
import { BackendStatus } from "./components/BackendStatus";
import { trackPageView } from "./lib/analytics/ga";

// Layout components
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { AccessDenied } from "./components/AccessDenied";

// Auth & Landing
// Auth & Landing
import { AgroLogisticRedesigned } from "./components/landing/AgroLogisticRedesigned"; // Changed from ./components/landing/AgroLogisticLandingPage
import { LoginPage } from "@presentation/pages/LoginPage";
import { RegisterPage } from "@presentation/pages/RegisterPage";
import { ModernAuthPage } from "@presentation/pages/ModernAuthPage";
import { ForgotPasswordPage } from "@presentation/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@presentation/pages/ResetPasswordPage";

// Dashboard
import { ModernDashboard } from "./components/ModernDashboard";
import { FarmVistaDashboard } from "./components/FarmVistaDashboard";

// Core Features
import { ChatInterface } from "./components/ChatInterface";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { MarketplaceModern } from "./components/MarketplaceModern";

import { RentalMarketplace2 } from "./components/RentalMarketplace2";
import { Settings } from "./components/Settings";
import { ProfilePage } from "./components/ProfilePage";
import { NotificationsPage } from "./components/NotificationsPage";

// Blog
import { BlogHome } from "./components/BlogHome";
import { BlogArticle } from "./components/BlogArticle";
import { BlogAdmin } from "./components/BlogAdmin";

// Academy
import { AcademyPortal } from "./components/AcademyPortal";

// Admin Features
import { UserManagement } from "./components/UserManagement";
import { ProductInventory } from "./components/ProductInventory";
import { OrdersManagement } from "./components/OrdersManagement";
import { CategoryManagement } from "./components/CategoryManagement";
import { ReportEngine } from "./components/ReportEngine";
import { AdminPanelHome } from "./components/AdminPanelHome";

// Advanced Features
import { IoTDeviceHub } from "./components/IoTDeviceHub";
import { AutomationWorkflows } from "./components/AutomationWorkflows";
import { AIInsights } from "./components/AIInsights";
import { FinancialSuite } from "./components/FinancialSuite";
import { LogisticsTracking } from "./components/LogisticsTracking";

// Farm Dashboard Components
import { WeatherDashboard } from "./components/WeatherDashboard";
import { SoilWaterManagement } from "./components/SoilWaterManagement";
import { EquipmentManagement } from "./components/EquipmentManagement";
import { TaskManagement } from "./components/TaskManagement";
import { HelpSupport } from "./components/HelpSupport";
import { CropManagement } from "./components/CropManagement";

// B2B & Logistics (Nouveaux composants)
import { TransportCalculator } from "./components/TransportCalculator";
import { ShippingTracker } from "./components/ShippingTracker";

import { B2BChat } from "./components/B2BChat";
import { CarrierDashboard } from "./components/CarrierDashboard";
import { AffiliateDashboard } from "./components/AffiliateDashboard";
import { LaborManagement } from "./components/LaborManagement";

import { Permission } from "@domain/value-objects/permissions.vo";
import { UserRole } from "@domain/enums/user-role.enum";

function AppShell() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  // For development: Start with dashboard instead of landing page
  // Change to "/" for production landing page
  const [currentRoute, setCurrentRoute] = useState(() => {
    if (typeof window === "undefined") return "/";
    return window.location.pathname || "/";
  });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [showBackendStatus, setShowBackendStatus] = useState(false);
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || "";

  // SPA page views (GA4) - uniquement si consentement donné et GA initialisé
  useEffect(() => {
    trackPageView(gaMeasurementId, currentRoute);
  }, [gaMeasurementId, currentRoute]);

  // Protection routes: redirige vers /auth si non authentifié
  useEffect(() => {
    const needsAuth = currentRoute.startsWith("/admin") || currentRoute.startsWith("/customer");
    if (!isLoading && needsAuth && !isAuthenticated) {
      setCurrentRoute("/auth");
      window.scrollTo(0, 0);
    }
  }, [currentRoute, isAuthenticated, isLoading]);
  
  // Sidebar visible uniquement pour les pages d'administration spécifiques
  const showSidebar =
    isAuthenticated &&
    (currentRoute.startsWith("/admin") || currentRoute.startsWith("/customer"));

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    setSidebarMobileOpen(false);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", route);
    }
    window.scrollTo(0, 0);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const onPopState = () => {
      setCurrentRoute(window.location.pathname || "/");
      setSidebarMobileOpen(false);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const getSidebarType = (): "admin" | "customer" => {
    return currentRoute.startsWith("/admin") ? "admin" : "customer";
  };

  const userRole: UserRole | undefined = user?.role;
  const userPermissions = user?.permissions.toArray();

  const deny = (moduleLabel: string) => (
    <AccessDenied
      title="Accès refusé"
      message={`Vous n’avez pas accès à « ${moduleLabel} ». Si vous pensez que c’est une erreur, contactez un administrateur.`}
      onBack={() => handleNavigate(getSidebarType() === "admin" ? "/admin/dashboard" : "/customer/dashboard")}
    />
  );

  const hasAnyPermission = (...perms: Permission[]) =>
    user ? user.permissions.hasAny(...perms) : false;

  const renderContent = () => {
    switch (currentRoute) {
      // Auth & Landing
      case "/":
        return <AgroLogisticRedesigned onNavigate={handleNavigate} />; // Changed from AgroLogisticLandingPage
      case "/auth":
        return <ModernAuthPage onNavigate={handleNavigate} />;
      case "/login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "/register":
        return <RegisterPage onNavigate={handleNavigate} />;
      case "/forgot-password":
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case "/reset-password":
        return <ResetPasswordPage onNavigate={handleNavigate} />;
      
      // Admin Dashboard
      case "/admin/overview":
      case "/admin/dashboard":
        return <FarmVistaDashboard onNavigate={handleNavigate} />;
      
      // Customer Dashboard
      case "/customer/overview":
      case "/customer/dashboard":
        return <ModernDashboard />;
      
      // Core Features
      case "/admin/chat":
      case "/customer/chat":
        return <ChatInterface />;
      
      case "/admin/analytics":
      case "/customer/analytics":
        return <AnalyticsDashboard />;
      
      case "/admin/marketplace":
      case "/customer/marketplace":
        return <MarketplaceModern />;
      
      case "/admin/rental":
      case "/customer/rental":
        return <RentalMarketplace2 />;
      
      case "/admin/settings":
      case "/customer/settings":
        return <Settings />;
      
      case "/admin/profile":
      case "/customer/profile":
        return <ProfilePage />;
      
      case "/admin/notifications":
      case "/customer/notifications":
        return <NotificationsPage />;
      
      // Blog
      case "/admin/blog":
      case "/customer/blog":
        return <BlogHome onNavigate={handleNavigate} />;
      
      case "/admin/blog/article":
      case "/customer/blog/article":
        return <BlogArticle onNavigate={handleNavigate} />;
      
      case "/admin/blog/manage":
        return <BlogAdmin onNavigate={handleNavigate} />;
      
      // Academy
      case "/admin/academy":
      case "/customer/academy":
        return <AcademyPortal onNavigate={handleNavigate} />;
      
      // Admin Features
      case "/admin/users":
        if (!hasAnyPermission(Permission.VIEW_USERS, Permission.EDIT_USERS, Permission.DELETE_USERS)) {
          return deny("Gestion Utilisateurs");
        }
        return <UserManagement />;
      
      case "/admin/products":
        if (!hasAnyPermission(Permission.VIEW_ALL_PRODUCTS)) {
          return deny("Produits");
        }
        return <ProductInventory />;
      
      case "/admin/orders":
        if (!hasAnyPermission(Permission.MANAGE_ORDERS, Permission.VIEW_ALL_ORDERS)) {
          return deny("Commandes");
        }
        return <OrdersManagement />;
      
      case "/admin/categories":
        if (!hasAnyPermission(Permission.MANAGE_CATEGORIES)) {
          return deny("Catégories");
        }
        return <CategoryManagement />;
      
      case "/admin/reports":
        if (!hasAnyPermission(Permission.VIEW_ANALYTICS, Permission.EXPORT_REPORTS)) {
          return deny("Rapports");
        }
        return <ReportEngine />;
      
      case "/admin/panel":
        return <AdminPanelHome onNavigate={handleNavigate} />;

      case "/admin/labor":
        if (userRole !== UserRole.ADMIN) {
          return deny("Gestion Main-d'œuvre");
        }
        return <LaborManagement />;
      
      // Advanced Features
      case "/admin/iot":
      case "/customer/iot":
        return <IoTDeviceHub />;
      
      case "/admin/automation":
        if (userRole !== UserRole.ADMIN) {
          return deny("Automation");
        }
        return <AutomationWorkflows />;
      
      case "/admin/ai-insights":
      case "/customer/ai-insights":
        return <AIInsights />;
      
      case "/admin/finance":
      case "/customer/finance":
        if (!hasAnyPermission(Permission.VIEW_FINANCIAL_REPORTS)) {
          return deny("Finance");
        }
        return <FinancialSuite />;
      
      case "/admin/logistics":
      case "/customer/logistics":
        if (!hasAnyPermission(Permission.MANAGE_LOGISTICS, Permission.VIEW_DELIVERY_ORDERS)) {
          return deny("Logistique");
        }
        return <LogisticsTracking />;
      
      case "/admin/crops":
      case "/customer/crops":
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.FARMER) {
          return deny("Gestion Cultures");
        }
        return <CropManagement />;
      
      case "/admin/weather":
      case "/customer/weather":
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.FARMER) {
          return deny("Météo");
        }
        return <WeatherDashboard />;
      
      case "/admin/soil-water":
      case "/customer/soil-water":
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.FARMER) {
          return deny("Sol & Eau");
        }
        return <SoilWaterManagement />;

      case "/admin/equipment":
      case "/customer/equipment":
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.FARMER) {
          return deny("Équipements");
        }
        return <EquipmentManagement />;
      
      case "/admin/tasks":
      case "/customer/tasks":
        if (userRole !== UserRole.ADMIN && userRole !== UserRole.FARMER) {
          return deny("Gestion Tâches");
        }
        return <TaskManagement />;
      
      case "/admin/help":
      case "/customer/help":
        return <HelpSupport />;
      
      // B2B & Logistics (Nouveaux)
      case "/admin/transport-calculator":
      case "/customer/transport-calculator":
        return <TransportCalculator />;
      
      case "/admin/tracking":
      case "/customer/tracking":
        return <ShippingTracker trackingNumber="AGR-2024-001234" />;
      
      case "/admin/carrier-dashboard":
        return <CarrierDashboard />;
      
      case "/admin/b2b-chat":
      case "/customer/b2b-chat":
        return <B2BChat contactId="seller-123" contactName="Support Client" />;
      
      case "/admin/affiliate-dashboard":
        return <AffiliateDashboard />;
      
      // Default fallback
      default:
        return isAuthenticated ? <ModernDashboard /> : <AgroLogisticRedesigned onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`min-h-screen bg-background ${theme}`}>
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
            handleNavigate("/");
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
                handleNavigate("/");
              }}
            />
            <main className="w-full md:flex-1 overflow-y-auto bg-[#F6F7F9]">
              <div className="mx-auto p-6 max-w-7xl">
                {renderContent()}
              </div>
            </main>
          </div>
        ) : (
          <main className="w-full">
            {renderContent()}
          </main>
        )}

        <ConsentBanner />
        {showBackendStatus && <BackendStatus onClose={() => setShowBackendStatus(false)} />}
        
        {/* Floating backend status button */}
        <button
          onClick={() => setShowBackendStatus(true)}
          className="fixed bottom-4 right-4 z-40 rounded-full bg-gray-800 p-3 text-white shadow-lg hover:bg-gray-700 transition-colors"
          title="Vérifier l'état du backend"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <Toaster position="top-right" />
      </div>
  );
}

export default function App() {
  return (
    <AuthProviderComponent>
      <AppShell />
    </AuthProviderComponent>
  );
}