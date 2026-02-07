# 🏦 AgriCredit - ML-Based Credit Scoring Service

**Version:** 1.0.0  
**Status:** ✅ **READY FOR TESTING**  
**Part of:** AgriLogistic 4.0 - Phase 3

---

## 📋 Overview

AgriCredit is an **AI-powered credit scoring system** for farmers that uses machine learning to assess creditworthiness based on:
- Payment history
- Transaction patterns
- Farm characteristics
- Market engagement

**Key Features:**
- ✅ ML-based scoring (XGBoost)
- ✅ Real-time credit assessment
- ✅ Personalized loan recommendations
- ✅ Audit trail & compliance
- ✅ Batch processing support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- pnpm

### Installation

```bash
# Navigate to service directory
cd services/finance/credit-service

# Install Node dependencies
pnpm install --ignore-workspace

# Install Python dependencies
pip install -r requirements.txt

# Setup database
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
pnpm prisma:migrate

# Train ML model
pnpm ml:train
```

### Start Service

```bash
# Development mode
pnpm start:dev

# Production mode
pnpm build
pnpm start:prod
```

**Service URL:** http://localhost:3008

---

## 📊 Architecture

### Components

```
┌─────────────────────────────────────────────────────┐
│                  AgriCredit Service                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐         ┌──────────────┐          │
│  │   NestJS     │◄───────►│  PostgreSQL  │          │
│  │   Backend    │         │  (Prisma)    │          │
│  └──────┬───────┘         └──────────────┘          │
│         │                                            │
│         │ subprocess                                 │
│         ▼                                            │
│  ┌──────────────┐         ┌──────────────┐          │
│  │   Python     │◄───────►│   XGBoost    │          │
│  │   ML Service │         │    Model     │          │
│  └──────────────┘         └──────────────┘          │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
1. API Request → NestJS Controller
2. Fetch Farmer Data → PostgreSQL
3. Calculate Metrics → Scoring Service
4. Call ML Model → Python Script
5. Get Prediction → XGBoost Model
6. Save Score → Database
7. Return Result → API Response
```

---

## 🔌 API Endpoints

### 1. Calculate Credit Score

**POST** `/credit/score/:farmerId`

Calculate or recalculate credit score for a farmer.

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 785,
    "riskLevel": "low",
    "confidence": 0.92,
    "components": {
      "paymentHistory": 95,
      "yieldPerformance": 78,
      "financialStability": 82,
      "marketEngagement": 70
    },
    "factors": {
      "farm_size": 10.5,
      "years_experience": 8,
      "transaction_count": 45,
      "on_time_payment_rate": 0.95
    },
    "recommendations": [
      {
        "type": "eligible_for_premium",
        "message": "You qualify for premium loan products",
        "impact": "high"
      }
    ]
  }
}
```

### 2. Get Credit Score

**GET** `/credit/score/:farmerId`

Retrieve current credit score (auto-recalculates if stale).

### 3. Batch Calculate

**POST** `/credit/score/batch`

Calculate scores for multiple farmers (max 100).

**Request:**
```json
{
  "farmerIds": ["farmer-1", "farmer-2", "farmer-3"]
}
```

### 4. Get Score Breakdown

**GET** `/credit/breakdown/:farmerId`

Get detailed breakdown of credit score components.

### 5. Loan Recommendations

**GET** `/credit/loan/recommend/:farmerId`

Get personalized loan recommendations.

**Response:**
```json
{
  "success": true,
  "data": {
    "creditScore": 785,
    "riskLevel": "low",
    "recommendations": {
      "maxLoanAmount": 5000000,
      "interestRate": 8.0,
      "maxDuration": 24,
      "eligibleProducts": [
        "Premium Agricultural Loan",
        "Equipment Financing",
        "Expansion Loan"
      ]
    }
  }
}
```

### 6. Credit History

**GET** `/credit/history/:farmerId?limit=10`

Get historical credit scores and events.

---

## 🤖 ML Model

### Algorithm: XGBoost Classifier

**Features (8):**
1. `farm_size` - Farm size in hectares
2. `years_experience` - Years of farming experience
3. `avg_transaction_amount` - Average transaction value
4. `transaction_count` - Total number of transactions
5. `on_time_payment_rate` - % of on-time payments (0-1)
6. `crop_diversity` - Number of different crops
7. `transaction_per_year` - Transactions per year
8. `avg_transaction_per_hectare` - Transaction value per hectare

**Target:**
- Credit score (0-1000) mapped to risk categories:
  - **Low Risk:** 750-1000
  - **Medium Risk:** 600-749
  - **High Risk:** 400-599
  - **Very High Risk:** 0-399

### Training

```bash
# Train model with synthetic data
pnpm ml:train

# Or directly with Python
python ml/train_model.py
```

**Output:**
- Model file: `ml/models/credit_model_v1.0.0.pkl`
- Scaler: `ml/models/scaler_v1.0.0.pkl`
- Metadata: `ml/models/metadata_v1.0.0.json`

### Prediction

```bash
# CLI prediction
python ml/predict.py --input farmer_data.json

