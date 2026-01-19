# AgroDeep (AgroLogistic Platform)

Monorepo contenant :
- un **frontend** React/Vite dans `AgroDeep/`
- des **microservices** Node/TS dans `AgroDeep/services/` (dont `auth-service`)

## Prérequis

- Node.js 20+
- npm 9+
- (Optionnel) Docker Desktop pour Postgres/Redis/Kong, etc.

## Installation (frontend)

```powershell
cd AgroDeep
npm install
```

## Démarrage

### 1) Mode développement (auth mock, sans backend)

```powershell
cd AgroDeep
$env:VITE_AUTH_PROVIDER="mock"
npm run dev
```

Ouvrir `http://localhost:5173`.

### 2) Mode backend réel (auth-service)

1. Démarrer l’infrastructure minimale :

```powershell
cd AgroDeep
docker-compose up -d postgres redis
```

2. Démarrer `auth-service` :

```powershell
cd AgroDeep\services\auth-service
npm install
npm run dev
```

3. Démarrer le frontend en pointant vers l’API :

```powershell
cd AgroDeep
$env:VITE_AUTH_PROVIDER="real"
$env:VITE_API_GATEWAY_URL="http://localhost:3001/api/v1"
npm run dev
```

## Variables d’environnement (frontend)

Créer `AgroDeep/.env` :

```env
VITE_AUTH_PROVIDER=mock
VITE_API_GATEWAY_URL=http://localhost:3001/api/v1
```

## Sécurité (résumé)

- **CSRF** (backend auth) : endpoint `GET /api/v1/auth/csrf-token` + Double Submit Cookie.
- **Validation** : routes auth validées via Joi + sanitization.
- **Dépendances** : suppression de `xlsx` (export/import désormais en CSV).

## Import / Export (CSV)

Les écrans :
- `src/app/components/UserManagement.tsx`
- `src/app/components/ProductInventory.tsx`

gèrent l’import/export **CSV** via `src/shared/utils/csv.ts`.

## Scripts (frontend)

```bash
npm run build
npm run typecheck
npm test
npm run lint
```

## Documentation

Voir `AgroDeep/docs/` :
- `ACCOUNT-CREATION-GUIDE.md`
- `ARCHITECTURE.md`
- `API_ENDPOINTS.md`
- `DEVELOPMENT_GUIDE.md`
- `AUDIT_REPORT.md`
