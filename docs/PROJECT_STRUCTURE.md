# Structure du projet (AgroLogistic)

Ce document décrit l’organisation du code **frontend** (Vite + React + TypeScript) ainsi que les répertoires d’infrastructure/microservices.

## Vue d’ensemble

```
AgroDeep/
├── src/
│   ├── app/                 # Shell UI existant + composants “legacy”
│   ├── application/         # Use cases (Clean Architecture)
│   ├── domain/              # Entités + value objects (Clean Architecture)
│   ├── infrastructure/      # API adapters, clients, providers (Clean Architecture)
│   ├── presentation/        # Pages/contexts UI (auth, pages UI dédiées)
│   ├── layouts/             # Layouts React Router (Navbar/Sidebar + Outlet)
│   ├── pages/               # Pages (routes) normalisées
│   ├── router/              # Routing (React Router) + guards
│   ├── shared/              # Utilitaires partagés
│   ├── stores/              # State global (Zustand)
│   └── styles/              # CSS/Tailwind
│
├── infrastructure/          # Kong + Compose + monitoring
├── backend/auth-service/    # Auth Service (FastAPI) OAuth2/OIDC
└── services/                # Microservices métiers (Node/Express)
```

## Frontend : conventions

### `src/pages/`
- Contient des **pages routées** (une page = un chemin).
- Les pages peuvent assembler des composants venant de `src/app/components` (legacy) ou `src/presentation/pages`.

### `src/layouts/`
- Layouts de navigation (Navbar/Sidebar) basés sur le chemin (`/admin/*`, `/customer/*`).
- Utilise `Outlet` pour afficher la page actuelle.

### `src/router/`
- Définition des routes et **guards** (auth, permissions, rôles).
- Adaptateurs pour préserver les APIs de composants existants (ex: `onNavigate(route)`).

### `src/app/`
- Contient des composants UI existants (Dashboard, modules, landing).
- Le fichier `src/app/App.tsx` garde l’ancien routing “state-based” **à titre de référence**.
- Le point d’entrée actuel est `src/app/AppRouterRoot.tsx` (React Router).

## Aliases

Les alias TypeScript/Vite sont définis dans `tsconfig.json` et `vite.config.ts` :

- `@pages/*` → `src/pages/*`
- `@layouts/*` → `src/layouts/*`
- `@router/*` → `src/router/*`
- `@components/*` → `src/app/components/*`

## Références

- Guide développement : `docs/DEVELOPMENT_GUIDE.md`
- Architecture : `docs/ARCHITECTURE.md`
- Endpoints API : `docs/API_ENDPOINTS.md`
- Kong : `infrastructure/docs/kong-usage.md`

