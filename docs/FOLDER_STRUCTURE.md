# 📁 AgroDeep - Structure Complète des Dossiers

## Vue d'ensemble

Ce document décrit l'intégralité de la structure de dossiers de la plateforme AgroDeep, avec des annotations détaillées pour chaque dossier et fichier important.

---

## 🌳 Arborescence Complète

```
agrodeep-platform/
│
├── 📁 .github/                              # GitHub Configuration
│   ├── 📁 workflows/                        # CI/CD Workflows
│   │   ├── 🔨 ci.yml                       # Continuous Integration
│   │   ├── 🚀 deploy.yml                   # Deployment Pipeline
│   │   ├── 🧪 test.yml                     # Automated Testing
│   │   ├── 🔍 codeql-analysis.yml          # Security Scanning
│   │   └── 📦 release.yml                  # Release Automation
│   │
│   ├── 📁 ISSUE_TEMPLATE/                   # Issue Templates
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── question.md
│   │
│   ├── 📁 PULL_REQUEST_TEMPLATE/
│   │   └── pull_request_template.md
│   │
│   └── 📄 dependabot.yml                    # Dependency Updates
│
├── 📁 docs/                                 # Documentation
│   ├── 📄 ARCHITECTURE.md                   # Architecture Overview
│   ├── 📄 FOLDER_STRUCTURE.md              # This File
│   ├── 📄 DEVELOPMENT_GUIDE.md             # Development Guide
│   ├── 📄 CONTRIBUTING.md                   # Contribution Guidelines
│   ├── 📄 CODE_OF_CONDUCT.md               # Code of Conduct
│   ├── 📄 API_DOCUMENTATION.md             # API Documentation
│   ├── 📄 COMPONENT_LIBRARY.md             # Component Documentation
│   │
│   ├── 📁 architecture/                     # Architecture Docs
│   │   ├── clean-architecture.md
│   │   ├── domain-driven-design.md
│   │   └── design-patterns.md
│   │
│   ├── 📁 decisions/                        # Architecture Decision Records
│   │   ├── 001-use-clean-architecture.md
│   │   ├── 002-state-management-zustand.md
│   │   ├── 003-testing-strategy.md
│   │   └── 004-monorepo-structure.md
│   │
│   └── 📁 guides/                           # User Guides
│       ├── getting-started.md
│       ├── deployment.md
│       └── troubleshooting.md
│
├── 📁 src/                                  # Source Code
│   │
│   ├── 📁 domain/                          # 🔵 DOMAIN LAYER
│   │   │                                    # Core Business Logic - No Dependencies
│   │   │
│   │   ├── 📁 entities/                     # Business Entities
│   │   │   ├── 📄 user.entity.ts
│   │   │   │   └── User domain model avec méthodes métier
│   │   │   │
│   │   │   ├── 📄 farm.entity.ts
│   │   │   │   └── Exploitation agricole avec coordonnées
│   │   │   │
│   │   │   ├── 📄 order.entity.ts
│   │   │   │   └── Commande marketplace avec statuts
│   │   │   │
│   │   │   ├── 📄 product.entity.ts
│   │   │   │   └── Produit agricole avec prix et stock
│   │   │   │
│   │   │   ├── 📄 transport.entity.ts
│   │   │   │   └── Transport avec calcul de coût
│   │   │   │
│   │   │   ├── 📄 device.entity.ts
│   │   │   │   └── Appareil IoT connecté
│   │   │   │
│   │   │   └── 📄 affiliate.entity.ts
│   │   │       └── Affilié avec commissions
│   │   │
│   │   ├── 📁 value-objects/               # Immutable Value Objects
│   │   │   ├── 📄 email.vo.ts
│   │   │   │   └── Email validé (regex)
│   │   │   │
│   │   │   ├── 📄 price.vo.ts
│   │   │   │   └── Prix avec devise et TVA
│   │   │   │
│   │   │   ├── 📄 coordinates.vo.ts
│   │   │   │   └── Latitude/Longitude
│   │   │   │
│   │   │   ├── 📄 delivery-address.vo.ts
│   │   │   │   └── Adresse de livraison complète
│   │   │   │
│   │   │   ├── 📄 phone-number.vo.ts
│   │   │   │   └── Numéro de téléphone validé
│   │   │   │
│   │   │   └── 📄 weight.vo.ts
│   │   │       └── Poids avec unité (kg, tonnes)
│   │   │
│   │   ├── 📁 aggregates/                   # Domain Aggregates (DDD)
│   │   │   ├── 📄 marketplace-order.aggregate.ts
│   │   │   │   └── Order + OrderItems + Payment
│   │   │   │
│   │   │   ├── 📄 transport-booking.aggregate.ts
│   │   │   │   └── Transport + Route + Carrier
│   │   │   │
│   │   │   └── 📄 farm-operations.aggregate.ts
│   │   │       └── Farm + Crops + IoTDevices
│   │   │
│   │   ├── 📁 repositories/                 # Repository Interfaces
│   │   │   ├── 📄 base.repository.ts
│   │   │   │   └── Generic repository interface
│   │   │   │
│   │   │   ├── 📄 user.repository.ts
│   │   │   ├── 📄 order.repository.ts
│   │   │   ├── 📄 product.repository.ts
│   │   │   ├── 📄 transport.repository.ts
│   │   │   └── 📄 device.repository.ts
│   │   │
│   │   ├── 📁 events/                       # Domain Events
│   │   │   ├── 📄 base.event.ts
│   │   │   ├── 📄 order-placed.event.ts
│   │   │   ├── 📄 order-cancelled.event.ts
│   │   │   ├── 📄 delivery-completed.event.ts
│   │   │   ├── 📄 payment-received.event.ts
│   │   │   └── 📄 device-connected.event.ts
│   │   │
│   │   ├── 📁 enums/                        # Domain Enumerations
│   │   │   ├── 📄 order-status.enum.ts
│   │   │   ├── 📄 payment-status.enum.ts
│   │   │   ├── 📄 transport-type.enum.ts
│   │   │   ├── 📄 user-role.enum.ts
│   │   │   └── 📄 device-status.enum.ts
│   │   │
│   │   └── 📁 exceptions/                   # Domain Exceptions
│   │       ├── 📄 domain-exception.ts
│   │       ├── 📄 invalid-price.exception.ts
│   │       ├── 📄 out-of-stock.exception.ts
│   │       ├── 📄 invalid-coordinates.exception.ts
│   │       └── 📄 unauthorized.exception.ts
│   │
│   ├── 📁 application/                     # 🟢 APPLICATION LAYER
│   │   │                                    # Use Cases & Application Services
│   │   │
│   │   ├── 📁 use-cases/                    # Use Cases (Business Actions)
│   │   │   │
│   │   │   ├── 📁 auth/                     # Authentication Use Cases
│   │   │   │   ├── 📄 login.usecase.ts
│   │   │   │   ├── 📄 register.usecase.ts
│   │   │   │   ├── 📄 logout.usecase.ts
│   │   │   │   ├── 📄 forgot-password.usecase.ts
│   │   │   │   └── 📄 verify-email.usecase.ts
│   │   │   │
│   │   │   ├── 📁 marketplace/              # Marketplace Use Cases
│   │   │   │   ├── 📄 create-order.usecase.ts
│   │   │   │   ├── 📄 cancel-order.usecase.ts
│   │   │   │   ├── 📄 update-order.usecase.ts
│   │   │   │   ├── 📄 search-products.usecase.ts
│   │   │   │   ├── 📄 add-to-cart.usecase.ts
│   │   │   │   └── 📄 checkout.usecase.ts
│   │   │   │
│   │   │   ├── 📁 transport/                # Transport Use Cases
│   │   │   │   ├── 📄 calculate-cost.usecase.ts
│   │   │   │   ├── 📄 book-transport.usecase.ts
│   │   │   │   ├── 📄 track-shipment.usecase.ts
│   │   │   │   ├── 📄 assign-carrier.usecase.ts
│   │   │   │   └── 📄 confirm-delivery.usecase.ts
│   │   │   │
│   │   │   ├── 📁 iot/                      # IoT Use Cases
│   │   │   │   ├── 📄 register-device.usecase.ts
│   │   │   │   ├── 📄 read-sensor-data.usecase.ts
│   │   │   │   ├── 📄 configure-device.usecase.ts
│   │   │   │   └── 📄 send-command.usecase.ts
│   │   │   │
│   │   │   ├── 📁 analytics/                # Analytics Use Cases
│   │   │   │   ├── 📄 generate-report.usecase.ts
│   │   │   │   ├── 📄 export-data.usecase.ts
│   │   │   │   ├── 📄 calculate-kpi.usecase.ts
│   │   │   │   └── 📄 create-dashboard.usecase.ts
│   │   │   │
│   │   │   ├── 📁 financial/                # Financial Use Cases
│   │   │   │   ├── 📄 process-payment.usecase.ts
│   │   │   │   ├── 📄 generate-invoice.usecase.ts
│   │   │   │   ├── 📄 calculate-commission.usecase.ts
│   │   │   │   └── 📄 track-revenue.usecase.ts
│   │   │   │
│   │   │   └── 📁 admin/                    # Admin Use Cases
│   │   │       ├── 📄 manage-users.usecase.ts
│   │   │       ├── 📄 manage-products.usecase.ts
│   │   │       ├── 📄 manage-categories.usecase.ts
│   │   │       └── 📄 system-settings.usecase.ts
│   │   │
│   │   ├── 📁 services/                     # Application Services
│   │   │   ├── 📄 notification.service.ts
│   │   │   ├── 📄 email.service.ts
│   │   │   ├── 📄 sms.service.ts
│   │   │   ├── 📄 payment.service.ts
│   │   │   ├── 📄 pricing.service.ts
│   │   │   ├── 📄 geocoding.service.ts
│   │   │   └── 📄 weather.service.ts
│   │   │
│   │   ├── 📁 dto/                          # Data Transfer Objects
│   │   │   ├── 📁 request/
│   │   │   │   ├── 📄 create-order.dto.ts
│   │   │   │   ├── 📄 transport-booking.dto.ts
│   │   │   │   └── 📄 user-registration.dto.ts
│   │   │   │
│   │   │   └── 📁 response/
│   │   │       ├── 📄 order-response.dto.ts
│   │   │       ├── 📄 user-profile.dto.ts
│   │   │       └── 📄 transport-cost.dto.ts
│   │   │
│   │   ├── 📁 mappers/                      # Entity ↔ DTO Mappers
│   │   │   ├── 📄 order.mapper.ts
│   │   │   ├── 📄 user.mapper.ts
│   │   │   ├── 📄 product.mapper.ts
│   │   │   └── 📄 transport.mapper.ts
│   │   │
│   │   ├── 📁 validators/                   # Business Validators
│   │   │   ├── 📄 order.validator.ts
│   │   │   ├── 📄 transport.validator.ts
│   │   │   ├── 📄 payment.validator.ts
│   │   │   └── 📄 user.validator.ts
│   │   │
│   │   └── 📁 ports/                        # Ports (Hexagonal Architecture)
│   │       ├── 📄 notification.port.ts
│   │       ├── 📄 payment.port.ts
│   │       └── 📄 storage.port.ts
│   │
│   ├── 📁 infrastructure/                  # 🟡 INFRASTRUCTURE LAYER
│   │   │                                    # External Implementations
│   │   │
│   │   ├── 📁 api/                          # API Clients
│   │   │   ├── 📁 rest/
│   │   │   │   ├── 📄 http-client.ts
│   │   │   │   ├── 📄 interceptors.ts
│   │   │   │   └── 📄 error-handler.ts
│   │   │   │
│   │   │   └── 📁 graphql/
│   │   │       ├── 📄 apollo-client.ts
│   │   │       └── 📄 queries.ts
│   │   │
│   │   ├── 📁 persistence/                  # Data Persistence
│   │   │   ├── 📁 in-memory/               # In-Memory (Dev/Test)
│   │   │   │   ├── 📄 user.repository.impl.ts
│   │   │   │   ├── 📄 order.repository.impl.ts
│   │   │   │   └── 📄 product.repository.impl.ts
│   │   │   │
│   │   │   ├── 📁 local-storage/           # Browser Storage
│   │   │   │   ├── 📄 cart.repository.impl.ts
│   │   │   │   └── 📄 preferences.repository.impl.ts
│   │   │   │
│   │   │   └── 📁 supabase/                # Supabase Backend
│   │   │       ├── 📄 supabase-client.ts
│   │   │       ├── 📄 user.repository.impl.ts
│   │   │       ├── 📄 order.repository.impl.ts
│   │   │       └── 📄 product.repository.impl.ts
│   │   │
│   │   ├── 📁 messaging/                    # Event Bus & Messaging
│   │   │   ├── 📄 event-bus.ts
│   │   │   ├── 📄 event-dispatcher.ts
│   │   │   └── 📄 message-queue.ts
│   │   │
│   │   ├── 📁 logging/                      # Logging & Monitoring
│   │   │   ├── 📄 logger.ts
│   │   │   ├── 📄 sentry.config.ts
│   │   │   ├── 📄 analytics.ts
│   │   │   └── 📄 performance-monitor.ts
│   │   │
│   │   ├── 📁 adapters/                     # External Service Adapters
│   │   │   ├── 📄 email.adapter.ts
│   │   │   ├── 📄 sms.adapter.ts
│   │   │   ├── 📄 payment.adapter.ts
│   │   │   └── 📄 weather.adapter.ts
│   │   │
│   │   └── 📁 config/                       # Configuration
│   │       ├── 📄 env.config.ts
│   │       ├── 📄 api.config.ts
│   │       ├── 📄 database.config.ts
│   │       └── 📄 feature-flags.ts
│   │
│   ├── 📁 presentation/                    # 🔴 PRESENTATION LAYER
│   │   │                                    # UI Components & State
│   │   │
│   │   ├── 📁 components/                   # React Components
│   │   │   │
│   │   │   ├── 📁 ui/                      # Design System (Atomic Design)
│   │   │   │   │
│   │   │   │   ├── 📁 atoms/               # Atomic Components
│   │   │   │   │   ├── 📄 Button.tsx
│   │   │   │   │   ├── 📄 Input.tsx
│   │   │   │   │   ├── 📄 Card.tsx
│   │   │   │   │   ├── 📄 Badge.tsx
│   │   │   │   │   ├── 📄 Avatar.tsx
│   │   │   │   │   ├── 📄 Icon.tsx
│   │   │   │   │   └── 📄 Spinner.tsx
│   │   │   │   │
│   │   │   │   ├── 📁 molecules/           # Molecule Components
│   │   │   │   │   ├── 📄 FormField.tsx
│   │   │   │   │   ├── 📄 SearchBar.tsx
│   │   │   │   │   ├── 📄 ProductCard.tsx
│   │   │   │   │   ├── 📄 StatsCard.tsx
│   │   │   │   │   └── 📄 NotificationItem.tsx
│   │   │   │   │
│   │   │   │   ├── 📁 organisms/           # Organism Components
│   │   │   │   │   ├── 📄 Navbar.tsx
│   │   │   │   │   ├── 📄 Sidebar.tsx
│   │   │   │   │   ├── 📄 ProductGrid.tsx
│   │   │   │   │   ├── 📄 OrderSummary.tsx
│   │   │   │   │   ├── 📄 DashboardStats.tsx
│   │   │   │   │   └── 📄 DataTable.tsx
│   │   │   │   │
│   │   │   │   └── 📁 templates/           # Layout Templates
│   │   │   │       ├── 📄 DashboardLayout.tsx
│   │   │   │       ├── 📄 AdminLayout.tsx
│   │   │   │       └── 📄 MarketplaceLayout.tsx
│   │   │   │
│   │   │   ├── 📁 features/                # Feature Components
│   │   │   │   │
│   │   │   │   ├── 📁 marketplace/
│   │   │   │   │   ├── 📄 ProductList.tsx
│   │   │   │   │   ├── 📄 ProductDetail.tsx
│   │   │   │   │   ├── 📄 ShoppingCart.tsx
│   │   │   │   │   ├── 📄 Checkout.tsx
│   │   │   │   │   └── 📄 OrderHistory.tsx
│   │   │   │   │
│   │   │   │   ├── 📁 transport/
│   │   │   │   │   ├── 📄 TransportCalculator.tsx
│   │   │   │   │   ├── 📄 ShippingTracker.tsx
│   │   │   │   │   ├── 📄 CarrierDashboard.tsx
│   │   │   │   │   └── 📄 B2BChat.tsx
│   │   │   │   │
│   │   │   │   ├── 📁 iot/
│   │   │   │   │   ├── 📄 IoTDeviceHub.tsx
│   │   │   │   │   ├── 📄 SensorDashboard.tsx
│   │   │   │   │   └── 📄 DeviceControl.tsx
│   │   │   │   │
│   │   │   │   ├── 📁 analytics/
│   │   │   │   │   ├── 📄 AnalyticsDashboard.tsx
│   │   │   │   │   ├── 📄 ReportEngine.tsx
│   │   │   │   │   └── 📄 ChartViewer.tsx
│   │   │   │   │
│   │   │   │   ├── 📁 auth/
│   │   │   │   │   ├── 📄 LoginScreen.tsx
│   │   │   │   │   ├── 📄 RegisterScreen.tsx
│   │   │   │   │   └── 📄 ForgotPassword.tsx
│   │   │   │   │
│   │   │   │   ├── 📁 admin/
│   │   │   │   │   ├── 📄 UserManagement.tsx
│   │   │   │   │   ├── 📄 ProductInventory.tsx
│   │   │   │   │   ├── 📄 OrdersManagement.tsx
│   │   │   │   │   └── 📄 CategoryManagement.tsx
│   │   │   │   │
│   │   │   │   └── 📁 financial/
│   │   │   │       ├── 📄 FinancialSuite.tsx
│   │   │   │       └── 📄 AffiliateDashboard.tsx
│   │   │   │
│   │   │   └── 📁 layout/                  # Layout Components
│   │   │       ├── 📄 Header.tsx
│   │   │       ├── 📄 Footer.tsx
│   │   │       └── 📄 MainLayout.tsx
│   │   │
│   │   ├── 📁 pages/                        # Page Components (Routes)
│   │   │   ├── 📄 HomePage.tsx
│   │   │   ├── 📄 MarketplacePage.tsx
│   │   │   ├── 📄 DashboardPage.tsx
│   │   │   ├── 📄 AdminPage.tsx
│   │   │   ├── 📄 ProfilePage.tsx
│   │   │   ├── 📄 NotFoundPage.tsx
│   │   │   └── 📄 ErrorPage.tsx
│   │   │
│   │   ├── 📁 hooks/                        # Custom React Hooks
│   │   │   ├── 📄 useAuth.ts
│   │   │   ├── 📄 useOrders.ts
│   │   │   ├── 📄 useProducts.ts
│   │   │   ├── 📄 useTransport.ts
│   │   │   ├── 📄 useTheme.ts
│   │   │   ├── 📄 useNotifications.ts
│   │   │   └── 📄 useDebounce.ts
│   │   │
│   │   ├── 📁 contexts/                     # React Contexts
│   │   │   ├── 📄 AuthContext.tsx
│   │   │   ├── 📄 ThemeContext.tsx
│   │   │   ├── 📄 NotificationContext.tsx
│   │   │   └── 📄 CartContext.tsx
│   │   │
│   │   ├── 📁 stores/                       # State Management (Zustand)
│   │   │   ├── 📄 auth.store.ts
│   │   │   ├── 📄 cart.store.ts
│   │   │   ├── 📄 ui.store.ts
│   │   │   ├── 📄 notifications.store.ts
│   │   │   └── 📄 filters.store.ts
│   │   │
│   │   └── 📁 routing/                      # Routing Configuration
│   │       ├── 📄 routes.tsx
│   │       ├── 📄 guards.tsx
│   │       ├── 📄 PrivateRoute.tsx
│   │       └── 📄 RouteConfig.tsx
│   │
│   ├── 📁 shared/                          # ⚫ SHARED UTILITIES
│   │   │                                    # Cross-Cutting Concerns
│   │   │
│   │   ├── 📁 constants/                    # Application Constants
│   │   │   ├── 📄 routes.constants.ts
│   │   │   ├── 📄 api.constants.ts
│   │   │   ├── 📄 validation.constants.ts
│   │   │   └── 📄 theme.constants.ts
│   │   │
│   │   ├── 📁 helpers/                      # Helper Functions
│   │   │   ├── 📄 date.helper.ts
│   │   │   ├── 📄 currency.helper.ts
│   │   │   ├── 📄 string.helper.ts
│   │   │   ├── 📄 array.helper.ts
│   │   │   └── 📄 validation.helper.ts
│   │   │
│   │   ├── 📁 types/                        # TypeScript Types
│   │   │   ├── 📄 common.types.ts
│   │   │   ├── 📄 api.types.ts
│   │   │   ├── 📄 user.types.ts
│   │   │   └── 📄 product.types.ts
│   │   │
│   │   └── 📁 utils/                        # Utility Functions
│   │       ├── 📄 logger.util.ts
│   │       ├── 📄 storage.util.ts
│   │       ├── 📄 crypto.util.ts
│   │       └── 📄 format.util.ts
│   │
│   ├── 📁 styles/                          # Global Styles
│   │   ├── 📄 fonts.css
│   │   ├── 📄 theme.css
│   │   ├── 📄 globals.css
│   │   └── 📄 tailwind.css
│   │
│   ├── 📁 assets/                          # Static Assets
│   │   ├── 📁 images/
│   │   ├── 📁 icons/
│   │   └── 📁 fonts/
│   │
│   ├── 📁 config/                          # Application Config
│   │   ├── 📄 app.config.ts
│   │   ├── 📄 routes.config.ts
│   │   └── 📄 theme.config.ts
│   │
│   ├── 📄 App.tsx                          # Root Component
│   ├── 📄 main.tsx                         # Entry Point
│   └── 📄 vite-env.d.ts                    # Vite TypeScript
│
├── 📁 public/                              # Public Assets
│   ├── 📄 favicon.ico
│   ├── 📄 robots.txt
│   └── 📄 manifest.json
│
├── 📁 tests/                               # Tests
│   ├── 📁 unit/                            # Unit Tests
│   │   ├── 📁 domain/
│   │   ├── 📁 application/
│   │   └── 📁 presentation/
│   │
│   ├── 📁 integration/                     # Integration Tests
│   │   ├── 📁 api/
│   │   └── 📁 repositories/
│   │
│   ├── 📁 e2e/                             # End-to-End Tests
│   │   ├── 📄 login.spec.ts
│   │   ├── 📄 marketplace.spec.ts
│   │   └── 📄 checkout.spec.ts
│   │
│   └── 📁 fixtures/                        # Test Fixtures
│       ├── 📄 users.fixture.ts
│       ├── 📄 orders.fixture.ts
│       └── 📄 products.fixture.ts
│
├── 📁 scripts/                             # Build & Dev Scripts
│   ├── 📄 build.sh
│   ├── 📄 deploy.sh
│   ├── 📄 test.sh
│   └── 📄 seed-data.ts
│
├── 📁 tools/                               # Development Tools
│   ├── 📁 generators/                      # Code Generators
│   │   ├── 📄 component.generator.ts
│   │   ├── 📄 usecase.generator.ts
│   │   └── 📄 entity.generator.ts
│   │
│   └── 📁 scripts/
│       └── 📄 analyze-bundle.ts
│
├── 📄 .editorconfig                        # Editor Configuration
├── 📄 .eslintrc.cjs                        # ESLint Configuration
├── 📄 .prettierrc                          # Prettier Configuration
├── 📄 .gitignore                           # Git Ignore Rules
├── 📄 .env.example                         # Environment Variables Example
│
├── 📄 tsconfig.json                        # TypeScript Configuration
├── 📄 tsconfig.node.json                   # TypeScript Node Config
├── 📄 vite.config.ts                       # Vite Configuration
├── 📄 vitest.config.ts                     # Vitest Configuration
├── 📄 playwright.config.ts                 # Playwright Configuration
├── 📄 tailwind.config.js                   # Tailwind Configuration
│
├── 📄 package.json                         # Dependencies & Scripts
├── 📄 pnpm-lock.yaml                       # Lock File
│
├── 📄 README.md                            # Project README
├── 📄 CHANGELOG.md                         # Changelog
└── 📄 LICENSE                              # MIT License
```

