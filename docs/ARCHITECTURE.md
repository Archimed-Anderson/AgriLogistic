# 🏗️ AgroLogistic - Architecture Documentation

## Vue d'ensemble

AgroLogistic est une plateforme SaaS complète pour la chaîne d'approvisionnement agricole construite selon les principes de **Clean Architecture** et **Domain-Driven Design (DDD)**.

---

## 📐 Diagramme d'Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                      AgroLogistic PLATFORM                          │
│              Clean Architecture + Modular Design                │
└─────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  DOMAIN      │      │ APPLICATION  │      │ PRESENTATION │
│  (Entities)  │◄─────│ (Use Cases)  │─────▶│   (UI/UX)    │
│              │      │              │      │              │
│ • User       │      │ • Services   │      │ • Components │
│ • Farm       │      │ • Handlers   │      │ • Pages      │
│ • Order      │      │ • Validators │      │ • Hooks      │
│ • Product    │      │ • Mappers    │      │ • Contexts   │
└──────────────┘      └──────────────┘      └──────────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               ▼
                    ┌──────────────────┐
                    │ INFRASTRUCTURE   │
                    │  (External I/O)  │
                    │                  │
                    │ • API Clients    │
                    │ • Storage        │
                    │ • Messaging      │
                    │ • Logging        │
                    └──────────────────┘
```

---

## 🎯 Principes Architecturaux

### 1. **Dependency Rule**
```
Domain ◄── Application ◄── Infrastructure
   ▲                              │
   └──────── Presentation ────────┘

Les dépendances pointent TOUJOURS vers le centre (Domain)
```

### 2. **Separation of Concerns**
Chaque couche a une responsabilité unique et bien définie :

| Couche | Responsabilité | Dépendances |
|--------|---------------|-------------|
| **Domain** | Logique métier pure | Aucune |
| **Application** | Orchestration use cases | Domain uniquement |
| **Infrastructure** | Implémentation technique | Domain + Application |
| **Presentation** | Interface utilisateur | Application + Infrastructure |

### 3. **Testability**
```
┌─────────────────────────────────────┐
│ Domain Layer: 100% testable        │  ← Tests unitaires purs
├─────────────────────────────────────┤
│ Application Layer: Mockable        │  ← Tests avec mocks
├─────────────────────────────────────┤
│ Infrastructure: Integration tests   │  ← Tests d'intégration
├─────────────────────────────────────┤
│ Presentation: E2E + Component tests │  ← Tests Vitest + Playwright
└─────────────────────────────────────┘
```

---

## 📦 Structure des Couches

### 🔵 **DOMAIN LAYER** (Core Business Logic)

```
src/domain/
├── entities/                    # Entités métier
│   ├── user.entity.ts
│   ├── farm.entity.ts
│   ├── order.entity.ts
│   ├── product.entity.ts
│   └── transport.entity.ts
│
├── value-objects/              # Objets valeur immuables
│   ├── email.vo.ts
│   ├── price.vo.ts
│   ├── coordinates.vo.ts
│   └── delivery-address.vo.ts
│
├── aggregates/                 # Agrégats DDD
│   ├── marketplace-order.aggregate.ts
│   └── transport-booking.aggregate.ts
│
├── repositories/               # Interfaces de persistence
│   ├── user.repository.ts
│   ├── order.repository.ts
│   └── product.repository.ts
│
├── events/                     # Domain Events
│   ├── order-placed.event.ts
│   ├── delivery-completed.event.ts
│   └── payment-received.event.ts
│
└── exceptions/                 # Business Exceptions
    ├── domain-exception.ts
    ├── invalid-price.exception.ts
    └── out-of-stock.exception.ts
