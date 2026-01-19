# AgroLogistic Platform - API Endpoints Documentation

## Table des Matières
- [Architecture & Ports](#architecture--ports)
- [Configuration](#configuration)
- [Endpoints par Service](#endpoints-par-service)
- [Procédure de Dépannage](#procédure-de-dépannage)
- [Tests & Validation](#tests--validation)

---

## Architecture & Ports

### Vue d'ensemble

```
┌─────────────┐
│   Frontend  │  Port 3000
│   React App │
└──────┬──────┘
       │ HTTP
       ↓
┌─────────────────┐
│  Kong Gateway   │  Port 8000 (HTTP), 8443 (HTTPS), 8001 (Admin)
│  API Gateway    │
└────────┬────────┘
         │
         ├──→ Auth Service         (Port 3001)
         ├──→ Product Service      (Port 3002)
         ├──→ Order Service        (Port 3003)
         ├──→ Payment Service      (Port 3004)
         ├──→ Delivery Service     (Port 3005)
         ├──→ Notification Service (Port 3006)
         ├──→ AI Service           (Port 3007)
         ├──→ Analytics Service    (Port 3008)
         └──→ Blockchain Service   (Port 3009)
```

### Table Complète des Services et Ports

| Service | Port(s) | Protocole | URL d'accès | Description |
|---------|---------|-----------|-------------|-------------|
| **Applications** |
| Frontend React | 3000 | HTTP | http://localhost:3000 | Interface utilisateur principale |
| **API Gateway** |
| Kong Gateway | 8000 | HTTP | http://localhost:8000 | Point d'entrée API principal |
| Kong Gateway | 8443 | HTTPS | https://localhost:8443 | Point d'entrée sécurisé |
| Kong Admin API | 8001 | HTTP | http://localhost:8001 | Administration Kong |
| Konga (Kong UI) | 1337 | HTTP | http://localhost:1337 | Interface d'administration Kong |
| **Services Backend** |
| Auth Service | 3001 | HTTP | http://localhost:3001 | Authentification & autorisation |
| Product Service | 3002 | HTTP | http://localhost:3002 | Gestion du catalogue produits |
| Order Service | 3003 | HTTP | http://localhost:3003 | Gestion des commandes |
| Payment Service | 3004 | HTTP | http://localhost:3004 | Traitement des paiements |
| Delivery Service | 3005 | HTTP | http://localhost:3005 | Suivi des livraisons |
| Notification Service | 3006 | HTTP | http://localhost:3006 | Notifications (Email/SMS/Push) |
| AI Service | 3007 | HTTP | http://localhost:3007 | Recommandations ML |
| Analytics Service | 3008 | HTTP | http://localhost:3008 | Analytique temps réel |
| Blockchain Service | 3009 | HTTP | http://localhost:3009 | Traçabilité blockchain |
| **Bases de Données** |
| PostgreSQL | 5432 | PostgreSQL | localhost:5432 | Base principale |
| PostgreSQL Auth | 5433 | PostgreSQL | localhost:5433 | Base auth dédiée |
| Redis | 6379 | Redis | localhost:6379 | Cache principal |
| Redis Auth | 6380 | Redis | localhost:6380 | Cache auth |
| MongoDB | 27017 | MongoDB | localhost:27017 | Documents & produits |
| Elasticsearch | 9200, 9300 | HTTP, TCP | localhost:9200 | Recherche & logs |
| ClickHouse | 8123, 9000 | HTTP, Native | localhost:8123 | Analytics OLAP |
| **Monitoring** |
| Prometheus | 9090 | HTTP | http://localhost:9090 | Collecte métriques |
| Grafana | 4001 | HTTP | http://localhost:4001 | Dashboards & visualisation |
| Kibana | 5601 | HTTP | http://localhost:5601 | Visualisation logs |
| Jaeger | 16686 | HTTP | http://localhost:16686 | Tracing distribué |
| Superset | 8088 | HTTP | http://localhost:8088 | Business Intelligence |
| **Message Queue** |
| Kafka | 9092 | Kafka | localhost:9092 | Event streaming |
| Zookeeper | 2181 | TCP | localhost:2181 | Coordination Kafka |

---

## Configuration

### Variables d'Environnement Requises

#### Frontend (`.env`)

```env
# Application
VITE_APP_NAME=AgroLogistic
VITE_APP_VERSION=2.0.0

# ⚠️ IMPORTANT: Utiliser Kong Gateway comme point d'entrée
VITE_API_GATEWAY_URL=http://localhost:8000/api/v1

# URL directe du service auth (pour health checks uniquement)
VITE_AUTH_SERVICE_URL=http://localhost:3001/api/v1

# Provider d'authentification
VITE_AUTH_PROVIDER=real

# Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

#### Services Backend

Chaque service backend doit avoir son propre fichier `.env`:

**Auth Service** (`services/auth-service/.env`):
```env
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5433
DB_NAME=AgroLogistic_auth
DB_USER=AgroLogistic
DB_PASSWORD=AgroLogistic_secure_2026
REDIS_HOST=localhost
REDIS_PORT=6380
REDIS_PASSWORD=redis_secure_2026
JWT_ACCESS_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CORS_ORIGIN=http://localhost:3000
```

---

## Endpoints par Service

### 1. Authentication Service (Port 3001)

#### Base URL
- **Via Kong (Recommandé)**: `http://localhost:8000/api/v1/auth`
- **Direct**: `http://localhost:3001/api/v1/auth`

#### Endpoints

| Méthode | Route | Description | Auth Required |
|---------|-------|-------------|---------------|
| POST | `/auth/register` | Créer un nouveau compte | Non |
| POST | `/auth/login` | Se connecter | Non |
| POST | `/auth/logout` | Se déconnecter | Oui |
| POST | `/auth/refresh` | Rafraîchir le token | Non |
| GET | `/auth/me` | Obtenir l'utilisateur courant | Oui |
| POST | `/auth/verify-email` | Vérifier l'email | Non |
| POST | `/auth/password-reset` | Demander réinitialisation | Non |
| POST | `/auth/password-reset/confirm` | Confirmer nouveau mot de passe | Non |

#### Exemples de Requêtes

**Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "password": "SecurePass123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "uuid-here",
    "email": "farmer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "farmer"
  },
  "expiresIn": 3600
}
```

**Register:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "farmer",
    "phone": "+33612345678"
  }'
```

**Get Current User:**
```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 2. Product Service (Port 3002)

#### Base URL
- **Via Kong**: `http://localhost:8000/api/v1/products`
- **Direct**: `http://localhost:3002/api/v1/products`

#### Endpoints

| Méthode | Route | Description | Auth Required |
|---------|-------|-------------|---------------|
| GET | `/products` | Liste des produits | Non |
| GET | `/products/:id` | Détails d'un produit | Non |
| POST | `/products` | Créer un produit | Oui (Farmer) |
| PUT | `/products/:id` | Modifier un produit | Oui (Owner) |
| DELETE | `/products/:id` | Supprimer un produit | Oui (Owner) |
| GET | `/products/search` | Rechercher produits | Non |
| GET | `/products/categories` | Liste des catégories | Non |

---

### 3. Order Service (Port 3003)

#### Base URL
- **Via Kong**: `http://localhost:8000/api/v1/orders`
- **Direct**: `http://localhost:3003/api/v1/orders`

#### Endpoints

| Méthode | Route | Description | Auth Required |
|---------|-------|-------------|---------------|
| GET | `/orders` | Mes commandes | Oui |
| GET | `/orders/:id` | Détails commande | Oui (Owner) |
| POST | `/orders` | Créer commande | Oui |
| PUT | `/orders/:id/status` | Modifier statut | Oui (Seller) |
| POST | `/orders/:id/cancel` | Annuler commande | Oui (Owner) |

---

### 4. Payment Service (Port 3004)

#### Base URL
- **Via Kong**: `http://localhost:8000/api/v1/payments`
- **Direct**: `http://localhost:3004/api/v1/payments`

#### Endpoints

| Méthode | Route | Description | Auth Required |
|---------|-------|-------------|---------------|
| POST | `/payments/charge` | Créer paiement | Oui |
| POST | `/payments/refund` | Rembourser | Oui (Admin) |
| GET | `/payments/:id` | Détails paiement | Oui (Owner) |
| POST | `/webhooks/stripe` | Webhook Stripe | Non (Verified) |

---

### 5. Delivery Service (Port 3005)

#### Base URL
- **Via Kong**: `http://localhost:8000/api/v1/deliveries`
- **Direct**: `http://localhost:3005/api/v1/deliveries`

#### Endpoints

| Méthode | Route | Description | Auth Required |
|---------|-------|-------------|---------------|
| GET | `/deliveries/:id/track` | Suivi livraison | Oui |
| POST | `/deliveries/:id/location` | Mettre à jour position | Oui (Driver) |
| WS | `/ws/tracking/:id` | WebSocket suivi temps réel | Oui |

---

### 6. Notification Service (Port 3006)

#### Base URL
- **Via Kong**: `http://localhost:8000/api/v1/notifications`
- **Direct**: `http://localhost:3006/api/v1/notifications`

#### Endpoints

| Méthode | Route | Description | Auth Required |
|---------|-------|-------------|---------------|
| POST | `/notifications/email` | Envoyer email | Oui (System) |
| POST | `/notifications/sms` | Envoyer SMS | Oui (System) |
| POST | `/notifications/push` | Notification push | Oui (System) |
| GET | `/notifications` | Mes notifications | Oui |

---

### 7. AI Service (Port 3007)

#### Base URL
- **Via Kong**: `http://localhost:8000/api/v1/ai`
- **Direct**: `http://localhost:3007/api/v1/ai`

#### Endpoints

| Méthode | Route | Description | Auth Required |
|---------|-------|-------------|---------------|
| GET | `/ai/recommendations/:userId` | Recommandations produits | Oui |
| GET | `/ai/forecast/demand/:productId` | Prévision demande | Oui (Farmer) |

---

### 8. Analytics Service (Port 3008)

#### Base URL
- **Via Kong**: `http://localhost:8000/api/v1/analytics`
- **Direct**: `http://localhost:3008/api/v1/analytics`

#### Endpoints

| Méthode | Route | Description | Auth Required |
|---------|-------|-------------|---------------|
| GET | `/analytics/dashboard` | KPIs dashboard | Oui |
| POST | `/events/track` | Tracker événement | Non |

---

### 9. Blockchain Service (Port 3009)

#### Base URL
- **Via Kong**: `http://localhost:8000/api/v1/blockchain`
- **Direct**: `http://localhost:3009/api/v1/blockchain`

#### Endpoints

| Méthode | Route | Description | Auth Required |
|---------|-------|-------------|---------------|
| POST | `/blockchain/products` | Enregistrer produit | Oui (Farmer) |
| GET | `/blockchain/products/:id/history` | Historique traçabilité | Non |

---

## Procédure de Dépannage

### Problème: "Impossible de se connecter au serveur"

#### Vérifications à effectuer:

**1. Vérifier que Docker est en cours d'exécution:**
```bash
docker ps
```

**2. Vérifier l'état des conteneurs:**
```bash
docker ps --filter "name=AgroLogistic" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

**3. Vérifier qu'il n'y a pas de conflits de ports:**
```bash
# Vérifier si le port 3001 est libre (pour auth-service)
netstat -ano | findstr :3001

# Vérifier si le port 8000 est utilisé par Kong
netstat -ano | findstr :8000
```

**4. Tester Kong Gateway:**
```bash
curl http://localhost:8000
# Devrait retourner: {"message":"no Route matched with those values"}
```

**5. Tester Auth Service directement:**
```bash
curl http://localhost:3001/health
# Devrait retourner: {"status":"healthy","service":"auth-service"}
```

**6. Vérifier les logs:**
```bash
# Logs Kong
docker logs AgroLogistic-kong --tail 50

# Logs Auth Service
docker logs AgroLogistic-auth-service --tail 50
```

**7. Vérifier le fichier .env:**
```bash
# Dans AgroLogistic/
cat .env
# Doit contenir: VITE_API_GATEWAY_URL=http://localhost:8000/api/v1
```

### Solutions Courantes

#### Problème: Port 3001 déjà utilisé

**Symptôme:**
```
Bind for 0.0.0.0:3001 failed: port is already allocated
```

**Solution:**
Le port 3001 était utilisé par Grafana. C'est maintenant résolu (Grafana utilise le port 4001).

Si le problème persiste:
```bash
# Arrêter tous les conteneurs
docker-compose down

# Redémarrer
docker-compose up -d

# Vérifier
docker ps | grep 3001
```

#### Problème: URL incorrecte dans le frontend

**Symptôme:**
Frontend essaie de se connecter à `localhost:3001` au lieu de `localhost:8000`

**Solution:**
1. Vérifier `.env`:
```bash
echo $VITE_API_GATEWAY_URL
# Doit afficher: http://localhost:8000/api/v1
```

2. Si incorrect, modifier `.env` et redémarrer:
```bash
npm run dev
```

#### Problème: Kong ne route pas vers auth-service

**Symptôme:**
Kong répond mais retourne "no Route matched"

**Solution:**
Vérifier la configuration Kong dans `services/api-gateway/kong.yml`:
```yaml
services:
  - name: auth-service
    url: http://auth-service:3001
    routes:
      - name: auth-route
        paths:
          - /api/v1/auth
```

Appliquer la configuration:
```bash
docker restart AgroLogistic-kong
```

---

## Tests & Validation

### Tests Manuels

#### 1. Test de Connectivité Basique

```bash
# Test Kong
curl http://localhost:8000

# Test Auth Service (direct)
curl http://localhost:3001/health

# Test Auth via Kong
curl http://localhost:8000/api/v1/auth/health
```

#### 2. Test d'Authentification Complet

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq

# Utiliser le token retourné
export TOKEN="<token_from_response>"

# Test endpoint protégé
curl http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  | jq
```

#### 3. Test de Performance

```bash
# Mesurer le temps de réponse
time curl http://localhost:8000/api/v1/auth/health
```

### Tests Automatisés

#### Tests Unitaires
```bash
# Tests API Client
npm run test src/infrastructure/api/rest/__tests__/

# Tous les tests unitaires
npm run test
```

#### Tests E2E
```bash
# Tests authentification
npm run test:e2e tests/e2e/auth-connection.spec.ts

# Tous les tests E2E
npm run test:e2e
```

#### Validation Complète
```bash
# Validation complète (typecheck + lint + tests)
npm run validate
```

---

## URLs de Référence Rapide

### Développement Local

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Gateway | http://localhost:8000 |
| Kong Admin | http://localhost:8001 |
| Auth Health | http://localhost:3001/health |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:4001 (admin/grafana_secure_2026) |
| Kibana | http://localhost:5601 |

### Production (à configurer)

| Service | URL |
|---------|-----|
| Frontend | https://app.AgroLogistic.com |
| API Gateway | https://api.AgroLogistic.com |
| Admin Portal | https://admin.AgroLogistic.com |

---

## Notes Importantes

1. **Toujours utiliser Kong Gateway** (`localhost:8000`) depuis le frontend, jamais les services directs
2. **Grafana** est maintenant sur le port **4001** (anciennement 3001)
3. **Auth Service** utilise le port **3001** (libéré de Grafana)
4. Les **variables d'environnement** doivent être configurées avant le build
5. En **production**, utiliser HTTPS et mettre à jour toutes les URLs

---

*Documentation mise à jour le 2026-01-19*
*Version: 2.0.0*