---

## 📊 Statistiques de la Structure

```
Statistiques du Projet:
├── Total Folders: ~80
├── Configuration Files: 15
├── Documentation Files: 10
├── Source Folders (src/): 45
└── Test Folders: 10
```

---

## 🎯 Légende des Icônes

```
📁 Dossier                      🔵 Domain Layer
📄 Fichier                      🟢 Application Layer
🔨 Configuration               🟡 Infrastructure Layer
🧪 Tests                       🔴 Presentation Layer
🚀 Deployment                  ⚫ Shared/Utils
🔍 Quality Assurance
```

---

## 🔄 Flux de Création de Fichiers

### Exemple: Créer une nouvelle fonctionnalité "Crop Management"

```
1. Domain Layer:
   └── src/domain/entities/crop.entity.ts
   └── src/domain/value-objects/harvest-date.vo.ts
   └── src/domain/events/crop-planted.event.ts

2. Application Layer:
   └── src/application/use-cases/crops/plant-crop.usecase.ts
   └── src/application/dto/request/plant-crop.dto.ts
   └── src/application/validators/crop.validator.ts

3. Infrastructure Layer:
   └── src/infrastructure/persistence/supabase/crop.repository.impl.ts

4. Presentation Layer:
   └── src/presentation/components/features/crops/CropManagement.tsx
   └── src/presentation/hooks/useCrops.ts
   └── src/presentation/pages/CropsPage.tsx

5. Tests:
   └── tests/unit/domain/entities/crop.entity.spec.ts
   └── tests/unit/application/plant-crop.usecase.spec.ts
   └── tests/e2e/crop-management.spec.ts
```