```

**Règles strictes :**
- ❌ Pas de dépendances externes (frameworks, libs)
- ❌ Pas d'I/O (API, DB, localStorage)
- ✅ Logique métier pure et testable
- ✅ TypeScript strict mode

---

### 🟢 **APPLICATION LAYER** (Use Cases & Services)

```
src/application/
├── use-cases/                  # Use Cases (actions métier)
│   ├── auth/
│   │   ├── login.usecase.ts
│   │   ├── register.usecase.ts
│   │   └── logout.usecase.ts
│   │
│   ├── marketplace/
│   │   ├── create-order.usecase.ts
│   │   ├── cancel-order.usecase.ts
│   │   └── search-products.usecase.ts
│   │
│   ├── transport/
│   │   ├── calculate-cost.usecase.ts
│   │   ├── book-transport.usecase.ts
│   │   └── track-shipment.usecase.ts
│   │
│   ├── iot/
│   │   ├── register-device.usecase.ts
│   │   └── read-sensor-data.usecase.ts
│   │
│   └── analytics/
│       ├── generate-report.usecase.ts
│       └── export-data.usecase.ts
│
├── services/                   # Services d'application
│   ├── notification.service.ts
│   ├── email.service.ts
│   ├── payment.service.ts
│   └── pricing.service.ts
│
├── dto/                        # Data Transfer Objects
│   ├── create-order.dto.ts
│   ├── transport-booking.dto.ts
│   └── user-profile.dto.ts
│
├── mappers/                    # Entity ↔ DTO mappers
│   ├── order.mapper.ts
│   ├── user.mapper.ts
│   └── product.mapper.ts
│
└── validators/                 # Business Validators
    ├── order.validator.ts
    ├── transport.validator.ts
    └── payment.validator.ts
```

**Responsabilités :**
- Orchestrer les entités du domain
- Coordonner les transactions
- Appliquer les règles métier complexes
- Mapper les données entre couches

---

### 🟡 **INFRASTRUCTURE LAYER** (Implémentations Techniques)

```
src/infrastructure/
├── api/                        # API Clients externes
│   ├── rest/
│   │   ├── http-client.ts
│   │   └── interceptors.ts
│   └── graphql/
│       └── apollo-client.ts
│
├── persistence/                # Implémentations repositories
│   ├── in-memory/             # Pour tests & développement
│   │   ├── user.repository.impl.ts
│   │   └── order.repository.impl.ts
│   │
│   ├── local-storage/         # Persistence locale
│   │   └── cart.repository.impl.ts
│   │
│   └── supabase/              # Backend réel
│       ├── user.repository.impl.ts
│       └── order.repository.impl.ts
│
├── messaging/                  # Event Bus & Messaging
│   ├── event-bus.ts
│   └── message-queue.ts
│
├── logging/                    # Logging & Monitoring
│   ├── logger.ts
│   ├── sentry.config.ts
│   └── analytics.ts
│
└── config/                     # Configuration
    ├── env.config.ts
    ├── api.config.ts
    └── feature-flags.ts
