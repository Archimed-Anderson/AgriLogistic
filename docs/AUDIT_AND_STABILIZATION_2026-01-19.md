# Audit & Stabilisation — AgroDeep (2026-01-19)

## Portée de l’audit

- **Frontend**: `AgroDeep/` (React + Vite + TypeScript + Vitest/Playwright)
- **Backend principal validé**: `AgroDeep/services/auth-service` (Node + TypeScript + Jest)
- **Orchestration**: `AgroDeep/docker-compose.yml` + scripts PowerShell à la racine

## Problèmes critiques identifiés

### 1) Script `clean` non compatible Windows
- **Symptôme**: `npm run clean` utilisait `rm -rf` → casse sur Windows.
- **Impact**: nettoyage impossible, erreurs de build/tests dans certains workflows.

### 2) Incohérence de variables d’environnement côté frontend
- **Symptôme**: `docker-compose.yml` injectait `VITE_API_URL`, alors que le code lit majoritairement `VITE_API_GATEWAY_URL`.
- **Impact**: risques de configuration “fantôme” (frontend pointe au mauvais endpoint).

### 3) Healthcheck Docker du frontend “unhealthy”
- **Symptôme**: healthcheck sur `/health` alors que le serveur Vite ne sert pas forcément cette route.
- **Impact**: container marqué `unhealthy` malgré fonctionnement apparent.

### 4) Timeout de health-check non effectif (Node fetch)
- **Symptôme**: `fetch(url, { timeout: 5000 })` n’est pas supporté par fetch natif Node.
- **Impact**: scripts de vérification pouvant “pendre” (timeout non appliqué).

### 5) Scripts PowerShell non reproductibles (chemins absolus)
- **Symptôme**: plusieurs scripts pointaient vers `c:\Users\ander\Downloads\...`.
- **Impact**: exécution impossible sur une autre machine / autre emplacement.

### 6) **Risque sécurité majeur**: abaissement de la sécurité PostgreSQL
- **Symptôme**: `AgroDeep/scripts/fix-and-start.ps1` écrivait un `pg_hba.conf` en mode **trust** sur de larges plages réseau.
- **Impact**: ouverture aux accès non authentifiés en dev (et risque de copier/coller en prod).

### 7) Vulnérabilités npm (auth-service)
- **Symptôme**: `npm audit --audit-level=high` signalait des vulnérabilités `diff` et `tar`.
- **Impact**: surface d’attaque via dépendances transitive.

## Corrections implémentées

### Frontend
- **Windows compatible**: `npm run clean` utilise désormais `node scripts/utils/clean.cjs`.
- **Variables d’env**: `docker-compose.yml` exporte `VITE_API_GATEWAY_URL` (et conserve `VITE_API_URL` en alias legacy).
- **Healthcheck**: vérifie désormais `http://localhost:3000` (root), pas `/health`.
- **Validation**: `npm run validate:full` passe (typecheck + lint + tests + build).

### Auth-service
- **Sécurité dépendances**: ajout de `overrides` npm pour forcer `diff` et `tar` à des versions corrigées.
- **Validation**: `npm audit --audit-level=high` passe + `npm test` passe.

### Scripts / Outillage
- **Portabilité**: scripts PowerShell rendus **sans chemins absolus** (résolution via `$PSScriptRoot`).
- **Sécurité**: suppression du bloc qui modifiait `pg_hba.conf` en `trust` dans `fix-and-start.ps1`.
- **Health-check timeout**: implémentation d’un timeout via `AbortController`.

## Fichiers modifiés (principaux)

- `AgroDeep/package.json`
- `AgroDeep/docker-compose.yml`
- `AgroDeep/scripts/check-health.js`
- `AgroDeep/scripts/fix-and-start.ps1`
- `AgroDeep/services/auth-service/package.json`
- `START_APP_SIMPLE.ps1`
- `run-security-tests.ps1`
- `scripts/fix-vulnerabilities.ps1`
- `scripts/rotate-secrets.ps1`

## Procédure de test (reproductible)

### 1) Frontend (qualité)

```powershell
cd AgroDeep
npm install
npm run validate:full
```

### 2) Auth-service (sécurité + tests)

```powershell
cd AgroDeep\services\auth-service
npm install
npm audit --audit-level=high
npm test
```

### 3) Démarrage rapide (dev)

```powershell
.\START_APP_SIMPLE.ps1
```

## Points restant avant “production”

- Remplacer les **secrets par défaut** (ne pas dépendre de valeurs de fallback dans `docker-compose.yml`).
- Activer/forcer **CSRF** si le frontend utilise des cookies.
- Restreindre l’accès au **Kong Admin API** (port 8001) et activer TLS en prod.
- Mettre en place CI (au minimum `npm run validate:full` + `npm audit` + tests backend).

