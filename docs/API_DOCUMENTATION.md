# ðŸ“– Documentation API AgriLogistic Ecosystem
Version: **3.0.0 (Pro Max)** | Date: **2026-01-27**

L'écosystème **AgriLogistic** expose ses fonctionnalités via une architecture microservices sécurisée par **Kong API Gateway**.

---

## ðŸ” Authentification & Sécurité
Tous les services (sauf exceptions publiques) requièrent un jeton **JWT Bearer**.

- **OAuth2 / OIDC** : Géré par `auth-service`.
- **Kong Gateway** : Centralise la validation des jetons et le rate limiting.

---

## ðŸ›’ AgroMarket (Microservice Marketplace)
Gestion des produits agricoles, stocks et transactions.

### ðŸ“¦ Produits
| Méthode | Endpoint | Description | Rôles |
|---------|----------|-------------|-------|
| `GET` | `/api/v1/marketplace/products` | Liste tous les produits (filtrage possible) | Public |
| `GET` | `/api/v1/marketplace/products/:id` | Détails d'un produit spécifique | Public |
| `POST` | `/api/v1/marketplace/products` | Ajouter un nouveau produit | Admin, Farmer |
| `PATCH` | `/api/v1/marketplace/products/:id` | Mettre à jour un produit | Admin, Owner |
| `DELETE` | `/api/v1/marketplace/products/:id` | Supprimer un produit | Admin |

### ðŸ›’ Panier & Commandes
| Méthode | Endpoint | Description | Rôles |
|---------|----------|-------------|-------|
| `POST` | `/api/v1/marketplace/orders` | Créer une commande (Checkout) | Buyer |
| `GET` | `/api/v1/marketplace/orders/me` | Liste les commandes de l'utilisateur | Authentifié |
| `GET` | `/api/v1/marketplace/orders/:id` | Détails d'une commande | Owner |

---

## ðŸšš AgriLogistic Link (Logistique)
Optimisation des routes et gestion des transporteurs.

| Méthode | Endpoint | Description | Rôles |
|---------|----------|-------------|-------|
| `GET` | `/api/v1/logistics/routes` | Calculer une route optimale | Admin, Transporter |
| `POST` | `/api/v1/logistics/shipments` | Créer une expédition | Admin, Farmer |
| `PATCH` | `/api/v1/logistics/shipments/:id` | Mettre à jour le statut (GPS/IoT) | Transporter |

---

## ðŸ¤– AgriLogistic Trace & AI
Services d'intelligence et de traçabilité.

| Méthode | Endpoint | Description | Rôles |
|---------|----------|-------------|-------|
| `GET` | `/api/v1/ai/insights` | Récupérer les analyses prédictives | Admin, Farmer |
| `POST` | `/api/v1/trace/verify` | Vérifier l'origine via Blockchain | Public |

---

## ðŸ›  Environnement de Développement

### Accès Rapide (Dev Mode)
L'application supporte un mode `Quick Access` pour les développeurs, permettant de bypasser temporairement le processus OIDC complet pour tester les dashboards :
- `/login?dev=true` : Active les boutons d'accès direct.

### Ports par Défaut
- **Frontend (Web App)** : `3000`
- **Auth Service** : `3001`
- **Kong Gateway** : `8000`
- **Marketplace Backend** : `3002`

---
*Document conçu via @api-documentation-generator pour l'écosystème AgriLogistic.*