---

## 🚦 Conventions de Nommage

### Fichiers

```
✅ CORRECT:
- user.entity.ts
- create-order.usecase.ts
- ProductCard.tsx
- useAuth.ts
- order.repository.ts

❌ INCORRECT:
- User.ts (manque .entity)
- createOrder.ts (camelCase au lieu de kebab-case)
- productCard.tsx (composant doit être PascalCase)
- use_auth.ts (underscore au lieu de camelCase)
```

### Dossiers

```
✅ CORRECT:
- use-cases/
- value-objects/
- marketplace/

❌ INCORRECT:
- UseCases/ (PascalCase)
- value_objects/ (underscore)
- Marketplace/ (PascalCase)
```

---

## 📝 Notes Importantes

### ⚠️ Règles Strictes par Couche

#### Domain Layer
```
✅ Autorisé:
- Entities, Value Objects, Aggregates
- Interfaces (repositories, events)
- Pure TypeScript/JavaScript
- Business logic uniquement

❌ Interdit:
- Import de React, Vite, ou autre framework
- API calls, localStorage, fetch
- Dépendances externes (sauf types)
```

#### Application Layer
```
✅ Autorisé:
- Use cases, Services
- Orchestration entre domain et infra
- Validation métier
- Mapping DTO ↔ Entity

❌ Interdit:
- Code UI (JSX, composants)
- Direct API calls (utiliser les ports)
- Logique de présentation
```

#### Infrastructure Layer
```
✅ Autorisé:
- Implémentation des repositories
- API clients
- Adapters externes
- Configuration

❌ Interdit:
- Logique métier
- Composants React
- Business rules
```

#### Presentation Layer
```
✅ Autorisé:
- Composants React
- Hooks, Contexts
- State management (Zustand)
- Routing

❌ Interdit:
- Logique métier complexe
- Direct database access
- Business rules implementation
```

---

## 🔗 Liens Rapides

- [Architecture Overview](./ARCHITECTURE.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [Component Library](./COMPONENT_LIBRARY.md)

---

**Dernière mise à jour:** $(date)  
**Version:** 2.0.0  
**Mainteneur:** AgroDeep Team
