# 🌾 AgroDeep Platform

<div align="center">

![AgroDeep Logo](https://via.placeholder.com/200x200/0B7A4B/FFFFFF?text=AgroDeep)

**Plateforme SaaS Complète pour la Chaîne d'Approvisionnement Agricole**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./docs/CONTRIBUTING.md)

[Documentation](./docs) · [Demo](https://agrodeep.com) · [Report Bug](https://github.com/agrodeep/agrodeep-platform/issues) · [Request Feature](https://github.com/agrodeep/agrodeep-platform/issues)

</div>

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 À Propos

**AgroDeep** est une plateforme SaaS moderne et complète conçue pour révolutionner la chaîne d'approvisionnement agricole. Construite avec React, TypeScript et suivant les principes de Clean Architecture, elle offre :

- 🛒 **Marketplace** - Achat/vente de produits et équipements agricoles
- 🚚 **Logistique** - Gestion du transport et tracking en temps réel
- 🌾 **Agriculture Intelligente** - IoT, IA, et automatisation des cultures
- 💰 **Suite Financière** - Gestion financière et programme d'affiliation
- 📊 **Analytics** - Rapports et KPIs en temps réel
- 👥 **Gestion d'Utilisateurs** - Administration complète multi-rôles

---

## ✨ Fonctionnalités

### 🛒 Marketplace & Commerce

- Catalogue de produits complet (tracteurs, équipements, pièces détachées)
- Panier d'achat et processus de commande
- Gestion des stocks en temps réel
- Système de paiement sécurisé
- Historique des commandes

### 🚚 Transport & Logistique

- **Calculateur de Transport** - Estimation automatique des coûts
- **Tracking en Temps Réel** - Suivi GPS des livraisons
- **Gestion des Transporteurs** - Dashboard transporteurs
- **Chat B2B** - Communication directe transporteur-client
- **Optimisation des Routes** - IA pour routes optimales

### 🌾 Agriculture Intelligente

- **IoT Device Hub** - Connexion capteurs et équipements
- **Crop Intelligence** - Analyse des cultures avec IA
- **AI Insights** - Prédictions et recommandations
- **Automation Workflows** - Automatisation des tâches

### 💰 Suite Financière

- Gestion de facturation
- Traitement des paiements
- Programme d'affiliation (jusqu'à 25% commission)
- Suivi des revenus en temps réel

### 📊 Analytics & Reporting

- Dashboard avec KPIs en temps réel
- Rapports personnalisables
- Export de données (CSV, Excel, PDF)
- Visualisations interactives

### 👥 Administration

- Gestion multi-utilisateurs
- Rôles et permissions (Admin, User, Carrier)
- Gestion de produits et catégories
- Configuration système

---

## 🏗️ Architecture

AgroDeep est construit selon les principes de **Clean Architecture** :

```
┌─────────────────────────────────────────┐
│          AGRODEEP PLATFORM              │
│     Clean Architecture + DDD            │
└─────────────────────────────────────────┘
                  │
      ┌───────────┼───────────┐
      │           │           │
      ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  DOMAIN  │ │   APP    │ │   UI     │
│(Entities)│◄│(Use Cases)│►│(React)   │
└──────────┘ └──────────┘ └──────────┘
      │           │           │
      └───────────┼───────────┘
                  ▼
          ┌──────────────┐
          │    INFRA     │
          │(APIs, DB)    │
          └──────────────┘
```

### Principes

- ✅ **Separation of Concerns** - Chaque couche a une responsabilité unique
- ✅ **Dependency Inversion** - Les dépendances pointent vers le domaine
- ✅ **Testability** - 100% testable indépendamment
- ✅ **Scalability** - Architecture modulaire et extensible

Voir [ARCHITECTURE.md](./docs/ARCHITECTURE.md) pour plus de détails.

---

## 🛠️ Technologies

### Core

- **React 18.2** - UI Library
- **TypeScript 5.3** - Type Safety
- **Vite 5.0** - Build Tool
- **Tailwind CSS 4.0** - Styling

### State Management

- **Zustand** - Global State
- **React Query** - Server State
- **React Context** - Local State

### UI Components

- **Radix UI** - Headless Components
- **Lucide React** - Icon Library
- **Sonner** - Toast Notifications

### Development

- **Vitest** - Unit Testing
- **Playwright** - E2E Testing
- **ESLint** - Linting
- **Prettier** - Code Formatting

### Infrastructure

- **Supabase** - Backend (Auth, DB, Storage)
- **Vercel** - Deployment
- **GitHub Actions** - CI/CD

---

## 🚀 Installation

### Prérequis

```bash
Node.js >= 18.0.0
pnpm >= 8.0.0
Git >= 2.30.0
```

### Installation Rapide

```bash
# 1. Clone le repository
git clone https://github.com/agrodeep/agrodeep-platform.git
cd agrodeep-platform

# 2. Installe les dépendances
pnpm install

# 3. Configure les variables d'environnement
cp .env.example .env
# Édite .env avec tes valeurs

# 4. Lance en développement
pnpm dev
```

### Configuration des Variables d'Environnement

```bash
# .env
VITE_APP_NAME=AgroDeep
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 💻 Utilisation

### Commandes Disponibles

```bash
# Développement
pnpm dev              # Lance le serveur de dev
pnpm dev:host         # Dev avec accès réseau

# Build
pnpm build            # Build production
pnpm preview          # Preview du build

# Tests
pnpm test             # Tests unitaires
pnpm test:watch       # Tests en mode watch
pnpm test:e2e         # Tests E2E
pnpm test:coverage    # Rapport de coverage

# Quality
pnpm lint             # Vérifie le code
pnpm lint:fix         # Corrige les erreurs
pnpm format           # Formate le code
pnpm typecheck        # Vérifie les types

# Analysis
pnpm analyze          # Analyse la taille du bundle
```

### Accès à l'Application

Après `pnpm dev`, l'application est accessible sur :

```
Local:   http://localhost:5173
Network: http://192.168.x.x:5173
```

### Comptes de Test

```
Admin:
Email: admin@agrodeep.com
Password: Admin123!

User:
Email: user@agrodeep.com
Password: User123!

Carrier:
Email: carrier@agrodeep.com
Password: Carrier123!
```

---

## 📚 Documentation

### Documentation Complète

- [**ARCHITECTURE.md**](./docs/ARCHITECTURE.md) - Architecture détaillée
- [**FOLDER_STRUCTURE.md**](./docs/FOLDER_STRUCTURE.md) - Structure des dossiers
- [**DEVELOPMENT_GUIDE.md**](./docs/DEVELOPMENT_GUIDE.md) - Guide de développement
- [**CONTRIBUTING.md**](./docs/CONTRIBUTING.md) - Guide de contribution
- [**API_DOCUMENTATION.md**](./docs/API_DOCUMENTATION.md) - Documentation API

### Guides Rapides

#### Créer un Nouveau Composant

```bash
# Structure recommandée
src/presentation/components/features/mon-module/
├── MonComposant.tsx
├── MonComposant.spec.tsx
└── index.ts
```

#### Créer un Use Case

```bash
# Structure recommandée
src/application/use-cases/mon-module/
├── mon-action.usecase.ts
├── mon-action.usecase.spec.ts
└── index.ts
```

#### Ajouter une Route

```typescript
// src/presentation/routing/routes.tsx
{
  path: "/nouvelle-route",
  element: <NouvellePage />,
  guard: PrivateRoute
}
```

---

## 🤝 Contributing

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le repository
2. **Clone** ton fork
3. **Crée** une branche (`git checkout -b feature/ma-feature`)
4. **Commit** tes changements (`git commit -m 'feat: add new feature'`)
5. **Push** vers ta branche (`git push origin feature/ma-feature`)
6. **Ouvre** une Pull Request

Voir [CONTRIBUTING.md](./docs/CONTRIBUTING.md) pour plus de détails.

### Standards de Commits

Nous utilisons [Conventional Commits](https://www.conventionalcommits.org/) :

```bash
feat(scope): add new feature
fix(scope): resolve bug
docs(scope): update documentation
style(scope): format code
refactor(scope): restructure code
test(scope): add tests
chore(scope): update dependencies
```

---

## 🧪 Testing

### Couverture de Tests

```
Domain Layer:       100% ████████████████████
Application Layer:   90% ██████████████████
Infrastructure:      70% ██████████████
Presentation:        80% ████████████████
```

### Lancer les Tests

```bash
# Tests unitaires
pnpm test

# Tests E2E
pnpm test:e2e

# Rapport de coverage
pnpm test:coverage
```

---

## 📈 Roadmap

### Q1 2026

- [x] Marketplace complet
- [x] Transport & Logistics
- [x] IoT Device Hub
- [x] AI Insights
- [x] Financial Suite

### Q2 2026

- [ ] Mobile App (React Native)
- [ ] API publique REST/GraphQL
- [ ] Intégrations tierces (Stripe, Twilio)
- [ ] Multi-langue (i18n)

### Q3 2026

- [ ] Blockchain pour traçabilité
- [ ] Marketplace B2B2C étendu
- [ ] Module de formation (LMS)
- [ ] Analytics avancés (ML)

---

## 👥 Équipe

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/username1">
        <img src="https://via.placeholder.com/100" width="100px;" alt=""/>
        <br /><sub><b>John Doe</b></sub>
      </a>
      <br />Lead Developer
    </td>
    <td align="center">
      <a href="https://github.com/username2">
        <img src="https://via.placeholder.com/100" width="100px;" alt=""/>
        <br /><sub><b>Jane Smith</b></sub>
      </a>
      <br />UI/UX Designer
    </td>
    <td align="center">
      <a href="https://github.com/username3">
        <img src="https://via.placeholder.com/100" width="100px;" alt=""/>
        <br /><sub><b>Bob Johnson</b></sub>
      </a>
      <br />Backend Engineer
    </td>
  </tr>
</table>

---

## 📄 License

Ce projet est licensé sous la **MIT License** - voir [LICENSE](./LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- [React](https://reactjs.org/) - UI Library
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Supabase](https://supabase.com/) - Backend Platform
- [Vercel](https://vercel.com/) - Deployment Platform
- Tous nos [contributeurs](https://github.com/agrodeep/agrodeep-platform/contributors)

---

## 📞 Contact

- **Website**: [agrodeep.com](https://agrodeep.com)
- **Email**: contact@agrodeep.com
- **Twitter**: [@agrodeep](https://twitter.com/agrodeep)
- **LinkedIn**: [AgroDeep](https://linkedin.com/company/agrodeep)

---

<div align="center">

**Fait avec ❤️ par l'équipe AgroDeep**

[⬆ Retour en haut](#-agrodeep-platform)

</div>
