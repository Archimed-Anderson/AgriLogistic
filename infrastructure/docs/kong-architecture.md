# Kong API Gateway Architecture
# AgroLogistic 2.0 - Technical Documentation

## 📐 Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  Web App (Next.js)  │  Mobile Apps  │  Admin Dashboard          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      KONG API GATEWAY                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   PLUGIN LAYER                            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  • JWT Authentication    • Rate Limiting                  │  │
│  │  • CORS                   • Request/Response Transform    │  │
│  │  • Logging               • Caching (Proxy Cache)          │  │
│  │  • Prometheus Metrics    • IP Restriction                 │  │
│  │  • Request Size Limiting • Custom Plugins                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              SERVICE DISCOVERY & ROUTING                  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Declarative Config  │  Health Checks  │  Load Balancing │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MICROSERVICES LAYER                           │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │  Auth    │  │ Product  │  │  Order   │  │Logistics │        │
│  │  :8001   │  │  :8002   │  │  :8003   │  │  :8004   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Payment  │  │Notification│ │Analytics │  │   AI     │        │
│  │  :8005   │  │  :8006   │  │  :8007   │  │  :8008   │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                      │
│  │Blockchain│  │Inventory │  │  User    │                      │
│  │  :8009   │  │  :8010   │  │  :8011   │                      │
│  └──────────┘  └──────────┘  └──────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

### 1. Authenticated Request Flow

```
Client Request
    │
    ▼
┌─────────────────────────┐
│ 1. CORS Preflight       │ ← OPTIONS request
│    (if applicable)      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 2. Rate Limiting Check  │ ← Global + Service-specific
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 3. JWT Validation       │ ← Verify token signature
│    - Check expiration   │    Check claims
│    - Extract user info  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 4. Custom Auth Plugin   │ ← Role-based permissions
│    - Check blacklist    │    Verify consumer
│    - Validate role      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 5. Request Transform    │ ← Add headers
│    - X-User-ID          │    X-User-Role
│    - X-Request-ID       │    X-Gateway-Version
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 6. Service Discovery    │ ← Find healthy upstream
│    + Load Balancing     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 7. Proxy to Service     │ ← Forward to microservice
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 8. Response Transform   │ ← Add response headers
│    - X-Response-Time    │    X-Kong-Latency
│    - X-RateLimit-*      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 9. Metrics Collection   │ ← Prometheus metrics
│    + Logging            │
└────────┬────────────────┘
         │
         ▼
    Response to Client
```

### 2. Public Endpoint Flow (Auth)

```
Login Request (POST /api/v1/auth/login)
    │
    ▼
CORS Check → Rate Limiting → Route to Auth Service
    │
    ▼
Auth Service validates credentials
    │
    ▼
Generate JWT token
    │
    ▼
Return token to client
    │
    ▼
Client stores token (localStorage/cookie)
```

## 🔌 Plugin Architecture

### Plugin Execution Order (PRIORITY)

```
Request Phase:
1005 - Custom Auth
1000 - Request Logger
 950 - JWT
 900 - Rate Limiting
 850 - CORS
 800 - Request Transformer
 500 - IP Restriction

Response Phase:
 800 - Response Transformer
 750 - Proxy Cache
 500 - Prometheus
```

### Custom Plugins

#### 1. Request Logger (`request-logger.lua`)

**Purpose:** Enhanced logging with business metadata

**Features:**
- Captures full request/response cycle
- Adds request_id for tracing
- Logs client IP, consumer, latency
- Error enrichment for 4xx/5xx

**Configuration:**
```lua
{
  log_requests = true,
  log_responses = true,
  debug_mode = false
}
```

#### 2. Custom Auth (`custom-auth.lua`)

**Purpose:** Role-based access control

**Features:**
- Token blacklist checking (Redis)
- Role-based permissions
- Path-based authorization
- Adds user context headers

**Configuration:**
```lua
{
  enforce_permissions = true,
  log_auth = true
}
```

## 🗄️ Data Flow

### PostgreSQL Schema (Kong DB)

```sql
services
├── id (UUID)
├── name (VARCHAR)
├── url (VARCHAR)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

routes
├── id (UUID)
├── service_id (UUID FK)
├── paths (TEXT[])
├── methods (VARCHAR[])
└── created_at (TIMESTAMP)

plugins
├── id (UUID)
├── service_id (UUID FK)
├── route_id (UUID FK)
├── name (VARCHAR)
├── config (JSONB)
└── enabled (BOOLEAN)

consumers
├── id (UUID)
├── username (VARCHAR)
├── custom_id (VARCHAR)
└── created_at (TIMESTAMP)

jwt_secrets
├── id (UUID)
├── consumer_id (UUID FK)
├── key (VARCHAR)
├── algorithm (VARCHAR)
├── secret (VARCHAR)
└── created_at (TIMESTAMP)
```

## 📊 Service Registry

### Service Configuration Matrix

