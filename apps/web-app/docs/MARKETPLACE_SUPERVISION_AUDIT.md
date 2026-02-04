# Audit - Marketplace Agricole (Supervision Offres)

**Date :** 1er Février 2025  
**Page :** `/admin/operations/marketplace`  
**Cahier des charges :** Centre de contrôle marketplace - supervision et modération des offres d'achat/vente

---

## 1. CONFORMITÉ FONCTIONNELLE

### 1.1 Vue d'ensemble marché temps réel

| Fonctionnalité | Statut | Détails |
|----------------|--------|---------|
| Compteur offres actives par catégorie | ⚠️ Partiel | Card "Live Offers" avec total actives, mais **pas de répartition par catégorie** (céréales, fruits, légumes) |
| Prix moyen par produit et par région vs semaine précédente | ✅ Implémenté | Cards `trends` avec product, region, currentPrice, previousPrice, change % (🔺 +5.6%, 🔻 -10.7%) |
| Anomalies détection (prix anormal, fraude) | ✅ Implémenté | `anomalies` dans `MarketOffer`, affichées dans l'inspecteur ("Security Red-Flags"), exemple : "Anormal price detected: 25% below regional average" |

### 1.2 Modération offres

| Fonctionnalité | Statut | Détails |
|----------------|--------|---------|
| File validation nouvelles offres (photos, descriptions, certifications) | ✅ Implémenté | Queue "Active Listings Queue" avec AG Grid, inspecteur avec photo placeholder, quantity, price, Approve/Reject |
| Détection contenu inapproprié (IA Computer Vision sur photos) | ⚠️ Mocké | Badge "CV VERIFIED" affiché, **aucune intégration IA réelle** |
| Gestion signalements : Bouton "Signaler" → Investigation | ✅ Implémenté | Bouton "Flag for Investigation" dans l'inspecteur (non connecté à un workflow backend) |

### 1.3 Matching supervision

| Fonctionnalité | Statut | Détails |
|----------------|--------|---------|
| Vue algorithmes de matching en action ("Pourquoi cette offre suggérée ?") | ⚠️ Partiel | Onglet "Matching Engine" avec animation, score 0.94 ; inspecteur affiche "Best Buyer Match: Global Foods CI (0.97)", "Sentiment Score", "History Reliability" |
| Override manuel : Forcer match si IA a manqué opportunité | ❌ Manquant | Aucun bouton ou flux pour forcer un match manuellement |
| Statistiques matching : Taux succès, temps moyen offre→vente | ⚠️ Partiel | Card "Match Rate 88%" dans HUD ; **temps moyen entre offre et vente non affiché** |

### 1.4 Régulation économique

| Fonctionnalité | Statut | Détails |
|----------------|--------|---------|
| Limitation prix (plafonnement si spéculation) | ⚠️ UI seule | Bouton "Set Cap" sur chaque trend card ; **non connecté** à une logique backend |
| Mode crise : Priorisation offres locales vs export | ✅ Implémenté | Toggle "Crisis Mode" actif/inactif (État géré dans le store, pas de logique métier associée) |

---

## 2. STACK TECHNIQUE

| Composant | Cahier des charges | Implémenté | Remarque |
|-----------|--------------------|------------|----------|
| **Frontend** | React Data Grid (AG Grid) | ✅ AG Grid | `MarketplaceGrid.tsx` avec AgGridReact |
| **Frontend** | D3.js visualisation flux prix | ❌ | Pas de graphiques D3 ; trends affichés en cards uniquement |
| **Backend** | NestJS + MongoDB | ❌ | Données Zustand mock uniquement |
| **Cache** | Redis top produits temps réel | ❌ | Non implémenté |
| **IA** | NLP analyse sentiment descriptions | ⚠️ Mocké | Champ `sentiment` (positive/neutral/negative) affiché, pas d'appel IA réel |
| **IA** | Computer Vision qualité photos | ⚠️ Mocké | Badge CV VERIFIED, pas de service IA |
| **Blockchain** | Vérification authenticité offres certifiées | ❌ | Non implémenté |

---

## 3. RAPPORTS

| Rapport | Statut | Détails |
|---------|--------|---------|
| Volume transactions par produit (journalier, hebdomadaire) | ❌ Manquant | Aucun rapport dédié |
| Satisfaction utilisateurs marketplace (NPS) | ❌ Manquant | Aucun NPS affiché |
| Identification "Super Producteurs" (volume + qualité + fiabilité) | ❌ Manquant | Aucune section dédiée ; "History Reliability" (14 Deals / 0 Claims) affiché par offre mais pas de leaderboard |

---

## 4. FICHIERS ET ARCHITECTURE

| Fichier | Rôle |
|---------|------|
| `apps/web-app/src/app/admin/operations/marketplace/page.tsx` | Page principale : HUD, onglets (Mod / Matching / Economics), inspecteur offre |
| `apps/web-app/src/components/admin/operations/MarketplaceGrid.tsx` | Grille AG Grid pour la file de modération |
| `apps/web-app/src/store/marketplaceStore.ts` | État : offers, trends, crisisMode, selectOffer, updateOfferStatus |

---

## 5. ACTIONS PRIORITAIRES

### Court terme (UI)
1. **Compteur par catégorie** : Afficher offres actives par catégorie (Céréales, Fruits, Légumes) dans le HUD ou sous-forme de sous-cards.
2. **Bouton "Set Cap"** : Connecter à une action (modal ou API) pour définir un plafond de prix.
3. **Override match manuel** : Ajouter bouton "Force Match" dans l'inspecteur avec sélection acheteur cible.
4. **Statistiques matching** : Ajouter "Temps moyen offre→vente" (même mock) dans l'onglet Matching.

### Moyen terme (Backend & IA)
1. **API NestJS + MongoDB** : CRUD offres, modération, signalements.
2. **Service NLP** : Intégration analyse sentiment des descriptions.
3. **Service CV** : Intégration détection qualité/inapproprié sur photos.
4. **Redis** : Cache "top produits" temps réel pour le HUD.
5. **D3.js** : Graphique évolution prix par produit/région.

### Long terme
1. **Blockchain** : Vérification authenticité offres certifiées.
2. **Rapports** : Volume transactions, NPS, Super Producteurs.
3. **Mode crise** : Logique backend pour priorisation offres locales vs export.

---

## 6. SCORE DE CONFORMITÉ

| Critère | Poids | Score |
|---------|-------|-------|
| Vue d'ensemble marché | 25% | 75% |
| Modération offres | 25% | 80% |
| Matching supervision | 25% | 55% |
| Régulation économique | 15% | 70% |
| Stack & Rapports | 10% | 30% |

**Score global estimé : 65%**

---

## 7. RÉSUMÉ

L'interface Marketplace Supervision est **bien avancée** sur les aspects centraux : HUD temps réel, file de modération avec AG Grid, inspecteur offre (approve/reject/flag), anomalies, trends prix, mode crise. Les lacunes principales concernent :

- **Override manuel match** et **statistiques matching** détaillées
- **D3.js** pour visualisation flux prix
- **Compteur par catégorie**
- **Backend, IA (NLP/CV), Redis, Blockchain** et **rapports** (transactions, NPS, Super Producteurs)
