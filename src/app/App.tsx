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
import { VerifyEmailPage } from "@presentation/pages/VerifyEmailPage";

// Dashboard
import { ModernDashboard } from "./components/ModernDashboard";
import { ModernizedDashboard } from "./components/dashboard/ModernizedDashboard";

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
import { ProjectDetailPage } from "./components/landing/pages/ProjectDetailPage";
import { DemoPage } from "./components/landing/pages/DemoPage";

import { SolutionsLogisticsPage } from "./components/landing/pages/SolutionsLogisticsPage";
import { PartnersEcosystemPage } from "./components/landing/pages/PartnersEcosystemPage";
import { SustainableLogisticsPage } from "./components/landing/pages/SustainableLogisticsPage";
import { TechBlogPage } from "./components/landing/pages/TechBlogPage";

// AgriLogistic Link Hub
import LinkHubPage from "./link-hub/page";
import LinkMonitorPage from "./admin/link-monitor/page";


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
      case "/verify-email":
        return <VerifyEmailPage onNavigate={handleNavigate} />;
      case "/demo":
        return <DemoPage onNavigate={handleNavigate} />;
      

      case "/solutions/logistics":
        return <SolutionsLogisticsPage onNavigate={handleNavigate} />;
      case "/about/partners":
        return <PartnersEcosystemPage onNavigate={handleNavigate} />;
      case "/commitments/sustainability":
        return <SustainableLogisticsPage onNavigate={handleNavigate} />;
      case "/resources/blog":
      case "/blog":
        return <TechBlogPage onNavigate={handleNavigate} />;

      // Admin Dashboard
      case "/admin/overview":
      case "/admin/dashboard":
        return <ModernizedDashboard onNavigate={handleNavigate} />;
      
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
      
      case "/link-hub":
        return <LinkHubPage />;
      
      case "/admin/link-monitor":
        return <LinkMonitorPage />;
      
      // Projects Pages
      // Contact Pages
      case "/contact/general":
        return (
          <ProjectDetailPage 
            onNavigate={handleNavigate}
            title="General Inquiries"
            category="Contact Us"
            date="24/7 Availability"
            client="AgroLogistic Support"
            image="/assets/images/landing/contact-general.png"
            content={(
              <>
                <h2>We're Here to Help</h2>
                <p>Have a question about our platform, services, or pricing? Our team is ready to provide you with the answers you need to get started.</p>
                <h3>How we can assist:</h3>
                <ul>
                  <li>Platform demonstrations and walkthroughs.</li>
                  <li>Account setup and configuration guidance.</li>
                  <li>General information about sustainable farming.</li>
                </ul>
              </>
            )}
          />
        );
      case "/contact/support":
        return (
          <ProjectDetailPage 
            onNavigate={handleNavigate}
            title="Technical Support"
            category="Customer Success"
            date="Immediate Response"
            client="Active Users"
            image="/assets/images/landing/contact-support.png"
            content={(
              <>
                <h2>Expert Technical Assistance</h2>
                <p>Facing a technical issue? Our dedicated support engineers are here to ensure your operations run smoothly without interruption.</p>
                <h3>Support Services:</h3>
                <ul>
                  <li>Real-time troubleshooting for IOT devices.</li>
                  <li>Data synchronization and API integration help.</li>
                  <li>System upgrade and maintenance support.</li>
                </ul>
              </>
            )}
          />
        );
      case "/contact/partnerships":
        return (
          <ProjectDetailPage 
            onNavigate={handleNavigate}
            title="Strategic Partnerships"
            category="Business Development"
            date="Global Network"
            client="Enterprise Partners"
            image="/assets/images/landing/contact-partners.png"
            content={(
              <>
                <h2>Grow With Us</h2>
                <p>We are always looking to collaborate with organizations that share our vision for a sustainable agricultural future. Let's build something great together.</p>
                <h3>Partnership Opportunities:</h3>
                <ul>
                  <li>Supply chain integration for retailers.</li>
                  <li>Technology co-development and research.</li>
                  <li>NGO and government sustainability initiatives.</li>
                </ul>
              </>
            )}
          />
        );

      // Story Pages
      case "/story/eco-practices":
        return (
           <ProjectDetailPage 
            onNavigate={handleNavigate}
            title="Eco-Friendly Farming Practices"
            category="Our Story"
            date="Since 2018"
            client="Internal Initiative"
            image="/assets/images/landing/story-eco-practices.png"
            content={(
              <>
                <h2>Preserving Nature, Enhancing Yields</h2>
                <p>We believe that high-yield agriculture shouldn't come at the cost of the environment. Our eco-friendly practices focus on regenerative agriculture, ensuring soil health and biodiversity are maintained.</p>
                <h3>Key Synergies</h3>
                <ul>
                  <li>Regenerative Soil Management: Using cover crops and composting to sequester carbon.</li>
                  <li>Integrated Pest Management (IPM): Reducing pesticide use by introducing natural predators.</li>
                  <li>Water Conservation: Precision irrigation to minimize runoff and waste.</li>
                </ul>
              </>
            )}
          />
        );
      case "/story/fair-trade":
        return (
          <ProjectDetailPage 
            onNavigate={handleNavigate}
            title="Fair Trade Marketplace"
            category="Social Impact"
            date="Global Reach"
            client="Community Driven"
            image="/assets/images/landing/story-fair-trade.png"
            content={(
              <>
                <h2>Empowering Farmers Globally</h2>
                <p>AgroLogistic cuts out the middlemen, connecting smallholder farmers directly to global buyers. This ensures fairer prices, transparent transactions, and faster payments.</p>
                <h3>Marketplace Features</h3>
                <ul>
                  <li>Direct Access: Farmers sell directly to retailers and processors.</li>
                  <li>Price Transparency: Real-time market data available to all users.</li>
                  <li>Secure Payments: Blockchain-verified transactions ensure trust and speed.</li>
                </ul>
              </>
            )}
          />
        );

      // Sustainable Practices Pages
      case "/practices/yield-growth":
        return (
          <ProjectDetailPage 
            onNavigate={handleNavigate}
            title="80% Yield Growth"
            category="Performance"
            date="Ongoing"
            client="AgroLogistic Standard"
            image="/assets/images/landing/practice-yield-growth.png"
            content={(
              <>
                <h2>Maximizing Crop Potential</h2>
                <p>Our AI-driven analytics platform processes millions of data points daily to provide actionable insights. This allows farmers to optimize planting schedules, nutrient application, and pest control.</p>
                <h3>Impact Metrics</h3>
                <ul>
                  <li>Average yield increase of 80% within first 2 years.</li>
                  <li>Reduction in chemical usage by 35%.</li>
                  <li>Real-time disease detection accuracy of 99%.</li>
                </ul>
              </>
            )}
          />
        );
      case "/practices/water-efficiency":
        return (
          <ProjectDetailPage 
            onNavigate={handleNavigate}
            title="100% Efficient Water Use"
            category="Sustainability"
            date="Standard Feature"
            client="Global Partners"
            image="/assets/images/landing/practice-water-efficiency.png"
            content={(
              <>
                <h2>Smart Irrigation Technology</h2>
                <p>Water is our most precious resource. Our smart irrigation systems ensure that every drop counts, delivering water directly to the plant roots based on real-time soil moisture data.</p>
                <h3>Technology Specs</h3>
                <ul>
                  <li>Automated drip irrigation valves.</li>
                  <li>Soil moisture sensors at multiple depths.</li>
                  <li>Weather-adaptive watering schedules.</li>
                </ul>
              </>
            )}
          />
        );
      case "/practices/renewable-energy":
        return (
          <ProjectDetailPage 
            onNavigate={handleNavigate}
            title="Renewable Energy Integration"
            category="Energy"
            date="infrastructure"
            client="Eco-Certified Farms"
            image="/assets/images/landing/practice-renewable-energy.png"
            content={(
              <>
                <h2>Powering the Future</h2>
                <p>We help farms transition to 100% renewable energy sources. From solar panels on barn roofs to wind turbines in open fields, we integrate clean energy into every aspect of operations.</p>
                <h3>Benefits</h3>
                <ul>
                  <li>Zero operational carbon footprint.</li>
                  <li>Significant reduction in electricity costs.</li>
                  <li>Energy independence for remote locations.</li>
                </ul>
              </>
            )}
          />
        );

      case "/projects/eco-farm":
        return (
          <ProjectDetailPage 
            onNavigate={handleNavigate}
            title="Eco-Farm Expansion"
            category="Infrastructure"
            date="October 2024"
            client="BioFuture Holdings"
            image="/assets/images/landing/project-eco-farm.png"
            content={(
              <>
                <h2>Expansion Overview</h2>
                <p>We successfully expanded the operational capacity of BioFuture's main facility by 200%. This project included the installation of a 500kW solar array, automated greenhouses, and a vertically integrated logistics hub.</p>
                <h3>Key Achievements</h3>
                <ul>
                  <li>Fully energy self-sufficient facility.</li>
                  <li>Integrated water recycling reducing consumption by 60%.</li>
                  <li>Automated climate control systems.</li>
                </ul>
              </>
            )}
          />
        );
      case "/projects/smart-irrigation":
        return (
          <ProjectDetailPage 
            onNavigate={handleNavigate}
            title="Smart Irrigation System"
            category="Technology"
            date="November 2024"
            client="AgriTech Solutions"
            image="/assets/images/landing/project-smart-irrigation.png"
            content={(
              <>
                <h2>The Challenge</h2>
                <p>Water scarcity in the region demanded a revolutionary approach to crop hydration. Traditional methods were wasteful and imprecise.</p>
                <h3>Our Solution</h3>
                <p>We deployed a network of over 1000 IoT sensors connected to a central AI processing unit. This system analyzes soil moisture, weather forecasts, and crop health in real-time to deliver the exact amount of water needed.</p>
                <h3>Results</h3>
                <ul>
                  <li>40% Reduction in water usage.</li>
                  <li>15% Increase in crop yield.</li>
                  <li>Zero runoff waste.</li>
                </ul>
              </>
            )}
          />
        );
      case "/projects/logistics":
        return (
          <ProjectDetailPage 
            onNavigate={handleNavigate}
            title="Organic Supply Chain"
            category="Logistics"
            date="December 2024"
            client="GreenGrocer Co-op"
            image="/assets/images/landing/project-logistics.png"
            content={(
              <>
                <h2>Project Scope</h2>
                <p>Establishing a farm-to-table logistics network for a cooperative of 50 local organic farmers. The goal was to minimize time from harvest to retail shelf.</p>
                <h3>Implementation</h3>
                <p>Our team implemented a synchronized fleet management system using electric trucks and a centralized distribution warehouse with automated sorting.</p>
                <h3>Impact</h3>
                <ul>
                  <li>Freshness guarantee improved from 3 days to 7 days.</li>
                  <li>Carbon footprint reduced by 85% thanks to EV fleet.</li>
                  <li>Real-time tracking for end consumers via QR codes.</li>
                </ul>
              </>
            )}
          />
        );
      
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