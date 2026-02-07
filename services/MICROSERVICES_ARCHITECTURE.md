# 🌾 AgriLogistic 4.0 - Backend Microservices Architecture

## 📋 Overview

This document describes the new modular microservices architecture for AgriLogistic 4.0. All new services follow NestJS best practices and are designed to be independent, scalable, and maintainable.

---

## 🏗️ New Microservices

### 1. **Agri-Rentals Service** 🚜
**Location:** `services/logistics/rentals-service/`  
**Port:** `3007`  
**Purpose:** Equipment rental marketplace management

**Endpoints:**
- `POST /rentals` - Create new rental
- `GET /rentals` - List all rentals (with status filter)
- `GET /rentals/:id` - Get rental details
- `PATCH /rentals/:id` - Update rental
- `DELETE /rentals/:id` - Delete rental
- `GET /rentals/equipment/available` - List available equipment
- `POST /rentals/:id/book` - Book equipment

**Key Features:**
- Equipment catalog (tractors, harvesters, tools)
- Booking calendar
- GPS tracking integration
- Smart contract escrow (TODO)

---

### 2. **AgriCredit Service** 💳
**Location:** `services/fintech/credit-service/`  
**Port:** `3008`  
**Purpose:** Post-harvest credit scoring and loan management

**Endpoints:**
- `POST /credit/applications` - Create loan application
- `GET /credit/applications` - List all applications
- `GET /credit/applications/:id` - Get application details
- `POST /credit/applications/:id/approve` - Approve application
- `POST /credit/applications/:id/reject` - Reject application
- `GET /credit/loans` - List all loans
- `GET /credit/loans/:id` - Get loan details
- `POST /credit/loans/:id/repayment` - Record repayment
- `GET /credit/scoring/:farmerId` - Calculate Agri-Score
- `GET /credit/portfolio/stats` - Portfolio analytics

**Key Features:**
- ML-based Agri-Score calculation
- Credit limit assessment
- Personalized interest rates (8-24%)
- Default risk prediction
- Automatic repayment via Mobile Money escrow

---

### 3. **Cold Chain Service** ❄️
**Location:** `services/logistics/coldchain-service/`  
**Port:** `3009`  
**Purpose:** Temperature monitoring and cold storage management

**Endpoints:**
- `POST /coldchain/storage` - Create storage unit
- `GET /coldchain/storage` - List all storage units
- `GET /coldchain/storage/:id` - Get storage unit details
- `GET /coldchain/storage/:id/temperature` - Temperature history
- `POST /coldchain/trucks` - Create cold truck
- `GET /coldchain/trucks` - List all cold trucks
- `GET /coldchain/trucks/:id/tracking` - Track cold truck
- `POST /coldchain/alerts` - Create temperature alert
- `GET /coldchain/alerts` - List all alerts
- `GET /coldchain/stats/breach-rate` - Breach rate statistics

**Key Features:**
- IoT sensor integration (LoRaWAN, Sigfox)
- Real-time temperature monitoring
- GPS tracking for cold trucks
- Automatic breach alerts
- Mini-chambres froides management

---

### 4. **Agri-Coop Service** 🤝
**Location:** `services/coop-service/`  
**Port:** `3010`  
**Purpose:** Cooperative management and blockchain governance

**Endpoints:**
- `POST /coop` - Create cooperative
- `GET /coop` - List all cooperatives
- `GET /coop/:id` - Get cooperative details
- `POST /coop/:id/members` - Add member
- `GET /coop/:id/members` - List members
- `POST /coop/:id/votes` - Create vote
- `GET /coop/:id/votes` - List all votes
- `POST /coop/:id/votes/:voteId/cast` - Cast vote
- `GET /coop/:id/treasury` - Treasury balance
- `POST /coop/:id/tokens/distribute` - Distribute CTT tokens
- `GET /coop/:id/production/collective` - Collective production

**Key Features:**
- Blockchain-based voting (Polygon)
- Cooperative Treasury Token (CTT) management
- Transparent governance
- Collective production planning
- Dividend distribution

---

### 5. **Vision AI Service** 🔬
**Location:** `services/ai-service/vision-service/`  
**Port:** `3011`  
**Purpose:** Disease diagnosis using computer vision

**Endpoints:**
- `POST /vision/diagnose` - Diagnose disease from image
- `GET /vision/diagnoses` - List all diagnoses
- `GET /vision/diagnoses/:id` - Get diagnosis details
- `GET /vision/diseases` - List all diseases
- `GET /vision/diseases/:id` - Get disease details
- `GET /vision/stats/accuracy` - Model accuracy metrics
- `GET /vision/stats/epidemics` - Epidemic alerts
- `GET /vision/recommendations/:diagnosisId` - Treatment recommendations

**Key Features:**
- CNN-based disease detection (ResNet50/EfficientNet)
- 50+ disease database
- 90% accuracy target
- Epidemic early warning
- LLM-based treatment recommendations

