# AgroLogistic

<div align="center">
  <img src="public/assets/images/landing/icon-marketplace.png" alt="AgroLogistic" width="96" height="96" />

  <p><strong>Plateforme SaaS “Super App” pour la logistique et la chaîne d'approvisionnement agricole</strong></p>
  <p>
    AgroLogistic centralise la gestion agricole, le marketplace B2B, la logistique (livraisons & tracking), les paiements,
    l’analytics et l’IA, via une architecture microservices et une API Gateway Kong.
  </p>

[![CI](https://github.com/agrologistic/agrologistic-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/agrologistic/agrologistic-platform/actions/workflows/ci.yml)
[![Coverage](https://codecov.io/gh/agrologistic/agrologistic-platform/graph/badge.svg)](https://codecov.io/gh/agrologistic/agrologistic-platform)
[![Version](https://img.shields.io/badge/version-2.1.0-green)](#notes-de-version)
[![License](https://img.shields.io/badge/license-MIT-blue)](#licence)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](#pr%C3%A9requis-techniques)
[![Docker](https://img.shields.io/badge/docker-compose-blue)](#installation--configuration)

</div>

---

## Table des matières

- [Fonctionnalités principales](#fonctionnalités-principales)
- [Architecture du projet](#architecture-du-projet)
- [Stack technique](#stack-technique)
- [Prérequis techniques](#prérequis-techniques)
- [Installation & configuration](#installation--configuration)
  - [Mode Frontend (mock)](#mode-frontend-mock)
  - [Mode Full Stack (Kong + Auth + microservices)](#mode-full-stack-kong--auth--microservices)
  - [Variables d'environnement](#variables-denvironnement)
- [Scripts disponibles](#scripts-disponibles)
- [Tests](#tests)
- [Exemples d’utilisation](#exemples-dutilisation)
- [Documentation API](#documentation-api)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [Troubleshooting](#troubleshooting)
- [Contribution](#contribution)
- [Notes de version](#notes-de-version)
- [Licence](#licence)
- [Crédits](#crédits)

## Fonctionnalités principales

### Produit & Marketplace
- **Catalogue produits** : listing, recherche, détails, gestion (CRUD) via `product-service`.
- **Marketplace B2B** : parcours acheteur/vendeur, gestion de l’offre et de la demande (côté UI).

### Logistique (livraisons & tracking)
- **Livraisons** : gestion des livraisons (CRUD) et statuts.
- **Tracking** : endpoints de suivi et ETA (en dev, fallback Redis/DB), WebSocket pour le live tracking.
- **Chemins publics conservés** : `/api/v1/logistics/*` via Kong (façade sur `delivery-service`).

### Commandes & paiements
- **Orders** : création et suivi (saga pattern côté service), historisation des statuts.
- **Payments** : paiements (Stripe simulé en dev si non configuré), webhooks, remboursements.

### Notifications
- **Multi-canal** : email / SMS / push (providers optionnels), historique en base.
- **Contact** : endpoint public `/api/v1/contact` (ex: formulaire).

## Modules Utilisateurs

### 🛒 Espace Acheteur (`/buyer`) — 13 pages
Dashboard premium pour les acheteurs professionnels :
- **Dashboard** : KPIs personnalisés, flux d'actualités, alertes prix, graphique dépenses.
- **Marketplace** : Recherche avancée, filtres multicritères, mode grille/liste, comparateur.
- **Commandes** : Kanban 5 colonnes, timeline de suivi, modal détail.
- **Fournisseurs** : Base de données fournisseurs, notes, historique.
- **Traçabilité** : Suivi blockchain, certificats, timeline produit.
- **Qualité** : Inspections, scores qualité, rapports.
- **Stocks** : Gestion inventaire, alertes rupture, réapprovisionnement.
- **Analytics** : Graphiques interactifs, tendances, prévisions IA.
- **Livraisons** : Suivi temps réel, carte live, timeline.
- **Finance** : Transactions, factures, moyens de paiement (Orange Money, Wave).
- **Communauté** : Forum discussions, événements, networking.
- **Paramètres** : Profil, notifications, sécurité 2FA, préférences.
- **Assistant IA** : Chat intelligent, suggestions sourcing, analyse coûts.

### 👨‍🌾 Espace Agriculteur (`/farmer`) — Design modernisé
Gestion complète de l'exploitation agricole :
- **Dashboard** : KPIs (revenus, cultures, stock), graphique revenus Recharts, widget météo intégré.
- **Parcelles** : Cartographie interactive, suivi des sols.
- **Logistique** : Demandes de transport, suivi des enlèvements.
- **Marché** : Mise en vente des produits, suivi des cours.
- **Sidebar premium** : Gradient vert émeraude, widget météo, profil utilisateur.

### 🚚 Espace Transporteur (`/transporter`) — Design modernisé
Gestion de la logistique et du fret :
- **Dashboard** : KPIs temps réel (12 livraisons, 185K FCFA, 4.8★), alertes trafic.
- **Livraisons** : Liste avec filtres, modal détail, confirmation livraison.
- **Routes** : Optimisation des itinéraires (VRP Algorithm), calcul de coûts.
- **Flotte** : Gestion des véhicules, maintenance prédictive, IoT tracking.
- **Marketplace** : Bourse de fret, offres de transport.
- **Finance** : Facturation automatique, rentabilité par trajet.
- **Sidebar premium** : Gradient bleu, indicateur connexion, stats activité jour.

### 🛒 Espace Client (`/customer`)
Marketplace B2B pour les acheteurs :
- **Catalogue** : Recherche produits, filtres avancés.
- **Commandes** : Suivi des commandes, historique.
- **Paiements** : Wallet intégré, factures.

### Analytics & IA
- **Analytics** : stockage ClickHouse (agrégations), ingestion d’événements (Kafka optionnel).
- **IA** : recommandations & prévisions (seed minimal pour renvoyer des résultats en dev).

### Sécurité & API Gateway
- **Kong Gateway** (single entry-point) : routage, CORS, rate limiting, cache, limites de taille, plugins.
- **Auth enterprise OAuth2/OIDC** : registration + verification email + login + refresh + OIDC endpoints.
- **JWT RS256** validé par Kong (consumer `agrologistic-web-app` / `mobile` / `admin`).

### Qualité & DX
- **Clean Architecture** côté frontend (domain/application/infrastructure/presentation).
- **Tests** : Vitest + Playwright (smoke & full), scripts de validation.
- **Docs & runbooks** : architecture, guides, rapports de validation.

## Architecture du projet

### Vue d’ensemble (composants)

```mermaid
flowchart LR
  U[Clients Web / Mobile] --> FE[Frontend (Vite + React)]
  FE -->|HTTP(S) /api/v1| KONG[Kong API Gateway]

  subgraph "Auth"
    AUTH[Auth Service (FastAPI)\nOAuth2/OIDC + JWT RS256]
    AUTHDB[(PostgreSQL)]
    AUTHREDIS[(Redis)]
    AUTH --> AUTHDB
    AUTH --> AUTHREDIS
  end

  subgraph "Business Microservices (Node/Express)"
    PROD[product-service]
    ORDER[order-service]
    PAY[payment-service]
    LOGI[logistics-service\n(delivery-service facade)]
    NOTIF[notification-service]
    ANALYTICS[analytics-service]
    AI[ai-service]
    BC[blockchain-service]
    INV[inventory-service]
    USER[user-service]
  end

  KONG --> AUTH
  KONG --> PROD
  KONG --> ORDER
  KONG --> PAY
  KONG --> LOGI
  KONG --> NOTIF
  KONG --> ANALYTICS
  KONG --> AI
  KONG --> BC
  KONG --> INV
  KONG --> USER

  PROD --> PRODDB[(PostgreSQL)]
  PROD --> PRODES[(Elasticsearch)]
  ORDER --> ORDERDB[(PostgreSQL)]
  ORDER --> ORDERREDIS[(Redis)]
  PAY --> PAYDB[(PostgreSQL)]
  LOGI --> LOGIDB[(PostgreSQL)]
  LOGI --> LOGIREDIS[(Redis)]
  NOTIF --> NOTIFDB[(PostgreSQL)]
  NOTIF --> NOTIFREDIS[(Redis)]
  ANALYTICS --> CH[(ClickHouse)]
  ANALYTICS --> AREDIS[(Redis)]
  AI --> AIDB[(PostgreSQL)]
  AI --> AIREDIS[(Redis)]
  INV --> INVDB[(PostgreSQL)]
  USER --> USERDB[(PostgreSQL)]
```

### Structure Frontend (Clean Architecture)

```
src/
├── app/              # UI / layout / routing
├── application/      # Use cases
├── domain/           # Entités / règles métier
├── infrastructure/   # API adapters, clients, persistance
├── presentation/     # Pages / composants de présentation
├── modules/          # Modules fonctionnels
└── stores/           # Zustand (état global)
```

### Microservices Backend

```
backend/
├── auth-service/           # OAuth2/OIDC + JWT RS256 (FastAPI)
│   ├── app/
│   │   ├── api/           # Endpoints REST
│   │   ├── core/          # Configuration, sécurité
│   │   ├── db/            # Base de données
│   │   ├── models/        # Modèles SQLAlchemy
│   │   ├── schemas/       # Pydantic schemas
│   │   └── services/      # Logique métier
│   └── migrations/        # Alembic migrations

infrastructure/
├── docker-compose.business.yml    # Stack microservices métiers
├── docker-compose.kong.yml        # Kong API Gateway
└── docs/                          # Documentation infrastructure

services/
├── product-service/        # Catalogue produits (Node/Express)
├── order-service/         # Gestion commandes (Node/Express)
├── payment-service/       # Paiements Stripe (Node/Express)
├── logistics-service/     # Livraisons & tracking (Node/Express)
├── notification-service/  # Notifications multi-canal (Node/Express)
├── analytics-service/     # Analytics ClickHouse (Node/Express)
├── ai-service/           # IA & recommandations (Node/Express)
├── blockchain-service/    # Blockchain & traçabilité (Node/Express)
├── inventory-service/     # Gestion inventaire (Node/Express)
└── user-service/         # Gestion utilisateurs (Node/Express)
```

## Stack technique

### Frontend
- **Framework**: React 18.3+ avec TypeScript 5.3+
- **Build Tool**: Vite 6.4+
- **Routing**: React Router DOM 7.12+
- **State Management**: Zustand 5.0+
- **UI Components**: Radix UI + Tailwind CSS 4.1+
- **Forms**: React Hook Form 7.55+
- **Charts**: Recharts 2.15+
- **Testing**: Vitest 4.0+ + Playwright 1.57+

### Backend
- **API Gateway**: Kong 3.4+ (PostgreSQL backend)
- **Auth Service**: FastAPI (Python) + OAuth2/OIDC + JWT RS256
- **Microservices**: Node.js 20+ + Express.js
- **Databases**:
  - PostgreSQL 15+ (données relationnelles)
  - Redis 7+ (cache, sessions, pub/sub)
  - ClickHouse (analytics, time-series)
  - Elasticsearch (recherche produits)
  - MongoDB (données non-structurées, optionnel)

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose v2
- **Orchestration**: Kubernetes (k8s/) pour production
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana (optionnel)
- **Logging**: ELK Stack (optionnel)

### Sécurité
- **Authentication**: OAuth2/OIDC (Auth Service)
- **Authorization**: JWT RS256 validé par Kong
- **Rate Limiting**: Kong plugins (50-500 req/min selon tier)
- **CORS**: Configuré via Kong
- **HTTPS**: Supporté (port 8443)

## Prérequis techniques

### Outils
- **Node.js**: 20+
- **npm**: 9+
- **Docker Desktop**: 4.5+ (WSL2 recommandé sur Windows)
- **Docker Compose v2** (inclus avec Docker Desktop)
- **Git** (optionnel mais recommandé)

### Ports (local)
- **Kong Proxy**: `8000` (HTTP), `8443` (HTTPS)
- **Kong Admin API**: `8001` (localhost only)
- **Konga UI**: `1337`
- **Frontend Vite**: `5173` (par défaut)

## Installation & configuration

### Mode Frontend (mock)

1) Installer et lancer :

```bash
cd AgroDeep
npm install
npm run dev
```

2) Configurer `.env` (dans `AgroDeep/`) :

```env
VITE_AUTH_PROVIDER=mock
VITE_API_GATEWAY_URL=http://localhost:8000/api/v1
```

### Mode Full Stack (Kong + Auth + microservices)

> Objectif : **Frontend → Kong (`/api/v1`) → Auth + microservices** (tous sur `agrologistic-network`).

#### 0) Créer le réseau Docker (si nécessaire)

```powershell
docker network create agrologistic-network
```

#### 1) Démarrer les microservices métiers (stack unifié)

```powershell
cd AgroDeep\infrastructure
docker compose --env-file env.business.local -f docker-compose.business.yml up -d --build
```

#### 2) Démarrer l’Auth Service (OAuth2/OIDC)

```powershell
cd ..\backend\auth-service
docker compose -f docker-compose.auth.yml up -d --build
```

#### 3) Démarrer Kong (API Gateway)

```powershell
cd ..\..\infrastructure
docker compose --env-file env.kong.local -f docker-compose.kong.yml up -d
```

#### 4) Démarrer le Frontend en mode “backend réel”

Créer/mettre à jour `AgroDeep/.env` :

```env
VITE_AUTH_PROVIDER=real
VITE_API_GATEWAY_URL=http://localhost:8000/api/v1
```

Puis :

```powershell
cd ..\  # AgroDeep
npm run dev
```

### Variables d'environnement

#### Frontend (`.env` dans `AgroDeep/`)

```env
# Mode d'authentification (mock | real)
VITE_AUTH_PROVIDER=real

# URL de l'API Gateway Kong
VITE_API_GATEWAY_URL=http://localhost:8000/api/v1

# URLs des services (optionnel, utilise VITE_API_GATEWAY_URL par défaut)
VITE_PRODUCT_SERVICE_URL=http://localhost:8000/api/v1/products
VITE_ORDER_SERVICE_URL=http://localhost:8000/api/v1/orders
VITE_PAYMENT_SERVICE_URL=http://localhost:8000/api/v1/payments
VITE_LOGISTICS_SERVICE_URL=http://localhost:8000/api/v1/logistics
```

#### Backend (voir `backend/auth-service/env.auth.example` et `infrastructure/env.kong.example`)

**Auth Service** :
- `DATABASE_URL` : PostgreSQL connection string
- `REDIS_URL` : Redis connection string
- `JWT_SECRET_KEY` : Clé secrète JWT
- `JWT_PUBLIC_KEY` : Clé publique RS256 (pour validation Kong)
- `JWT_PRIVATE_KEY` : Clé privée RS256 (pour signature)
- `OIDC_ISSUER` : URL du serveur OIDC
- `EMAIL_SMTP_HOST` : Serveur SMTP pour emails
- `EMAIL_SMTP_PORT` : Port SMTP
- `EMAIL_FROM` : Adresse email expéditeur

**Kong** :
- `KONG_DATABASE` : `postgres` ou `off` (DB-less)
- `KONG_PG_HOST` : Host PostgreSQL
- `KONG_PG_DATABASE` : Nom de la base de données
- `KONG_PG_USER` : Utilisateur PostgreSQL
- `KONG_PG_PASSWORD` : Mot de passe PostgreSQL

## Scripts disponibles

### Développement
```bash
npm run dev              # Démarrer le serveur de développement
npm run dev:host        # Démarrer avec accès réseau (0.0.0.0)
npm run build           # Build de production
npm run build:analyze   # Build avec analyse de bundle
npm run preview         # Prévisualiser le build de production
```

### Qualité de code
```bash
npm run lint            # Linter ESLint
npm run lint:fix        # Corriger automatiquement les erreurs ESLint
npm run format          # Formater avec Prettier
npm run format:check    # Vérifier le formatage
npm run typecheck       # Vérifier les types TypeScript
```

### Tests
```bash
npm run test            # Tests unitaires (Vitest)
npm run test:watch      # Tests en mode watch
npm run test:ui         # Interface UI pour les tests
npm run test:coverage   # Tests avec couverture de code
npm run test:ci         # Tests pour CI/CD
npm run test:e2e        # Tests E2E smoke (Playwright)
npm run test:e2e:full    # Suite complète de tests E2E
npm run test:e2e:ui     # Interface UI Playwright
```

### Validation & déploiement
```bash
npm run validate        # Validation complète (typecheck + lint + format + tests)
npm run validate:full   # Validation complète + build
npm run validate:env    # Valider les variables d'environnement
npm run validate:services  # Valider les health endpoints des services
npm run check:health    # Vérifier la santé des services
npm run pre-deploy      # Vérifications pré-déploiement
npm run pre-production  # Vérifications pré-production
```

### Utilitaires
```bash
npm run clean           # Nettoyer les fichiers générés
npm run lighthouse      # Audit Lighthouse (performance)
```

## Tests

### Tests unitaires (Vitest)

Les tests unitaires sont situés dans `src/**/*.test.ts` et `src/**/*.spec.ts`.

```bash
# Lancer tous les tests
npm run test

# Mode watch (recommandé en développement)
npm run test:watch

# Avec couverture de code
npm run test:coverage
```

### Tests E2E (Playwright)

Les tests E2E sont dans `tests/e2e/`.

```bash
# Smoke test rapide
npm run test:e2e

# Suite complète
npm run test:e2e:full

# Interface UI interactive
npm run test:e2e:ui
```

### Structure des tests

```
tests/
├── e2e/
│   ├── smoke.spec.ts          # Tests smoke (rapides)
│   ├── auth.spec.ts           # Tests d'authentification
│   ├── marketplace.spec.ts    # Tests marketplace
│   └── screenshots/           # Captures d'écran automatiques
└── unit/                      # Tests unitaires (à organiser)
```

### Stratégie de test

- **Unitaires** : Logique métier, hooks, utilitaires
- **Intégration** : Services, adapters API
- **E2E** : Flux utilisateur complets (login, commande, paiement)

## Exemples d’utilisation

### 1) Health checks via Kong

```bash
curl http://localhost:8000/api/v1/auth/health
curl http://localhost:8000/api/v1/orders/health
curl http://localhost:8000/api/v1/logistics/health
curl http://localhost:8000/api/v1/payments/health
curl http://localhost:8000/api/v1/analytics/health
```

### 2) Auth “mode réel” (register → verify → login)

```bash
# Register (dev: renvoie verification_token)
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Test1234!","username":"demo","full_name":"Demo"}'

# Verify email (GET /verify-email/{token})
curl http://localhost:8000/api/v1/auth/verify-email/<verification_token>

# Login (renvoie access_token RS256 validé par Kong)
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Test1234!"}'
```

### 3) Appel API protégée via Kong

```bash
curl http://localhost:8000/api/v1/inventory \
  -H "Authorization: Bearer <access_token>"
```

### Captures d’écran
- Assets marketing / landing : `public/assets/images/landing/`
- Captures Playwright (tests E2E) : `tests/e2e/screenshots/`

## Documentation API

### Base URL
- **Gateway** : `http://localhost:8000`
- **API** : `http://localhost:8000/api/v1`

### Principaux endpoints (via Kong)

- Auth : `/api/v1/auth/*` (register/login/refresh/verify-email/…)
- Products : `/api/v1/products/*`
- Orders : `/api/v1/orders/*`
- Logistics : `/api/v1/logistics/*`
- Payments : `/api/v1/payments/*`
- Notifications : `/api/v1/notifications/*` (+ `/api/v1/contact`)
- Analytics : `/api/v1/analytics/*` (+ `/api/v1/events`)
- AI : `/api/v1/ai/*`
- Blockchain : `/api/v1/blockchain/*`
- Inventory : `/api/v1/inventory/*`
- Users : `/api/v1/users/*`

### Documentation détaillée
- Frontend API endpoints : [`docs/API_ENDPOINTS.md`](docs/API_ENDPOINTS.md)
- Structure du projet : [`docs/PROJECT_STRUCTURE.md`](docs/PROJECT_STRUCTURE.md)
- Pages UI & routes : [`docs/UI_PAGES.md`](docs/UI_PAGES.md)
- Architecture complète : [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- Guide de développement : [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md)
- Kong usage : [`infrastructure/docs/kong-usage.md`](infrastructure/docs/kong-usage.md)
- Kong architecture : [`infrastructure/docs/kong-architecture.md`](infrastructure/docs/kong-architecture.md)
- Auth service (OAuth2/OIDC) : [`backend/auth-service/README.md`](backend/auth-service/README.md)
- Runbook opérationnel : [`docs/OPERATIONS_RUNBOOK.md`](docs/OPERATIONS_RUNBOOK.md)

### Swagger/OpenAPI
- Les services backend exposent leurs documentations OpenAPI :
  - Auth Service : `http://localhost:8000/api/v1/auth/docs` (via Kong)
  - Product Service : `http://localhost:8000/api/v1/products/docs`
  - Order Service : `http://localhost:8000/api/v1/orders/docs`
  - Payment Service : `http://localhost:8000/api/v1/payments/docs`

## Développement

### Workflow recommandé

1. **Créer une branche** :
   ```bash
   git checkout -b feature/ma-feature
   # ou
   git checkout -b fix/bug-description
   ```

2. **Développer avec hot-reload** :
   ```bash
   npm run dev
   ```

3. **Tests en continu** :
   ```bash
   # Terminal 1: Dev server
   npm run dev
   
   # Terminal 2: Tests watch
   npm run test:watch
   ```

4. **Valider avant commit** :
   ```bash
   npm run validate:full
   ```

5. **Commit & Push** :
   ```bash
   git add .
   git commit -m "feat: description de la feature"
   git push origin feature/ma-feature
   ```

### Standards de code

- **TypeScript strict mode** : Tous les fichiers `.ts`/`.tsx` doivent être typés
- **ESLint** : Respecter les règles définies dans `.eslintrc.cjs`
- **Prettier** : Formatage automatique (format on save recommandé)
- **Conventions** :
  - Composants : PascalCase (`UserProfile.tsx`)
  - Hooks : camelCase avec préfixe `use` (`useAuth.ts`)
  - Utilitaires : camelCase (`formatDate.ts`)
  - Types/Interfaces : PascalCase (`UserProfile.ts`)

### Architecture Clean

Respecter la séparation des couches :
- **Domain** : Entités et règles métier pures (pas de dépendances externes)
- **Application** : Use cases et orchestration
- **Infrastructure** : Implémentations concrètes (API, storage)
- **Presentation** : UI et composants React

Voir [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) pour plus de détails.

## Déploiement

### Prérequis de déploiement

1. **Build de production** :
   ```bash
   npm run build
   ```

2. **Vérifications pré-déploiement** :
   ```bash
   npm run pre-deploy
   npm run pre-production
   ```

### Déploiement local (Docker)

```bash
# Build et démarrage avec Docker Compose
docker-compose up -d --build
```

### Déploiement production

Voir [`docs/OPERATIONS_RUNBOOK.md`](docs/OPERATIONS_RUNBOOK.md) pour :
- Configuration Kubernetes
- Variables d'environnement production
- Monitoring et alertes
- Backup et restauration
- Scaling horizontal

### CI/CD

Le projet utilise GitHub Actions (`.github/workflows/`) :
- **CI** : Tests automatiques sur chaque PR
- **CD** : Déploiement automatique sur merge vers `main`

## Troubleshooting

### Problèmes courants

#### 1. Kong ne démarre pas

**Symptôme** : `docker-compose` échoue pour Kong

**Solutions** :
```powershell
# Vérifier que le réseau Docker existe
docker network ls | Select-String agrologistic-network

# Créer le réseau si absent
docker network create agrologistic-network

# Vérifier les variables d'environnement Kong
cd infrastructure
cat env.kong.local  # Vérifier DATABASE_URL, etc.

# Regarder les logs
docker-compose -f docker-compose.kong.yml logs
```

#### 2. Auth Service : erreur de connexion PostgreSQL

**Symptôme** : `Connection refused` ou `database does not exist`

**Solutions** :
```powershell
# Vérifier que PostgreSQL est démarré
docker ps | Select-String postgres

# Vérifier les variables DATABASE_URL dans env.auth.local
cd backend/auth-service
cat env.auth.local

# Lancer les migrations
docker-compose -f docker-compose.auth.yml run --rm auth-service alembic upgrade head
```

#### 3. Frontend : erreur CORS

**Symptôme** : `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions** :
- Vérifier que Kong est démarré et que CORS est configuré
- Vérifier `VITE_API_GATEWAY_URL` dans `.env`
- Vérifier que le frontend utilise bien l'URL via Kong (`http://localhost:8000/api/v1`)

#### 4. Tests E2E échouent

**Symptôme** : Playwright ne trouve pas les éléments

**Solutions** :
```bash
# Lancer les tests en mode UI pour debug
npm run test:e2e:ui

# Vérifier que les services sont démarrés
npm run validate:services

# Vérifier les screenshots dans tests/e2e/screenshots/
```

#### 5. Build échoue

**Symptôme** : Erreurs TypeScript ou de build

**Solutions** :
```bash
# Nettoyer et réinstaller
npm run clean
rm -rf node_modules package-lock.json
npm install

# Vérifier les types
npm run typecheck

# Build avec analyse
npm run build:analyze
```

### Logs utiles

```powershell
# Logs Kong
docker-compose -f infrastructure/docker-compose.kong.yml logs -f

# Logs Auth Service
docker-compose -f backend/auth-service/docker-compose.auth.yml logs -f

# Logs microservices métiers
docker-compose -f infrastructure/docker-compose.business.yml logs -f [service-name]

# Logs frontend (Vite)
# Voir la console du navigateur et le terminal où `npm run dev` tourne
```

### Health checks

```bash
# Vérifier tous les services
npm run validate:services

# Health check manuel
curl http://localhost:8000/api/v1/auth/health
curl http://localhost:8000/api/v1/products/health
curl http://localhost:8000/api/v1/orders/health
```

## Contribution

Merci de contribuer !

1. **Lire le guide** : [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md)
2. **Créer une branche** :
   ```bash
   git checkout -b feat/ma-feature
   ```
3. **Développer** avec les standards de code (voir [Développement](#développement))
4. **Valider** :
   ```bash
   npm run validate:full
   ```
5. **Ouvrir une Pull Request** avec :
   - Description claire de la feature/fix
   - Plan de test
   - Screenshots si changement UI
   - Mise à jour de la documentation si nécessaire

## Notes de version

### Version 2.1.0 (2026-01-23)

Voir le changelog complet : [`CHANGELOG.md`](CHANGELOG.md)

#### 🎨 Nouveautés v2.1.0 — Modernisation des Dashboards

- **Buyer Dashboard complet** (13 pages) :
  - Dashboard, Marketplace, Orders, Suppliers, Traceability, Quality
  - Inventory, Analytics, Deliveries, Finance, Community, Settings
  - Assistant IA avec chat intelligent et suggestions
  - Hooks React Query : useBuyerDashboard, useMarketplace, useSuppliers, etc.

- **Design Premium** pour tous les dashboards :
  - **Sidebars gradient** : Bleu (Transporter), Vert (Farmer), Ambre (Buyer)
  - **Headers glassmorphiques** avec backdrop-blur
  - **Widgets stats intégrés** dans chaque sidebar
  - **Icônes Lucide** cohérentes sur toutes les pages
  - Design 100% responsive (mobile/tablette/desktop)

- **Données réalistes** sénégalaises :
  - Produits : tomates, oignons, mangues, manioc, arachides
  - Villes : Dakar, Thiès, Ziguinchor, Saint-Louis, Kolda
  - Prix en FCFA avec formatage correct
  - Fournisseurs et clients fictifs réalistes

#### Points clés v2.0.0

- **Kong API Gateway** :
  - Routes `/api/v1/*` homogènes pour tous les services
  - Health routes pour monitoring
  - CORS preflight route configurée
  - Rate limiting par tier utilisateur
  - JWT RS256 validation

- **Auth Service (FastAPI)** :
  - **OAuth2/OIDC** complet avec endpoints standards
  - JWT RS256 (signature et validation)
  - Support MFA et Social login

- **Business Stack** :
  - `docker-compose.business.yml` unifié pour tous les microservices métiers
  - Services : Product, Order, Payment, Logistics, Notification, Analytics, AI, Blockchain, Inventory, User
  - Bases de données : PostgreSQL, Redis, ClickHouse, Elasticsearch

- **Frontend** :
  - Clean Architecture implémentée
  - Tests E2E avec Playwright
  - Support OAuth2/OIDC avec refresh token
  - Mode mock et mode réel (backend)

- **DevOps** :
  - CI/CD avec GitHub Actions
  - Docker Compose pour développement local
  - Kubernetes configs pour production
  - Health checks et monitoring

#### Roadmap

Voir [`docs/IMPLEMENTATION_ROADMAP.md`](docs/IMPLEMENTATION_ROADMAP.md) pour le plan complet sur 4 phases (Q1-Q4 2026).

## Licence

Ce projet est sous licence **MIT**. Voir [`LICENSE`](LICENSE).

## Crédits

- **AgroLogistic Team** — `dev@agrologistic.com`
- **Tech stack** : React, TypeScript, Vite, FastAPI, Kong, PostgreSQL, Redis, ClickHouse, Docker, Kubernetes
- **Architecture** : Clean Architecture + Domain-Driven Design (DDD)
- **License** : MIT

### Ressources

- 📚 [Documentation complète](docs/)
- 🐛 [Signaler un bug](https://github.com/agrologistic/agrologistic-platform/issues)
- 💡 [Proposer une feature](https://github.com/agrologistic/agrologistic-platform/issues)
- 🤝 [Guide de contribution](docs/CONTRIBUTING.md)

---

<div align="center">
  <p>Made with ❤️ by the AgroLogistic Team</p>
  <p>
    <a href="https://agrologistic.com">Website</a> •
    <a href="https://github.com/agrologistic/agrologistic-platform">GitHub</a> •
    <a href="docs/">Documentation</a>
  </p>
</div>

