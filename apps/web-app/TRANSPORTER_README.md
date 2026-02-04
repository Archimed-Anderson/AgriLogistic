# 🚚 Transporter Command Center - "Uber du Tracteur"

Cette documentation décrit l'implémentation du nouveau **Dashboard Transporteur** (OS Logistique), conçu comme un cockpit de pilotage haute-fréquence pour la logistique agricole.

## 🌟 Architecture & Design "Dark Freight"

Le dashboard utilise un thème sombre exclusif (`bg-slate-950`) avec des accents **Emerald** (Écologie/Agri) et **Orange** (Alertes/Urgence), inspiré des interfaces de contrôle militaire ou aéronautique.

### 🗺️ Structure des Pages

L'application est structurée autour de 5 modules clés accessibles via la Sidebar latérale :

| Module               | Route                              | Fonctionnalité Clé                                                                  |
| :------------------- | :--------------------------------- | :---------------------------------------------------------------------------------- |
| **Command Center**   | `/dashboard/transporter`           | Vue d'ensemble vue "Cockpit", KPIs temps réel, Flux de revenus, Alertes Météo.      |
| **Optimizer Engine** | `/dashboard/transporter/optimizer` | Simulateur de calcul d'itinéraire (Mock OR-Tools), Visualisation étapes Blockchain. |
| **Gestion Flotte**   | `/dashboard/transporter/fleet`     | Suivi télématique (Santé, Carburant), Maintenance prédictive.                       |
| **Analytics**        | `/dashboard/transporter/analytics` | Rapports de performance financière et écologique.                                   |
| **Configuration**    | `/dashboard/transporter/settings`  | Paramètres API (TomTom, Blockchain), Notifications.                                 |

## 🔧 Fonctionnalités Techniques Implémentées

### 1. Middleware de Sécurité & Rôles

- Protection stricte de la route `/dashboard/transporter/*`.
- Vérification du rôle `transporter` dans le JWT.
- Injection du header `x-transporter-id` pour les requêtes backend.

### 2. Composants UI "Pro Max"

- **Layout Animé** : Sidebar rétractable avec `framer-motion`, Topbar avec statut MQTT simulé.
- **Charts Temps Réel** : Utilisation de `recharts` pour visualiser les flux de revenus et la performance.
- **Optimizer Wizard** : Interface étape par étape simulant l'appel à des APIs complexes (TomTom -> OR-Tools -> Hyperledger).

### 3. Mock Data & Simulations

Le système est pré-câblé avec des données de démonstration réalistes pour permettre une validation UX immédiate sans backend complexe :

- **Missions** : Liste de missions avec statuts (En route, Chargement).
- **Véhicules** : Flotte hétérogène (Poids lourds, Tracteurs).
- **Logs** : Console système affichant les étapes de calcul d'optimisation.

## 🚀 Comment Tester

1. **Accès** : `http://localhost:3005/dashboard/transporter`
2. **Login** : Connectez-vous avec un compte ayant le rôle `transporter` (ou modifiez le cookie pour tester).
3. **Action** :
   - Allez sur **Optimizer Engine**.
   - Cliquez sur **"Lancer l'Optimiseur"**.
   - Observez la séquence d'animation et les logs de la console système.

## 📁 Fichiers Clés

- `src/app/dashboard/transporter/layout.tsx` (Layout Principal)
- `src/components/dashboard/TransporterDashboard.tsx` (Composant Vue d'ensemble)
- `src/app/dashboard/transporter/optimizer/page.tsx` (Logique Optimisation)