| Service | Port | Upstream Health | Cache | Rate Limit | Special Plugins |
|---------|------|-----------------|-------|------------|-----------------|
| auth-service | 8001 | `/health` | ❌ | 100/min | - |
| product-service | 8002 | `/health` | ✅ 5min | 300/min | proxy-cache |
| order-service | 8003 | `/health` | ❌ | 200/min | - |
| logistics-service | 8004 | `/health` | ❌ | 300/min | - |
| payment-service | 8005 | `/health` | ❌ | 50/min | ip-restriction |
| notification-service | 8006 | `/health` | ❌ | 100/min | - |
| analytics-service | 8007 | `/health` | ✅ 1min | 100/min | proxy-cache |
| ai-service | 8008 | `/health` | ❌ | 30/min | request-size-limiting |
| blockchain-service | 8009 | `/health` | ❌ | 50/min | request-size-limiting |
| inventory-service | 8010 | `/health` | ❌ | 200/min | - |
| user-service | 8011 | `/health` | ❌ | 200/min | acl |

## 🔐 Security Architecture

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT",
    "kid": "web-app-jwt-key"
  },
  "payload": {
    "sub": "user-uuid",
    "email": "user@agrologistic.com",
    "role": "admin",
    "iat": 1705766400,
    "exp": 1705770000
  },
  "signature": "..."
}
```

### Security Layers

```
┌─────────────────────────────────────────────┐
│ Layer 1: Network Security                  │
│  • IP Whitelisting (admin routes)          │
│  • DDoS Protection (rate limiting)         │
│  • TLS 1.3 (HTTPS)                          │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│ Layer 2: Authentication                     │
│  • JWT Signature Validation                │
│  • Token Expiration Checks                 │
│  • Token Blacklist (Redis)                 │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│ Layer 3: Authorization                      │
│  • Role-Based Access Control (RBAC)        │
│  • Path-Based Permissions                  │
│  • Consumer ACLs                            │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│ Layer 4: Request Validation                │
│  • Request Size Limiting                   │
│  • Content-Type Validation                 │
│  • SQL Injection Protection                │
└─────────────────────────────────────────────┘
```

## 📈 Performance Optimization

### Caching Strategy

```
┌─────────────────────────────────────────┐
│ Cache Layer 1: Kong Proxy Cache         │
│  • Product listings: 5 minutes          │
│  • Analytics data: 1 minute             │
│  • Static content: 1 hour               │
└─────────────────────────────────────────┘
                 ▼
┌─────────────────────────────────────────┐
│ Cache Layer 2: Service-Level Cache      │
│  • Database query cache                 │
│  • Computed aggregations                │
└─────────────────────────────────────────┘
```

### Load Balancing

```
Kong Gateway
     │
     ├─── Round Robin (default)
     │    └─── Equal distribution
     │
     ├─── Least Connections
     │    └─── Send to server with fewest active connections
     │
     └─── Hash (consistent hashing)
          └─── Based on client IP or header
```

## 🔍 Observability

### Metrics Collected (Prometheus)

```yaml
# HTTP Requests
kong_http_requests_total{service, route, code}

# Latency
kong_latency{service, type}  # type: kong, upstream, request

# Bandwidth
kong_bandwidth{service, type}  # type: ingress, egress

# Upstream Health
kong_upstream_target_health{upstream, target, state}

# Consumer Metrics
kong_http_requests_total{consumer, service}
```

### Logging Structure

```json
{
  "timestamp": "2024-01-20T18:00:00Z",
  "request_id": "uuid-123",
  "method": "POST",
  "path": "/api/v1/orders",
  "status": 200,
  "latency_ms": 45,
  "client_ip": "192.168.1.100",
  "consumer": "agrologistic-web-app",
  "user_id": "user-uuid",
  "role": "user",
  "upstream": "order-service:8003",
  "upstream_latency_ms": 38
}
```

## 🚀 Deployment Considerations

### Resource Requirements

```yaml
Kong Gateway:
  CPU: 500m - 2000m
  Memory: 1GB - 2GB
  Replicas: 2+ (HA)

PostgreSQL:
  CPU: 250m - 500m
  Memory: 512MB - 1GB
  Storage: 10GB SSD

Konga:
  CPU: 100m - 200m
  Memory: 256MB - 512MB
```

### High Availability

```
┌────────────────┐     ┌────────────────┐
│ Kong Gateway 1 │     │ Kong Gateway 2 │
└───────┬────────┘     └────────┬───────┘
        │                       │
        └───────┬───────────────┘
                ▼
        ┌───────────────┐
        │  PostgreSQL   │
        │   (Primary)   │
        └───────┬───────┘
                │  Replication
                ▼
        ┌───────────────┐
        │  PostgreSQL   │
        │  (Standby)    │
        └───────────────┘
```

## 🔄 Disaster Recovery

### Backup Strategy

```bash
# Automated daily backups
0 2 * * * /infrastructure/scripts/kong-backup.sh

# Retention policy
- Daily backups: 7 days
- Weekly backups: 4 weeks
- Monthly backups: 12 months
```

### Recovery Time Objectives

```
RTO (Recovery Time Objective): 1 hour
RPO (Recovery Point Objective): 24 hours
MTTR (Mean Time To Recovery): 30 minutes
```

## 📚 Références

- Kong Gateway Documentation: https://docs.konghq.com/
- JWT RFC 7519: https://datatracker.ietf.org/doc/html/rfc7519
- Prometheus Best Practices: https://prometheus.io/docs/practices/naming/
- Docker Compose Reference: https://docs.docker.com/compose/

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-20  
**Maintained By:** AgroLogistic DevOps Team
