# 📋 Audit Quick Actions Hub - Cahier des Charges

**Date:** 1er Février 2025  
**Statut:** Conformité partielle → Mise à jour en cours

---

## 1. FONCTIONNALITÉS REQUISES vs IMPLÉMENTATION

### 1.1 Palette de commandes (Ctrl+K)

| Fonctionnalité | Cahier | Implémentation | Statut |
|----------------|--------|----------------|--------|
| Ouvrir palette Ctrl+K / Cmd+K | Oui | ✅ useHotkeys | OK |
| Recherche floue "Kofi", "TR-89", "4521" | Oui | ⚠️ cmdk built-in | À renforcer |
| Raccourcis mnémoniques K=T=KYC, T=Transport, F=Finance | Oui | ⚠️ Toast only | À améliorer |
| Fermer Esc | Implicite | ❌ Manquant | À ajouter |

### 1.2 Actions fréquentes (8 max)

| Action | Cahier | Implémentation | Statut |
|--------|--------|----------------|--------|
| Validation KYC rapide (file d'attente) | Oui | ✅ | OK |
| Génération rapport journalier | Oui | ✅ | OK |
| Activation mode maintenance | Oui | ✅ | OK |
| Broadcast notification zone transporteurs | Oui | ✅ (label à préciser) | OK |
| Forçage synchronisation blockchain | Oui | ✅ | OK |
| +3 actions optionnelles | 8 max | 5 actuelles | À compléter |

### 1.3 Workflows one-click

| Workflow | Cahier | Implémentation | Statut |
|----------|--------|----------------|--------|
| Emergency Stop - Suspension corridor logistique | Oui | ✅ | OK |
| Reroute Fleet - VRP zone météo dangereuse | Oui | ✅ | OK |

### 1.4 Technique

| Technologie | Cahier | Implémentation | Statut |
|-------------|--------|----------------|--------|
| useHotkeys | Oui | ✅ react-hotkeys-hook | OK |
| cmdk | Oui | ✅ cmdk | OK |
| API NestJS bypass cache | Oui | ❌ Mocké | Préparatoire |
| Audit trail (qui, quoi, quand) | Oui | ⚠️ console.log | À persister |

### 1.5 Design

| Critère | Cahier | Implémentation | Statut |
|---------|--------|----------------|--------|
| Bouton ⚡ bas sidebar | Oui | ✅ | OK |
| Feedback haptique mobile | Oui | ❌ | À ajouter |
| Feedback sonore desktop (optionnel) | Oui | ❌ | Optionnel |
| Dark mode obligatoire | Oui | ✅ | OK |

---

## 2. ACTIONS DE MISE À JOUR

1. Raccourcis K/T/F : ouvrir palette + pré-remplir recherche
2. Esc pour fermer
3. 3 actions supplémentaires (8 total)
4. Hooks API préparatoires + audit trail
5. Feedback haptique (navigator.vibrate)
6. Labels workflows alignés

---

## 3. API BACKEND (admin-service)

### Endpoints implémentés

| Méthode | Chemin | Description |
|---------|--------|-------------|
| POST | `/api/v1/admin/quick-actions/:action` | Exécution des actions rapides (bypass cache) |
| POST | `/api/v1/admin/audit` | Persistance de l'audit trail (qui, quoi, quand) |
| POST | `/api/v1/admin/workflows/emergency-stop` | Emergency Stop - suspension corridor logistique |
| POST | `/api/v1/admin/workflows/reroute-fleet` | Reroute Fleet - recalcul VRP zone météo |

### Configuration Kong

La route admin est configurée dans `infrastructure/api-gateway/kong.yml`.
Le service `admin-service` est ajouté à `docker-compose.yml` (port 5005).

### Variables d'environnement (web-app)

- `NEXT_PUBLIC_API_URL` : Kong (défaut http://localhost:8000/api/v1)
- `NEXT_PUBLIC_ADMIN_API_URL` : appels directs à admin-service (optionnel, ex: http://localhost:5005)