---

### 6. **Weather Service** 🌦️
**Location:** `services/intelligence/weather-service/`  
**Port:** `3012`  
**Purpose:** Hyperlocal weather forecasting and agronomic alerts

**Endpoints:**
- `GET /weather/current` - Current weather
- `GET /weather/forecast` - Weather forecast (14 days)
- `GET /weather/hyperlocal` - Hyperlocal forecast (1km²)
- `GET /weather/alerts` - Weather alerts
- `POST /weather/alerts/subscribe` - Subscribe to alerts
- `GET /weather/agronomic/:farmId` - Agronomic recommendations
- `GET /weather/evapotranspiration` - ET0 calculation
- `GET /weather/growing-degree-days` - GDD calculation

**Key Features:**
- AI downscaling to 1km² resolution
- Multi-source data fusion (ECMWF, GFS, NOAA)
- Extreme event detection
- Personalized agronomic recommendations
- FAO-56 Penman-Monteith ET0 calculation

---

## 🚀 Getting Started

### Installation

Each service has its own `package.json`. Install dependencies for each service:

```bash
# Rentals Service
cd services/logistics/rentals-service
npm install

# Credit Service
cd services/fintech/credit-service
npm install

# Cold Chain Service
cd services/logistics/coldchain-service
npm install

# Coop Service
cd services/coop-service
npm install

# Vision AI Service
cd services/ai-service/vision-service
npm install

# Weather Service
cd services/intelligence/weather-service
npm install
```

### Running Services

Each service can be run independently in development mode:

```bash
# Development mode (with auto-reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Service Ports

| Service | Port | URL |
|---------|------|-----|
| Rentals | 3007 | http://localhost:3007 |
| Credit | 3008 | http://localhost:3008 |
| Cold Chain | 3009 | http://localhost:3009 |
| Coop | 3010 | http://localhost:3010 |
| Vision AI | 3011 | http://localhost:3011 |
| Weather | 3012 | http://localhost:3012 |

---

## 📁 Directory Structure

```
services/
├── logistics/
│   ├── rentals-service/          # NEW - Equipment rental marketplace
│   ├── coldchain-service/        # NEW - Cold chain monitoring
│   ├── mission-service/          # EXISTING
│   ├── iot-service/              # EXISTING
│   └── production-service/       # EXISTING
├── fintech/
│   ├── credit-service/           # NEW - AgriCredit loans & scoring
│   ├── finance-service/          # EXISTING
│   ├── payment-service/          # EXISTING
│   └── pricing-service/          # EXISTING
├── ai-service/
│   └── vision-service/           # NEW - Disease diagnosis AI
├── intelligence/
│   └── weather-service/          # NEW - Hyperlocal weather
└── coop-service/                 # NEW - Cooperative management
```

---

## ✅ Implementation Status

| Module | Status | Completion |
|--------|--------|------------|
| Agri-Rentals | ✅ Skeleton Created | Module, Controller, Service |
| AgriCredit | ✅ Skeleton Created | Module, Controller, Service, Scoring |
| Cold Chain | ✅ Skeleton Created | Module, Controller, Service, IoT Monitoring |
| Agri-Coop | ✅ Skeleton Created | Module, Controller, Service, Governance, Token |
| Vision AI | ✅ Skeleton Created | Module, Controller, Service, Diagnosis |
| Weather | ✅ Skeleton Created | Module, Controller, Service, Forecast, Alerts |

---

## 🔄 Next Steps

### Phase 1: Database Integration
- [ ] Add Prisma/TypeORM schemas for each service
- [ ] Create database migrations
- [ ] Implement repository pattern

### Phase 2: Business Logic
- [ ] Implement TODO methods in services
- [ ] Add validation DTOs
- [ ] Integrate external APIs (weather, blockchain, etc.)

### Phase 3: Testing
- [ ] Add unit tests for services
- [ ] Add integration tests for controllers
- [ ] Add E2E tests for critical flows

### Phase 4: Documentation
- [ ] Generate Swagger/OpenAPI documentation
- [ ] Add API examples
- [ ] Create Postman collections

---

## 🔗 Integration with Existing Services

All new services are designed to be **independent** and **non-breaking**:

- ✅ No modifications to existing services (auth, users, logistics)
- ✅ Each service has its own port and can be deployed separately
- ✅ Communication via REST APIs (future: gRPC for inter-service calls)
- ✅ Shared configuration via environment variables

---

## 📝 Notes

- All services use **NestJS 10.x** with TypeScript
- All services follow the **Module-Controller-Service** pattern
- All services have **CORS enabled** for frontend integration
- All services use **class-validator** for DTO validation
- All TODO comments indicate where business logic needs to be implemented

---

**Created:** February 2026  
**Version:** 1.0.0  
**Author:** AgriLogistic Development Team
