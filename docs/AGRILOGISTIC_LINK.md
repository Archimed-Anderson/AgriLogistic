# 🚚 AgriLogistic Link - Hub de Mise en Relation 360°

## 📋 Vue d'ensemble

**AgriLogistic Link** est le module de mise en relation en temps réel qui connecte **Producteurs**, **Acheteurs** et **Transporteurs** dans l'écosystème agricole. C'est le "**Uber de l'agriculture**" : une plateforme intelligente qui utilise l'IA pour matcher instantanément les chargements avec les camions disponibles.

## 🎯 Objectifs

- **Mise en relation instantanée** : Connecter chargeurs et transporteurs en temps réel
- **Matching AI intelligent** : Score de compatibilité 0-100% basé sur 6 facteurs clés
- **Optimisation logistique** : Réduire les temps morts et maximiser l'efficacité
- **Transparence totale** : Suivi en temps réel et analytics détaillés

## 🏗️ Architecture

### Structure des fichiers

```
src/
├── app/
│   ├── data/
│   │   └── logistics-operations.ts    # Dataset complexe (Loads, Trucks, Matches)
│   ├── link-hub/
│   │   ├── page.tsx                   # Page publique du hub
│   │   └── link-hub.css               # Styles premium
│   └── admin/
│       └── link-monitor/
│           ├── page.tsx               # Dashboard admin
│           └── link-monitor.css       # Styles admin
```

## 📊 Dataset - Logistics Operations

### Types de données

#### 1. **Loads (Chargements)**
```typescript
interface Load {
  id: string;                    // LOAD-0001
  productType: ProductType;      // Maïs, Blé, Riz, etc.
  quantity: number;              // En tonnes
  origin: GeoCoordinates;        // Point de départ (GPS)
  destination: GeoCoordinates;   // Point d'arrivée (GPS)
  priceOffer: number;            // Prix offert (FCFA)
  status: LoadStatus;            // Pending, Matched, In Transit, Delivered
  aiMatchScore?: number;         // Score AI 0-100%
  matchedTruckId?: string;       // ID du camion matché
  specialRequirements?: string[]; // Exigences spéciales
  temperature?: {...};           // Contrôle température
  // ... autres champs
}
```

#### 2. **Trucks (Camions)**
```typescript
interface Truck {
  id: string;                    // TRUCK-0001
  driverName: string;            // Nom du conducteur
  driverRating: number;          // Note 0-5
  truckType: string;             // Type de camion
  capacity: number;              // Capacité en tonnes
  currentPosition: GeoCoordinates; // Position actuelle (GPS)
  status: TruckStatus;           // Available, Assigned, In Transit, Maintenance
  features: string[];            // GPS, Réfrigération, etc.
  aiMatchScore?: number;         // Score AI 0-100%
  // ... autres champs
}
```

#### 3. **Matches (Correspondances)**
```typescript
interface LogisticsMatch {
  id: string;                    // MATCH-0001
  loadId: string;                // ID du chargement
  truckId: string;               // ID du camion
  matchScore: number;            // Score global 0-100%
  distance: number;              // Distance en km
  estimatedDuration: number;     // Durée estimée (heures)
  estimatedCost: number;         // Coût estimé (FCFA)
  matchFactors: {                // Détail des facteurs
    capacityMatch: number;       // 25% max
    locationProximity: number;   // 20% max
    timeAvailability: number;    // 20% max
    specialRequirements: number; // 15% max
    priceCompatibility: number;  // 10% max
    driverRating: number;        // 10% max
  };
  status: 'Suggested' | 'Accepted' | 'Rejected' | 'Expired';
}
```

## 🤖 Algorithme de Matching AI

Le score de compatibilité est calculé selon **6 facteurs** :

### 1. **Capacité (25%)** - `capacityMatch`
- Ratio optimal : 70-100% de la capacité du camion
- Évite le gaspillage et la surcharge

### 2. **Proximité géographique (20%)** - `locationProximity`
- Distance camion ↔ point de chargement
- < 50 km : 20 points
- 50-150 km : 15 points
- 150-300 km : 10 points
- > 300 km : 5 points

### 3. **Disponibilité temporelle (20%)** - `timeAvailability`
- Écart entre date de pickup et disponibilité camion
- ≤ 1 jour : 20 points
- 1-3 jours : 15 points
- 3-7 jours : 10 points
- > 7 jours : 5 points

### 4. **Exigences spéciales (15%)** - `specialRequirements`
- Matching des features du camion avec les besoins
- Température contrôlée, GPS, etc.

### 5. **Compatibilité prix (10%)** - `priceCompatibility`
- Ratio prix offert / coût estimé
- ≥ 120% : 10 points
- 100-120% : 8 points
- 80-100% : 5 points
- < 80% : 2 points

### 6. **Note du conducteur (10%)** - `driverRating`
- Basé sur la note 0-5 étoiles
- (rating / 5) × 10

## 🎨 Page Publique - Link Hub

### Fonctionnalités

#### **4 Vues principales**
1. **Chargements** : Liste des loads avec filtres (Pending, Matched, In Transit)
2. **Camions** : Liste des trucks disponibles avec specs
3. **Matches** : Visualisation des correspondances avec scores détaillés
4. **Carte** : Vue géographique (placeholder pour intégration future)

