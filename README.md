# 🌾 AgriLogistic - Plateforme de Logistique Agricole Intelligente

![Version](https://img.shields.io/badge/version-3.0.0--Enterprise-blue.svg?style=for-the-badge&logo=appveyor)
![Status](https://img.shields.io/badge/status-Production_Ready-success.svg?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-Next.js_14_|_NestJS_|_Python-black?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-orange.svg?style=for-the-badge)

> **"L'OS de l'Agriculture Africaine"** : De la production à la consommation, une chaîne de valeur unifiée par la Data, l'IA et la Blockchain.

---

## 📑 Table des Matières

1. [Présentation Globale](#1️⃣-présentation-globale)
2. [Structure Globale de Fonctionnement](#2️⃣-structure-globale-de-fonctionnement)
3. [Diagrammes Fonctionnels par Rôle](#3️⃣-diagrammes-fonctionnels-détaillés)
4. [Fonctionnalités Complètes (A → Z)](#4️⃣-fonctionnalités-complètes-a--z)
5. [Technologies Utilisées (A → Z)](#5️⃣-technologies-utilisées-a--z)
6. [Architecture Technique](#6️⃣-architecture-technique)
7. [Sécurité & Accès](#7️⃣-sécurité--accès)
8. [Vision Future](#8️⃣-vision-future)
9. [Installation & Déploiement](#-installation--déploiement) (incl. [CI/CD GitHub Actions](#-cicd--github-actions--script-local))
10. [Configuration Auth](#-configuration-auth) (DB, variables d'env, migration Better Auth, Google OAuth)
11. [Implémentations Récentes (2025)](#-implémentations-récentes-2025)

---

## 1️⃣ Présentation Globale

### 🌍 Vision & Mission

**AgriLogistic** a pour mission de construire l'infrastructure numérique structurante de l'agriculture africaine. Nous remplaçons l'informel et l'opacité par une **plateforme SaaS intégrée** qui connecte producteurs, logisticiens et acheteurs industriels.

Notre vision : **Transformer chaque acteur de l'agriculture en une entreprise technologique data-driven.**

#### 🎯 Objectifs Stratégiques

| Période  | Objectif                        | KPI Cible                   |
| -------- | ------------------------------- | --------------------------- |
| **2024** | Consolidation marché domestique | 10,000 agriculteurs actifs  |
| **2025** | Expansion régionale (UEMOA)     | 50,000 transactions/mois    |
| **2026** | Leadership panafricain          | 500,000 tonnes transportées |

---

### 🛑 Problèmes Résolus dans la Logistique Agricole

| Problème                    | Impact Actuel                                                 | Solution AgriLogistic                                  |
| --------------------------- | ------------------------------------------------------------- | ------------------------------------------------------ |
| **Opacité Structurale**     | 60% du prix final capté par intermédiaires non-valeur ajoutée | Marketplace transparent avec pricing algorithmique     |
| **Pertes Post-Récolte**     | 40% de la production perdue faute de logistique adaptée       | Chaîne du froid digitalisée + optimisation des trajets |
| **Risque de Contrepartie**  | Manque de confiance dans les paiements et la qualité          | Smart Contracts avec escrow et traçabilité blockchain  |
| **Exclusion Bancaire**      | Absence de scoring crédit pour les acteurs ruraux             | Agri-Score basé sur l'historique de production         |
| **Inefficacité Logistique** | 30% des trajets à vide pour les transporteurs                 | Algorithme de matching intelligent et optimisation VRP |

---

### 💡 Valeur Ajoutée par Acteur

| Acteur              | Bénéfice Clé                                                                         | ROI Estimé                     |
| ------------------- | ------------------------------------------------------------------------------------ | ------------------------------ |
| **🌱 Agriculteur**  | **Accès Marché** : Vente directe, réduction des pertes, conseils agronomiques IA     | +35% revenus nets              |
| **🚚 Transporteur** | **Optimisation** : Réduction des trajets à vide, revenus garantis, gestion de flotte | +45% taux de remplissage       |
| **🛒 Acheteur**     | **Sourcing Sécurisé** : Traçabilité totale, conformité ESG, contrats intelligents    | -25% coûts d'approvisionnement |
| **👑 Admin**        | **Gouvernance** : Pilotage macro-économique, régulation, sécurité nationale          | Vision temps réel du marché    |

---

### 🚀 Positionnement Futuriste & Data-Driven

AgriLogistic se positionne comme la **première plateforme agricole cognitive** en Afrique, intégrant :

- **🧠 Intelligence Artificielle Prédictive** : Anticipation des rendements, prix et demandes
- **🔗 Blockchain de Traçabilité** : Certificat d'origine immuable pour l'export
- **📡 IoT Agricole** : Capteurs de sol, météo connectée, tracking GPS
- **🤖 Automatisation** : Workflows intelligents de bout en bout

---

## 2️⃣ Structure Globale de Fonctionnement

### 🏗️ Vue d'Ensemble du Système AgriLogistic

Le système AgriLogistic fonctionne comme un **Cerveau Central** qui orchestre les interactions physiques et financières entre tous les acteurs de l'écosystème agricole.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    AGRI-LOGISTIC : CERVEAU CENTRAL                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│   │  AGRICULTEUR │◄──►│   PLATFORM   │◄──►│  TRANSPORTEUR│              │
│   │   (Offre)    │    │   (Matching) │    │  (Logistique)│              │
│   └──────────────┘    └──────┬───────┘    └──────────────┘              │
│                              │                                          │
│                              ▼                                          │
│                       ┌──────────────┐                                  │
│                       │   ACHETEUR   │                                  │
│                       │   (Demande)  │                                  │
│                       └──────────────┘                                  │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    LAYERS TECHNIQUES                             │   │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │   │
│   │  │   IA    │ │  Data   │ │  Real-  │ │  Securité│ │  Block- │   │   │
│   │  │Predictive│ │  Lake   │ │  time   │ │   RBAC   │ │  chain  │   │   │
│   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 🔄 Flux de Données et Décisions

#### Cycle de Valeur AgriLogistic

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CYCLE DE VALEUR COMPLET                          │
└─────────────────────────────────────────────────────────────────────────┘

PHASE 1 : PRODUCTION              PHASE 2 : COMMERCIALISATION
┌─────────────────┐               ┌─────────────────┐
│  🌱 AGRICULTEUR │               │  🏪 MARKETPLACE  │
│                 │               │                 │
│ • Digitalisation│──────────────►│ • Publication   │
│   parcelle      │   Récolte     │   offre         │
│ • Suivi culture │   estimée     │ • Matching IA   │
│ • Prédiction    │               │ • Négociation   │
│   rendement     │               │   automatisée   │
└─────────────────┘               └────────┬────────┘
                                           │
                                           ▼
PHASE 3 : LOGISTIQUE              PHASE 4 : FINALISATION
┌─────────────────┐               ┌─────────────────┐
│  🚚 TRANSPORTEUR│               │  🤝 SMART CONTRACT│
│                 │               │                 │
│ • Optimisation  │◄──────────────│ • Escrow actif  │
│   tournée       │   Mission     │ • Tracking temps│
│ • Tracking GPS  │   assignée    │   réel          │
│ • Proof of      │               │ • Libération    │
│   Delivery      │──────────────►│   fonds auto    │
└─────────────────┘   Livraison   └─────────────────┘
                      confirmée
```

---

### 🔗 Interactions entre Rôles

| Interaction               | Déclencheur          | Acteurs                   | Résultat                     |
| ------------------------- | -------------------- | ------------------------- | ---------------------------- |
| **Publication Offre**     | Récolte prête        | Agriculteur → Marketplace | Offre visible aux acheteurs  |
| **Matching**              | Recherche produit    | Acheteur ↔ IA            | Suggestions personnalisées   |
| **Négociation**           | Intérêt mutuel       | Agriculteur ↔ Acheteur   | Accord sur prix/quantité     |
| **Escrow**                | Accord trouvé        | Smart Contract            | Fonds verrouillés sécurisés  |
| **Assignation Transport** | Contrat signé        | Transporteur ↔ Mission   | Camion désigné pour pickup   |
| **Tracking**              | Départ camion        | Tous les acteurs          | Visibilité temps réel        |
| **Livraison**             | Arrivée destination  | Transporteur → Acheteur   | Proof of Delivery généré     |
| **Paiement**              | Validation livraison | Smart Contract            | Libération automatique fonds |

---

### 📊 Logique Métier Globale

```mermaid
graph TB
    subgraph "🌱 INPUT - Production"
        A[Données Parcelle] --> B[IoT Sensors]
        C[Imagerie Satellite] --> D[Analyse NDVI]
        B --> E[Digital Twin]
        D --> E
    end

    subgraph "🧠 PROCESSING - Intelligence"
        E --> F[ML Yield Prediction]
        F --> G[Market Price Engine]
        G --> H[Matching Algorithm]
    end

    subgraph "🔄 ORCHESTRATION - Exécution"
        H --> I[Smart Contract Gen]
        I --> J[Logistics Assignment]
        J --> K[Route Optimization]
    end

    subgraph "📈 OUTPUT - Valeur"
        K --> L[Tracking Temps Réel]
        L --> M[Delivery Confirmation]
        M --> N[Auto-Paiement]
        N --> O[Analytics & Feedback]
    end

    O -.->|Boucle d'amélioration| E
```

---

## 3️⃣ Diagrammes Fonctionnels (Détaillés)

---

### 👑 A. Rôle Admin - Gouvernance & Supervision

#### 🎯 Concept & Responsabilités

L'**Admin** dispose d'une vue "Dieu" sur l'ensemble du système. Il assure la gouvernance, la conformité réglementaire et la santé économique de la plateforme.

| **Gouvernance** | Répertoire centralisé des acteurs, segmentation par rôles, gestion des accès | Espace Utilisateurs & KYC |
| **Conformité** | KYC/AML, validation documents d'identité, OCR, FaceMatch AI | Hub de Validation KYC |
| **Traçabilité** | Suivi immuable des lots "Seed to Fork", Certifications | Blockchain & IPFS Explorer |
| **ESG & RSE** | Pilotage impact carbone, éthique, déforestation (EUDR) | Dashboard Développement Durable |
| **Finance & Crédit**| Scoring Agri-Score (IA), gestion des prêts, analyse risques | Moteur de Scoring XGBoost |
| **Sécurité** | Gestion incidents, audit sécurité, backups | SIEM, logs centralisés |
| **Économique** | Régulation prix, monitoring volumes | Analytics avancés |
| **Technique** | Santé système, performance, scaling | Monitoring infrastructure |

#### 🔄 Interactions avec les Autres Rôles

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        ADMIN - INTERACTIONS                              │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   👑 ADMIN   │
                              │  (Supervision)│
                              └──────┬──────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
┌───────────────┐          ┌───────────────┐          ┌───────────────┐
│  🌱 AGRICULTEUR │          │  🚚 TRANSPORTEUR│          │  🛒 ACHETEUR   │
│               │          │               │          │               │
│ • Validation  │          │ • Validation  │          │ • Validation  │
│   KYC         │          │   licences    │          │   entreprise  │
│ • Suspension  │          │ • Audit flotte│          │ • Limites     │
│   compte      │          │ • Suspension  │          │   crédit      │
│ • Support     │          │   mission     │          • • Litiges     │
│   escalade    │          │ • Support     │          │   gestion     │
└───────────────┘          └───────────────┘          └───────────────┘
```

#### 📋 Diagramme Conceptuel Complet

```mermaid
graph TD
    subgraph "👑 Admin Command Center"
        Admin((Super Admin)) -->|Auth MFA| AuthGate{Auth Gateway}
        AuthGate -->|Success| Dash[Dashboard Supervision]
        AuthGate -->|Fail| Lock[Account Lock]

        Dash -->|Gouvernance| Users[User Management & KYC]
        Dash -->|Finance| Audit[Audit Logs & Transactions]
        Dash -->|Opérations| Market[Market Monitor]
        Dash -->|Infrastructure| Tech[System Health]
        Dash -->|Communication| Notif[Notifications Système]

        subgraph "🔐 Services Critiques"
            Users -->|Validation| Roles[RBAC System]
            Users -->|Vérification| KYC[KYC Engine]
            Audit -->|Surveillance| Fraud[Fraud Detection AI]
            Audit -->|Traçabilité| Blockchain[Blockchain Explorer]
            Market -->|Régulation| Pricing[Index Prix National]
            Market -->|Modération| Content[Content Moderation]
        end

        subgraph "📊 Analytics & Reporting"
            Tech -->|Métriques| Metrics[Performance Metrics]
            Market -->|Volumes| TradeStats[Trade Statistics]
            Audit -->|Financier| Financial[Financial Reports]
        end

        subgraph "⚙️ Configuration"
            Dash -->|Paramètres| Config[System Config]
            Config -->|Tarifs| Fees[Fee Structure]
            Config -->|Seuils| Thresholds[Alert Thresholds]
        end
    end

    subgraph "🔄 Intégrations Externes"
        KYC -->|API| GovAPI[Government APIs]
        Fraud -->|Feed| ThreatIntel[Threat Intelligence]
        Blockchain -->|Node| HyperLedger[Hyperledger Fabric]
    end
```

---

### 🌱 B. Rôle Agriculteur - Production & Commercialisation

#### 🎯 Concept & Responsabilités

L'interface **Agriculteur** est centrée sur l'optimisation du rendement agricole et la commercialisation rapide au meilleur prix.

| Domaine               | Responsabilités                               | Outils             |
| --------------------- | --------------------------------------------- | ------------------ |
| **Production**        | Gestion parcelles, suivi cultures, calendrier | Digital Twin, IoT  |
| **Prédiction**        | Estimation rendements, qualité, timing        | ML Yield Predictor |
| **Stockage**          | Inventaire post-récolte, traçabilité lot      | Gestion de stock   |
| **Commercialisation** | Publication offres, négociation, contrats     | Marketplace, Chat  |
| **Logistique**        | Demande transport, suivi livraisons           | Dispatch system    |
| **Finances**          | Paiements, historique, Agri-Score             | Wallet intégré     |

#### 🔄 Interactions avec les Autres Rôles

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     AGRICULTEUR - INTERACTIONS                           │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   👑 ADMIN   │
                              │  (Support &  │
                              │   Validation)│
                              └──────▲──────┘
                                     │
                                     │ KYC / Support
                                     │
┌───────────────┐          ┌─────────┴─────────┐          ┌───────────────┐
│  🚚 TRANSPORTEUR│◄─────────│  🌱 AGRICULTEUR   │─────────►│  🛒 ACHETEUR   │
│               │  Mission   │                 │  Vente   │               │
│ • Pickup      │  assignée  │ • Production    │  directe │ • Achat       │
│ • Livraison   │            │ • Offre créée   │          │ • Négociation │
│ • Tracking    │───────────►│ • Suivi récolte │◄─────────│ • Contrat     │
│   partagé     │  Livraison │ • Paiement reçu │  Paiement│ • Feedback    │
│               │  confirmée │                 │          │               │
└───────────────┘          └─────────────────┘          └───────────────┘
```

#### 📋 Diagramme Conceptuel Complet

```mermaid
graph TD
    subgraph "🌱 Espace Agriculteur"
        Farmer((Agriculteur)) -->|App Mobile| Farm[Gestion Exploitation]
        Farmer -->|Web Portal| Farm

        subgraph "📍 Cycle de Production"
            Farm -->|Cartographie| DigitalTwin[Jumeau Numérique Parcelle]
            DigitalTwin -->|IoT Sensors| IoTData[Données Capteurs]
            DigitalTwin -->|Satellite| Imagery[Imagerie NDVI]

            IoTData -->|Fusion| DataFusion[Data Lake Agricole]
            Imagery --> DataFusion

            DataFusion -->|Analyse ML| Prediction[Prédiction Récolte]
            Prediction -->|Rendement| YieldEst[Estimation Tonnes]
            Prediction -->|Qualité| QualityEst[Score Qualité]
            Prediction -->|Date| HarvestOpt[Date Optimale]

            YieldEst --> Task[Planning Tâches]
            QualityEst --> Task
            HarvestOpt --> Task

            Task -->|Alertes| Calendar[Calendrier Agricole]
        end

        subgraph "💰 Cycle Commercial"
            Farm -->|Stock| Inventory[Gestion Stock]
            Inventory -->|Lots| BatchTracking[Traçabilité Lot]

            BatchTracking -->|Publication| Market[Marketplace Offre]
            Market -->|Photos| RichMedia[Contenu Riche]
            Market -->|Certifs| Certifications[Certifications]
            Market -->|Prix| DynamicPricing[Prix Dynamique IA]

            Market -->|Intérêt| Chat[Chat Acheteur]
            Chat -->|Négociation| Negotiation[Module Négociation]
            Negotiation -->|Accord| Contract[Smart Contract]

            Contract -->|Escrow| Payment[Paiement Sécurisé]
            Contract -->|Logistique| Logistics[Demande Transport]
        end

        subgraph "📊 Performance & Finance"
            Farm -->|Historique| Analytics[Analytics Perso]
            Analytics -->|KPIs| Dashboard[Tableau de Bord]
            Payment -->|Revenus| Wallet[Agri-Wallet]
            Wallet -->|Score| CreditScore[Agri-Score Crédit]
        end
    end

    subgraph "🔄 Intégrations"
        IoTData -->|API| WeatherAPI[API Météo]
        Imagery -->|Service| Satellite[Sentinel/Landsat]
        Logistics -->|Matching| TransportPool[Pool Transporteurs]
        Payment -->|Gateway| MobileMoney[Mobile Money APIs]
    end
```

---

### 🚚 C. Rôle Transporteur - Logistique & Optimisation

#### 🎯 Concept & Responsabilités

Le **Transporteur** utilise un véritable "Dispatch System" pour gérer sa flotte et maximiser sa rentabilité au kilomètre parcouru.

| Domaine          | Responsabilités                           | Outils          |
| ---------------- | ----------------------------------------- | --------------- |
| **Flotte**       | Gestion camions, maintenance, assurances  | Fleet Commander |
| **Personnel**    | Gestion chauffeurs, planning, performance | HR Module       |
| **Missions**     | Acceptation, exécution, suivi             | Mission Control |
| **Optimisation** | Tournées, chargement, carburant           | Route Optimizer |
| **Exécution**    | Navigation, tracking, preuve livraison    | Driver App      |
| **Finance**      | Tarification, facturation, paiement       | Billing System  |

#### 🔄 Interactions avec les Autres Rôles

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    TRANSPORTEUR - INTERACTIONS                           │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   👑 ADMIN   │
                              │  (Validation │
                              │   licences)  │
                              └──────▲──────┘
                                     │
                                     │ Audit / Support
                                     │
┌───────────────┐          ┌─────────┴─────────┐          ┌───────────────┐
│  🌱 AGRICULTEUR│◄─────────│  🚚 TRANSPORTEUR  │─────────►│  🛒 ACHETEUR   │
│               │  Pickup    │                 │  Delivery│               │
│ • Produit     │  request   │ • Flotte gérée  │  request │ • Réception   │
│   prêt        │            │ • Mission       │          │   marchandise │
│ • Lieu        │───────────►│   acceptée      │─────────►│ • Validation  │
│   pickup      │  Livraison │ • Route         │  Livraison│   qualité     │
│               │  confirmée │   optimisée     │  confirmée│               │
└───────────────┘          └─────────────────┘          └───────────────┘
```

#### 📋 Diagramme Conceptuel Complet

```mermaid
graph TD
    subgraph "🚚 Espace Transporteur"
        Hauler((Transporteur)) -->|Web Portal| FleetOps[Fleet Operations Center]
        Hauler -->|Mobile App| FleetOps

        subgraph "🚛 Gestion des Ressources"
            FleetOps -->|CRUD| Trucks[Gestion Camions]
            FleetOps -->|CRUD| Trailers[Gestion Remorques]
            FleetOps -->|HR| Drivers[Gestion Chauffeurs]

            Trucks -->|Specs| TruckSpecs[Capacité/T°/Type]
            Trucks -->|Maintenance| Maintenance[Plan Maintenance]
            Trucks -->|Docs| TruckDocs[Assurances/Permis]

            Drivers -->|Profil| DriverProfile[Compétences]
            Drivers -->|Planning| DriverSchedule[Disponibilités]
            Drivers -->|Performance| DriverPerf[KPIs Sécurité]
        end

        subgraph "📋 Mission Control"
            FleetOps -->|Marketplace| FreightBoard[Bourse de Fret]
            FreightBoard -->|Filtres| JobFilter[Filtrage Intelligent]
            JobFilter -->|Match| JobMatch[Score Matching]

            JobMatch -->|Accept| Job[Mission Active]
            Job -->|Détails| JobDetails[Pickup/Delivery]
            Job -->|Cargo| CargoInfo[Type/Quantité/T°]

            Job -->|Routing AI| OSRM{Optimisation Trajet}
            OSRM -->|VRP Solver| RouteOpt[Route Optimisée]
            OSRM -->|Temps| ETACalc[Calcul ETA]
            OSRM -->|Coût| CostEst[Estimation Coût]
        end

        subgraph "📱 Exécution Terrain"
            RouteOpt -->|App Chauffeur| DriverApp[Application Chauffeur]
            DriverApp -->|Navigation| Nav[Navigation GPS]
            DriverApp -->|Checkpoints| CheckIn[Points de Contrôle]

            Nav -->|IoT| Track[Tracking Temps Réel]
            Track -->|GPS| Position[Position GPS]
            Track -->|Capteurs| Conditions[Température/Humidité]
            Track -->|Portes| DoorStatus[Ouverture/Fermeture]

            CheckIn -->|Pickup| PickupConfirm[Confirmation Pickup]
            CheckIn -->|Delivery| DeliveryConfirm[Confirmation Livraison]
            DeliveryConfirm -->|Preuve| POD[Proof of Delivery]
            POD -->|Photo| PODPhoto[Photo Livraison]
            POD -->|Signature| PODSign[Signature Numérique]
            POD -->|QR| PODQR[Scan QR Code]
        end

        subgraph "💰 Finance & Performance"
            FleetOps -->|Missions| MissionHistory[Historique Missions]
            MissionHistory -->|Revenus| Revenue[Revenus Totaux]
            MissionHistory -->|KPIs| FleetKPIs[Performance Flotte]
            FleetKPIs -->|Taux| FillRate[Taux Remplissage]
            FleetKPIs -->|KM| EmptyKM[Kilomètres à Vide]
            FleetKPIs -->|Client| Rating[Note Client]
        end
    end

    subgraph "🔄 Intégrations"
        OSRM -->|API| RoutingAPI[OSRM/Google Maps]
        Track -->|Stream| RealTimeDB[Firebase/Supabase]
        POD -->|Upload| Storage[Cloud Storage]
        Revenue -->|Gateway| PaymentSys[Système Paiement]
    end
```

---

### 🛒 D. Rôle Acheteur - Sourcing & Approvisionnement

#### 🎯 Concept & Responsabilités

L'**Acheteur** dispose d'outils de sourcing avancés pour sécuriser ses approvisionnements en qualité et en quantité, avec une traçabilité totale.

| Domaine        | Responsabilités                                 | Outils                 |
| -------------- | ----------------------------------------------- | ---------------------- |
| **Recherche**  | Découverte produits, filtres avancés, alertes   | Moteur de recherche IA |
| **Sourcing**   | RFQ, négociation, comparaison offres            | Sourcing Suite         |
| **Qualité**    | Vérification certifications, prédiction qualité | AI Quality Predict     |
| **Commandes**  | Panier, contrats, suivi commandes               | Order Management       |
| **Logistique** | Suivi livraisons, réception, validation         | Tracking Dashboard     |
| **Analyse**    | Historique achats, performance fournisseurs     | Analytics              |

#### 🔄 Interactions avec les Autres Rôles

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ACHETEUR - INTERACTIONS                             │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   👑 ADMIN   │
                              │  (Validation │
                              │   entreprise)│
                              └──────▲──────┘
                                     │
                                     │ KYC / Litiges
                                     │
┌───────────────┐          ┌─────────┴─────────┐          ┌───────────────┐
│  🌱 AGRICULTEUR│◄─────────│  🛒 ACHETEUR      │─────────►│  🚚 TRANSPORTEUR│
│               │  Vente     │                 │  Logistique│               │
│ • Offre       │  directe   │ • Recherche     │  request │ • Mission     │
│   répondue    │            │   produit       │          │   reçue       │
│ • Négociation │◄───────────│ • Négociation   │◄─────────│ • Tracking    │
│ • Livraison   │  Paiement  │ • Commande      │  Updates │   updates     │
│   préparée    │            │ • Réception     │          │               │
└───────────────┘          └─────────────────┘          └───────────────┘
```

#### 📋 Diagramme Conceptuel Complet - Séquence Détaillée

```mermaid
sequenceDiagram
    autonumber
    participant Buyer as 🛒 Acheteur
    participant AI as 🤖 Moteur Sourcing IA
    participant Market as 🏪 Marketplace
    participant Farmer as 🌱 Agriculteur
    participant SC as ⛓️ Smart Contract
    participant Logistics as 🚚 Logistique
    participant Admin as 👑 Admin (Escrow)

    Note over Buyer,Admin: PHASE 1 : DÉCOUVERTE & SOURCING

    Buyer->>AI: Recherche "Mangues Kent Export, >5T"
    AI->>Market: Query produits matchants
    Market-->>AI: Résultats filtrés
    AI->>Buyer: Analyse Match (Score 98%)<br/>+ Prédiction qualité<br/>+ Recommandations

    Buyer->>Market: Envoi RFQ (Request for Quote)
    Market->>Farmer: Notification nouvelle demande
    Farmer-->>Market: Réponse avec offre personnalisée
    Market-->>Buyer: Réponses fournisseurs reçues

    Note over Buyer,Farmer: PHASE 2 : NÉGOCIATION

    Buyer->>Market: Comparaison offres (prix/qualité/éthique)
    Buyer->>Farmer: Chat / Appel vidéo intégré
    Farmer-->>Buyer: Contre-proposition
    Buyer->>Buyer: Analyse avec AI Price Advisor

    Note over Buyer,SC: PHASE 3 : CONTRAT & PAIEMENT

    Buyer->>SC: Création Contrat (Escrow)
    SC->>SC: Validation conditions juridiques (OHADA)
    SC->>Admin: Vérification fonds disponibles
    Admin-->>SC: ✅ Fonds vérifiés
    SC->>SC: Verrouillage Fonds (Escrow Actif)
    SC-->>Buyer: Confirmation contrat signé
    SC-->>Farmer: Notification contrat actif

    Note over SC,Logistics: PHASE 4 : LOGISTIQUE

    SC->>Logistics: Déclenchement Transport Auto
    Logistics->>Logistics: Algorithme assignation transporteur
    Logistics-->>Buyer: Transporteur assigné + Détails

    loop Tracking Temps Réel (toutes les 30s)
        Logistics->>Buyer: Position GPS camion
        Logistics->>Buyer: Température cargo
        Logistics->>Buyer: ETA mis à jour
        Buyer->>Logistics: Acknowledge / Questions
    end

    Note over Buyer,Logistics: PHASE 5 : LIVRAISON

    Logistics->>Buyer: Arrivée imminente (15min)
    Logistics->>Buyer: Livraison effectuée
    Buyer->>Buyer: Inspection marchandise

    alt ✅ Livraison Conforme
        Buyer->>SC: Validation réception
        SC->>SC: Libération fonds vers Agriculteur
        SC->>Logistics: Paiement transporteur
        SC-->>Buyer: Confirmation transaction complète
    else ❌ Problème détecté
        Buyer->>Admin: Ouverture litige
        Admin->>SC: Gel temporaire fonds
        Note right of Admin: Processus médiation
    end

    Note over Buyer,Farmer: PHASE 6 : POST-TRANSACTION

    Buyer->>Buyer: Évaluation fournisseur
    Buyer->>AI: Feedback qualité (ML training)
    Farmer->>Farmer: Évaluation acheteur
```

---

## 4️⃣ Fonctionnalités Complètes (A → Z)

---

### 👑 Admin - Fonctionnalités Détaillées

#### Fonctionnalités Principales

| **User Management (RBAC)** | Répertoire Écosystème (Visualisation List/Kanban), Segmentation, Détection de doublons | P0 |
| **KYC Validation** | Identity Center (OCR Scan, FaceMatch Score 94.2%), Validation manuelle & auto | P0 |
| **Agri-Score Dashboard**| Scoring confiance dynamique (v3.1), Visualisations tendance, Analyse risque | P0 |
| **Fleet Commander (IoT Hub)**| NASA-style Mission Control, Télémétrie temps réel (Batterie, Frigo, Fuel), Géofencing | P0 |
| **Notification Center** | Centre de commande multi-canal (Push, SMS, WhatsApp), Campagnes & Analytics | P0 |
| **Maintenance Prédictive** | Analyse IA des données capteurs (usure pneus, vidange), Planification maintenance | P0 |
| **Rural Network Guardian** | Monitoring Connectivité, Cartographie Zone Blanche, SLA Opérateurs | P0 |
| **AgroContent CMS (BETA)** | Gestion articles (Notion-style), Calendrier événements, Médiathèque, SEO | P0 |
| **Satellite Imagery Center** | Catalogage, Indices Végétation (NDVI), Détection Changement (IA) | P0 |
| **Digital Twin Global (Vue Satellite)** | Cartographie multi-couches (NDVI, Yield, Diseases, Météo), Split slider 2023 vs 2024, MapLibre GL JS, RainViewer/OpenWeatherMap précipitations | P0 |
| **Gestion des Missions** | CRUD workflow complet (Creation -> Optimization -> POD -> e-CMR) | P0 |
| **Predictive Forecasting Lab**| Prédictions IA Rendement/Prix/Demande, Simulations What-If, Scénarios | P0 |
| **Supervision Financière** | Cashflow temps réel, Monitoring transactions, Anomaly Detection (IA) | P0 |
| **Hub de Paiements (Africa)** | Gateway multi-canal (Wave, OM, MTN), Gestion des retraits, Monitoring fraude | P0 |
| **Fraud Detection Unit (Scorpion)**| Détection Fraude IA, Blanchiment, Wash Trading, Ghost Trips | P0 |
| **Moteur de Prix Dynamique** | Algorithmes distance/route/saison, Éditeur de règles, Géo-zones | P0 |
| **Matrice de Monétisation** | Tracking MRR/ARR, Gestion SaaS (Plans), Splits auto, Export FEC | P0 |
| **Escrow & Governance** | Smart Contracts Hyperledger, Fonds bloqués, Multisig override | P0 |
| **Data Quality Center** | Intégrité Données, Profiling Auto, Détection Anomalies, Lineage | P0 |
| **Batch Traceability** | Suivi immuable des lots via QR Code & Blockchain | P0 |
| **Global Analytics** | OLAP Query Builder, SQL Mode, Visualization Explorer (ClickHouse) | P0 |
| **Flux Map (Global Flow)** | Heatmap Flux, Chord Diagrams, Détection Goulots Étranglement (GIS) | P0 |
| **Global Settings & Control Tower**| Configuration 2FA, API Keys, Feature Flags, Mode Maintenance, Backups | P0 |
| **Performance & SLA Center** | SLA Monitoring, Business Funnels, System Health (Prometheus) | P0 |
| **Maintenance & Ops** | Maintenance Mode, Blue/Green Deploys, Status Page, Health Checks | P0 |
| **Multi-Tenancy** | Isolation par Pays/Client, RLS Policies, Gestion Quotas & Config | P0 |
| **Feature Flags Lab** | Toggle Management, A/B Testing, Kill Switch, Rollouts | P0 |
| **Backups & Recovery** | DR Plan, RTO/RPO Monitor, Point-in-time Restore, S3 Archives | P0 |
| **Security SOC** | Threat Intelligence, WAF Monitoring, Access Control | P0 |
| **Community Hub** | Forum Agriculteurs, Gamification (Badges), Modération IA, Events | P0 |
| **Knowledge OS** | CMS Documentation, Forum Communautaire, Academy Webinars | P0 |
| **Communication Center** | Marketing Automation, Push/SMS Transactionnel, Templates MJML | P0 |
| **Developer Studio** | White Label Manager, API Management, Webhooks, Billing | P0 |
| **Partnerships CRM** | Pipeline Négociation (Kanban), Portail Partenaires (API Tokens), Portfolio Tracking | P0 |
| **Global Footprint** | Multi-Pays Ops, Launch Checklist, Compliance Dashboard (UEMOA Banking) | P0 |
| **Compliance Reports** | Templates Réglementaires (BCEAO, EUDR), Audit Logs, Exports XML/PDF | P0 |
| **Audit Logs** | Traçabilité complète des actions utilisateurs (Immutable) | P0 |
| **Audit Logs** | Traçabilité complète des actions utilisateurs (Immutable) | P0 |
| **Market Monitor** | Supervision offres, détection anomalies prix | P1 |
| **System Health** | Monitoring infrastructure, alertes performance | P0 |

#### Fonctionnalités Avancées

| Fonctionnalité          | Description                                         | Bénéfice                   |
| ----------------------- | --------------------------------------------------- | -------------------------- |
| **Fraud Detection AI**  | Détection automatique comportements suspects        | -80% fraudes               |
| **Content Moderation**  | Modération automatique images/descriptions          | Conformité légale          |
| **Blockchain Explorer** | Visualisation transactions Hyperledger Fabric, recherche par hash/wallet, filtres avancés, vérification intégrité | Transparence totale        |
| **NFT Trust Seals**     | Génération de certificats de conformité NFT         | Immuabilité preuve         |
| **Loan Architect**      | Simulateur de prêts dynamiques basé sur les risques | Optimisation yield         |
| **Multi-tenant Config** | Configuration par pays/région                       | Scalabilité internationale |
| **Advanced Reporting**  | Rapports personnalisables (RSE, Export, Audit)      | Pilotage décisionnel       |

#### Fonctionnalités Intelligentes (IA)

| Fonctionnalité        | Technologie            | Impact                         |
| --------------------- | ---------------------- | ------------------------------ |
| **Anomaly Detection** | Isolation Forest       | Détection fraude en temps réel |
| **Agri-Scoring**      | XGBoost Classification | Scoring crédit haute fidélité  |
| **Carbon Footprint**  | regression ML          | Calcul impact logistique       |
| **Price Prediction**  | LSTM Networks          | Prédiction tendances marché    |
| **User Segmentation** | K-Means Clustering     | Personnalisation services      |
| **Churn Prediction**  | XGBoost                | Rétention utilisateurs         |

#### Tableau de Bord Admin - KPIs

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD - KPIs                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │ 👥 Utilisateurs │  │ 🛡️ KYC Center    │  │ 💹 Agri-Score   │         │
│  │                 │  │                 │  │                 │         │
│  │  Actifs: 12,450 │  │  Verified: 85%  │  │  Score Moyen:812│         │
│  │  Nouveaux: +234 │  │  Pending: 89    │  │  Top Rated: 1.2K│         │
│  │  Doublons: 3    │  │  Trust Match:94%│  │  Risk Level:Low │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    CARTE DE CHALEUR DES FLUX                     │   │
│  │                                                                  │   │
│  │    [Carte interactive avec flux agricoles en temps réel]        │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌────────────────────────┐  ┌────────────────────────────────────────┐ │
│  │   ALERTES SÉCURITÉ     │  │   PERFORMANCES SYSTÈME                │ │
│  │   🔴 2 Critiques       │  │   CPU: 45%  RAM: 62%  DB: 23ms        │ │
│  │   🟡 8 Warnings        │  │   Uptime: 99.99% (30j)                │ │
│  │   🟢 145 Résolues      │  │   Requêtes/sec: 2,847                 │ │
│  └────────────────────────┘  └────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Notifications & Alertes

| Type        | Déclencheur        | Canal              | Action                  |
| ----------- | ------------------ | ------------------ | ----------------------- |
| 🚨 Critique | Fraude détectée    | SMS + Email + Push | Investigation immédiate |
| ⚠️ Warning  | Anomalie volume    | Email + Dashboard  | Analyse dans l'heure    |
| ℹ️ Info     | Nouvel utilisateur | Dashboard          | Validation KYC          |
| 📊 Rapport  | Fin de journée     | Email              | Résumé quotidien        |

---

### 🌱 Agriculteur - Fonctionnalités Détaillées

#### Fonctionnalités Principales

| Fonctionnalité            | Description                                 | Priorité |
| ------------------------- | ------------------------------------------- | -------- |
| **Digital Twin**          | Carte 3D des parcelles avec couches données | P0       |
| **Yield Predictor**       | Estimation tonnage futur basé imagerie      | P0       |
| **Marketplace Publisher** | Création annonces riches (photos, certifs)  | P0       |
| **Agri-Wallet**           | Portefeuille numérique intégré              | P0       |
| **Task Calendar**         | Planning tâches agricoles                   | P1       |
| **Chat Acheteur**         | Messagerie intégrée pour négociation        | P0       |

#### Fonctionnalités Avancées

| Fonctionnalité         | Description                             | Bénéfice              |
| ---------------------- | --------------------------------------- | --------------------- |
| **Irrigation Advisor** | Recommandations irrigation basées météo | -30% eau consommée    |
| **Pest Detection**     | Détection maladies par photo IA         | Protection récolte    |
| **Weather Alerts**     | Alertes météo personnalisées            | Réduction pertes      |
| **Community Forum**    | Échange entre agriculteurs              | Partage connaissances |
| **Offline Mode**       | Fonctionnement sans connexion           | Accessibilité rurale  |

#### Fonctionnalités Intelligentes (IA)

| Fonctionnalité           | Technologie | Impact                        |
| ------------------------ | ----------- | ----------------------------- |
| **Yield Prediction**     | CNN + LSTM  | ±5% précision estimation      |
| **Price Recommendation** | XGBoost     | +15% revenus optimaux         |
| **Disease Detection**    | ResNet50    | 94% accuracy diagnostic       |
| **Optimal Harvest Date** | Time Series | Réduction pertes post-récolte |

#### Tableau de Bord Agriculteur - KPIs

```
┌─────────────────────────────────────────────────────────────────────────┐
│                  AGRICULTEUR DASHBOARD - KPIs                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    MES PARCELLES (Digital Twin)                  │   │
│  │                                                                  │   │
│  │   ┌─────────┐  ┌─────────┐  ┌─────────┐                        │   │
│  │   │Parcelle A│  │Parcelle B│  │Parcelle C│                        │   │
│  │   │ 🌽 Maïs │  │ 🍅 Tomates│  │ 🫘 Haricots│                        │   │
│  │   │ 12.5 ha │  │ 5.2 ha  │  │ 8.0 ha  │                        │   │
│  │   │ ✅ Bon  │  │ ⚠️ Surveillance│  │ ✅ Bon  │                        │   │
│  │   │ Récolte:│  │ Récolte:│  │ Récolte:│                        │   │
│  │   │ 15 jours│  │ 7 jours │  │ 30 jours│                        │   │
│  │   └─────────┘  └─────────┘  └─────────┘                        │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │ 📈 PRÉDICTION   │  │ 💰 MES REVENUS  │  │ 📦 MES STOCKS   │         │
│  │                 │  │                 │  │                 │         │
│  │  Récolte estimée│  │  Ce mois:       │  │  Disponible:    │         │
│  │  45 tonnes      │  │  $3,450         │  │  12 tonnes      │         │
│  │  Confiance: 92% │  │  +23% vs mois   │  │  En transit:    │         │
│  │                 │  │  dernier        │  │  8 tonnes       │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    MARCHÉ - OFFRES ACTIVES                       │   │
│  │                                                                  │   │
│  │   • Maïs Jaune - 15T - $320/T - 12 vues - 3 offres reçues      │   │
│  │   • Tomates - 5T - $450/T - 8 vues - Négociation en cours      │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  💳 Agri-Wallet: $1,245.50 | Agri-Score: 847/1000 ⭐⭐⭐⭐              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Notifications & Alertes

| Type         | Déclencheur             | Canal      | Action               |
| ------------ | ----------------------- | ---------- | -------------------- |
| 🌧️ Météo     | Pluie imminente         | Push + SMS | Protéger récolte     |
| 💰 Offre     | Nouvelle offre acheteur | Push       | Répondre rapidement  |
| 🚚 Livraison | Camion en approche      | Push + SMS | Préparer marchandise |
| 💵 Paiement  | Fonds reçus             | Push + SMS | Vérifier wallet      |
| 🐛 Maladie   | Risque détecté          | Push       | Inspection parcelle  |

---

### 🚚 Transporteur - Fonctionnalités Détaillées

#### Fonctionnalités Principales

| Fonctionnalité      | Description                               | Priorité |
| ------------------- | ----------------------------------------- | -------- |
| **Fleet Command Center (IoT)** | Vue HUD 360° (Télémétrie, T°, Carburant, Vibrations) | P0 |
| **Smart Dispatch**  | Algorithme assignation automatique & Alertes WhatsApp | P0 |
| **Neural Route Optimizer** | Optimisation multi-points adaptive (OR-Tools Neural Engine) | P0 |
| **IoT Tracking Engine** | Ingestion MQTT & Stockage Time-Series (InfluxDB) | P0 |
| **E-Docs**          | Digitalisation lettres de voiture, POD, e-CMR | P0 |
| **Freight Board**   | Marketplace missions de transport intelligent | P0 |
| **Driver App**      | Navigation optimisée & Feedback sensoriel | P0 |

#### Fonctionnalités Avancées

| Fonctionnalité             | Description                    | Bénéfice        |
| -------------------------- | ------------------------------ | --------------- |
| **Fuel Optimization**      | Conseils conduite économique   | -15% carburant  |
| **Predictive Maintenance** | Alertes maintenance préventive | -40% pannes     |
| **Load Optimization**      | Optimisation chargement camion | +20% capacité   |
| **Multi-drop Planning**    | Tournées multiples optimisées  | +35% efficacité |
| **Toll Calculator**        | Estimation péages itinéraire   | Budget précis   |
| **Insurance Integration**  | Vérification couverture auto   | Conformité      |

#### Fonctionnalités Intelligentes (IA)

| Fonctionnalité         | Technologie              | Impact                |
| ---------------------- | ------------------------ | --------------------- |
| **Route Optimization** | Google OR-Tools (VRP) + Neural Constraints | -30% temps trajet     |
| **ETA Prediction**     | LSTM + Trafic temps réel & Road Conditions | ±10min précision      |
| **Vibration Analysis** | Signal Processing AI (FFT + Anomaly Det) | -40% pannes méca      |
| **Demand Forecasting** | Prophet | Anticipation missions |
| **Dynamic Pricing**    | RL Agent | Prix optimal mission  |

#### Tableau de Bord Transporteur - KPIs

```
┌─────────────────────────────────────────────────────────────────────────┐
│                 TRANSPORTEUR DASHBOARD - KPIs                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    MA FLOTTE EN TEMPS RÉEL                       │   │
│  │                                                                  │   │
│  │   🚛 Camions: 8 actifs  |  🟢 5 en mission  |  🟡 3 disponibles │   │
│  │   👨‍✈️ Chauffeurs: 12    |  ✅ 10 actifs   |  🏖️ 2 repos        │   │
│  │                                                                  │   │
│  │   [Carte live avec positions camions et statuts missions]       │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │ 📊 PERFORMANCE  │  │ 💰 REVENUS      │  │ 🎯 TAUX REMPL.  │         │
│  │   MOIS          │  │                 │  │                 │         │
│  │                 │  │                 │  │                 │         │
│  │  Missions: 47   │  │  Ce mois:       │  │  Cette semaine: │         │
│  │  KM parcourus:  │  │  $8,950         │  │                 │         │
│  │  12,450         │  │  +18% vs mois   │  │  87%            │         │
│  │                 │  │  dernier        │  │  🎯 Objectif:90%│         │
│  │  Note client:   │  │                 │  │                 │         │
│  │  ⭐ 4.7/5       │  │                 │  │                 │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    MISSIONS EN COURS                             │   │
│  │                                                                  │   │
│  │   #M-2847 | 🟡 En route | Maïs 15T | ETA: 14:30 | 45km restants│   │
│  │   #M-2848 | 🟢 Pickup   | Tomates 5T | Départ: 09:00           │   │
│  │   #M-2845 | ✅ Livré    | Haricots 8T | Livré à 11:45           │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  🔔 Bourse de Fret: 12 nouvelles missions disponibles dans votre zone  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Notifications & Alertes

| Type           | Déclencheur                   | Canal        | Action                |
| -------------- | ----------------------------- | ------------ | --------------------- |
| 📦 Mission     | Nouvelle mission disponible   | Push         | Évaluer/accepter      |
| 🚛 Pickup      | Produit prêt chez agriculteur | Push + SMS   | Se rendre sur place   |
| ⚠️ Alert       | Trafic/accident sur route     | Push         | Itinéraire alternatif |
| 🔔 Delivery    | Approche destination          | Push         | Contacter acheteur    |
| 💵 Payment     | Paiement reçu                 | Push + SMS   | Vérifier compte       |
| 🔧 Maintenance | Entretien préventif dû        | Email + Push | Planifier garage      |

---

### 🛒 Acheteur - Fonctionnalités Détaillées

#### Fonctionnalités Principales

| Fonctionnalité         | Description                            | Priorité |
| ---------------------- | -------------------------------------- | -------- |
| **AI Quality Predict** | Analyse visuelle produits par IA       | P0       |
| **Reverse RFQ**        | Post besoin, algo trouve fournisseurs  | P0       |
| **Supply Chain Map**   | Vue temps réel tous les camions        | P0       |
| **Contract Builder**   | Générateur contrats juridiques OHADA   | P0       |
| **Advanced Search**    | Filtres qualité, localisation, certifs | P0       |
| **Order Management**   | Suivi commandes, historique, réappro   | P0       |

#### Fonctionnalités Avancées

| Fonctionnalité       | Description                        | Bénéfice          |
| -------------------- | ---------------------------------- | ----------------- |
| **Supplier Scoring** | Évaluation fournisseurs historique | Choix informé     |
| **Price History**    | Historique prix par produit/région | Négociation       |
| **ESG Dashboard**    | Traçabilité éthique/carbone        | Reporting RSE     |
| **Multi-currency**   | Paiement multi-devises             | International     |
| **API Integration**  | Connexion ERP existant             | Automatisation    |
| **Bulk Ordering**    | Commandes groupées                 | Économies échelle |

#### Fonctionnalités Intelligentes (IA)

| Fonctionnalité           | Technologie                | Impact                        |
| ------------------------ | -------------------------- | ----------------------------- |
| **Quality Prediction**   | Computer Vision (ResNet)   | 96% accuracy qualité          |
| **Supplier Matching**    | Vector Similarity (Qdrant) | Match pertinent +40%          |
| **Price Forecasting**    | ARIMA + ML                 | Anticipation prix ±8%         |
| **Optimal Order Timing** | Reinforcement Learning     | Stock optimal                 |
| **Risk Assessment**      | Gradient Boosting          | Évaluation risque fournisseur |

#### Tableau de Bord Acheteur - KPIs

```
┌─────────────────────────────────────────────────────────────────────────┐
│                   ACHETEUR DASHBOARD - KPIs                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │
│  │ 🛒 COMMANDES    │  │ 💰 DÉPENSES     │  │ 📊 FOURNISSEURS │         │
│  │                 │  │                 │  │                 │         │
│  │  Actives: 12    │  │  Ce mois:       │  │  Actifs: 23     │         │
│  │  Ce mois: 45    │  │  $45,200        │  │  Note moyenne:  │         │
│  │  Livrées: 892   │  │  Budget: $50K   │  │  ⭐ 4.5/5       │         │
│  │                 │  │  Status: 90%    │  │                 │         │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘         │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    MAPpe SUPPLY CHAIN TEMPS RÉEL                 │   │
│  │                                                                  │   │
│  │   [Carte avec tous les camions transportant vos marchandises]   │   │
│  │                                                                  │   │
│  │   🚛 3 camions actifs | 📦 45T en transit | ⏱️ ETA moyen: 2h30   │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    COMMANDES EN COURS                            │   │
│  │                                                                  │   │
│  │   #CMD-4521 | 🚛 En route | Mangues 10T | ETA: 14:30 | Camion TR-89│
│  │   #CMD-4520 | 📦 Pickup   | Ananas 5T  | Départ: 16:00           │   │
│  │   #CMD-4518 | ✅ Livré    | Papayes 8T | Livré à 10:15           │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  🔔 Alerte: Prix du maïs en baisse de 8% cette semaine - Opportunité   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Notifications & Alertes

| Type        | Déclencheur                       | Canal      | Action              |
| ----------- | --------------------------------- | ---------- | ------------------- |
| 🔍 Match    | Nouveau fournisseur correspondant | Email      | Évaluer offre       |
| 💰 Price    | Prix produit favori en baisse     | Push       | Acheter opportunité |
| 🚚 Delivery | Camion en approche                | Push + SMS | Préparer réception  |
| ✅ Confirm  | Livraison confirmée               | Push       | Vérifier qualité    |
| ⭐ Review   | Évaluation fournisseur demandée   | Email      | Donner feedback     |
| 📊 Report   | Rapport hebdomadaire disponible   | Email      | Consulter analytics |

---

## 5️⃣ Technologies Utilisées (A → Z)

---

### 🎨 Frontend - Expérience Utilisateur

| Catégorie         | Technologie     | Version | Usage                                  |
| ----------------- | --------------- | ------- | -------------------------------------- |
| **Framework**     | Next.js         | 14.x    | App Router, Server Components, SSR/SSG |
| **Langage**       | TypeScript      | 5.x     | Typage strict, DX optimale             |
| **Styling**       | Tailwind CSS    | 4.x     | Utility-first, design system cohérent  |
| **UI Components** | Shadcn/UI       | Latest  | Composants accessibles, customisables  |
| **Animations**    | Framer Motion   | 11.x    | Transitions fluides, interactions      |
| **Icons**         | Lucide React    | Latest  | Icons modernes, consistent             |
| **Forms**         | React Hook Form | 7.x     | Gestion formulaires performante        |
| **Validation**    | Zod             | 3.x     | Validation schémas TypeScript          |
| **Command Palette** | cmdk          | Latest  | Quick Actions Hub (Ctrl+K), recherche floue |
| **Hotkeys**       | react-hotkeys-hook | 5.x  | Raccourcis mnémoniques (K=KYC, T=Transport, F=Finance) |

#### Data Visualization

| Technologie           | Usage                           | Performance          |
| --------------------- | ------------------------------- | -------------------- |
| **Recharts**          | Graphiques analytics, tendances | 60fps rendering      |
| **React-Leaflet**     | Cartographie interactive        | 100k+ points fluides |
| **D3.js**             | Visualisations custom complexes | Haute flexibilité    |
| **React-Three-Fiber** | Jumeaux numériques 3D           | WebGL optimisé       |

#### Cartographie

| Technologie       | Usage                            | Avantage               |
| ----------------- | -------------------------------- | ---------------------- |
| **Leaflet**       | Cartes de base, markers, heatmap | Léger, open-source     |
| **MapLibre GL**   | Digital Twin (optionnel), cartes vectorielles performantes, tuiles NDVI | Style personnalisable, open-source |
| **leaflet.heat**  | Heatmap zones à risque (War Room) | BSD-2-Clause           |
| **RainViewer API**| Overlay précipitations temps réel (Digital Twin) | Gratuit, sans clé      |
| **Turf.js**       | Calculs géospatiaux              | Analyses spatiales     |
| **OpenStreetMap** | Tuiles de fond                   | Gratuit, communautaire |

#### State Management

| Technologie        | Usage                          | Avantage                  |
| ------------------ | ------------------------------ | ------------------------- |
| **Zustand**        | État global applicatif         | Léger, simple, performant |
| **TanStack Query** | Cache serveur, synchronisation | Gestion requêtes optimale |
| **Jotai**          | État atomique local            | Granularité fine          |

---

### ⚙️ Backend - Puissance & Logique

| Catégorie         | Technologie     | Version | Usage                              |
| ----------------- | --------------- | ------- | ---------------------------------- |
| **Core API**      | NestJS          | 10.x    | Architecture modulaire, TypeScript |
| **Langage**       | TypeScript      | 5.x     | Type safety, maintenabilité        |
| **ORM**           | Prisma          | 5.x     | Modélisation DB, migrations        |
| **Validation**    | Class-Validator | Latest  | DTO validation                     |
| **Documentation** | Swagger/OpenAPI | 3.x     | API documentation auto             |

#### API Gateway

| Technologie | Usage                         | Avantage                     |
| ----------- | ----------------------------- | ---------------------------- |
| **Kong**    | API Gateway principal         | Rate limiting, auth, routing |
| **Nginx**   | Reverse proxy, load balancing | Haute performance            |

**Configuration Kong (cahier des charges 1.1)** : déploiement via `infrastructure/docker-compose.kong.yml` avec PostgreSQL ; configuration dans `infrastructure/kong/kong.conf` (logs, listen, plugins) et `infrastructure/kong/kong.yml` (services, routes, consumers JWT + API Key). Initialisation : `infrastructure/scripts/init-kong.sh` (délègue à `kong-init.sh`). Table des routes et ports (8001–8011) : `infrastructure/docs/routing-table.md`. Validation : `infrastructure/scripts/validate-kong-cahier.sh` (GET /services, GET /api/v1/users avec JWT). Rate limiting : 100 req/min anonyme (IP), 1000 req/min authentifié (consumer). Bootstrap idempotent : en cas d’erreur UNIQUE sur les JWT déjà en base, le bootstrap sort en succès pour ne pas bloquer le démarrage.

#### AI Services

| Technologie      | Usage            | Modèles                      |
| ---------------- | ---------------- | ---------------------------- |
| **FastAPI**      | Microservices ML | Endpoints Python performants |
| **Python**       | 3.11+            | Langage ML standard          |
| **TensorFlow**   | Deep Learning    | CNN, LSTM, Computer Vision   |
| **Scikit-learn** | ML classique     | Classification, régression   |
| **PyTorch**      | Recherche ML     | Flexibilité modèles          |

---

### 🔄 Data & Temps Réel

#### Event Streaming

| Technologie         | Usage               | Performance            |
| ------------------- | ------------------- | ---------------------- |
| **Apache Kafka**    | Event backbone      | 2M+ msg/sec            |
| **Kafka Connect**   | Intégration sources | Connecteurs riches     |
| **Schema Registry** | Gouvernance schémas | Compatibilité versions |

#### Temps Réel

| Technologie            | Usage                      | Latence                  |
| ---------------------- | -------------------------- | ------------------------ |
| **Socket.io**          | WebSockets bidirectionnels (War Room: `NEXT_PUBLIC_WAR_ROOM_WS_URL`) | <100ms                   |
| **Server-Sent Events** | Push serveur → client      | Unidirectionnel efficace |
| **Redis Pub/Sub**      | Messagerie temps réel      | Sub-ms                   |

#### Bases de Données

| Technologie    | Usage                              | Type      |
| -------------- | ---------------------------------- | --------- |
| **PostgreSQL** | Données relationnelles principales | SQL       |
| **PostGIS**    | Extensions géospatiales pour le routage | Spatial   |
| **MongoDB**    | Catalogues produits, logs non-structurés | Document  |
| **Redis**      | Cache, sessions, locks distribués | Key-Value |
| **InfluxDB 2.x** | Stockage télémétrie IoT (Time-Series) | TSDB      |
| **ClickHouse** | Analytics business haute performance | Columnar  |
| **Qdrant**     | Recherche vectorielle, similarité IA | Vector    |

#### IoT & Messaging Stack

| Technologie | Usage | Performance |
| :--- | :--- | :--- |
| **Mosquitto (MQTT)** | Message Broker pour capteurs IoT | 100k+ messages/sec |
| **Telegraf** | Agent de collecte & transformation | Data Pipeline stable |
| **WhatsApp API** | Notifications critiques chauffeurs | Délivrabilité 99% |

---

### 🧠 IA & Optimisation

| Domaine                  | Technologie                    | Usage                      | Précision        |
| ------------------------ | ------------------------------ | -------------------------- | ---------------- |
| **Prédiction Rendement** | TensorFlow (LSTM)              | Prédiction récoltes        | ±5%              |
| **Computer Vision**      | TensorFlow/ResNet              | Qualité produits           | 96%              |
| **Optimisation Routes**  | Google OR-Tools                | VRP, tournées              | -25% temps       |
| **Recherche Sémantique** | Qdrant + Sentence Transformers | Matching produits          | +40% pertinence  |
| **Forecasting**          | Prophet                        | Prédiction prix/demande    | ±8%              |
| **Classification**       | XGBoost                        | Scoring, risques           | 94% AUC          |
| **NLP**                  | Hugging Face Transformers      | Chatbot, analyse sentiment | State-of-the-art |
| **MLOps Pipeline**       | MLflow + Kubernetes            | Tracking, Deploy, Monitor  | Auto-scaling     |
| **Drift Detection**      | Evidently AI                   | Monitoring qualité data    | Alerting temps réel|

#### MLOps Workflow (Intelligence Factory)

```mermaid
graph LR
    subgraph "🏗️ Training Pipeline"
        Data[Feature Store] -->|Extract| Train[Training Cluster GPU]
        Train -->|Log Metrics| Tracking[MLflow Registry]
        Train -->|Artifacts| Model[Model Versioned]
    end

    subgraph "🚀 Serving & Ops"
        Model -->|Deploy| Serving[Knative Inference]
        Serving -->|Predict| App[User App]
        
        App -->|Feedback| Monitor[Drift Monitor]
        Monitor -->|Alert| Retrain[Trigger Retraining]
        Retrain -.->|Loop| Train
    end
```

---

### 🔗 Blockchain & Traçabilité

| Technologie            | Usage                           | Consensus              |
| ---------------------- | ------------------------------- | ---------------------- |
| **Hyperledger Fabric** | Private ledger entreprises      | PBFT                   |
| **Smart Contracts**    | Chaincode Go                    | Exécution déterministe |
| **IPFS**               | Stockage décentralisé documents | Content-addressed      |

---

### 🛡️ Sécurité

| Couche                 | Technologie            | Usage                   |
| ---------------------- | ---------------------- | ----------------------- |
| **Authentification**   | Passport.js + JWT      | Auth stateless          |
| **OAuth2/OIDC**        | Keycloak/Auth0         | SSO, fédération         |
| **RBAC**               | Casl/AccessControl     | Permissions granulaires |
| **Encryption Transit** | TLS 1.3                | HTTPS partout           |
| **Encryption Storage** | AES-256                | Données sensibles       |
| **Secrets**            | HashiCorp Vault        | Gestion secrets         |
| **WAF**                | ModSecurity/CloudFlare | Protection web          |

---

### 📊 Monitoring & Observabilité

| Technologie     | Usage             | Métriques             |
| --------------- | ----------------- | --------------------- |
| **Prometheus**  | Métriques système | Collecte time-series  |
| **Grafana**     | Dashboards        | Visualisation         |
| **Jaeger**      | Tracing distribué | Performance requêtes  |
| **ELK Stack**   | Logs centralisés  | Recherche, alertes    |
| **Sentry**      | Error tracking    | Exceptions temps réel |
| **Uptime Kuma** | Monitoring uptime | Alertes disponibilité |

---

### 🚀 DevOps & Infrastructure

| Technologie        | Usage            | Avantage            |
| ------------------ | ---------------- | ------------------- |
| **Docker**         | Conteneurisation | Portabilité         |
| **Kubernetes**     | Orchestration    | Scalabilité auto    |
| **Helm**           | Packaging K8s    | Gestion releases    |
| **Terraform**      | Infra as Code    | Reproductibilité    |
| **GitHub Actions** | CI/CD            | Automatisation      |
| **ArgoCD**         | GitOps           | Déploiement continu |

---

## 6️⃣ Architecture Technique

---

### 🏗️ Architecture Globale - Microservices Hybride

AgriLogistic repose sur une architecture **Microservices Hybride** orchestrée par un API Gateway, offrant le meilleur compromis entre modularité et simplicité opérationnelle.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ARCHITECTURE AGRI-LOGISTIC                       │
│                    (Microservices Hybride + Event-Driven)               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │   Web App   │  │  Mobile App │  │  Driver App │  │    PWA      │   │
│  │  (Next.js)  │  │(React Native)│  │   (Flutter) │  │  (Offline)  │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
└─────────┼────────────────┼────────────────┼────────────────┼──────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (Kong)                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │Rate Limiting│  │  JWT Auth   │  │   Routing   │  │   Logging   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      CORE SERVICES (NestJS)                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │ Auth Service  │  │ User Service  │  │ Market Service│               │
│  │               │  │               │  │               │               │
│  │ • Login/Reg   │  │ • Profils     │  │ • Offres      │               │
│  │ • JWT/OAuth   │  │ • KYC         │  │ • Matching    │               │
│  │ • RBAC        │  │ • Préférences │  │ • Pricing     │               │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘               │
│          │                  │                  │                        │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │Order Service  │  │Logistics Svc  │  │Payment Service│               │
│  │               │  │               │  │               │               │
│  │ • Commandes   │  │ • Missions    │  │ • Wallet      │               │
│  │ • Contrats    │  │ • Tracking    │  │ • Escrow      │               │
│  │ • Historique  │  │ • Optimisation│  │ • Paiements   │               │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘               │
│          │                  │                  │                        │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │Notif Service  │  │Analytics Svc  │  │Contract Svc   │               │
│  │               │  │               │  │               │               │
│  │ • Email       │  │ • Rapports    │  │ • Smart Ctr   │               │
│  │ • Push        │  │ • Dashboards  │  │ • Blockchain  │               │
│  │ • SMS         │  │ • ML Pipeline │  │ • Escrow      │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      AI SERVICES (Python/FastAPI)                        │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │  Prediction   │  │ Optimization  │  │    Vision     │               │
│  │    Service    │  │    Service    │  │    Service    │               │
│  │               │  │               │  │               │               │
│  │ • Yield ML    │  │ • VRP Solver  │  │ • Quality CV  │               │
│  │ • Price Pred  │  │ • ETA Calc    │  │ • Disease Det │               │
│  │ • Demand FC   │  │ • Load Opt    │  │ • OCR Docs    │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      EVENT BACKBONE (Apache Kafka)                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   Topics: user.events | order.events | logistics.events | payment.events │
│           analytics.events | notification.events | blockchain.events     │
│           incident-events (War Room)                                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                          │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────┐ │
│  │  PostgreSQL   │  │   MongoDB     │  │    Redis      │  │ClickHouse│ │
│  │  (Users,      │  │  (Catalog,    │  │   (Cache,     │  │(Analytics│ │
│  │   Orders)     │  │   Logs)       │  │   Sessions)   │  │  TSDB)   │ │
│  └───────────────┘  └───────────────┘  └───────────────┘  └──────────┘ │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐               │
│  │    Qdrant     │  │   MinIO/S3    │  │Hyperledger Fab│               │
│  │  (Vector DB)  │  │ (File Storage)│  │ (Blockchain)  │               │
│  └───────────────┘  └───────────────┘  └───────────────┘               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 🔄 Flux Frontend ↔ Backend

```mermaid
sequenceDiagram
    autonumber
    participant Client as 🖥️ Client (Next.js)
    participant CDN as 🌐 CDN (Vercel)
    participant Gateway as 🚪 API Gateway (Kong)
    participant Service as ⚙️ Microservice (NestJS)
    participant Cache as 💾 Redis Cache
    participant DB as 🗄️ PostgreSQL
    participant Event as 📡 Kafka
    participant AI as 🧠 AI Service (Python)

    Client->>CDN: Request Page
    CDN-->>Client: SSR HTML + JS

    Client->>Gateway: API Call (/api/market/products)
    Gateway->>Gateway: Validate JWT
    Gateway->>Gateway: Rate Limit Check

    Gateway->>Cache: Check Cache
    alt Cache Hit
        Cache-->>Gateway: Cached Response
    else Cache Miss
        Gateway->>Service: Forward Request
        Service->>DB: Query Products
        DB-->>Service: Results

        Service->>AI: Enhance with AI (recommendations)
        AI-->>Service: Enriched Data

        Service->>Cache: Store in Cache (TTL: 5min)
        Service-->>Gateway: Response
    end

    Gateway-->>Client: JSON Response

    Service->>Event: Publish analytics.event
    Event->>ClickHouse: Consume for analytics
```

---

### 🔐 Gestion des Rôles & Permissions (RBAC)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    MODÈLE RBAC AGRI-LOGISTIC                             │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   ROLES     │────►│ PERMISSIONS │────►│  RESOURCES  │────►│   ACTIONS   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘

ROLES:
├── 👑 admin
│   └── Permissions: ["*:*"] (Wildcard - tout accès)
│
├── 🌱 farmer
│   ├── Parcels: ["create", "read", "update", "delete"]
│   ├── Products: ["create", "read", "update", "delete"]
│   ├── Offers: ["create", "read", "update", "delete"]
│   ├── Contracts: ["read", "sign"]
│   └── Wallet: ["read", "withdraw"]
│
├── 🚚 transporter
│   ├── Fleet: ["create", "read", "update", "delete"]
│   ├── Drivers: ["create", "read", "update", "delete"]
│   ├── Missions: ["read", "accept", "execute"]
│   └── Tracking: ["create", "read"]
│
└── 🛒 buyer
    ├── Search: ["read"]
    ├── RFQ: ["create", "read", "update", "delete"]
    ├── Contracts: ["create", "read", "sign"]
    ├── Orders: ["create", "read"]
    └── Wallet: ["read", "deposit", "pay"]

HIERARCHIE:
admin > farmer | transporter | buyer

MIDDLEWARE NEXT.JS (middleware.ts):
─────────────────────────────────────
export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt');
  const user = verifyJWT(token);

  const routePermissions = {
    '/admin': ['admin'],
    '/farmer': ['admin', 'farmer'],
    '/transporter': ['admin', 'transporter'],
    '/buyer': ['admin', 'buyer']
  };

  if (!hasPermission(user.role, routePermissions[request.nextUrl.pathname])) {
    return NextResponse.redirect('/unauthorized');
  }
}
```

---

## 7️⃣ Sécurité & Accès

---

### 🔒 Pages Privées par Rôle

| Route                   | Rôle Requis            | Protection | Description           |
| ----------------------- | ---------------------- | ---------- | --------------------- |
| `/admin/*`              | `admin`                | JWT + RBAC | Espace administration |
| `/admin/analytics`      | `admin`                | JWT + RBAC | Analytics globaux     |
| `/admin/users`          | `admin`                | JWT + RBAC | Gestion utilisateurs  |
| `/farmer/*`             | `farmer`, `admin`      | JWT + RBAC | Espace agriculteur    |
| `/farmer/parcels`       | `farmer`, `admin`      | JWT + RBAC | Gestion parcelles     |
| `/farmer/market`        | `farmer`, `admin`      | JWT + RBAC | Publication offres    |
| `/transporter/*`        | `transporter`, `admin` | JWT + RBAC | Espace transporteur   |
| `/transporter/fleet`    | `transporter`, `admin` | JWT + RBAC | Gestion flotte        |
| `/transporter/missions` | `transporter`, `admin` | JWT + RBAC | Missions actives      |
| `/buyer/*`              | `buyer`, `admin`       | JWT + RBAC | Espace acheteur       |
| `/buyer/sourcing`       | `buyer`, `admin`       | JWT + RBAC | Recherche produits    |
| `/buyer/orders`         | `buyer`, `admin`       | JWT + RBAC | Suivi commandes       |

---

### 🛡️ Protection des Routes

```typescript
// middleware.ts - Protection globale des routes
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';
import { hasPermission } from './lib/rbac';

const protectedRoutes = {
  '/admin': ['admin'],
  '/farmer': ['farmer', 'admin'],
  '/transporter': ['transporter', 'admin'],
  '/buyer': ['buyer', 'admin'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si route protégée
  const matchedRoute = Object.keys(protectedRoutes).find((route) => pathname.startsWith(route));

  if (matchedRoute) {
    const token = request.cookies.get('jwt')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const payload = verifyJWT(token);
      const requiredRoles = protectedRoutes[matchedRoute];

      if (!hasPermission(payload.role, requiredRoles)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Ajouter user info aux headers pour le serveur
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.sub);
      requestHeaders.set('x-user-role', payload.role);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/farmer/:path*', '/transporter/:path*', '/buyer/:path*'],
};
```

---

### 🔐 Bonnes Pratiques Sécurité

| Couche         | Pratique                       | Implémentation                 |
| -------------- | ------------------------------ | ------------------------------ |
| **Auth**       | JWT avec refresh tokens        | Rotation automatique           |
| **Passwords**  | Argon2id hashing               | Salt unique par user           |
| **2FA**        | TOTP (Google Authenticator)    | Admin & transactions >$1000    |
| **Session**    | Redis stockage                 | TTL 24h, invalidation possible |
| **Headers**    | Security headers               | HSTS, CSP, X-Frame-Options     |
| **CORS**       | Whitelist origines             | Configuration stricte          |
| **Input**      | Validation Zod/Class-Validator | Rejet données malformées       |
| **SQL**        | Requêtes paramétrées (Prisma)  | Prévention injection           |
| **XSS**        | Échappement output             | React auto + DOMPurify         |
| **CSRF**       | Tokens CSRF                    | Formulaires protégés           |
| **Rate Limit** | Par IP + user                  | 100 req/min anonyme, 1000 auth |
| **Audit**      | Logs immutables                | Blockchain pour sensibles      |

---

### ⚡ Scalabilité & Performance

#### Optimisations Frontend (Next.js 14)

| Optimisation            | Implémentation                                | Impact                    |
| ----------------------- | --------------------------------------------- | ------------------------- |
| **Bundle Analyzer**     | `@next/bundle-analyzer` (ANALYZE=true)         | Identification modules lourds |
| **Lazy Loading**        | `next/dynamic` (QuickCommand, AG-Grid, Leaflet, Three.js, FleetCommander) | Réduction bundle initial  |
| **Loading States**      | `loading.tsx` (admin, dashboard)               | Feedback navigation <100ms |
| **Prefetch ciblé**      | `prefetch={false}` sur routes secondaires      | Moins de requêtes réseau  |
| **modularizeImports**   | lucide-react, @radix-ui/react-icons            | Réduction ~30KB icônes    |
| **ClientProviders**     | Wrapper AuthProvider/CartProvider/Toaster      | Fix hydration SSR         |
| **Font display: swap**  | Inter, Plus Jakarta Sans                      | Évite FOIT                |

#### Infrastructure

| Stratégie                | Implémentation          | Impact                 |
| ------------------------ | ----------------------- | ---------------------- |
| **Horizontal Scaling**   | Kubernetes HPA          | Auto-scale 2-50 pods   |
| **Caching Multi-niveau** | CDN → Redis → In-Memory | Latence <50ms          |
| **Database Sharding**    | PostgreSQL par région   | Capacité illimitée     |
| **Read Replicas**        | 3 replicas par master   | Lectures ×3            |
| **Connection Pooling**   | PgBouncer               | 10k+ connexions        |
| **Async Processing**     | Kafka + Workers         | Non-blocking           |
| **CDN Global**           | Vercel Edge             | 100+ PoP worldwide     |
| **Image Optimization**   | Next.js Image           | Format auto, lazy load |
| **Code Splitting**       | Dynamic imports         | Bundle size optimisé   |

---

## 8️⃣ Vision Future

---

### 🗺️ Roadmap Stratégique

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ROADMAP AGRI-LOGISTIC 2024-2027                       │
└─────────────────────────────────────────────────────────────────────────┘

2024 Q1-Q2                    2024 Q3-Q4                    2025
    │                             │                            │
    ▼                             ▼                            ▼
┌─────────┐                 ┌─────────┐                  ┌─────────┐
│ PHASE 1 │                 │ PHASE 2 │                  │ PHASE 3 │
│   V3.0  │                 │ AGRI-   │                  │ DRONES &│
│CURRENT  │                 │ FINTECH │                  │ROBOTIQUE│
└────┬────┘                 └────┬────┘                  └────┬────┘
     │                           │                            │
     • Consolidation           • Agri-Score IA v1.0 (Live)   • Drones
       features logistique       (30/25/20/15/10 weighting)    livraison
     • Marketplace V2           • Microcrédits agricoles      rurale
     • Mobile apps              • Assurance récolte paramétrique• Robots
     • Traçabilité Blockchain (OK)• Paiements cross-border      entrepôt
                                                               automatisés
                                    │                            │
                                    ▼                            ▼
                              ┌─────────┐                  ┌─────────┐
                              │ PHASE 4 │                  │ PHASE 5 │
                              │EXPANSION│                  │   IA    │
                              │PAN-AFRIC│                  │AVANCÉE  │
                              └────┬────┘                  └────┬────┘
                                   │                            │
                                   • UEMOA                      • Agriculture
                                   • CEMAC                        prédictive
                                   • Corridors                  • Autonomie
                                     logistiques                 décisionnelle
                                   • Hub régionaux              • Supply chain
                                   • Interopérabilité             cognitive
                                     monétaire                  • Carbon farming
```

---

### 🧠 IA Avancée - Vision 2025-2026

| Technologie                 | Application                        | Impact                    |
| --------------------------- | ---------------------------------- | ------------------------- |
| **LLM Agents**              | Assistant agricole conversationnel | Conseil personnalisé 24/7 |
| **Computer Vision 2.0**     | Comptage fruits, maturité auto     | Récolte optimale          |
| **Digital Twin Avancé**     | Simulation scénarios culture       | +30% rendement            |
| **Autonomous Planning**     | Planification entièrement auto     | Zero-touch farming        |
| **Predictive Supply Chain** | Anticipation disruptions           | Résilience totale         |
| **Carbon Credits AI**       | Quantification carbone générée     | Revenus additionnels      |

---

### 🌍 Internationalisation

| Région            | Date Cible | Spécificités                       |
| ----------------- | ---------- | ---------------------------------- |
| **Côte d'Ivoire** | Q2 2024    | Marché pilote, cacao/café          |
| **Sénégal**       | Q3 2024    | Francophonie, arachide             |
| **Ghana**         | Q4 2024    | Anglophone, cacao                  |
| **Nigeria**       | Q1 2025    | Plus grand marché, diversification |
| **Kenya**         | Q2 2025    | Horticulture export                |
| **Ethiopie**      | Q4 2025    | Café premium                       |

---

### 📈 Scalabilité Métier & Technique

| Dimension                  | Objectif 2025 | Objectif 2027 |
| -------------------------- | ------------- | ------------- |
| **Utilisateurs**           | 100,000       | 1,000,000     |
| **Transactions/mois**      | 500,000       | 5,000,000     |
| **Tonnes transportées/an** | 500,000       | 5,000,000     |
| **Pays**                   | 5             | 20            |
| **Régions**                | 2             | 5             |
| **Disponibilité**          | 99.95%        | 99.99%        |
| **Latence API**            | <100ms        | <50ms         |


---

## 🚀 Installation & Déploiement

### Pré-requis
- **Node.js**: v20.x (LTS)
- **PNPM**: v9.x ou v10.x
- **Docker**: (Optionnel pour le déploiement)
- **PostgreSQL**: v15 (Si le backend local est utilisé)

### Installation Locale
```bash
# 1. Cloner le repository
git clone https://github.com/votre-org/AgroDeep.git
cd AgroDeep

# 2. Installer les dépendances
pnpm install

# 3. Configurer l'environnement
cp apps/web-app/.env.example apps/web-app/.env.local
# (Modifier .env.local avec vos clés API)

# 4. Lancer le serveur de développement
pnpm dev
```

### Démarrage dev avec PostgreSQL
Les services **incident-service** et **production-service** (et d’autres) se connectent à PostgreSQL. Pour que `pnpm dev` fonctionne :

1. **Démarrer PostgreSQL** (port **5435** par défaut) :
   ```bash
   docker compose up -d postgres
   ```
   Pour un démarrage propre (sans conteneurs orphelins) : `docker compose up -d postgres --remove-orphans`. Pour tout réinitialiser : `docker compose down --remove-orphans` puis `docker compose up -d postgres`.
2. **Optionnel** : copier `.env.example` vers `.env` à la racine et vérifier `DB_PORT=5435` et `DB_PASSWORD=AgriLogistic_secure_2026`. Définir `INFLUXDB_TOKEN=` (ou un token réel si vous utilisez InfluxDB/Telegraf) évite le warning Docker Compose.
3. **Si vous voyez "password authentication failed for user AgriLogistic"** : le mot de passe dans le conteneur ne correspond pas. Réinitialiser :
   ```bash
   docker exec -it AgriLogistic-postgres psql -U AgriLogistic -d postgres -c "ALTER USER AgriLogistic WITH PASSWORD 'AgriLogistic_secure_2026';"
   ```
4. **Si vous voyez "Bind for 0.0.0.0:5435 failed: port is already allocated"** : définir `POSTGRES_PORT=5436` dans `.env` à la racine, puis `DB_PORT=5436` (et `DATABASE_URL=...@localhost:5436/productions_db` pour production-service) dans les `.env` des services concernés.
   - **Option A – Libérer le port** : trouver le processus (PowerShell : `Get-NetTCPConnection -LocalPort 5433`) ou un conteneur (`docker ps -a`), puis arrêter le conteneur qui utilise 5433 (`docker stop <container_id>`) ou l’autre instance PostgreSQL.
### ▲ Déploiement Vercel (Web App)
La web-app Next.js (`apps/web-app`) peut être déployée sur [Vercel](https://vercel.com). Configuration et variables d'environnement (Production / Preview) : voir **[docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)**. Dans Vercel, définir **Root Directory** = `apps/web-app`. **Si le build échoue** : procédure pas à pas **[docs/VERCEL_REDEPLOY_STEPS.md](docs/VERCEL_REDEPLOY_STEPS.md)**.

### ☁️ Déploiement Google Cloud (Web App)
La web-app peut être déployée sur **Google Cloud** (Cloud Run + Cloud SQL). Guide **étape par étape** : **[docs/GOOGLE_CLOUD_DEPLOYMENT.md](docs/GOOGLE_CLOUD_DEPLOYMENT.md)** (création projet, APIs, Cloud SQL, Artifact Registry, build Docker, déploiement Cloud Run, variables d'environnement, migrations Better Auth).

### 🆓 Phase test – options gratuites (Vercel, Render, AWS, GCP)
Pour une phase test sans coût : **[docs/FREE_TIER_DEPLOYMENT.md](docs/FREE_TIER_DEPLOYMENT.md)** compare **Vercel + Neon**, **Render**, **AWS Amplify + Neon** et **Google Cloud Run + Neon**, et recommande le meilleur choix (recommandation : **Vercel + Neon** pour 0 € et simplicité). Configuration Neon pas à pas : **[docs/NEON_SETUP.md](docs/NEON_SETUP.md)**.

### 🐳 Déploiement Docker (Production)
L'application est conteneurisée et prête pour le déploiement (Kubernetes/ECS/Cloud Run). Le workflow CD construit l'image avec le contexte `apps/web-app` et pousse vers GHCR.

```bash
# 1. Construire l'image Docker (contexte = apps/web-app)
docker build -t ghcr.io/votre-org/agrologistic-platform/web-app:latest -f apps/web-app/Dockerfile apps/web-app

# 2. Lancer le conteneur
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL="https://api.agrologistic.com" ghcr.io/votre-org/agrologistic-platform/web-app:latest
```

### 🔧 Variables d'Environnement Clés

| Variable | Usage | Obligatoire |
| -------- | ----- | ----------- |
| `NEXT_PUBLIC_API_URL` | URL API Gateway | Oui |
| `NEXT_PUBLIC_WAR_ROOM_WS_URL` | WebSocket War Room (incidents temps réel) | Non |
| `NEXT_PUBLIC_ADMIN_API_URL` | Admin API (Quick Actions, Audit, Workflows) | Non |
| `NEXT_PUBLIC_OPENWEATHERMAP_API_KEY` | Couche précipitations Digital Twin (sinon RainViewer gratuit) | Non |
| `NEXT_PUBLIC_DIGITAL_TWIN_USE_MAPLIBRE` | Moteur carte Digital Twin (MapLibre vs Leaflet) | Non |

### 📡 API Admin (Quick Actions & Workflows)

| Endpoint | Méthode | Usage |
| -------- | ------- | ----- |
| `/api/admin/quick-actions/:action` | POST | Exécution actions rapides (bypass cache) |
| `/api/admin/audit` | POST | Persistance audit trail |
| `/admin/workflows/emergency-stop` | POST | Emergency Stop (suspension corridor logistique) |
| `/admin/workflows/reroute-fleet` | POST | Reroute Fleet (recalcul VRP zone météo) |

### 🗺️ Geospatial - Tile Service (Digital Twin)

| Composant | Technologie | Usage |
| --------- | ----------- | ----- |
| **Tile Service** | Python FastAPI, rasterio, rio-tiler | Tuiles NDVI depuis COG (MinIO) |
| **PostGIS** | PostgreSQL + PostGIS | Stockage géométries parcelles |
| **COG** | Cloud Optimized GeoTIFF (MinIO) | Stockage images Sentinel-2 |
| **IA Anomalie** | PyTorch, CNN | Détection maladies/zonage Digital Twin |

---

### ✅ Checklist de Mise en Production (Pre-Flight)
- [ ] **Environnement**: Toutes les variables `NEXT_PUBLIC_` sont définies dans le CI/CD.
- [ ] **Base de Données**: Migrations appliquées sur la base de production.
- [ ] **Tests**: E2E Tests (`pnpm test:e2e`) passés à 100%.
- [ ] **Build**: `pnpm build` compile sans erreur bloquante.
- [ ] **Assets**: Les images statiques sont optimisées ou sur CDN.
- [ ] **Sécurité**: Headers de sécurité (CSP, HSTS) configurés dans `next.config.mjs`.

### 🔄 CI/CD – GitHub Actions & script local

| Fichier | Rôle |
| ------- | ----- |
| **`.github/workflows/ci.yml`** | **CI** : sur PR/push `main`/`develop` – lint, typecheck, format:check, tests unitaires, tests d’intégration (optionnel avec Docker), build monorepo ; job **Security** : scan Trivy (filesystem) + upload SARIF. |
| **`.github/workflows/cd.yml`** | **CD** : push `main` → build image web-app, push GHCR, déploiement **staging** (EKS) ; tag `v*` → déploiement **production** ; rollback automatique + notification Slack en cas d’échec. |
| **`.github/workflows/migrate.yml`** | **Migrations DB** : déclenchement manuel (`workflow_dispatch`) – choix d’environnement (staging/production), exécution `prisma migrate deploy` pour auth-service et mission-service. Secrets : `DATABASE_URL`, optionnel `DATABASE_URL_MISSION`. |
| **`.github/workflows/nightly-backup.yml`** | **Backup DB** : planifié 2h UTC quotidien + manuel – `pg_dump` depuis `DATABASE_URL`, compression, upload en artifact (7 jours) et optionnellement vers S3 si `S3_BACKUP_BUCKET` est défini. |
| **`scripts/deploy.sh`** | **Script local de secours** : `./scripts/deploy.sh [staging\|production]` – install deps, validation (typecheck, lint, format, tests), build, migrations Prisma si `DATABASE_URL` défini. Variables : `SKIP_VALIDATE=1`, `SKIP_MIGRATE=1`. |

**Secrets / variables utiles pour les workflows :**

| Contexte | Secret / Variable | Usage |
| -------- | ----------------- | ----- |
| CD staging/production | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | EKS |
| CD | `AWS_REGION`, `EKS_CLUSTER_NAME` | Cluster EKS |
| CD (optionnel) | `SLACK_WEBHOOK_URL` | Notifications déploiement / rollback |
| Migrate | `DATABASE_URL` | Prisma (auth-service) |
| Migrate (optionnel) | `DATABASE_URL_MISSION` | Prisma (mission-service) |
| Nightly backup | `DATABASE_URL` | pg_dump |
| Nightly backup (optionnel) | `S3_BACKUP_BUCKET`, AWS credentials | Upload S3 |

**Overlay Kubernetes staging :** `infrastructure/k8s/overlays/staging/` (namespace `AgriLogistic-staging`, configmap, secrets, 1 replica web). Production : `infrastructure/k8s/overlays/production/`.

---

## 📌 Implémentations Récentes (2025)

### Digital Twin Global (Vue Satellite)

| Fonctionnalité | Technologie | Statut |
| -------------- | ----------- | ------ |
| Overlays Yield (heatmap rendements) | Leaflet, couleurs par T/ha | ✅ |
| Overlays Diseases (zones maladies IA) | Cercles MapLibre/Leaflet, diseaseZones | ✅ |
| Couche Précipitations | RainViewer API (gratuit) / OpenWeatherMap (clé optionnelle) | ✅ |
| Split slider 2023 vs 2024 | CompareMapSlider, clip-path | ✅ |
| MapLibre GL JS (optionnel) | maplibre-gl, react-map-gl/maplibre | ✅ |
| Tile Service (backend) | Python FastAPI, rasterio, rio-tiler | 🏗️ Structure |
| PostGIS + COG + IA Anomalie | Roadmap docs/DIGITAL_TWIN_BACKEND_ROADMAP.md | 📋 Planifié |

### War Room & Quick Actions

| Composant | Implémentation |
| --------- | -------------- |
| Kafka topics (cahier 1.2) | user.events, order.events, logistics.events, payment.events, iot.telemetry, analytics.events, incident.events ; analytics-service et incident-service alignés |
| API Incidents + Redis Pub/Sub | incident-service |
| `NEXT_PUBLIC_WAR_ROOM_WS_URL` | WebSocket temps réel |
| Quick Actions API | POST quick-actions/:action, audit, workflows |
| cmdk + react-hotkeys-hook | Palette Ctrl+K, raccourcis mnémoniques |

### Performance Frontend

| Optimisation | Impact |
| ------------ | ------ |
| Bundle Analyzer | ANALYZE=true pnpm build |
| Lazy loading (QuickCommand, AG-Grid, Leaflet, Three.js, FleetCommander) | Réduction bundle initial |
| loading.tsx (admin, dashboard) | Feedback navigation |
| Prefetch ciblé | Moins de requêtes secondaires |
| modularizeImports (lucide-react) | ~30KB économisés |
| ClientProviders | Fix hydration SSR |

### API Gateway Kong (Cahier des charges 1.1)

| Élément | Détail |
| ------- | ------ |
| **docker-compose.kong.yml** | Stack Kong + PostgreSQL ; montage `kong.conf` et démarrage Kong avec `-c /usr/local/kong/kong.conf` |
| **kong.conf** | `infrastructure/kong/kong.conf` : proxy_listen, admin_listen, database, plugins, logs |
| **kong.yml** | Config déclarative : services (ports 8001–8011), routes, JWT + consumers API Key (key-auth) |
| **init-kong.sh** | `infrastructure/scripts/init-kong.sh` appelle `kong-init.sh` pour l’initialisation |
| **routing-table.md** | `infrastructure/docs/routing-table.md` : tableau routes, services, plugins, commandes de validation |
| **validate-kong-cahier.sh** | Script de validation : GET /services, GET /api/v1/users avec JWT, GET /status |
| **Rate limiting** | 100 req/min par IP (anonyme), 1000 req/min par consumer (authentifié) |
| **Bootstrap** | Idempotent : si UNIQUE violation (JWT déjà en base), sortie en succès ; `restart: "no"` pour éviter la boucle |
| **PostgreSQL** | Même `KONG_PG_PASSWORD` (ou défaut `kong_secure_2026`) pour kong-database, kong-bootstrap, kong-gateway |

### Event Bus Apache Kafka (Cahier des charges 1.2)

| Élément | Détail |
| ------- | ------ |
| **docker-compose.kafka.yml** | Cluster KRaft (sans Zookeeper), 3 brokers, Schema Registry Confluent, Kafka Connect, Kafka UI (provectus/kafka-ui) ; `infrastructure/docker-compose.kafka.yml` ; broker 1 exposé sur le port **19092** (évite conflit avec Kafka du compose principal sur 9092) |
| **Topics** | user.events (3 p, 7 j), order.events (6 p, 30 j), logistics.events (6 p, 7 j), payment.events (3 p, 1 an), iot.telemetry (12 p, 3 j), analytics.events (6 p, 90 j), incident.events (3 p, 7 j) ; création automatique au démarrage (kafka-init-topics) |
| **kafka/config/server.properties** | Réglages optimisés 8 GB RAM (log, réseau, réplication) ; heap brokers 2g, Connect 1g |
| **Schema Registry** | Port 8081 ; gouvernance Avro |
| **Connecteurs** | `infrastructure/connectors/` : postgres-source.json (JDBC Source PostgreSQL), clickhouse-sink.json (analytics.events → ClickHouse), jdbc-sink.json (réplication), http-sink.json (webhooks) ; voir `infrastructure/connectors/README.md` pour installation ClickHouse/HTTP Sink |
| **Schémas Avro** | `infrastructure/kafka/schemas/avro/user-event-v1.avsc`, `order-event-v1.avsc` |
| **Scripts** | `infrastructure/kafka/scripts/create-topics.sh` (création manuelle topics) ; `infrastructure/scripts/validate-kafka-cahier.sh` (Linux/macOS), `infrastructure/scripts/validate-kafka-cahier.ps1` (Windows) |
| **Validation** | Après démarrage du stack : `docker exec kafka-broker-1 kafka-topics --bootstrap-server localhost:9092 --list` ; `docker exec kafka-broker-1 kafka-console-consumer --bootstrap-server localhost:9092 --topic order.events --from-beginning` ; ou exécuter `./infrastructure/scripts/validate-kafka-cahier.sh` / `.\infrastructure\scripts\validate-kafka-cahier.ps1` |
| **Documentation** | `infrastructure/docs/kafka-cahier-1.2.md` (déploiement, topics, connecteurs, validation) ; section Kafka dans `infrastructure/QUICK_START.md` |
| **Services alignés** | analytics-service : abonnement user.events, order.events, logistics.events, payment.events, analytics.events, iot.telemetry + compatibilité noms en tirets ; incident-service : production/consommation incident.events |

### Service Mesh Linkerd (Optionnel – Phase 2)

| Élément | Détail |
| ------- | ------ |
| **Contexte** | Observabilité réseau et mTLS entre micro-services sans modifier le code applicatif. |
| **install.sh** | `infrastructure/linkerd/install.sh` : installation CLI Linkerd2 (CNCF), control plane, extension Viz (dashboard) ; prérequis `linkerd check --pre`. |
| **Fonctionnalités** | mTLS automatique entre pods meshés ; métriques réseau (latence, erreurs) ; load balancing avancé ; retry et circuit breaker (proxy). |
| **Injection** | Annotation `linkerd.io/inject: enabled` sur le namespace AgroLogistic ; injection automatique via `infrastructure/k8s-manifests/with-linkerd/`. |
| **k8s-manifests/with-linkerd/** | `namespace-linkerd.yaml` (namespace avec annotation) ; `kustomization.yaml` (inclut l’overlay production) ; déploiement : `kubectl apply -k infrastructure/k8s/overlays/with-linkerd/`. Validation : `.\infrastructure\scripts\validate-linkerd.ps1`. |
| **Dashboard** | Extension Viz : `linkerd viz dashboard` (proxy local) pour visualisation du mesh. |
| **Alerting p99** | `infrastructure/linkerd/prometheus-rules-p99.yaml` : PrometheusRule alerte si latence p99 > 500 ms (métrique `response_latency_ms_bucket`). |
| **Documentation** | `infrastructure/linkerd/README.md` ; `infrastructure/k8s-manifests/with-linkerd/README.md`. |

### Monitoring Métier - Apache Superset (Cahier des charges)

| Élément | Détail |
| ------- | ------ |
| **Contexte** | Remplacement solution analytics propriétaire par Apache Superset 100 % open source pour monitoring métier plateforme agricole. |
| **Tâche** | Authentification intégrée (admin/admin ; SSO Keycloak optionnel) ; connexion PostgreSQL (données métier) et ClickHouse (analytics) ; dashboards prédéfinis par rôle ; Row Level Security (RLS) par rôle utilisateur. |
| **docker-compose.superset.yml** | Stack complète avec init automatique (db upgrade, admin, init.sh) : Superset 3.x, PostgreSQL (metadata superset-db), Redis (cache + Celery), Celery worker/beat, Flower ; `infrastructure/docker-compose.superset.yml`. Volumes : superset_config.py, datasources/, datasets/, charts/. |
| **Stack** | Superset 3.x (port 8088), PostgreSQL (superset-db), Redis (cache requêtes + broker Celery), Celery worker (tâches async), Celery beat (planification), Flower (monitoring Celery, port 5555). |
| **Configuration requise** | Docker Compose complet avec init auto ; datasources agrilogistic_prod (PostgreSQL), analytics_warehouse (ClickHouse), kafka_streams (optionnel) ; RLS par rôle (agriculteur, transporteur, admin). |
| **superset/superset_config.py** | Configuration Python : DB metadata, Redis, Celery, RLS, CORS, feature flags ; cache données (1h historique, 5min temps réel) ; RESULTS_BACKEND Redis pour requêtes async ; GLOBAL_ASYNC_QUERIES. |
| **superset/init.sh** | Post-migration : création admin, préparation datasources ; import YAML à lancer après création des bases dans l’UI. |
| **superset/datasources/** | Connecteurs YAML : postgres.yaml (OLTP agrilogistic, tables users/entities/products/orders/contracts/missions, cache 1h), clickhouse.yaml (OLAP analytics, events/iot_telemetry/funnel_analysis, cache 5min), trino.yaml (federated optionnel). Voir `infrastructure/superset/datasources/README.md`. |
| **superset/datasets/** | Datasets optimisés : orders_dataset.yaml (métriques total_revenue, avg_order_value, order_count, distinct_customers ; dimensions created_at, status, total, user_id, entity_id). Cache 1h/5min ; async pour datasets > 1M lignes. Voir `infrastructure/superset/datasets/README.md`. |
| **superset/charts/** | Templates charts : revenue_chart.json (form_data line chart CA mensuel sur dataset orders). |
| **superset/dashboards/exports/** | Exports JSON des dashboards (à remplir après création dans l’UI). Import : `superset import-dashboards -p /app/pythonpath/dashboards/exports/*.json`. Voir `infrastructure/superset/dashboards/exports/README.md`. |
| **Datasources (UI)** | À configurer dans Data > Connect Database : agrilogistic_oltp (PostgreSQL), agrilogistic_analytics (ClickHouse), agrilogistic_federated (Trino optionnel). Puis import YAML : `superset import_datasources -p /app/pythonpath/datasources/postgres.yaml -r -u admin` (idem clickhouse, datasets/orders_dataset.yaml). |
| **Dashboard Executive** | GMV Temps Réel (Big Number + Trend, orders, date_range) ; Carte Transactions (Deck.GL Scatter, orders+parcels, product_type, date) ; Funnel Conversion (Funnel, events, cohort_date) ; Top Produits (Bar, products, region, date) ; Satisfaction NPS (Gauge, feedbacks). |
| **Dashboard Opérations Logistiques** | Carte Flotte Temps Réel (Deck.GL Path, missions+iot, status, transporter) ; Performance Transport (Mixed, missions, date_range) ; Taux Remplissage (Pie, vehicles, type) ; Alertes Temps Réel (Table Log, incidents, severity). |
| **Dashboard Agriculteur** | Revenus Mensuels (Line, payments, farmer_id, date) ; Rendement vs Prévision (Bar, parcels+predictions, crop_type, season) ; Qualité Produits (Box Plot, quality_scores, product_category). |
| **RLS (Sécurité)** | Agriculteur : filtre farmer_id / user_id ; Transporteur : filtre transporter_id ; Admin : UNFILTERED. Configurer dans Settings > List RLS (ou API) pour chaque rôle et dataset. |
| **Validation** | UI http://localhost:8088 (login admin/admin) ; Flower http://localhost:5555 ; test SQL (après connexion datasource) : `SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '7 days'` ; script `.\infrastructure\scripts\validate-superset.ps1`. |
| **Documentation** | `infrastructure/superset/README.md` (complet) ; `infrastructure/docs/superset-monitoring-metier.md`. |

### Monitoring Technique - Observabilité complète (Prometheus + Grafana)

| Élément | Détail |
| ------- | ------ |
| **Contexte** | Monitoring technique infrastructure et applications pour SLA 99.95% et détection proactive des incidents. |
| **Tâche** | Déployer la stack complète Prometheus + Grafana + Alertmanager + Loki + Tempo. |
| **docker-compose.monitoring.yml** | Stack : Prometheus (15s scrape, 15j retention), Grafana, Alertmanager, Loki (7j retention), Tempo (OTLP/Jaeger), Node Exporter, cAdvisor ; `infrastructure/docker-compose.monitoring.yml`. Déploiement : `cd infrastructure && docker compose -f docker-compose.monitoring.yml up -d`. |
| **Prometheus** | Scraping 15s ; retention 15j ; targets : Node Exporter (OS), cAdvisor (containers Docker), Prometheus itself, application metrics (/metrics NestJS). Config : `infrastructure/monitoring/prometheus/prometheus.yml` ; règles : `infrastructure/monitoring/prometheus/rules/alerts.yml`. |
| **Grafana** | Datasources : Prometheus, Loki, Tempo, PostgreSQL (+ Jaeger, Elasticsearch, ClickHouse). Provisioning : `infrastructure/monitoring/grafana/provisioning/datasources/datasources.yml`, `dashboards/dashboards.yml`. Dashboards prédéfinis : `infrastructure/monitoring/grafana/dashboards/*.json` (services-overview, security-dashboard). Alerting vers Slack/PagerDuty. |
| **Loki** | Logs aggregation ; collecte logs Docker (driver loki) ; labels container_name, service, level ; retention 7j. Config : `infrastructure/monitoring/loki/loki-config.yml`. |
| **Tempo** | Distributed tracing ; receiving Jaeger format, OTLP ; stockage local (S3 pour prod). Config : `infrastructure/monitoring/tempo/tempo.yml`. |
| **Alertmanager** | Routes : critical → PagerDuty, warning → Slack ; silences pour maintenance. Config : `infrastructure/monitoring/alertmanager/config.yml`. Variables : `PAGERDUTY_ROUTING_KEY`, `SLACK_WEBHOOK_URL`. |
| **Dashboards Grafana (cahier)** | **Infrastructure - Cluster Overview** : CPU/Memory/Disks par node, Network I/O, Container resource usage (cAdvisor), Kubernetes (si applicable). **Application - API Performance** : Request rate par endpoint, latence p50/p95/p99, error rate 4xx/5xx, top slowest queries PostgreSQL. **Business - SRE Golden Signals** : Traffic (req/sec), Latency, Errors, Saturation. |
| **Instrumentation NestJS** | Endpoint `/metrics` exposé via `packages/microservice-core` (metricsMiddleware, metricsEndpoint) ; format Prometheus compatible (http_requests_total, http_request_duration_seconds). Exemple cahier prom-client : Counter `http_requests_total` (method, route, status_code), Histogram `http_request_duration_seconds` (buckets 0.1, 0.5, 1, 2, 5). Voir `infrastructure/monitoring/README.md`. |
| **Validation** | Prometheus http://localhost:9090 ; Grafana http://localhost:3000 (admin/admin) ; Loki http://localhost:3100 ; requête test `rate(http_requests_total[5m])`. Script : `.\infrastructure\scripts\validate-monitoring.ps1`. |
| **Documentation** | `infrastructure/monitoring/README.md`. |

### Kubernetes pour Orchestration (Option Production – Cahier 3.2)

| Élément | Détail |
| ------- | ------ |
| **Contexte** | Migration vers Kubernetes pour auto-scaling et haute disponibilité AgriLogistic. |
| **Namespace** | `agrilogistic` ; ConfigMaps pour configurations non sensibles ; Secrets (Sealed Secrets ou Vault) pour données sensibles. |
| **Deployments** | web-app, user-service (auth), market-service, logistics-service, payment-service, ai-service ; définis dans `infrastructure/k8s/base/frontend.yml`, `base/services.yml`, `deployments/*.yaml`. |
| **StatefulSets** | postgres, redis, clickhouse, kafka, zookeeper ; `infrastructure/k8s/statefulsets/*.yaml`. |
| **Services & Ingress** | ClusterIP pour communication interne ; Ingress NGINX avec cert-manager (Let's Encrypt) ; `infrastructure/k8s/ingress/ingress.yaml`. |
| **HPA** | Horizontal Pod Autoscaler (CPU 70 %, min 2 / max 10) pour market-service, web-app, user-service ; `infrastructure/k8s/hpa/*.yaml`. |
| **Monitoring** | ServiceMonitors Prometheus Operator pour scraping `/metrics` ; `infrastructure/k8s/monitoring/servicemonitors.yaml`. |
| **Déploiement** | `kubectl apply -f infrastructure/k8s/base/namespace.yaml` puis ConfigMap, StatefulSets, Deployments, Ingress, HPA ; ou `kubectl apply -k infrastructure/k8s/overlays/production`. |
| **Validation** | `kubectl get pods -n agrilogistic` ; `kubectl top pods -n agrilogistic` ; `kubectl logs -f deployment/market-service -n agrilogistic`. |
| **Documentation** | `infrastructure/k8s/README.md`. |

### Database – Optimisation PostgreSQL (Cahier 4.1)

| Élément | Détail |
| ------- | ------ |
| **Contexte** | PostgreSQL 15+ optimisé pour charges OLTP (transactions) + OLAP (requêtes analytics). |
| **Fichier** | `infrastructure/postgres/postgresql-production.conf` : configuration de production à monter ou merger avec `postgresql.conf`. |
| **Mémoire (16 GB RAM)** | shared_buffers = 4GB ; effective_cache_size = 12GB ; work_mem = 20MB ; maintenance_work_mem = 512MB. |
| **WAL & Réplication** | wal_level = replica ; max_wal_size = 2GB ; min_wal_size = 512MB ; archive_mode = on ; archive_command pour sauvegarde WAL. |
| **Query Planning** | random_page_cost = 1.1 (SSD) ; effective_io_concurrency = 200 ; default_statistics_target = 100 ; JIT activé si besoin. |
| **Logging** | log_min_duration_statement = 1000 (requêtes > 1s) ; log_checkpoints, log_connections, log_lock_waits. |
| **Extensions** | shared_preload_libraries = 'pg_stat_statements, auto_explain' pour analyse des requêtes lentes. |
| **Connexions & Parallélisme** | max_connections, max_parallel_workers_per_gather, max_parallel_workers. |
| **Timeouts** | statement_timeout, lock_timeout, idle_in_transaction_session_timeout pour éviter les blocages. |
| **Usage** | Copier/merger le fichier dans le répertoire de données PostgreSQL et redémarrer le serveur ; adapter les chemins d’archive selon l’environnement. |

| **Partitionnement** | Table `orders` : partitionnement par mois (RANGE sur created_at) ; fonction `create_orders_partition_for_month(month_date)` ; index BRIN sur created_at, GIN sur JSONB. Voir `services/marketplace/order-service/migrations/002_orders_partitioning.sql`. Génération automatique des partitions : cron ou pg_partman. |
| **Indexation** | BRIN (created_at), GIN (JSONB metadata), GiST (PostGIS géométries). |
| **Réplication** | Streaming Replication : 1 primaire, 2 réplicas (lecture + backups/analytics) ; slots nommés ; vérification lag `pg_stat_replication` ; failover manuel ou Patroni. |
| **Maintenance** | VACUUM ANALYZE hebdomadaire, REINDEX mensuel : `infrastructure/scripts/maintenance/vacuum.sh`. pg_dump quotidien vers S3/MinIO : `infrastructure/scripts/backup/s3-backup.sh`. |
| **Fichiers** | `infrastructure/postgres/initdb/01-extensions.sql`, `pg_hba.conf.example`, `migrations/` (analytics_events, notifications, feature_flags, audit_logs). Voir `infrastructure/postgres/README.md`. |

### Database – Migrations complémentaires (Cahier 4.2)

| Élément | Détail |
| ------- | ------ |
| **analytics_events** | Table pour sync ClickHouse : event_type, user_id, session_id, properties (JSONB), sent_to_clickhouse. Index sur event_type, created_at, sent (partiel). `infrastructure/postgres/migrations/001_analytics_events.sql`. |
| **notifications** | Schéma plateforme : type (push, email, sms, whatsapp), title, content, data (JSONB), read_at, sent_at, delivered_at, failed_at. Index user_unread (partiel). `infrastructure/postgres/migrations/002_notifications_platform.sql`. |
| **feature_flags** | key, description, enabled, rules (JSONB). Seed : new_dashboard_ui, ai_price_prediction, advanced_routing. `infrastructure/postgres/migrations/003_feature_flags.sql`. |
| **audit_logs** | Immutable (fillfactor=100), partitionnée par mois (RANGE changed_at). table_name, record_id, action (INSERT/UPDATE/DELETE), old_data/new_data (JSONB), changed_by, changed_at, ip_address, user_agent. Fonction `create_audit_logs_partition_for_month`. `infrastructure/postgres/migrations/004_audit_logs.sql`. |
| **Exécution** | `psql -d agrilogistic -f infrastructure/postgres/initdb/01-extensions.sql` puis `.../migrations/001_*.sql` à `004_*.sql`. Voir `infrastructure/postgres/README.md`. |

### Migrations Prisma (auth-service)

| Migration | Contenu |
| --------- | ------- |
| `20240115120000_add_analytics` | Table `analytics_events` (sync ClickHouse). |
| `20240115130000_add_notifications` | Table `notifications` (push, email, sms, whatsapp). |
| `20240115140000_add_feature_flags` | Table `feature_flags` + seed. |
| `20240115150000_add_audit_logs` | Table `audit_logs` partitionnée par mois + fonction `create_audit_logs_partition_for_month`. |
| **Emplacement** | `services/identity/auth-service/prisma/migrations/`. |
| **Commande** | `cd services/identity/auth-service && pnpm prisma:migrate` (dev) ou `prisma migrate deploy` (prod). |

### Observabilité – OpenTelemetry (Prompt 5.1)

| Élément | Détail |
| ------- | ------ |
| **Contexte** | Tracing distribué end-to-end (API → DB → Cache → External). |
| **Stack OTLP / Jaeger** | `infrastructure/docker-compose.otel.yml` : Jaeger all-in-one (OTLP gRPC 4317, OTLP HTTP 4318, thrift 6831). Collector optionnel (profil `with-collector`). Démarrage : `cd infrastructure && docker compose -f docker-compose.otel.yml up -d`. |
| **Visualisation Jaeger UI** | http://localhost:16686 — Recherche par traceID, service, durée ; graph de dépendances entre services (« System Architecture »). |
| **NestJS** | `packages/microservice-core/middleware/tracing.ts` ; export `@agrologistic/microservice-core/tracing`. Instrumentation HTTP, pg, Redis, kafkajs. OTLP HTTP vers Jaeger/Tempo (défaut `http://localhost:4318`). En première ligne de `main.ts` : `import '@agrologistic/microservice-core/tracing';` (auth-service, mission-service). |
| **Express (user-service)** | `services/identity/user-service/src/tracing.ts` ; en première ligne de `index.ts` : `import './tracing';`. OTLP HTTP, auto-instrumentation Express/pg. Variables : `OTEL_SDK_DISABLED`, `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`. |
| **Frontend (Next.js)** | `apps/web-app/instrumentation.ts` : spans côté serveur (navigation, API routes). Utilise @vercel/otel si installé, sinon instrumentation manuelle (Node SDK OTLP). `next.config.mjs` : `experimental.instrumentationHook: true`. Variables : `OTEL_SERVICE_NAME` (défaut `agrilogistic-web-app`), `OTEL_EXPORTER_OTLP_ENDPOINT`. |
| **Python (FastAPI AI Service)** | `services/ai-service/src/tracing.py` : TracerProvider, JaegerExporter (thrift), BatchSpanProcessor, `tracing.instrument_fastapi(app)` dans `main.py`. Variables : `OTEL_SDK_DISABLED`, `JAEGER_AGENT_HOST` (défaut `jaeger`), `JAEGER_AGENT_PORT` (défaut `6831`), `OTEL_SERVICE_NAME`. Dépendances : `opentelemetry-exporter-jaeger-thrift`, `opentelemetry-instrumentation-fastapi` (voir `services/ai-service/requirements.txt`). |
| **Variables (NestJS)** | `OTEL_SDK_DISABLED`, `OTEL_EXPORTER_OTLP_ENDPOINT`, `OTEL_SERVICE_NAME`, `JAEGER_AGENT_ENDPOINT`. |
| **Documentation** | `infrastructure/docs/opentelemetry-tracing.md` (fichiers, Jaeger UI, user-service, web-app). |

### Validation globale infrastructure

| Élément | Détail |
| ------- | ------ |
| **Script** | `.\infrastructure\scripts\validate-all.ps1` : enchaîne les validations Monitoring (Prometheus, Grafana, Loki, Tempo), Superset, Kafka, Kong. |
| **Options** | `-SkipMonitoring`, `-SkipSuperset`, `-SkipKafka`, `-SkipKong` pour ignorer une stack. |
| **Rapport** | Résumé OK / FAIL / SKIP par stack et liens utiles en fin d’exécution. Code de sortie 1 si au moins un échec. |
| **Validation unitaire** | Monitoring seul : `.\infrastructure\scripts\validate-monitoring.ps1`. Voir `infrastructure/monitoring/README.md`. |

### Tests de validation (CI)

| Élément | Détail |
| ------- | ------ |
| **Commande** | `pnpm run validate` (typecheck + lint + format + test:ci) ; `pnpm run test:ci` (tests unitaires + coverage). |
| **Tests d’intégration** | `tests/integration/full-service-flow.test.ts` : skip automatique des tests qui appellent l’API lorsque le service auth n’est pas joignable (CI sans services). |
| **Logistics** | `src/app/data/logistics-operations.test.ts` : types `Coordinates` ([lat, lon]), `Load`/`Truck` alignés sur le module. |

### CI/CD Pipelines (GitHub Actions)

| Workflow | Déclenchement | Rôle |
| -------- | -------------- | ----- |
| **CI** (`ci.yml`) | PR / push `main` ou `develop` | Lint (turbo), typecheck, format:check, tests unitaires, tests d'intégration (Docker optionnel), build monorepo ; job Security : Trivy scan filesystem, upload SARIF (Security tab). |
| **CD** (`cd.yml`) | Push `main` ou tag `v*` | Build image web-app (Dockerfile `apps/web-app`), push vers GHCR ; staging sur `main` (EKS + `kubectl set image`), production sur tag ; rollback + Slack en cas d'échec. Overlays K8s : `infrastructure/k8s/overlays/staging` et `production`. |
| **Migrations** (`migrate.yml`) | Manuel (`workflow_dispatch`) | Choix environnement (staging/production) ; `prisma migrate deploy` auth-service et mission-service ; secrets `DATABASE_URL`, `DATABASE_URL_MISSION` (optionnel). |
| **Backup** (`nightly-backup.yml`) | Cron 2h UTC + manuel | `pg_dump` depuis `DATABASE_URL`, compression, artifact (7 j) et optionnel S3 (`S3_BACKUP_BUCKET`). |

**Script local de secours :** `scripts/deploy.sh [staging|production]` – install, validation, build, migrations si `DATABASE_URL` ; variables `SKIP_VALIDATE`, `SKIP_MIGRATE`. Voir [Installation & Déploiement – CI/CD](#-cicd--github-actions--script-local).

### ESLint & qualité web-app

| Élément | Détail |
| ------- | ------ |
| **Documentation** | `apps/web-app/docs/ESLINT_RULES.md` : règles ESLint modifiées, corrections (erreur `Plus` FleetCommander, `alt` img, hooks), désactivations ciblées (unescaped-entities, no-img-element, jsx-no-comment-textnodes) avec justification. |
| **Config** | `apps/web-app/.eslintrc.json` : règles `react/no-unescaped-entities`, `@next/next/no-img-element`, `react/jsx-no-comment-textnodes` en `off` ; `react-hooks/exhaustive-deps` et `jsx-a11y/alt-text` en `warn`. |
| **Résultat** | `pnpm run lint` dans `apps/web-app` : « No ESLint warnings or errors » (exit 0). |

### Nettoyage du code source

| Élément | Détail |
| ------- | ------ |
| **Rapport** | `docs/CLEANUP_REPORT.md` : inventaire, liste des suppressions (fichiers temporaires, scripts obsolètes), mise à jour `.gitignore`, recommandations. |
| **Changelog** | `CHANGELOG.md` (racine) et `apps/web-app/CHANGELOG.md` : entrées 2026-02-03 pour le nettoyage. |

### Migration Authentification (Fév 2026)

| Élément | Détail |
| ------- | ------ |
| **Librairie** | **Better Auth** remplace NestJS Auth pour la web-app (Next.js 14+). Configuration dans `apps/web-app/src/auth.ts`. |
| **Base de Données** | **Prisma 7** : Configuration centralisée dans `apps/web-app/prisma.config.ts`. Port local PostgreSQL : **5435**. |
| **Sécurité** | Support OAuth (Google, Apple), Sessions DB avec expiration 24h, Rôles utilisateur (Admin, Farmer, Transporter, Buyer). |
| **Setup dev** | Variables dans `apps/web-app/.env` (généré automatiquement). Commande schema : `npx prisma db push`. |

#### Intégration Frontend & API

| Composant | Description Technique |
| --------- | --------------------- |
| **API Backend** | Route Handler `app/api/auth/[...all]/route.ts` exposant les endpoints Better Auth. |
| **Server Actions** | `app/actions/auth-actions.ts` : Wrappers séurisés pour `signUpEmail`, `signInEmail`, `signInSocial`. |
| **Login UI** | `LoginForm.tsx` refactorisé pour utiliser les Server Actions + Bouton Google Sign-In. |
| **Middleware** | `middleware.ts` adapté pour vérifier `better-auth.session_token` au lieu des tokens JWT manuels. |
| **Nettoyage** | Suppression du service legacy `services/identity/auth-service`. |

### 🔐 Configuration Auth

Cette section décrit comment configurer l'authentification (Better Auth) pour la web-app : création de la base, variables d'environnement, migration des tables, et Google OAuth. Fichiers concernés : `apps/web-app/src/auth.ts`, `apps/web-app/src/app/actions/auth-actions.ts`, `apps/web-app/src/context/AuthContext.tsx`, `apps/web-app/src/components/auth/LoginForm.tsx`, `apps/web-app/.env.example`.

#### 1. Créer la base de données

1. **Démarrer PostgreSQL** (port **5435** par défaut) :
   ```bash
   docker compose up -d postgres
   ```
2. **Créer la base** si besoin (ex. `AgriLogistic`) :
   ```bash
   docker exec -it AgriLogistic-postgres psql -U AgriLogistic -d postgres -c "CREATE DATABASE AgriLogistic;"
   ```
3. En cas d'erreur de mot de passe : réinitialiser avec le même que dans `DATABASE_URL` (ex. `AgriLogistic_secure_2026`).

#### 2. Définir les variables d'environnement

1. Copier l'exemple dans la web-app :
   ```bash
   cp apps/web-app/.env.example apps/web-app/.env.local
   # ou .env selon votre setup
   ```
2. Éditer `apps/web-app/.env.local` (ou `apps/web-app/.env`) et renseigner au minimum :
   - **`DATABASE_URL`** : URL Postgres, ex. `postgresql://AgriLogistic:AgriLogistic_secure_2026@localhost:5435/AgriLogistic`
   - **`BETTER_AUTH_SECRET`** : clé de signature (min 32 caractères). Générer : `openssl rand -base64 32`
   - **`BETTER_AUTH_URL`** ou **`NEXTAUTH_URL`** : URL de base de l'app, ex. `http://localhost:3000`
3. Optionnel : **`NEXT_PUBLIC_DEV_LOGIN_DELAY_MS`** (défaut 250) pour le délai d’accès rapide en ms ; **`GOOGLE_CLIENT_ID`** / **`GOOGLE_CLIENT_SECRET`** pour Google OAuth (voir §4).

#### 3. Lancer la migration Better Auth

Les tables Better Auth (`user`, `session`, `account`, `verification`) doivent être créées avant toute inscription. Dans le répertoire **`apps/web-app`** :

```bash
cd apps/web-app
npx @better-auth/cli@latest migrate
```

Vérifier que `DATABASE_URL` est bien défini (dans `.env` ou `.env.local`) avant d’exécuter la commande. Si la base n’est pas migrée, l’inscription (email ou Google) affiche une erreur explicite : *« Base de données non migrée. Exécutez la migration Better Auth (voir README – Configuration Auth). »* (gestion d’erreur dans `apps/web-app/src/app/actions/auth-actions.ts`).

#### 4. Configurer Google OAuth (Redirect URI, Consent Screen)

Pour activer « Se connecter avec Google » (dégradation gracieuse si non configuré : pas d’erreur serveur, message utilisateur dans `apps/web-app/src/components/auth/LoginForm.tsx`).

1. **Console Google Cloud** : [https://console.cloud.google.com/](https://console.cloud.google.com/).
2. **Créer un projet** (ou en sélectionner un).
3. **Écran de consentement OAuth** :  
   **APIs & Services → OAuth consent screen**  
   - Type d’application : **Externe** (ou Interne pour Workspace).  
   - Renseigner : Nom de l’application, e-mail d’assistance, domaines autorisés si besoin.  
   - Scopes : ajouter `.../auth/userinfo.email` et `.../auth/userinfo.profile` si nécessaire.  
   - Enregistrer.
4. **Identifiants** : **APIs & Services → Credentials → Create Credentials → OAuth client ID**  
   - Type : **Application Web**.  
   - **Origines JavaScript autorisées** : `http://localhost:3000` (et l’URL de prod si applicable).  
   - **URI de redirection autorisés** : `http://localhost:3000/api/auth/callback/google` (adapter pour la prod, ex. `https://votredomaine.com/api/auth/callback/google`).  
   - Créer ; copier le **Client ID** et le **Client Secret**.
5. Dans **`apps/web-app/.env.local`** (ou `.env`) :
   ```env
   GOOGLE_CLIENT_ID=votre_client_id
   GOOGLE_CLIENT_SECRET=votre_client_secret
   ```
   La config Better Auth dans `apps/web-app/src/auth.ts` n’enregistre le provider Google que si ces deux variables sont présentes et non placeholder (évite une erreur serveur si l’admin n’a pas encore configuré Google).

#### 5. Livrables finaux attendus

| Élément | Détail |
|--------|--------|
| **Fichiers .env.example** | Mis à jour dans `apps/web-app/.env.example` (DB, Better Auth, Google, `NEXT_PUBLIC_DEV_LOGIN_DELAY_MS`). |
| **Tables Better Auth** | Créées en base via `npx @better-auth/cli@latest migrate` dans `apps/web-app`. |
| **Inscription Email / Google** | Fonctionnelles avec gestion d’erreur (message clair si DB non migrée). |
| **Accès rapide (test)** | Délai configurable, défaut **250 ms** via `NEXT_PUBLIC_DEV_LOGIN_DELAY_MS` dans `apps/web-app/src/context/AuthContext.tsx`. |

---

## 📞 Contact & Support

| Canal                 | Lien/Email                                                   | Disponibilité      |
| --------------------- | ------------------------------------------------------------ | ------------------ |
| **Site Web**          | [www.agri-logistic.com](https://www.agri-logistic.com)       | 24/7               |
| **Support**           | support@agri-logistic.com                                    | Lun-Ven 8h-18h GMT |
| **Documentation API** | [docs.agri-logistic.com](https://docs.agri-logistic.com)     | 24/7               |
| **Status Page**       | [status.agri-logistic.com](https://status.agri-logistic.com) | 24/7               |

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<p align="center">
  <strong>© 2026 AgriLogistic Corp.</strong><br>
  <em>Architecting the Future of African Agriculture.</em><br><br>
  🌾 🚚 💰 🌍
</p>
