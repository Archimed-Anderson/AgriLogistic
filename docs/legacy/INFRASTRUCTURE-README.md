# Kong API Gateway - AgroLogistic 2.0

## 🚀 Démarrage Rapide

### Option 1: Déploiement Automatisé (RECOMMANDÉ)

**Windows PowerShell:**
```powershell
cd infrastructure
.\scripts\kong-deploy.ps1
```

**Linux/macOS/WSL:**
```bash
cd infrastructure
chmod +x scripts/kong-deploy.sh
./scripts/kong-deploy.sh
```

### Option 2: Déploiement Manuel

```bash
# 1. Démarrer Kong
cd infrastructure
docker-compose -f docker-compose.kong.yml up -d

# 2. Initialiser la configuration
chmod +x scripts/kong-init.sh
./scripts/kong-init.sh

# 3. Tester (optionnel)
chmod +x scripts/kong-test.sh
./scripts/kong-test.sh

# 4. Vérifier
curl http://localhost:8000/api/v1/products
```

## 📁 Structure du Projet

```
infrastructure/
├── docker-compose.kong.yml         # Stack Docker Compose
├── .env.kong                       # Variables d'environnement
│
├── kong/
│   ├── kong.yml                    # Config déclarative (11 services)
│   └── plugins/
│       ├── request-logger.lua      # Plugin logging enrichi
│       └── custom-auth.lua         # Plugin auth personnalisée
│
├── scripts/
│   ├── ✅ kong-init.sh                # Initialisation automatique
│   ├── ✅ kong-deploy.sh              # Déploiement complet (Linux)
│   ├── ✅ kong-deploy.ps1             # Déploiement complet (Windows)
│   ├── ✅ kong-test.sh                # Suite de tests (18 tests)
│   └── ✅ kong-backup.sh              # Backup automatisé
│
├── monitoring/
│   ├── prometheus.yml              # Config Prometheus
│   ├── grafana-datasources.yml    # Datasources Grafana
│   └── grafana-dashboards.yml      # Dashboards Grafana
│
└── docs/
    ├── kong-usage.md               # Guide d'utilisation
    └── kong-architecture.md        # Documentation architecture
```

## 🔧 Configuration

### Services Exposés

| Service | Port | Description |
|---------|------|-------------|
| Kong Proxy | 8000 | Point d'entrée HTTP |
| Kong Proxy SSL | 8443 | Point d'entrée HTTPS |
| Kong Admin | 8001 | API d'administration |
| Kong Manager | 8002 | Interface web |
| Konga UI | 1337 | Interface alternative |
| Prometheus | 9090 | Métriques |
| Grafana | 3001 | Dashboards |

### Microservices Routés

```
Auth Service       (8001) → /api/v1/auth/*
Product Service    (8002) → /api/v1/products/*
Order Service      (8003) → /api/v1/orders/*
Logistics Service  (8004) → /api/v1/logistics/*
Payment Service    (8005) → /api/v1/payments/*
Notification       (8006) → /api/v1/notifications/*
Analytics Service  (8007) → /api/v1/analytics/*
AI Service         (8008) → /api/v1/ai/*
Blockchain Service (8009) → /api/v1/blockchain/*
Inventory Service  (8010) → /api/v1/inventory/*
User Service       (8011) → /api/v1/users/*
```

## 🔐 Authentification

### JWT Consumers

- **Web App** (`agrologistic-web-app`) - SPA Frontend
- **Mobile App** (`agrologistic-mobile-app`) - iOS/Android
- **Admin** (`agrologistic-admin`) - Admin Dashboard

### Utilisation

```bash
# 1. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@agrologistic.com","password":"pass123"}'

# 2. Utiliser le token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer ${TOKEN}"
```

## 🔌 Plugins Actifs

### Globaux
- **CORS** - Support multi-origin
- **Rate Limiting** - 1000 req/min par défaut
- **Prometheus** - Métriques
- **Request/Response Transformer** - Headers enrichis

### Par Service
- **JWT** (tous sauf auth) - Authentification
- **Proxy Cache** (products, analytics) - Performance
- **IP Restriction** (payment) - Sécurité
- **Request Size Limiting** (ai, blockchain) - Protection

## 📊Monitoring

```bash
# Métriques Kong
curl http://localhost:8000/metrics

# Prometheus UI
open http://localhost:9090

# Grafana UI
open http://localhost:3001  # admin/admin
```

## 🧪 Tests Automatisés

### Suite Complète (18 tests)

```bash
cd infrastructure
chmod +x scripts/kong-test.sh
./scripts/kong-test.sh
```

### Tests Inclus

**Infrastructure (6 tests)**
- Kong Admin API, Proxy, Konga UI
- Prometheus, Grafana, PostgreSQL

**Configuration (4 tests)**
- Services (11), Routes (36+)
- Consumers (3+), Plugins (5+)

**Sécurité (3 tests)**
- JWT, CORS, Rate Limiting

**Services (2 tests)**
- Auth et Product routes

**Monitoring (2 tests)**
- Métriques Prometheus \u0026 Kong

**Performance (1 test)**
- Latence < 1s

### Tests Manuels

```bash
# Health check
curl http://localhost:8001/status

# Test route (devrait retourner 401 sans JWT)
curl http://localhost:8000/api/v1/products

# Avec JWT (après initialisation)
TOKEN=$(cat kong-tokens.txt | grep "Web App Token" -A 1 | tail -1)
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/v1/products
```

## 🛠️ Maintenance

### Backup

```bash
./scripts/kong-backup.sh

# Backups stockés dans ./backups/
# Rétention: 7 jours
```

### Mise à jour Config

```bash
# Éditer kong/kong.yml
vim kong/kong.yml

# Redémarrer Kong
docker-compose -f docker-compose.kong.yml restart kong-gateway
```

## 🐛 Troubleshooting

### Logs

```bash
# Tous les logs
docker-compose -f docker-compose.kong.yml logs -f

# Kong seulement
docker-compose -f docker-compose.kong.yml logs -f kong-gateway
```

### Status

```bash
# Kong health
curl http://localhost:8001/status

# Services configurés
curl http://localhost:8001/services | jq
```

## 📚 Documentation

- **[Usage Guide](docs/kong-usage.md)** - Guide complet d'utilisation
- **[Architecture](docs/kong-architecture.md)** - Documentation technique détaillée

## ✅ Checklist Production

- [ ] Changer tous les secrets (`.env.kong`)
- [ ] Activer HTTPS avec certificats valides
- [ ] Configurer IP whitelisting pour admin
- [ ] Activer backups automatiques
- [ ] Configurer alertes Prometheus
- [ ] Tester failover et disaster recovery
- [ ] Documenter runbooks opérationnels

## 🔒 Sécurité

- JWT avec HS256 (configurable RS256)
- Rate limiting par IP et consumer
- Token blacklist support (Redis)
- Request size limiting
- IP whitelisting pour routes sensibles

## 📈 Performance

- Caching proxy actif (products, analytics)
- Health checks actifs (10s interval)
- Load balancing round-robin
- Auto-scaling ready

---

**Version:** 1.0.0  
**Kong:** 3.5  
**Services:** 11  
**Status:** Production Ready ✅
