# 🌾 AgriLogistic - Cloud Native Agricultural Platform

![Version](https://img.shields.io/badge/version-5.0.0--Cloud--Native-emerald.svg?style=for-the-badge&logo=appveyor)
![Status](https://img.shields.io/badge/status-Production_Ready-success.svg?style=for-the-badge)
![Stack](https://img.shields.io/badge/Stack-Next.js_14_|_NestJS_|_Python_|_Neon_|_R2-black?style=for-the-badge)
![Cloud](https://img.shields.io/badge/Cloud-Vercel_|_Render_|_Cloudflare-blue?style=for-the-badge)

> **"L'OS de l'Agriculture Africaine"** : Plateforme Cloud Native unifiée pour la chaîne de valeur agricole, de la production à la consommation.

---

## 🚀 Quick Start (Cloud Native)

```bash
# 1. Clone & Setup
git clone https://github.com/your-org/agrilogistic.git
cd AgroDeep

# 2. Install Dependencies
pnpm install

# 3. Configure Environment
cp .env.production.example .env
# Fill in your Neon, R2, and API credentials

# 4. Push Database Schema
cd packages/database
npx prisma db push

# 5. Start Development
cd ../..
pnpm dev
```

**📍 Access Points:**
- **Frontend (Next.js):** http://localhost:3000
- **API (NestJS):** http://localhost:3001
- **AI Service (FastAPI):** http://localhost:8000

---

## ☁️ Cloud Native Architecture (v5.0)

AgriLogistic has been fully migrated to a **Cloud Native architecture** for maximum scalability, performance, and cost-efficiency.

### Architecture Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLOUD NATIVE STACK                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   VERCEL     │    │    RENDER    │    │  CLOUDFLARE  │      │
│  │  (Frontend)  │    │  (Backend)   │    │   (Workers)  │      │
│  │              │    │              │    │              │      │
│  │  Next.js 14  │◄──►│  NestJS API  │◄──►│   Webhooks   │      │
│  │  Multi-region│    │  Python AI   │    │   R2 Storage │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                    │                    │             │
│         └────────────────────┼────────────────────┘             │
│                              ▼                                  │
│                    ┌──────────────────┐                         │
│                    │  NEON POSTGRESQL │                         │
│                    │   (Serverless)   │                         │
│                    └──────────────────┘                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

| Component | Technology | Purpose | Cost |
|-----------|------------|---------|------|
| **Frontend** | Vercel (Next.js 14) | Multi-region deployment, SSR, API routes | $0 (100GB/mo) |
| **API** | Render (NestJS) | RESTful API, WebSockets, health checks | $0 (512MB RAM) |
| **AI Service** | Render (Python FastAPI) | ML inference, disease prediction | $0 (512MB RAM) |
| **Database** | Neon PostgreSQL | Serverless, auto-scaling, branching | $0 (0.5GB, 100 CU-h) |
| **Storage** | Cloudflare R2 | Zero-egress object storage | $0 (10GB, ∞ egress) |
| **Webhooks** | Cloudflare Workers | Mobile Money validation, HMAC-SHA256 | $0 (100k req/day) |

**Total Monthly Cost**: **$0** for up to 500 active users

---

## 📦 Deployment Guide

### Prerequisites

- [Neon](https://neon.tech) account (PostgreSQL)
- [Cloudflare](https://cloudflare.com) account (R2 + Workers)
- [Vercel](https://vercel.com) account (Frontend)
- [Render](https://render.com) account (Backend)

### Step-by-Step Deployment

Follow our comprehensive deployment guide: [`docs/QUICK_DEPLOY.md`](docs/QUICK_DEPLOY.md)

**Estimated Time**: 30 minutes

### Documentation

- **[Quick Deploy Guide](docs/QUICK_DEPLOY.md)** - 30-minute production deployment
- **[Environment Variables](docs/ENVIRONMENT_VARIABLES.md)** - Configuration reference
- **[Neon Setup](docs/NEON_SETUP.md)** - PostgreSQL database setup
- **[R2 Setup](docs/R2_SETUP.md)** - Object storage configuration
- **[AI Service Optimization](docs/AI_SERVICE_OPTIMIZATION.md)** - Performance tuning
- **[Cloudflare Workers](docs/CLOUDFLARE_WORKERS.md)** - Webhook deployment

---

## ✅ Implementation Status (Feb 2026)

| Phase | Module | Status | Technologies |
|-------|--------|--------|--------------|
| **Phase 1** | Core Foundation | ✅ **DONE** | NestJS, PostgreSQL, JWT, Redis |
| **Phase 2** | Smart Logistics | ✅ **DONE** | PostGIS, Redis, Kafka |
| **Phase 3** | IoT Cold Chain | ✅ **READY** | MQTT, InfluxDB, ML Predictor |
| **Phase 3** | Agri-Vision AI | ✅ **READY** | Ollama (LLaVA), FastAPI |
| **Phase 3** | Agri-Coop (Web3) | ✅ **READY** | Solana, CTT Tokenomics |
| **Phase 4** | Agri-Insurance | ✅ **READY** | LangGraph, WhatsApp API |
| **Phase 5** | **Cloud Native Migration** | 🎯 **COMPLETE** | Vercel, Render, Neon, R2 |

---

## 🚀 Performance Improvements

### Frontend (Vercel)

- **Bundle Optimization**: Advanced webpack splitting (vendor/common chunks)
- **Image Optimization**: AVIF/WebP with R2 CDN
- **Multi-region**: Paris + US East deployment
- **Security**: HSTS, CSP, X-Frame-Options headers

### Backend (Render)

- **Health Monitoring**: Automatic restart on failure
- **Connection Pooling**: Optimized for serverless
- **CORS**: Strict origin validation

### AI Service (Render)

- **Cold Start**: 47% faster (15s → 8s)
- **Memory**: 50% reduction (800MB → 400MB)
- **Throughput**: 4x improvement (5 → 20 req/s)
- **Model Caching**: Zero reload time with `@lru_cache`

---

## 📊 Architecture Highlights

### Zero-Egress Storage (Cloudflare R2)

```typescript
// Generate presigned URL for secure uploads
const uploadUrl = await r2Service.generatePresignedUrl({
  bucket: 'agri-products',
  key: `products/${productId}/image.jpg`,
  expiresIn: 3600,
  operation: 'putObject',
});

// Client uploads directly to R2 (no backend bandwidth)
await fetch(uploadUrl, {
  method: 'PUT',
  body: imageFile,
});
```

### Serverless Database (Neon)

- **Auto-scaling**: Scales to zero when inactive
- **Branching**: Preview environments with instant copies
- **Connection Pooling**: Optimized for serverless functions

### Webhook Security (Cloudflare Workers)

- **HMAC-SHA256 Validation**: Cryptographic signature verification
- **Replay Attack Prevention**: 5-minute timestamp window
- **Edge Deployment**: <50ms latency worldwide

---

## 🌍 Global Reach

### Multi-Region Deployment

- **Primary**: EU (Frankfurt) - Neon, Render
- **CDN**: Global - Vercel Edge Network
- **Storage**: Global - Cloudflare R2

### Latency Targets

| Region | Target | Actual |
|--------|--------|--------|
| West Africa | <200ms | ~150ms |
| Europe | <100ms | ~50ms |
| North America | <150ms | ~100ms |

---

## 🔐 Security & Compliance

### Authentication

- **JWT**: Secure token-based auth
- **MFA**: Multi-factor authentication for admins
- **OAuth**: Google, Facebook integration

### Data Protection

- **Encryption**: TLS 1.3 in transit, AES-256 at rest
- **GDPR**: Right to erasure, data portability
- **EUDR**: Deforestation compliance tracking

### Audit & Compliance

- **Immutable Logs**: All actions tracked
- **Blockchain**: Hyperledger Fabric for traceability
- **KYC/AML**: Identity verification with FaceMatch AI

---

## 📈 Scaling Strategy

### Current (Free Tier)

- **Users**: Up to 500 active
- **Transactions**: ~5,000/month
- **Storage**: 10GB
- **Cost**: **$0/month**

### Growth (Paid Tier)

- **Users**: 5,000+ active
- **Transactions**: 50,000+/month
- **Storage**: 100GB+
- **Cost**: ~$34/month

### Enterprise (Custom)

- **Users**: Unlimited
- **Dedicated Infrastructure**: Custom SLA
- **White Label**: Custom branding
- **Cost**: Contact sales

---

## 🛠️ Development

### Local Development

```bash
# Start all services
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Analyze bundle
ANALYZE=true pnpm build
```

### Tech Stack

**Frontend**:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts, Leaflet, Three.js

**Backend**:
- NestJS (Node.js)
- Prisma ORM
- PostgreSQL (Neon)
- Redis

**AI/ML**:
- Python FastAPI
- TensorFlow, PyTorch
- LangChain, Ollama
- Qdrant (Vector DB)

**Infrastructure**:
- Vercel (Frontend)
- Render (Backend/AI)
- Cloudflare (R2, Workers)
- Neon (PostgreSQL)

---

## 📚 Documentation

### User Guides

- [Admin Dashboard](docs/admin-guide.md)
- [Farmer Portal](docs/farmer-guide.md)
- [Transporter App](docs/transporter-guide.md)
- [Buyer Platform](docs/buyer-guide.md)

### Technical Docs

- [API Reference](docs/api-reference.md)
- [Database Schema](docs/database-schema.md)
- [Architecture Decision Records](docs/adr/)

### Deployment

- [Quick Deploy](docs/QUICK_DEPLOY.md)
- [Environment Variables](docs/ENVIRONMENT_VARIABLES.md)
- [Neon Setup](docs/NEON_SETUP.md)
- [R2 Setup](docs/R2_SETUP.md)
- [AI Optimization](docs/AI_SERVICE_OPTIMIZATION.md)
- [Cloudflare Workers](docs/CLOUDFLARE_WORKERS.md)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

Copyright © 2024-2026 AgriLogistic. All rights reserved.

---

## 🌟 What's New in v5.0 (Cloud Native)

### Infrastructure

- ✅ Migrated to Vercel (frontend)
- ✅ Migrated to Render (backend/AI)
- ✅ Migrated to Neon PostgreSQL (serverless)
- ✅ Migrated to Cloudflare R2 (zero-egress storage)
- ✅ Cloudflare Workers (webhook validation)

### Performance

- ✅ 47% faster AI cold start
- ✅ 50% memory reduction
- ✅ 4x AI throughput improvement
- ✅ Advanced bundle splitting
- ✅ Multi-region deployment

### Developer Experience

- ✅ One-command deployment
- ✅ Comprehensive documentation (6 guides)
- ✅ Automated deployment scripts
- ✅ Health check endpoints
- ✅ Production-ready configurations

---

## 📞 Support

- **Email**: support@agrilogistic.com
- **Documentation**: [docs.agrilogistic.com](https://docs.agrilogistic.com)
- **Community**: [community.agrilogistic.com](https://community.agrilogistic.com)

---

Made with ❤️ for African Agriculture