```

**Caractéristiques :**
- Implémente les interfaces du domain
- Gère les I/O (API, DB, Cache)
- Swap facile des implémentations
- Configuration centralisée

---

### 🔴 **PRESENTATION LAYER** (UI Components & State)

```
src/presentation/
├── components/                 # React Components
│   ├── ui/                    # Design System (Atomic Design)
│   │   ├── atoms/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   │
│   │   ├── molecules/
│   │   │   ├── FormField.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── ProductCard.tsx
│   │   │
│   │   ├── organisms/
│   │   │   ├── Navbar.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   └── OrderSummary.tsx
│   │   │
│   │   └── templates/
│   │       ├── DashboardLayout.tsx
│   │       └── AdminLayout.tsx
│   │
│   ├── features/              # Feature Components
│   │   ├── marketplace/
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   └── ShoppingCart.tsx
│   │   │
│   │   ├── transport/
│   │   │   ├── TransportCalculator.tsx
│   │   │   ├── ShippingTracker.tsx
│   │   │   └── CarrierDashboard.tsx
│   │   │
│   │   ├── iot/
│   │   │   ├── IoTDeviceHub.tsx
│   │   │   └── SensorDashboard.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   └── ReportEngine.tsx
│   │   │
│   │   └── auth/
│   │       ├── LoginScreen.tsx
│   │       └── RegisterScreen.tsx
│   │
│   └── layout/                # Layout Components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
│
├── pages/                     # Page Components (Routes)
│   ├── HomePage.tsx
│   ├── MarketplacePage.tsx
│   ├── DashboardPage.tsx
│   └── AdminPage.tsx
│
├── hooks/                     # Custom React Hooks
│   ├── useAuth.ts
│   ├── useOrders.ts
│   ├── useTransport.ts
│   └── useTheme.ts
│
├── contexts/                  # React Contexts
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── NotificationContext.tsx
│
├── stores/                    # State Management (Zustand)
│   ├── auth.store.ts
│   ├── cart.store.ts
│   ├── ui.store.ts
│   └── notifications.store.ts
│
└── routing/                   # Routing Configuration
    ├── routes.tsx
    ├── guards.tsx
    └── RouteConfig.tsx
```

**Architecture Composants :**
```
Page Component
    ↓
Container (Smart Component - Business Logic)
    ↓
Presentational Component (Props in, Events out)
    ↓
UI Components (Design System)
```

---

## 🔄 Flux de Données

### Exemple : Création d'une commande marketplace

```
┌──────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                               │
└──────────────────────────────────────────────────────────────┘
         │ Click "Commander"
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. PRESENTATION LAYER                                        │
│    - ProductDetail.tsx                                       │
│    - Collecte les données du formulaire                     │
└──────────────────────────────────────────────────────────────┘
         │ createOrder(dto)
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. APPLICATION LAYER                                         │
│    - CreateOrderUseCase.execute(dto)                        │
│    - Validation des données                                  │
│    - Orchestration de la logique métier                     │
└──────────────────────────────────────────────────────────────┘
         │ validate() + save()
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. DOMAIN LAYER                                              │
│    - Order.create(...)                                       │
│    - Order.validate()                                        │
│    - OrderPlacedEvent                                        │
└──────────────────────────────────────────────────────────────┘
         │ repository.save(order)
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. INFRASTRUCTURE LAYER                                      │
│    - OrderRepository.save()                                  │
│    - API call to backend                                     │
│    - Event Bus publish                                       │
└──────────────────────────────────────────────────────────────┘
         │ Response
         ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. BACK TO PRESENTATION                                      │
│    - Success notification                                    │
│    - Navigation to order page                                │
│    - UI update                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 🧩 Modules & Bounded Contexts (DDD)

```
AgroLogistic Platform
│
├── 🛒 Marketplace Context
│   ├── Products
│   ├── Orders
│   ├── Payments
│   └── Shopping Cart
│
├── 🚚 Transport & Logistics Context
│   ├── Transport Calculator
│   ├── Shipping Tracker
│   ├── Carrier Management
│   └── B2B Chat
│
├── 🌾 Agriculture Intelligence Context
│   ├── Crop Intelligence
│   ├── IoT Device Hub
│   ├── AI Insights
│   └── Automation Workflows
│
├── 💰 Financial Context
│   ├── Financial Suite
│   ├── Invoicing
│   ├── Affiliate Program
│   └── Revenue Tracking
│
├── 📊 Analytics Context
│   ├── Analytics Dashboard
│   ├── Report Engine
│   ├── KPI Tracking
│   └── Data Export
│
├── 👥 User Management Context
│   ├── Authentication
│   ├── Authorization
│   ├── User Profiles
│   └── Role Management
│
└── 📚 Content & Learning Context
    ├── Blog
    ├── Academy Portal
    ├── Documentation
    └── Knowledge Base
```

---

## 🔌 Intégrations & APIs

### API Strategy

