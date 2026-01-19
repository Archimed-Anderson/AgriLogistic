# 🚛 AgroLogistic Platform

> **Enterprise-grade agricultural logistics platform with microservices architecture, AI-powered features, blockchain traceability, and real-time delivery tracking.**

[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-blue)](/.github/workflows/ci.yml)
[![Docker](https://img.shields.io/badge/Docker-20.10+-blue)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)]()

---

## 🚀 Quick Start

### Development Mode (Mock Authentication)

```bash
# Clone and install dependencies
cd AgroLogistic
npm install

# Start the development server
npm run dev

# Access the platform at http://localhost:5173
```

### Production Mode (Full Backend)

```bash
# Start all infrastructure services
docker-compose up -d

# Access the platform
# Frontend:     http://localhost:3000
# Kong API:     http://localhost:8000
# Grafana:      http://localhost:3001 (admin/grafana_secure_2026)
# Prometheus:   http://localhost:9090
```

---

## 🔐 Authentication System

### Supported User Roles

| Role | Description | Features |
|------|-------------|----------|
| **Admin** | Platform administrators | Full access, user management, reports |
| **Farmer** | Agricultural producers | Product management, sales, analytics |
| **Buyer** | Product purchasers | Marketplace, orders, tracking |
| **Transporter** | Logistics providers | Delivery management, GPS tracking |

### Demo Accounts (Development Mode)

| Email | Password | Role |
|-------|----------|------|
| `admin@agrologistic.com` | admin123 | Administrator |
| `farmer@agrologistic.com` | farmer123 | Farmer |
| `buyer@agrologistic.com` | buyer123 | Buyer |
| `transporter@agrologistic.com` | transporter123 | Transporter |
| `demo@agrologistic.com` | (any password) | Demo Admin |

### Configuration

Set the auth provider in `.env`:

```env
# Development (no backend required)
VITE_AUTH_PROVIDER=mock

# Production (requires backend services)
VITE_AUTH_PROVIDER=real
VITE_API_GATEWAY_URL=http://localhost:8000/api/v1
```

---

## 📋 Features

### Core Platform
- 🛒 **Marketplace** - Agricultural products trading platform
- 📊 **Dashboard** - Real-time KPIs, weather, analytics
- 💳 **Payments** - Stripe integration with webhooks
- 📦 **Orders** - Saga pattern for distributed transactions

### Authentication & User Management
- 🔐 **Multi-role Authentication** - Admin, Farmer, Buyer, Transporter
- 📝 **Multi-step Registration** - Role-specific fields and validation
- 🔑 **Secure Password Handling** - Client-side hashing + server-side bcrypt
- 📧 **Email Verification** - Account activation via email
- 🔄 **Token Refresh** - Automatic JWT token renewal

### Advanced Features
- 🚚 **Real-time Delivery** - GPS tracking via WebSocket
- 📧 **Notifications** - Email (SendGrid), SMS (Twilio), Push (FCM)
- 🤖 **AI/ML** - Product recommendations, demand forecasting
- 📈 **Analytics** - ClickHouse OLAP with Kafka streaming
- ⛓️ **Blockchain** - Hyperledger Fabric product traceability

### DevOps
- 🔄 **CI/CD** - GitHub Actions pipelines
- 🎯 **GitOps** - ArgoCD deployments
- 📡 **Observability** - Prometheus, Grafana, Jaeger, ELK

---

## 🏗️ Architecture

```
AgroLogistic/
├── 📁 .github/workflows/       # CI/CD pipelines
│
├── 📁 docs/                    # Documentation
│   ├── ACCOUNT-CREATION-GUIDE.md
│   ├── ARCHITECTURE.md
│   ├── API_ENDPOINTS.md
│   └── IMPLEMENTATION_PLAN_PHASE[1-4].md
│
├── 📁 infrastructure/          # DevOps configurations
│   ├── argocd/                 # GitOps applications
│   ├── k8s/                    # Kubernetes manifests
│   └── monitoring/             # Prometheus, Grafana, ELK
│
├── 📁 services/                # Backend microservices
│   ├── auth-service/           # Authentication (3001)
│   ├── product-service/        # Catalog (3002)
│   ├── order-service/          # Saga pattern (3003)
│   ├── payment-service/        # Stripe (3004)
│   ├── delivery-service/       # GPS tracking (3005)
│   ├── notification-service/   # Email/SMS/Push (3006)
│   ├── ai-service/             # ML recommendations (3007)
│   ├── analytics-service/      # ClickHouse analytics (3008)
│   └── blockchain-service/     # Hyperledger Fabric (3009)
│
├── 📁 src/                     # React Frontend (Clean Architecture)
│   ├── app/                    # Pages & routing
│   ├── application/            # Use cases & DTOs
│   ├── domain/                 # Entities & business logic
│   ├── infrastructure/         # API adapters & services
│   └── presentation/           # UI components & hooks
│
├── 📁 tests/                   # E2E & integration tests
├── docker-compose.yml          # Infrastructure stack
└── package.json                # Frontend dependencies
```

---

## 🐳 Services Architecture

| Service | Port | Technology | Description |
|---------|------|------------|-------------|
| **Frontend** | 5173 (dev) / 3000 (prod) | React + Vite | Dashboard & marketplace UI |
| **Auth** | 3001 | Node.js + JWT | Authentication & authorization |
| **Product** | 3002 | Node.js + PostgreSQL | Product catalog |
| **Order** | 3003 | Node.js + Saga | Order management |
| **Payment** | 3004 | Node.js + Stripe | Payment processing |
| **Delivery** | 3005 | Node.js + Socket.io | GPS tracking |
| **Notification** | 3006 | Node.js + BullMQ | Multi-channel notifications |
| **AI** | 3007 | Node.js + TensorFlow | ML recommendations |
| **Analytics** | 3008 | Node.js + ClickHouse | Real-time analytics |
| **Blockchain** | 3009 | Node.js + Hyperledger | Product traceability |
| **Kong Gateway** | 8000 | Kong 3.5 | API Gateway |

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# Unit tests with watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e

# All tests
npm run test:all
```

---

## 📦 Deployment

### Local Development
```bash
# With mock auth (no backend needed)
VITE_AUTH_PROVIDER=mock npm run dev

# With full backend
docker-compose up -d
VITE_AUTH_PROVIDER=real npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Kubernetes Deployment
```bash
# Apply with Kustomize
kubectl apply -k infrastructure/k8s/overlays/production

# Or use ArgoCD
kubectl apply -f infrastructure/argocd/applications.yml
```

---

## 📈 Monitoring

| Dashboard | URL | Credentials |
|-----------|-----|-------------|
| Grafana | http://localhost:3001 | admin / grafana_secure_2026 |
| Prometheus | http://localhost:9090 | - |
| Kong Admin | http://localhost:8001 | - |

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Authentication Provider
VITE_AUTH_PROVIDER=mock           # mock | real

# API Configuration
VITE_API_GATEWAY_URL=http://localhost:8000/api/v1
VITE_API_URL=http://localhost:8000/api/v1

# Database (for production)
POSTGRES_PASSWORD=your_password
REDIS_PASSWORD=your_password

# JWT (for production)
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret

# External Services (optional)
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG....
TWILIO_ACCOUNT_SID=AC...
```

---

## 📚 Documentation

- [Account Creation Guide](docs/ACCOUNT-CREATION-GUIDE.md) - User registration procedures
- [Architecture Overview](docs/ARCHITECTURE.md) - System design and patterns
- [API Endpoints](docs/API_ENDPOINTS.md) - Complete API reference
- [Development Guide](docs/DEVELOPMENT_GUIDE.md) - Setup and coding standards
- [Contributing](docs/CONTRIBUTING.md) - Contribution guidelines

---

## 🔄 Recent Changes

### v2.0.0 - January 2026
- **Rebranding**: Renamed from AgroDeep to AgroLogistic
- **Multi-role Authentication**: Added support for Admin, Farmer, Buyer, Transporter roles
- **Multi-step Registration**: New comprehensive registration form with role-specific fields
- **Mock Auth Provider**: Development mode with demo accounts
- **Code Cleanup**: Removed debug logging, optimized codebase

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Built with ❤️ by the AgroLogistic Team**