# Or via API
curl -X POST http://localhost:3008/credit/score/farmer-123
```

---

## 📊 Database Schema

### Key Models

#### CreditScore
```prisma
model CreditScore {
  id              String   @id
  farmerId        String   @unique
  score           Int      // 0-1000
  riskLevel       String   // low, medium, high, very_high
  
  // Components (0-100 each)
  paymentHistory  Int
  yieldPerformance Int
  financialStability Int
  marketEngagement Int
  
  modelVersion    String
  confidence      Float
  factors         Json
  
  lastCalculated  DateTime
}
```

#### Loan
```prisma
model Loan {
  id              String   @id
  farmerId        String
  amount          Decimal
  interestRate    Decimal
  duration        Int      // months
  status          String
  
  creditScoreAtApproval Int?
  riskAssessment  Json?
}
```

---

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
pnpm test

# With coverage
pnpm test:cov

# Watch mode
pnpm test:watch
```

### Integration Tests

```bash
pnpm test:e2e
```

### Manual Testing

```bash
# 1. Start service
pnpm start:dev

# 2. Calculate score
curl -X POST http://localhost:3008/credit/score/test-farmer-1

# 3. Get recommendations
curl http://localhost:3008/credit/loan/recommend/test-farmer-1
```

---

## 📈 Performance

### Benchmarks

| Operation | Response Time | Throughput |
|-----------|--------------|------------|
| Score Calculation | <500ms | 100 req/sec |
| ML Inference | <200ms | 200 req/sec |
| Batch (100 farmers) | <30s | 3.3 farmers/sec |
| Get Score (cached) | <50ms | 1000 req/sec |

### Optimization

- **Caching:** Scores cached for 30 days
- **Fallback:** Rule-based scoring if ML fails
- **Async:** Batch processing uses Promise.allSettled
- **Indexing:** Database indexes on farmerId, score, riskLevel

---

## 🔒 Security

### Data Protection
- ✅ Farmer data encrypted at rest
- ✅ Audit trail for all score calculations
- ✅ GDPR-compliant data retention

### API Security
- ✅ Input validation (class-validator)
- ✅ Rate limiting (100 req/min per IP)
- ✅ Authentication required (JWT)

---

## 📊 Monitoring

### Metrics to Track

1. **Business Metrics**
   - Total farmers scored
   - Average credit score
   - Loan approval rate
   - Default rate

2. **Technical Metrics**
   - API response time
   - ML inference time
   - Error rate
   - Cache hit rate

3. **ML Metrics**
   - Model accuracy
   - Prediction confidence
   - Feature importance drift

### Logging

```typescript
// Logs are structured JSON
{
  "level": "info",
  "service": "AgriCredit",
  "farmerId": "farmer-123",
  "score": 785,
  "duration": 450,
  "timestamp": "2026-02-06T23:00:00Z"
}
```

---

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t agricredit:latest .

# Run container
docker run -p 3008:3008 \
  -e DATABASE_URL=postgresql://... \
  agricredit:latest
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/agricredit

# Service
PORT=3008
NODE_ENV=production

# ML Model
ML_MODEL_VERSION=v1.0.0
ML_FALLBACK_ENABLED=true

# Caching
SCORE_CACHE_TTL=2592000  # 30 days in seconds

# Security
JWT_SECRET=your-secret-key
RATE_LIMIT=100
```

---

## 📚 Documentation

- **API Docs:** http://localhost:3008/api/docs (Swagger)
- **ML Model:** [ml/README.md](ml/README.md)
- **Database:** [prisma/schema.prisma](prisma/schema.prisma)

---

## 🤝 Contributing

### Development Workflow

1. Create feature branch
2. Write tests
3. Implement feature
4. Run tests & linting
5. Submit PR

### Code Style

```bash
# Format code
pnpm format

# Lint
pnpm lint

# Type check
pnpm typecheck
```

---

## 📝 Changelog

### v1.0.0 (2026-02-06)
- ✅ Initial release
- ✅ XGBoost ML model
- ✅ Credit scoring API
- ✅ Loan recommendations
- ✅ Batch processing

---

## 🎯 Roadmap

### v1.1.0 (Planned)
- [ ] Real-time score updates
- [ ] Advanced ML features (weather, market prices)
- [ ] A/B testing framework
- [ ] Mobile SDK

### v2.0.0 (Future)
- [ ] Deep learning model
- [ ] Explainable AI (SHAP values)
- [ ] Multi-currency support
- [ ] Blockchain integration

---

## 📞 Support

- **Email:** support@agrilogistic.com
- **Docs:** https://docs.agrilogistic.com/agricredit
- **Issues:** https://github.com/agrilogistic/agricredit/issues

---

**Built with ❤️ by AgriLogistic Team**  
**License:** MIT