```
┌─────────────────────────────────────────┐
│         Frontend (React)                │
├─────────────────────────────────────────┤
│    API Layer (React Query)              │
├─────────────────────────────────────────┤
│    HTTP Client (Axios/Fetch)            │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│      Backend APIs                       │
│                                         │
│  • Supabase (Auth, DB, Storage)        │
│  • External Services (Weather, Maps)   │
│  • Payment Gateway                      │
│  • Messaging Services                   │
└─────────────────────────────────────────┘
```

---

## 🧪 Testing Strategy

```
┌──────────────────────────────────────────────────────────┐
│                   TESTING PYRAMID                        │
│                                                          │
│                        /\                                │
│                       /E2E\      ← Playwright (Critiques)│
│                      /______\                            │
│                     /        \                           │
│                    /Integration\ ← Vitest (API + State) │
│                   /______________\                       │
│                  /                \                      │
│                 /  Unit Tests      \ ← Vitest (Logique) │
│                /____________________\                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Couverture de tests par couche

| Couche | Type de test | Outil | Couverture cible |
|--------|-------------|-------|-----------------|
| Domain | Unit | Vitest | 100% |
| Application | Unit + Integration | Vitest | 90% |
| Infrastructure | Integration | Vitest | 70% |
| Presentation | Component + E2E | Vitest + Playwright | 80% |

---

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTION                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │   Vercel     │      │   Supabase   │                   │
│  │  (Frontend)  │─────▶│   (Backend)  │                   │
│  └──────────────┘      └──────────────┘                   │
│         │                      │                           │
│         ▼                      ▼                           │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │   Cloudflare │      │  PostgreSQL  │                   │
│  │     (CDN)    │      │   Database   │                   │
│  └──────────────┘      └──────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Documentation & Resources

- **ARCHITECTURE.md** (ce fichier) - Vue d'ensemble architecture
- **FOLDER_STRUCTURE.md** - Structure détaillée des dossiers
- **DEVELOPMENT_GUIDE.md** - Guide développement
- **CONTRIBUTING.md** - Guide contribution
- **API_DOCUMENTATION.md** - Documentation API
- **COMPONENT_LIBRARY.md** - Design System documentation

---

## 🔄 Migration Strategy

### Phase 1: Foundation (Semaine 1-2)
- ✅ Créer structure de dossiers
- ✅ Mettre en place configuration
- ✅ Setup testing framework
- ✅ Documentation initiale

### Phase 2: Domain & Application (Semaine 3-4)
- ⬜ Extraire logique métier en entities
- ⬜ Créer use cases
- ⬜ Implémenter value objects
- ⬜ Définir events

### Phase 3: Infrastructure (Semaine 5-6)
- ⬜ Implémenter repositories
- ⬜ Setup API clients
- ⬜ Configuration persistence
- ⬜ Logging & monitoring

### Phase 4: Presentation Refactoring (Semaine 7-8)
- ⬜ Migrer composants vers nouvelle structure
- ⬜ Setup state management (Zustand)
- ⬜ Routing refactoring
- ⬜ Hooks customisés

### Phase 5: Testing & Quality (Semaine 9-10)
- ⬜ Tests unitaires domain
- ⬜ Tests intégration
- ⬜ Tests E2E critiques
- ⬜ Performance optimization

---

## 🎯 Métriques de Qualité

```
Code Quality Targets:
├── Test Coverage: > 80%
├── TypeScript Strict: 100%
├── ESLint Errors: 0
├── Bundle Size: < 500KB (gzipped)
├── Lighthouse Score: > 90
└── Core Web Vitals: All Green
```

---

## 🤝 Contributing

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les guidelines de contribution.

---

## 📝 License

MIT License - Voir [LICENSE](../LICENSE)

---

**Dernière mise à jour:** $(date)  
**Version:** 2.0.0  
**Mainteneur:** AgroLogistic Team
