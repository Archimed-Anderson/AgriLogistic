import { useState } from "react";
import { Toaster } from "sonner";

// Layout components
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

// Auth & Landing
import { LandingPageInteractive } from "./components/LandingPageInteractive";
import { LoginScreen } from "./components/LoginScreen";
import { RegisterScreen } from "./components/RegisterScreen";

// Dashboard
import { AdminDashboard } from "./components/AdminDashboard";
import { CustomerDashboard } from "./components/CustomerDashboard";
import { ModernDashboard } from "./components/ModernDashboard";

// Core Features
import { ChatInterface } from "./components/ChatInterface";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { MarketplaceModern } from "./components/MarketplaceModern";
import { RentalMarketplace } from "./components/RentalMarketplace";
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
import { CropIntelligence } from "./components/CropIntelligence";

// B2B & Logistics (Nouveaux composants)
import { TransportCalculator } from "./components/TransportCalculator";
import { ShippingTracker } from "./components/ShippingTracker";
import { PriceNegotiator } from "./components/PriceNegotiator";
import { B2BChat } from "./components/B2BChat";
import { CarrierDashboard } from "./components/CarrierDashboard";
import { AffiliateDashboard } from "./components/AffiliateDashboard";

export default function App() {
  const [currentRoute, setCurrentRoute] = useState("/");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminMode, setAdminMode] = useState(false);

  const isAuthenticated = !["/", "/login", "/register"].includes(currentRoute);
  
  // Sidebar visible uniquement pour les pages d'administration spécifiques
  const showSidebar = isAuthenticated && 
    (currentRoute === "/admin/panel" ||
     currentRoute.startsWith("/admin/users") || 
     currentRoute.startsWith("/admin/products") ||
     currentRoute.startsWith("/admin/orders") ||
     currentRoute.startsWith("/admin/categories") ||
     currentRoute.startsWith("/admin/reports") ||
     currentRoute.startsWith("/admin/logistics") ||
     currentRoute.startsWith("/admin/transport-calculator") ||
     currentRoute.startsWith("/admin/tracking") ||
     currentRoute.startsWith("/admin/carrier-dashboard") ||
     currentRoute.startsWith("/admin/b2b-chat") ||
     currentRoute.startsWith("/admin/affiliate-dashboard") ||
     currentRoute.startsWith("/admin/crops") ||
     currentRoute.startsWith("/admin/iot") ||
     currentRoute.startsWith("/admin/ai-insights") ||
     currentRoute.startsWith("/admin/finance") ||
     currentRoute.startsWith("/admin/automation") ||
     currentRoute.startsWith("/admin/settings") ||
     currentRoute.startsWith("/customer/orders") ||
     currentRoute.startsWith("/customer/transport-calculator") ||
     currentRoute.startsWith("/customer/tracking") ||
     currentRoute.startsWith("/customer/iot") ||
     currentRoute.startsWith("/customer/ai-insights") ||
     currentRoute.startsWith("/customer/finance") ||
     currentRoute.startsWith("/customer/crops") ||
     currentRoute.startsWith("/customer/payments") ||
     currentRoute.startsWith("/customer/settings"));

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo(0, 0);
  };

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const getSidebarType = (): "admin" | "customer" => {
    return currentRoute.startsWith("/admin") ? "admin" : "customer";
  };

  const renderContent = () => {
    switch (currentRoute) {
      // Auth & Landing
      case "/":
        return <LandingPageInteractive onNavigate={handleNavigate} />;
      case "/login":
        return <LoginScreen onNavigate={handleNavigate} />;
      case "/register":
        return <RegisterScreen onNavigate={handleNavigate} />;
      
      // Admin Dashboard
      case "/admin/overview":
      case "/admin/dashboard":
        return <ModernDashboard />;
      
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
        return <RentalMarketplace />;
      
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
        return <UserManagement />;
      
      case "/admin/products":
        return <ProductInventory />;
      
      case "/admin/orders":
        return <OrdersManagement />;
      
      case "/admin/categories":
        return <CategoryManagement />;
      
      case "/admin/reports":
        return <ReportEngine />;
      
      case "/admin/panel":
        return <AdminPanelHome onNavigate={handleNavigate} />;
      
      // Advanced Features
      case "/admin/iot":
      case "/customer/iot":
        return <IoTDeviceHub />;
      
      case "/admin/automation":
        return <AutomationWorkflows />;
      
      case "/admin/ai-insights":
      case "/customer/ai-insights":
        return <AIInsights />;
      
      case "/admin/finance":
      case "/customer/finance":
        return <FinancialSuite />;
      
      case "/admin/logistics":
      case "/customer/logistics":
        return <LogisticsTracking />;
      
      case "/admin/crops":
      case "/customer/crops":
        return <CropIntelligence />;
      
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
        return <AdminDashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-background ${theme}`}>
      {isAuthenticated && (
        <Navbar
          currentRoute={currentRoute}
          onNavigate={handleNavigate}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          notificationCount={3}
          isAuthenticated={isAuthenticated}
          adminMode={adminMode}
          onAdminModeChange={setAdminMode}
        />
      )}
      
      {showSidebar ? (
        <div className="flex h-[calc(100vh-4rem)]">
          <Sidebar
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
            type={getSidebarType()}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="container mx-auto p-6 max-w-7xl">
              {renderContent()}
            </div>
          </main>
        </div>
      ) : (
        <main className="w-full">
          {renderContent()}
        </main>
      )}

      <Toaster position="top-right" />
    </div>
  );
}