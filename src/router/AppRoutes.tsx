import { Route, Routes, Navigate } from "react-router-dom";

import { RootLayout } from "@layouts/RootLayout";
import { NavigateAdapter } from "@router/NavigateAdapter";
import { RequireAuth } from "@router/guards/RequireAuth";
import { RequirePermissions } from "@router/guards/RequirePermissions";
import { RequireRole } from "@router/guards/RequireRole";

import { NotFoundPage } from "@pages/NotFoundPage";
import { PaymentsPage } from "@pages/customer/PaymentsPage";
import {
  ContactGeneralPage,
  ContactPartnershipsPage,
  ContactSupportPage,
  PracticesRenewableEnergyPage,
  PracticesWaterEfficiencyPage,
  PracticesYieldGrowthPage,
  ProjectEcoFarmPage,
  ProjectLogisticsPage,
  ProjectSmartIrrigationPage,
  StoryEcoPracticesPage,
  StoryFairTradePage,
} from "@pages/marketing/MarketingDetailPages";

// Auth & Landing
import { AgroLogisticRedesigned } from "@/app/components/landing/AgroLogisticRedesigned";
import { LoginPage } from "@presentation/pages/LoginPage";
import { RegisterPage } from "@presentation/pages/RegisterPage";
import { ModernAuthPage } from "@presentation/pages/ModernAuthPage";
import { ForgotPasswordPage } from "@presentation/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@presentation/pages/ResetPasswordPage";
import { VerifyEmailPage } from "@presentation/pages/VerifyEmailPage";
// Dashboard
import { ModernDashboard } from "@/app/components/ModernDashboard";

// Core Features
import { ChatInterface } from "@/app/components/ChatInterface";
import { AnalyticsDashboard } from "@/app/components/AnalyticsDashboard";
import { MarketplaceModern } from "@/app/components/MarketplaceModern";
import { RentalMarketplace } from "@/app/components/RentalMarketplace";
import { Settings } from "@/app/components/Settings";
import { ProfilePage } from "@/app/components/ProfilePage";
import { NotificationsPage } from "@/app/components/NotificationsPage";

// Blog / Academy
import { BlogHome } from "@/app/components/BlogHome";
import { BlogArticle } from "@/app/components/BlogArticle";
import { BlogAdmin } from "@/app/components/BlogAdmin";
import { BlogAdminDashboard } from "@/app/components/BlogAdminDashboard";
import { ArticleEditor } from "@/app/components/ArticleEditor";
import { EventsManager } from "@/app/components/EventsManager";
import { AcademyPortal } from "@/app/components/AcademyPortal";

// Admin Features
import { ProductInventory } from "@/app/components/ProductInventory";
import { OrdersManagement } from "@/app/components/OrdersManagement";
import { CategoryManagement } from "@/app/components/CategoryManagement";
import { ReportEngine } from "@/app/components/ReportEngine";
import { AdminPanelHome } from "@/app/components/AdminPanelHome";
import { LaborManagement } from "@/app/components/LaborManagement";

// Advanced Features
import { IoTDeviceHub } from "@/app/components/IoTDeviceHub";
import { AutomationWorkflows } from "@/app/components/AutomationWorkflows";
import { AIInsights } from "@/app/components/AIInsights";
import { FinancialSuite } from "@/app/components/FinancialSuite";
import { LogisticsTracking } from "@/app/components/LogisticsTracking";

// Farm dashboard
import { WeatherDashboard } from "@/app/components/WeatherDashboard";
import { SoilWaterManagement } from "@/app/components/SoilWaterManagement";
import { EquipmentManagement } from "@/app/components/EquipmentManagement";
import { TaskManagement } from "@/app/components/TaskManagement";
import { HelpSupport } from "@/app/components/HelpSupport";
import { CropManagement } from "@/app/components/CropManagement";