#### **Statistiques en temps réel**
- Chargements actifs
- Camions disponibles
- Taux de match
- Temps moyen de matching

#### **Filtres avancés**
- Recherche par produit, ville, conducteur
- Filtrage par statut
- Tri par score AI

#### **Affichage des scores AI**
- Barre de progression visuelle
- Score 0-100%
- Détail du camion matché

### Design

- **Glassmorphism** : Effets de verre dépoli
- **Gradients dynamiques** : Couleurs vibrantes
- **Animations fluides** : Transitions smooth
- **Responsive** : Mobile-first design
- **Dark mode** : Thème sombre premium

## 📈 Dashboard Admin - Link Monitor

### KPIs en temps réel

#### **6 Cartes KPI**
1. **Chargements actifs** : Nombre + tendance
2. **Camions disponibles** : Nombre + tendance
3. **Taux de match** : Pourcentage + tendance
4. **Revenu total** : Montant en FCFA
5. **Score AI moyen** : Moyenne des matches
6. **Distance moyenne** : Km par trajet

### Analytics avancés

#### **Distribution des statuts**
- Graphiques en barres pour Loads et Trucks
- Pourcentages et nombres absolus

#### **Top Routes**
- Routes les plus fréquentes
- Nombre de trajets par route

#### **Top Produits**
- Produits les plus transportés
- Volume en tonnes

#### **Top Conducteurs**
- Classement par revenu
- Note, nombre de trajets, revenu total

#### **Matches récents**
- Tableau détaillé des 10 derniers matches
- Score AI, distance, coût, statut
- Actions : Voir, Éditer

#### **Feed d'activité en temps réel**
- Indicateur "Live"
- Nouveaux matches, chargements, camions
- Timestamps relatifs

### Contrôles

- **Sélecteur de période** : 24h, 7j, 30j, Tout
- **Export de données** : Bouton d'export
- **Filtres personnalisés** : Par métrique

## 🚀 Utilisation

### Intégration dans l'app

#### 1. **Importer le dataset**
```typescript
import {
  mockLoads,
  mockTrucks,
  mockMatches,
  mockAnalytics,
  calculateAIMatchScore,
  calculateDistance,
} from '@/app/data/logistics-operations';
```

#### 2. **Utiliser les composants**
```typescript
// Page publique
import LinkHubPage from '@/app/link-hub/page';

// Dashboard admin
import LinkMonitorPage from '@/app/admin/link-monitor/page';
```

#### 3. **Ajouter les routes**
```typescript
// Dans votre router
{
  path: '/link-hub',
  component: LinkHubPage,
  meta: { requiresAuth: true }
},
{
  path: '/admin/link-monitor',
  component: LinkMonitorPage,
  meta: { requiresAuth: true, role: 'admin' }
}
```

## 📊 Données mockées

### Volumes
- **50 chargements** : Variété de produits et destinations
- **30 camions** : Différents types et capacités
- **Matches automatiques** : Générés par l'algorithme AI

### Géolocalisation
- **10 villes** : Côte d'Ivoire, Ghana, Burkina Faso, Togo, Bénin
- **Coordonnées GPS réelles** : Lat/Lon précises
- **Calcul de distance** : Formule de Haversine

### Produits
- Maïs, Blé, Riz, Soja
- Tomates, Pommes de terre, Oignons
- Café, Cacao, Coton

### Types de camions
- Camion léger (2-5t)
- Camion moyen (5-13t)
- Poids lourd (10-25t)
- Semi-remorque (20-40t)
- Frigorifique (8-23t)

## 🎯 Prochaines étapes

### Phase 2 - Fonctionnalités avancées

1. **Intégration carte interactive**
   - Leaflet ou Mapbox
   - Marqueurs en temps réel
   - Traçage des routes

2. **Notifications push**
   - Nouveaux matches
   - Changements de statut
   - Alertes urgentes

3. **Chat intégré**
   - Communication producteur ↔ transporteur
   - Négociation de prix
   - Partage de documents

4. **Système de paiement**
   - Escrow
   - Mobile money
   - Facturation automatique

5. **Historique et rapports**
   - Export PDF/Excel
   - Graphiques personnalisés
   - Analyse prédictive

6. **API REST**
   - Endpoints pour mobile apps
   - Webhooks pour intégrations
   - Documentation Swagger

## 🛠️ Technologies utilisées

- **React 18** : Framework UI
- **TypeScript** : Type safety
- **CSS3** : Styles premium
- **Animations CSS** : Transitions fluides
- **Responsive Design** : Mobile-first

## 📝 Notes techniques

### Performance
- Utilisation de `useMemo` pour optimiser les calculs
- Lazy loading des composants
- Pagination des résultats

### Accessibilité
- Sémantique HTML5
- ARIA labels
- Contraste des couleurs

### SEO
- Meta tags appropriés
- Structured data
- Sitemap

## 🤝 Contribution

Pour contribuer au module AgriLogistic Link :

1. Créer une branche feature
2. Implémenter les changements
3. Tester sur différents devices
4. Soumettre une PR avec description détaillée

## 📄 Licence

© 2026 AgriLogistic - Tous droits réservés

---

**Créé avec ❤️ par l'équipe AgriLogistic**

*Le futur de la logistique agricole en Afrique*
