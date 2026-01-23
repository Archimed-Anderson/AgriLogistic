# Kong API Gateway - Setup & Usage Guide
# AgroLogistic 2.0 - Docker Compose Version

## 🚀 Quick Start

### Prerequisites

```bash
# Vérifier que Docker et Docker Compose sont installés
docker --version
docker-compose --version

# Installer jq pour manipulation JSON (optionnel)
sudo apt-get install jq
```

### Démarrage Rapide

```bash
# 1. Naviguer vers le dossier infrastructure
cd infrastructure

# 2. Générer les clés JWT RS256 (obligatoire)
# Windows:
#   powershell -ExecutionPolicy Bypass -File scripts/generate-jwt-keys.ps1
# Linux/macOS:
#   chmod +x scripts/generate-jwt-keys.sh && ./scripts/generate-jwt-keys.sh

# 3. Démarrer Kong (DB mode). Fournir un .env.kong (voir env.kong.example)
docker-compose -f docker-compose.kong.yml --env-file .env.kong up -d

# 4. Démarrer le nouveau auth-service OAuth2/OIDC (Postgres + Redis)
# IMPORTANT: ne pas démarrer le auth-service legacy en parallèle (conflit réseau/DNS).
cd ../backend/auth-service
# Fournir les variables (voir env.auth.example). Exemple:
docker-compose -f docker-compose.auth.yml up -d --build
docker-compose -f docker-compose.auth.yml run --rm auth-service alembic upgrade head
cd ../../infrastructure

# 5. Vérifier que tous les containers sont en cours d'exécution
docker-compose -f docker-compose.kong.yml ps

# 6. Initialiser (optionnel: helpers + token)
chmod +x scripts/kong-init.sh
./scripts/kong-init.sh

# 7. Tester un endpoint
curl http://localhost:8000/api/v1/products
```

## 📊 Architecture

```
Frontend (Next.js:3000)
         ↓
Kong Gateway (8000/8443)
         ↓
    [Plugins Layer]
    - JWT Auth
    - Rate Limiting
    - CORS
    - Logging
    - Caching
         ↓
   Load Balancer
         ↓
  Microservices (8001-8011)
```

## 🔧 Configuration Files

### Structure des fichiers

```
infrastructure/
├── docker-compose.kong.yml    # Stack Docker Compose
├── .env.kong                   # Variables d'environnement
├── kong/
│   ├── kong.yml                # Configuration déclarative
│   └── plugins/
│       ├── request-logger.lua  # Plugin custom logging
│       └── custom-auth.lua     # Plugin auth personnalisée
├── scripts/
│   ├── kong-init.sh            # Script d'initialisation
│   └── kong-backup.sh          # Script de backup
└── monitoring/
    ├── prometheus.yml          # Config Prometheus
    ├── grafana-datasources.yml
    └── grafana-dashboards.yml
```

## 🌐 Endpoints

### Kong Services

| Service | Port | Admin UI | Description |
|---------|------|----------|-------------|
| Kong Proxy | 8000 (HTTP) | - | Point d'entrée API |
| Kong Proxy SSL | 8443 (HTTPS) | - | Point d'entrée sécurisé |
| Kong Admin API | 8001 (localhost only) | - | API de configuration |
| Konga UI | 1337 | ✓ | Interface alternative |
| Prometheus | 9090 | ✓ | Métriques |
| Grafana | 3001 | ✓ | Dashboards |
| Jaeger | 16686 | ✓ | Tracing (profile `tracing`) |

### Accès aux UIs

```bash
# Konga Admin UI
http://localhost:1337

# Prometheus
http://localhost:9090

# Grafana (admin/admin)
http://localhost:3001

# Jaeger (tracing)
http://localhost:16686
```

## 🔑 Authentication & JWT

### Récupérer un Token JWT

```bash
# Méthode 1: Via le script d'initialisation
# Les tokens sont générés automatiquement dans kong-tokens.txt

# Méthode 2: Via l'API d'authentification
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@agrologistic.com",
    "password": "password123"
  }'
```

### Utiliser un Token

```bash
# Requête authentifiée
TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."

curl http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer ${TOKEN}"
```

## 📋 Services & Routes

### Liste complète des routes

| Service | Method | Path | Auth | Rate Limit |
|---------|--------|------|------|------------|
| **Auth** | POST | `/api/v1/auth/login` | ❌ Public | 100/min |
| **Auth** | POST | `/api/v1/auth/register` | ❌ Public | 100/min |
| **Auth** | POST | `/api/v1/auth/refresh` | ❌ Public | 100/min |
| **Auth** | GET | `/.well-known/openid-configuration` | ❌ Public | 100/min |
| **Auth** | GET | `/.well-known/jwks.json` | ❌ Public | 100/min |
| **Auth** | POST | `/oauth/token` | ❌ Public (client auth) | 100/min |
| **Auth** | GET | `/oauth/userinfo` | ✅ Bearer | 100/min |
| **Auth** | POST | `/api/v1/auth/mfa/*` | ✅ Bearer/MFA | 100/min |
| **Products** | GET | `/api/v1/products` | ✅ JWT | 300/min |
| **Products** | POST | `/api/v1/products/search` | ✅ JWT | 300/min |
| **Orders** | GET/POST | `/api/v1/orders` | ✅ JWT | 200/min |
| **Logistics** | GET/POST | `/api/v1/logistics` | ✅ JWT | 300/min |
| **Payments** | POST | `/api/v1/payments` | ✅ JWT | 50/min |
| **Notifications** | POST | `/api/v1/notifications` | ✅ JWT | 100/min |
| **Analytics** | GET | `/api/v1/analytics` | ✅ JWT | 100/min |
| **AI** | POST | `/api/v1/ai/*` | ✅ JWT | 30/min |
| **Blockchain** | GET/POST | `/api/v1/blockchain` | ✅ JWT | 50/min |
| **Inventory** | GET/PUT | `/api/v1/inventory` | ✅ JWT | 200/min |
| **Users** | GET/PUT | `/api/v1/users` | ✅ JWT | 200/min |