// B2B & Logistics (UI)
import { TransportCalculator } from "@/app/components/TransportCalculator";
import { ShippingTracker } from "@/app/components/ShippingTracker";
import { B2BChat } from "@/app/components/B2BChat";
import { CarrierDashboard } from "@/app/components/CarrierDashboard";
import { AffiliateDashboard } from "@/app/components/AffiliateDashboard";
import { SolutionsFarmersPage } from "@/app/components/landing/pages/SolutionsFarmersPage";
import { TechBlogPage } from "@/app/components/landing/pages/TechBlogPage";
import { DemoInteractivePage } from "@/app/components/landing/pages/DemoInteractivePage";
import CaseStudiesPage from "@pages/marketing/CaseStudiesPage";
import DigitalTransformationPage from "@pages/marketing/DigitalTransformationPage";

import { Permission } from "@domain/value-objects/permissions.vo";
import { UserRole } from "@domain/enums/user-role.enum";

// New Admin Dashboard
import UnifiedAdminLayout from "@/app/admin/components/unified/UnifiedAdminLayout";
import WarRoomPage from "@/app/admin/war-room/page";
import AdminUsersPage from "@/app/admin/users/page";
import AdminAnalyticsPage from "@/app/(admin)/analytics/page";
import AdminSystemPage from "@/app/(admin)/system/page";
import AdminSecurityPage from "@/app/(admin)/security/page";
import CombinedTasksPage from "@/app/(admin)/tasks/page";

// Farmer Dashboard Pages
import FarmerDashboardPage from "@/app/(farmer)/dashboard/page";
import FarmOperationsPage from "@/app/(farmer)/farm/operations/page";
import MarketplaceProPage from "@/app/(farmer)/marketplace/pro/page";
import RentalManagerPage from "@/app/(farmer)/rental/manager/page";
import LogisticsHubPage from "@/app/(farmer)/logistics/hub/page";

// Transporter Dashboard Pages
import TransporterLayout from "@/app/(transporter)/layout";
import TransporterDashboardPage from "@/app/(transporter)/dashboard/page";
import RouteOptimizerPage from "@/app/(transporter)/routes/page";
import ShipmentsPage from "@/app/(transporter)/shipments/page";
import FleetPage from "@/app/(transporter)/fleet/page";
import FinancePage from "@/app/(transporter)/finance/page";
import MarketplacePage from "@/app/(transporter)/marketplace/page";
import AnalyticsPage from "@/app/(transporter)/analytics/page";

