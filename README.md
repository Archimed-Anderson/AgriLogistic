# AgroLogistic Platform

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Vite](https://img.shields.io/badge/Vite-6.4-646cff)

**Plateforme SaaS complète pour la logistique et la chaîne d'approvisionnement agricole**

[Démarrage rapide](#démarrage-rapide) • [Fonctionnalités](#fonctionnalités) • [Architecture](#architecture) • [Documentation](#documentation)

</div>

---

## Présentation

AgroLogistic est une solution intégrée conçue pour moderniser et optimiser les opérations agricoles. Elle combine la gestion des cultures, la logistique, le marketplace B2B, et des fonctionnalités d'intelligence artificielle pour offrir une expérience utilisateur fluide et performante.

## Prérequis

| Outil | Version | Description |
|-------|---------|-------------|
| Node.js | 20+ | Runtime JavaScript |
| npm | 9+ | Gestionnaire de paquets |
| Docker | (optionnel) | Pour les services backend |

## Démarrage rapide

### Installation

```bash
# Cloner le repository
git clone https://github.com/agrologistic/agrologistic-platform.git
cd agrologistic-platform

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

Ouvrir [http://localhost:5174](http://localhost:5174)

### Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@agrologistic.com | admin123 |
| Agriculteur | farmer@agrologistic.com | farmer123 |
| Acheteur | buyer@agrologistic.com | buyer123 |
| Transporteur | transporter@agrologistic.com | transporter123 |

## Fonctionnalités

### Gestion agricole
- **Dashboard** - Vue d'ensemble avec métriques clés et météo intégrée
- **Crop Intelligence** - Suivi des cultures avec données en temps réel
- **Sol et Eau** - Monitoring de l'irrigation et qualité des sols
- **Météo** - Intégration des prévisions météorologiques
- **Équipements** - Gestion du parc matériel

### Gestion des ressources humaines
- **Main-d'œuvre** - Suivi temps réel des équipes terrain
- **Plannings** - Rotations et gestion des shifts
- **Analytics IA** - Prédictions et optimisation des ressources
- **IoT** - Intégration des appareils connectés

### Commerce et logistique
- **Marketplace** - Place de marché B2B pour produits agricoles
- **Logistique** - Gestion des transports et livraisons
- **Calculateur transport** - Estimation des coûts logistiques
- **Paiements** - Gestion des transactions

### Administration
- **Utilisateurs** - Gestion multi-rôles (Admin, Farmer, Buyer, Transporter)
- **Rapports** - Génération de rapports personnalisés
- **Paramètres** - Configuration de la plateforme

## Architecture

```
src/
├── app/              # Composants UI principaux
├── application/      # Use cases et logique métier
├── domain/           # Entités et value objects
├── infrastructure/   # Adapters et services externes
├── presentation/     # Pages et composants de présentation
├── modules/          # Modules fonctionnels
├── shared/           # Utilitaires partagés
└── stores/           # État global (Zustand)
```

Le projet suit les principes de **Clean Architecture** avec une séparation claire des responsabilités.

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Compile pour la production |
| `npm run typecheck` | Vérifie les types TypeScript |
| `npm run lint` | Analyse le code avec ESLint |
| `npm run test` | Lance les tests unitaires |
| `npm run test:e2e` | Lance les tests end-to-end |

## Technologies

| Catégorie | Technologies |
|-----------|--------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS 4, Radix UI |
| State | Zustand |
| Charts | Recharts |
| Forms | React Hook Form |
| Tests | Vitest, Playwright |

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine :

```env
VITE_AUTH_PROVIDER=mock
VITE_API_GATEWAY_URL=http://localhost:3001/api/v1
```

### Mode backend réel

```bash
# Démarrer l'infrastructure
docker-compose up -d postgres redis

# Démarrer le service d'authentification
cd services/auth-service && npm run dev

# Configurer le frontend
VITE_AUTH_PROVIDER=real npm run dev
```

## Documentation

- [Guide de développement](docs/DEVELOPMENT_GUIDE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Endpoints](docs/API_ENDPOINTS.md)
- [Guide création de compte](docs/ACCOUNT-CREATION-GUIDE.md)

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

**AgroLogistic** - Optimisez votre chaîne d'approvisionnement agricole

</div>