## 🧪 Testing

### Health Checks

```bash
# Kong health
curl http://localhost:8000/health

# Admin API status
curl http://localhost:8001/status

# Service health (exemple: products)
curl http://localhost:8000/api/v1/products/health
```

### Test Rate Limiting

```bash
# Dépasser la limite (devrait retourner 429)
for i in {1..150}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/api/v1/ai
done
```

### Test CORS

```bash
curl -X OPTIONS http://localhost:8000/api/v1/products \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Authorization" \
  -v
```

## 📊 Monitoring

### Prometheus Metrics

```bash
# Kong metrics
curl http://localhost:8100/metrics

# Query Prometheus API
curl 'http://localhost:9090/api/v1/query?query=kong_http_requests_total'
```

### Logs

```bash
# Kong Gateway logs
docker-compose -f docker-compose.kong.yml logs -f kong-gateway

# PostgreSQL logs
docker-compose -f docker-compose.kong.yml logs -f kong-database

# Tous les logs
docker-compose -f docker-compose.kong.yml logs -f
```

## 🔒 Security

### SSL/TLS Configuration

```bash
# Générer des certificats auto-signés (dev)
openssl req -x509 -newkey rsa:4096 -keyout kong/ssl/key.pem \
  -out kong/ssl/cert.pem -days 365 -nodes

# Mettre à jour docker-compose.kong.yml
volumes:
  - ./kong/ssl:/usr/local/kong/ssl:ro

environment:
  KONG_SSL_CERT: /usr/local/kong/ssl/cert.pem
  KONG_SSL_CERT_KEY: /usr/local/kong/ssl/key.pem
```

### IP Whitelisting

```bash
# Ajouter IP restriction sur un service
curl -X POST http://localhost:8001/services/payment-service/plugins \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ip-restriction",
    "config": {
      "allow": ["192.168.1.0/24", "10.0.0.1"]
    }
  }'
```

## 🛠️ Maintenance

### Backup

```bash
# Backup automatique
chmod +x scripts/kong-backup.sh
./scripts/kong-backup.sh

# Backups sont stockés dans ./backups/
ls -lh backups/
```

### Restore

```bash
# Restaurer depuis un backup
BACKUP_FILE="kong_backup_20240120_120000.sql"

docker exec -i agrologistic-kong-db \
  psql -U kong -d kong < backups/${BACKUP_FILE}

# Redémarrer Kong
docker-compose -f docker-compose.kong.yml restart kong-gateway
```

### Update Configuration

```bash
# Après modification de kong/kong.yml
docker-compose -f docker-compose.kong.yml restart kong-gateway

# Ou via Admin API
curl -X POST http://localhost:8001/config \
  -F config=@kong/kong.yml
```

## 📈 Performance Tuning

### Ajuster les workers

```yaml
# Dans .env.kong
KONG_NGINX_WORKER_PROCESSES=auto
KONG_MEM_CACHE_SIZE=256m
```

### Activer le cache

```bash
# Ajouter proxy-cache sur un service
curl -X POST http://localhost:8001/services/product-service/plugins \
  -d "name=proxy-cache" \
  -d "config.strategy=memory" \
  -d "config.cache_ttl=300"
```

## 🐛 Troubleshooting

### Kong ne démarre pas

```bash
# Vérifier les logs
docker-compose -f docker-compose.kong.yml logs kong-gateway

# Vérifier la migration DB
docker-compose -f docker-compose.kong.yml logs kong-bootstrap

# Recréer la DB
docker-compose -f docker-compose.kong.yml down -v
docker-compose -f docker-compose.kong.yml up -d
```

### 401 Unauthorized malgré un token valide

```bash
# Vérifier le consumer JWT
curl http://localhost:8001/consumers/agrologistic-web-app/jwt

# Vérifier le plugin JWT
curl http://localhost:8001/plugins | jq '.data[] | select(.name=="jwt")'

# Tester le token
jwt decode YOUR_TOKEN_HERE
```

### Rate limit trop restrictif

```bash
# Augmenter la limite sur un service
curl -X PATCH http://localhost:8001/plugins/{plugin_id} \
  -d "config.minute=500" \
  -d "config.hour=10000"
```

## 🚀 Production Deployment

### Checklist

- [ ] Changer tous les secrets dans `.env.kong`
- [ ] Activer HTTPS avec certificats valides
- [ ] Configurer les IP whitelisting pour l'admin
- [ ] Activer les backups automatiques (cron)
- [ ] Configurer les alertes Prometheus
- [ ] Activer les logs vers un système centralisé
- [ ] Tester le failover
- [ ] Documenter les runbooks

### Environment Variables Production

```bash
# Générer de nouveaux secrets
export KONG_PG_PASSWORD=$(openssl rand -base64 32)
# RS256: générer une paire de clés RSA (voir scripts/generate-jwt-keys.*)

# Mettre à jour .env.kong
```

## 📚 Ressources

- [Kong Documentation](https://docs.konghq.com/)
- [Kong Plugin Hub](https://docs.konghq.com/hub/)
- [Declarative Configuration](https://docs.konghq.com/gateway/latest/production/deployment-topologies/db-less-and-declarative-config/)
- [Prometheus Metrics](https://docs.konghq.com/hub/kong-inc/prometheus/)

---

**Support:** Pour toute question, consulter la documentation ou créer une issue dans le repository du projet.