// Buyer Dashboard
import BuyerLayout from "@/app/(buyer)/layout";
import BuyerDashboardPage from "@/app/(buyer)/dashboard/page";
import BuyerMarketplacePage from "@/app/(buyer)/marketplace/page";
import BuyerOrdersPage from "@/app/(buyer)/orders/page";
import BuyerSuppliersPage from "@/app/(buyer)/suppliers/page";
import BuyerTraceabilityPage from "@/app/(buyer)/traceability/page";
import BuyerQualityPage from "@/app/(buyer)/quality/page";
import BuyerInventoryPage from "@/app/(buyer)/inventory/page";
import BuyerAnalyticsPage from "@/app/(buyer)/analytics/page";
import BuyerDeliveriesPage from "@/app/(buyer)/deliveries/page";
import BuyerFinancePage from "@/app/(buyer)/finance/page";
import BuyerCommunityPage from "@/app/(buyer)/community/page";
import BuyerSettingsPage from "@/app/(buyer)/settings/page";
import BuyerAssistantPage from "@/app/(buyer)/assistant/page";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {/* Public */}
        <Route path="/" element={<NavigateAdapter component={AgroLogisticRedesigned} />} />
        <Route path="/auth" element={<NavigateAdapter component={ModernAuthPage} />} />
        <Route path="/login" element={<NavigateAdapter component={LoginPage} />} />
        <Route path="/register" element={<NavigateAdapter component={RegisterPage} />} />
        <Route path="/forgot-password" element={<NavigateAdapter component={ForgotPasswordPage} />} />
        <Route path="/reset-password" element={<NavigateAdapter component={ResetPasswordPage} />} />
        <Route path="/verify-email" element={<NavigateAdapter component={VerifyEmailPage} />} />
        <Route path="/verify-email" element={<NavigateAdapter component={VerifyEmailPage} />} />
        {/* Old Demo Page route replaced/aliased if needed, keeping /demo for the new page */}
        <Route path="/demo" element={<NavigateAdapter component={DemoInteractivePage} />} />

        {/* Marketing / landing detail pages */}
        <Route path="/contact/general" element={<NavigateAdapter component={ContactGeneralPage} />} />
        <Route path="/contact/support" element={<NavigateAdapter component={ContactSupportPage} />} />
        <Route path="/contact/partnerships" element={<NavigateAdapter component={ContactPartnershipsPage} />} />
        <Route path="/story/eco-practices" element={<NavigateAdapter component={StoryEcoPracticesPage} />} />
        <Route path="/story/fair-trade" element={<NavigateAdapter component={StoryFairTradePage} />} />
        <Route path="/practices/yield-growth" element={<NavigateAdapter component={PracticesYieldGrowthPage} />} />
        <Route path="/practices/water-efficiency" element={<NavigateAdapter component={PracticesWaterEfficiencyPage} />} />
        <Route path="/practices/renewable-energy" element={<NavigateAdapter component={PracticesRenewableEnergyPage} />} />
        <Route path="/projects/eco-farm" element={<NavigateAdapter component={ProjectEcoFarmPage} />} />
        <Route path="/projects/smart-irrigation" element={<NavigateAdapter component={ProjectSmartIrrigationPage} />} />
        <Route path="/projects/logistics" element={<NavigateAdapter component={ProjectLogisticsPage} />} />
        <Route path="/blog" element={<NavigateAdapter component={TechBlogPage} />} />
        <Route path="/solutions/farmers" element={<NavigateAdapter component={SolutionsFarmersPage} />} />
        <Route path="/case-studies" element={<NavigateAdapter component={CaseStudiesPage} />} />
        <Route path="/tag/digital-transformation" element={<NavigateAdapter component={DigitalTransformationPage} />} />

        {/* Protected (Admin / Customer) */}
        <Route element={<RequireAuth />}>
          {/* Dashboards */}
          <Route path="/customer/overview" element={<ModernDashboard />} />
          <Route path="/customer/dashboard" element={<ModernDashboard />} />

          {/* Core */}
          <Route path="/admin/chat" element={<ChatInterface />} />
          <Route path="/customer/chat" element={<ChatInterface />} />

          {/* <Route path="/admin/analytics" element={<AnalyticsDashboard />} /> */}
          <Route path="/customer/analytics" element={<AnalyticsDashboard />} />

          <Route path="/admin/marketplace" element={<MarketplaceModern />} />
          <Route path="/customer/marketplace" element={<MarketplaceModern />} />

          <Route path="/admin/rental" element={<RentalMarketplace />} />
          <Route path="/customer/rental" element={<RentalMarketplace />} />

          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/customer/settings" element={<Settings />} />

          <Route path="/admin/profile" element={<ProfilePage />} />
          <Route path="/customer/profile" element={<ProfilePage />} />

          <Route path="/admin/notifications" element={<NotificationsPage />} />
          <Route path="/customer/notifications" element={<NotificationsPage />} />

          {/* Blog */}
          <Route path="/admin/blog" element={<NavigateAdapter component={BlogAdminDashboard} />} />
          <Route path="/admin/blog/editor" element={<NavigateAdapter component={ArticleEditor} />} />
          <Route path="/admin/blog/events" element={<NavigateAdapter component={EventsManager} />} />
          <Route path="/admin/blog/manage" element={<NavigateAdapter component={BlogAdmin} />} />
          <Route path="/customer/blog" element={<NavigateAdapter component={BlogHome} />} />
          <Route path="/admin/blog/article" element={<NavigateAdapter component={BlogArticle} />} />
          <Route path="/customer/blog/article" element={<NavigateAdapter component={BlogArticle} />} />
          <Route path="/admin/blog/manage" element={<NavigateAdapter component={BlogAdmin} />} />

          {/* Academy */}
          <Route path="/admin/academy" element={<NavigateAdapter component={AcademyPortal} />} />
          <Route path="/customer/academy" element={<NavigateAdapter component={AcademyPortal} />} />

          <Route path="/admin" element={<UnifiedAdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="overview" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<WarRoomPage />} />
            <Route path="war-room" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Admin-only modules moved inside layout */}
            <Route
              path="users"
              element={
                <RequirePermissions
                  moduleLabel="Gestion Utilisateurs"
                  anyOf={[Permission.VIEW_USERS, Permission.EDIT_USERS, Permission.DELETE_USERS]}
                >
                  <AdminUsersPage />
                </RequirePermissions>
              }
            />
            <Route
              path="products"
              element={
                <RequirePermissions moduleLabel="Produits" anyOf={[Permission.VIEW_ALL_PRODUCTS]}>
                  <ProductInventory />
                </RequirePermissions>
              }
            />
            <Route
              path="orders"
              element={
                <RequirePermissions moduleLabel="Commandes" anyOf={[Permission.MANAGE_ORDERS, Permission.VIEW_ALL_ORDERS]}>
                  <OrdersManagement />
                </RequirePermissions>
              }
            />
            <Route
              path="categories"
              element={
                <RequirePermissions moduleLabel="Catégories" anyOf={[Permission.MANAGE_CATEGORIES]}>
                  <CategoryManagement />
                </RequirePermissions>
              }
            />
            <Route
              path="reports"
              element={
                <RequirePermissions moduleLabel="Rapports" anyOf={[Permission.VIEW_ANALYTICS, Permission.EXPORT_REPORTS]}>
                  <ReportEngine />
                </RequirePermissions>
              }
            />
            
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="system" element={<AdminSystemPage />} />
            <Route path="security" element={<AdminSecurityPage />} />
            <Route path="panel" element={<NavigateAdapter component={AdminPanelHome} />} />
            <Route
              path="labor"
              element={
                <RequireRole moduleLabel="Gestion Main-d'œuvre" anyOf={[UserRole.ADMIN]}>
                  <LaborManagement />
                </RequireRole>
              }
            />
            <Route path="iot" element={<IoTDeviceHub />} />
            <Route
              path="automation"
              element={
                <RequireRole moduleLabel="Automation" anyOf={[UserRole.ADMIN]}>
                  <AutomationWorkflows />
                </RequireRole>
              }
            />
            <Route path="ai-insights" element={<AIInsights />} />
            <Route
              path="finance"
              element={
                <RequirePermissions moduleLabel="Finance" anyOf={[Permission.VIEW_FINANCIAL_REPORTS]}>
                  <FinancialSuite />
                </RequirePermissions>
              }
            />
            <Route
              path="logistics"
              element={
                <RequirePermissions moduleLabel="Logistique" anyOf={[Permission.MANAGE_LOGISTICS, Permission.VIEW_DELIVERY_ORDERS]}>
                  <LogisticsTracking />
                </RequirePermissions>
              }
            />
            <Route path="chat" element={<ChatInterface />} />
            <Route path="blog" element={<NavigateAdapter component={BlogAdminDashboard} />} />
            <Route path="blog/editor" element={<NavigateAdapter component={ArticleEditor} />} />
            <Route path="blog/events" element={<NavigateAdapter component={EventsManager} />} />
            <Route path="blog/manage" element={<NavigateAdapter component={BlogAdmin} />} />
            <Route path="academy" element={<NavigateAdapter component={AcademyPortal} />} />
            <Route path="help" element={<HelpSupport />} />
          </Route>


          <Route
            path="/admin/crops"
            element={
              <RequireRole moduleLabel="Gestion Cultures" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <CropManagement />
              </RequireRole>
            }
          />
          <Route
            path="/customer/crops"
            element={
              <RequireRole moduleLabel="Gestion Cultures" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <CropManagement />
              </RequireRole>
            }
          />

          <Route
            path="/admin/weather"
            element={
              <RequireRole moduleLabel="Météo" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <WeatherDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/customer/weather"
            element={
              <RequireRole moduleLabel="Météo" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <WeatherDashboard />
              </RequireRole>
            }
          />

          <Route
            path="/admin/soil-water"
            element={
              <RequireRole moduleLabel="Sol & Eau" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <SoilWaterManagement />
              </RequireRole>
            }
          />
          <Route
            path="/customer/soil-water"
            element={
              <RequireRole moduleLabel="Sol & Eau" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <SoilWaterManagement />
              </RequireRole>
            }
          />

          <Route
            path="/admin/equipment"
            element={
              <RequireRole moduleLabel="Équipements" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <EquipmentManagement />
              </RequireRole>
            }
          />
          <Route
            path="/customer/equipment"
            element={
              <RequireRole moduleLabel="Équipements" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <EquipmentManagement />
              </RequireRole>
            }
          />

            <Route
              path="/admin/tasks"
              element={
                <RequireRole moduleLabel="Gestion Tâches" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                  <CombinedTasksPage />
                </RequireRole>
              }
            />
          <Route
            path="/customer/tasks"
            element={
              <RequireRole moduleLabel="Gestion Tâches" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <TaskManagement />
              </RequireRole>
            }
          />

          <Route path="/admin/help" element={<HelpSupport />} />
          <Route path="/customer/help" element={<HelpSupport />} />

          {/* B2B & logistics UI */}
          <Route path="/admin/transport-calculator" element={<TransportCalculator />} />
          <Route path="/customer/transport-calculator" element={<TransportCalculator />} />
          <Route path="/admin/tracking" element={<ShippingTracker trackingNumber="AGR-2024-001234" />} />
          <Route path="/customer/tracking" element={<ShippingTracker trackingNumber="AGR-2024-001234" />} />
          <Route path="/admin/carrier-dashboard" element={<CarrierDashboard />} />
          <Route path="/admin/b2b-chat" element={<B2BChat contactId="seller-123" contactName="Support Client" />} />
          <Route path="/customer/b2b-chat" element={<B2BChat contactId="seller-123" contactName="Support Client" />} />
          <Route path="/admin/affiliate-dashboard" element={<AffiliateDashboard />} />

          {/* Routes referenced by sidebar but missing previously */}
          <Route path="/customer/payments" element={<PaymentsPage />} />

          {/* Farmer Dashboard Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <RequireRole moduleLabel="Dashboard Agriculteur" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <FarmerDashboardPage />
              </RequireRole>
            }
          />
          <Route
            path="/farmer/operations"
            element={
              <RequireRole moduleLabel="Opérations Ferme" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <FarmOperationsPage />
              </RequireRole>
            }
          />
          <Route
            path="/farmer/marketplace"
            element={
              <RequireRole moduleLabel="Marketplace Pro" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <MarketplaceProPage />
              </RequireRole>
            }
          />
          <Route
            path="/farmer/rental"
            element={
              <RequireRole moduleLabel="Gestion Location" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <RentalManagerPage />
              </RequireRole>
            }
          />
          <Route
            path="/farmer/logistics"
            element={
              <RequireRole moduleLabel="Hub Logistique" anyOf={[UserRole.ADMIN, UserRole.FARMER]}>
                <LogisticsHubPage />
              </RequireRole>
            }
          />

          {/* Transporter Dashboard Routes */}
          <Route path="/transporter" element={<TransporterLayout />}>
            <Route
              index
              element={
                <RequireRole moduleLabel="Dashboard Transporteur" anyOf={[UserRole.ADMIN, UserRole.TRANSPORTER]}>
                  <TransporterDashboardPage />
                </RequireRole>
              }
            />
            <Route
              path="dashboard"
              element={
                <RequireRole moduleLabel="Dashboard Transporteur" anyOf={[UserRole.ADMIN, UserRole.TRANSPORTER]}>
                  <TransporterDashboardPage />
                </RequireRole>
              }
            />
            <Route
              path="routes"
              element={
                <RequireRole moduleLabel="Optimiseur de Routes" anyOf={[UserRole.ADMIN, UserRole.TRANSPORTER]}>
                  <RouteOptimizerPage />
                </RequireRole>
              }
            />
            <Route
              path="shipments"
              element={
                <RequireRole moduleLabel="Gestion Livraisons" anyOf={[UserRole.ADMIN, UserRole.TRANSPORTER]}>
                  <ShipmentsPage />
                </RequireRole>
              }
            />
            <Route
              path="fleet"
              element={
                <RequireRole moduleLabel="Gestion Flotte" anyOf={[UserRole.ADMIN, UserRole.TRANSPORTER]}>
                  <FleetPage />
                </RequireRole>
              }
            />
            <Route
              path="finance"
              element={
                <RequireRole moduleLabel="Gestion Finance" anyOf={[UserRole.ADMIN, UserRole.TRANSPORTER]}>
                  <FinancePage />
                </RequireRole>
              }
            />
            <Route
              path="marketplace"
              element={
                <RequireRole moduleLabel="Bourse de Fret" anyOf={[UserRole.ADMIN, UserRole.TRANSPORTER]}>
                  <MarketplacePage />
                </RequireRole>
              }
            />
            <Route
              path="analytics"
              element={
                <RequireRole moduleLabel="Analytics" anyOf={[UserRole.ADMIN, UserRole.TRANSPORTER]}>
                  <AnalyticsPage />
                </RequireRole>
              }
            />
        </Route>

          {/* Buyer Dashboard Routes */}
          <Route path="/buyer" element={<BuyerLayout />}>
            <Route
              index
              element={
                <RequireRole moduleLabel="Dashboard Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerDashboardPage />
                </RequireRole>
              }
            />
            <Route
              path="dashboard"
              element={
                <RequireRole moduleLabel="Dashboard Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerDashboardPage />
                </RequireRole>
              }
            />
            <Route
              path="marketplace"
              element={
                <RequireRole moduleLabel="Marketplace Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerMarketplacePage />
                </RequireRole>
              }
            />
            <Route
              path="orders"
              element={
                <RequireRole moduleLabel="Commandes Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerOrdersPage />
                </RequireRole>
              }
            />
            <Route
              path="suppliers"
              element={
                <RequireRole moduleLabel="Fournisseurs Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerSuppliersPage />
                </RequireRole>
              }
            />
            <Route
              path="traceability"
              element={
                <RequireRole moduleLabel="Traçabilité Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerTraceabilityPage />
                </RequireRole>
              }
            />
            <Route
              path="quality"
              element={
                <RequireRole moduleLabel="Qualité Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerQualityPage />
                </RequireRole>
              }
            />
            <Route
              path="inventory"
              element={
                <RequireRole moduleLabel="Inventaire Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerInventoryPage />
                </RequireRole>
              }
            />
            <Route
              path="analytics"
              element={
                <RequireRole moduleLabel="Analytics Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerAnalyticsPage />
                </RequireRole>
              }
            />
            <Route
              path="deliveries"
              element={
                <RequireRole moduleLabel="Livraisons Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerDeliveriesPage />
                </RequireRole>
              }
            />
            <Route
              path="finance"
              element={
                <RequireRole moduleLabel="Finance Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerFinancePage />
                </RequireRole>
              }
            />
            <Route
              path="community"
              element={
                <RequireRole moduleLabel="Communauté Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerCommunityPage />
                </RequireRole>
              }
            />
            <Route
              path="settings"
              element={
                <RequireRole moduleLabel="Paramètres Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerSettingsPage />
                </RequireRole>
              }
            />
            <Route
              path="assistant"
              element={
                <RequireRole moduleLabel="Assistant IA Acheteur" anyOf={[UserRole.ADMIN, UserRole.BUYER]}>
                  <BuyerAssistantPage />
                </RequireRole>
              }
            />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

