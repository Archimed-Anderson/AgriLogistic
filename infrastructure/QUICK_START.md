# ðŸš€ Kong API Gateway - Guide de Démarrage Rapide

## AgroLogistic 2.0 - Phase 1 Finalisée

---

## âš¡ Démarrage en 1 Commande

### Windows (PowerShell) - RECOMMANDÉ

```powershell
cd c:\Users\ander\Downloads\AgriLogisticwebapp-main\AgriLogistic\infrastructure
.\scripts\kong-deploy.ps1
```

### Linux / macOS / WSL

```bash
cd /path/to/AgriLogistic/infrastructure
chmod +x scripts/kong-deploy.sh
./scripts/kong-deploy.sh
```

Le script va automatiquement :
1. âœ… Vérifier les prérequis (Docker, Docker Compose)
2. âœ… Démarrer la stack Kong
3. âœ… Attendre que Kong soit prêt
4. âœ… Initialiser la configuration (services, routes, JWT)
5. âœ… (Optionnel) Exécuter les tests
6. âœ… Afficher les informations de connexion

---

## ðŸ“¦ Ce Qui Est Déployé

Une fois le script terminé, vous aurez :

### Services Kong
- **Kong Gateway** - API Gateway principal
- **Kong Admin API** - API d'administration
- **Kong Manager** - Interface web de gestion
- **PostgreSQL** - Base de données Kong
- **Konga** - Interface d'administration alternative

### Monitoring
- **Prometheus** - Collecte de métriques
- **Grafana** - Dashboards et visualisation

### Configuration
- **11 microservices** configurés
- **36+ routes** API
- **3 consommateurs JWT** (Web, Mobile, Admin)
- **12 plugins** actifs (CORS, Rate Limiting, JWT, etc.)

---

## ðŸ”— Accès aux Services

Après le déploiement, accédez à :

| Service | URL | Credentials |
|---------|-----|-------------|
| **Kong Proxy** | http://localhost:8000 | - |
| **Kong Admin** | http://localhost:8001 | - |
| **Kong Manager** | http://localhost:8002 | - |
| **Konga UI** | http://localhost:1337 | À configurer au 1er accès |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3001 | admin / admin |

---

## ðŸ§ª Test Rapide

### 1. Vérifier que Kong fonctionne

```bash
curl http://localhost:8001/status
```

**Résultat attendu :** HTTP 200 avec des statistiques Kong

### 2. Tester une route protégée (sans auth)

```bash
curl http://localhost:8000/api/v1/products
```

**Résultat attendu :** HTTP 401 (JWT requis)

### 3. Tester avec un JWT

```bash
# Récupérer le token généré
$TOKEN = (Get-Content kong-tokens.txt | Select-String "Web App Token" -Context 0,1).Context.PostContext

# Utiliser le token
curl http://localhost:8000/api/v1/products -H "Authorization: Bearer $TOKEN"
```

**Résultat attendu :** HTTP 502 (service backend pas encore déployé) ou HTTP 200 si backend actif

---

## ðŸ§ª Suite de Tests Complète

Pour valider l'installation complète :

### Windows (WSL)

```powershell
wsl bash -c "cd /mnt/c/Users/ander/Downloads/AgriLogisticwebapp-main/AgriLogistic/infrastructure && bash scripts/kong-test.sh"
```

### Linux / macOS

```bash
cd infrastructure
chmod +x scripts/kong-test.sh
./scripts/kong-test.sh
```

### Ce qui est testé

- âœ… **6 tests d'infrastructure** (Kong, Konga, Prometheus, Grafana, PostgreSQL)
- âœ… **4 tests de configuration** (Services, Routes, Consumers, Plugins)
- âœ… **3 tests de sécurité** (JWT, CORS, Rate Limiting)
- âœ… **2 tests de services** (Auth, Products)
- âœ… **2 tests de monitoring** (Métriques)
- âœ… **1 test de performance** (Latence)

**Total : 18 tests automatisés**

---

## ðŸ“Š Vérifier les Services

```bash
# Liste des conteneurs
docker-compose -f docker-compose.kong.yml ps

# Logs en temps réel
docker-compose -f docker-compose.kong.yml logs -f

# Logs Kong uniquement
docker-compose -f docker-compose.kong.yml logs -f kong-gateway

# Services configurés
curl http://localhost:8001/services | jq

# Routes configurées
curl http://localhost:8001/routes | jq

# Consommateurs JWT
curl http://localhost:8001/consumers | jq
```

---

## ðŸ›‘ Arrêter Kong

```bash
cd infrastructure
docker-compose -f docker-compose.kong.yml down
```

Pour tout supprimer (y compris les données) :

```bash
docker-compose -f docker-compose.kong.yml down -v
```

---

## ðŸ”„ Redémarrer Kong

```bash
cd infrastructure
docker-compose -f docker-compose.kong.yml restart
```

Ou relancer le script de déploiement :

```powershell
.\scripts\kong-deploy.ps1
```

---

## ðŸ› Dépannage

### Kong ne démarre pas

```bash
# Vérifier les logs
docker-compose -f docker-compose.kong.yml logs kong-gateway

# Vérifier la base de données
docker-compose -f docker-compose.kong.yml logs kong-database

# Réinitialiser complètement
docker-compose -f docker-compose.kong.yml down -v
.\scripts\kong-deploy.ps1
```

### Erreur "Port déjà utilisé"

```bash
# Vérifier les ports utilisés
netstat -ano | findstr "8000\|8001\|8443\|1337"

# Arrêter les services conflictuels ou modifier les ports dans docker-compose.kong.yml
```

### JWT ne fonctionne pas

```bash
# Vérifier les consumers
curl http://localhost:8001/consumers

# Regénérer les tokens
cd infrastructure
bash scripts/kong-init.sh

# Vérifier kong-tokens.txt
cat kong-tokens.txt
```

---

## ðŸ“ Fichiers Importants

```
infrastructure/
â”œâ”€â”€ docker-compose.kong.yml     # Configuration Docker Compose
â”œâ”€â”€ .env.kong                   #  Variables d'environnement
â”œâ”€â”€ kong-tokens.txt             # JWT tokens générés (créé après init)
â”‚
â”œâ”€â”€ scripts/
â”‚   â”œâ”€â”€ kong-deploy.ps1         # Déploiement Windows
â”‚   â”œâ”€â”€ kong-deploy.sh          # Déploiement Linux
â”‚   â”œâ”€â”€ kong-init.sh            # Initialisation
â”‚   â”œâ”€â”€ kong-test.sh            # Tests
â”‚   â””â”€â”€ kong-backup.sh          # Backup
â”‚
â”œâ”€â”€ kong/
â”‚   â”œâ”€â”€ kong.yml                # Config déclarative
â”‚   â””â”€â”€ plugins/                # Plugins custom
â”‚
â””â”€â”€ docs/
    â”œâ”€â”€ PHASE1_COMPLETE.md      # Documentation complète Phase 1
    â”œâ”€â”€ README.md               # Guide principal
    â”œâ”€â”€ kong-usage.md           # Guide d'utilisation
    â””â”€â”€ kong-architecture.md    # Architecture technique
```

---

## ðŸŽ¯ Prochaines Étapes

Maintenant que Kong est déployé, vous pouvez :

### 1. Explorer l'Admin UI

Accédez à **http://localhost:1337** (Konga) et configurez votre premier utilisateur.

### 2. Consulter les Métriques

Accédez à **http://localhost:9090** (Prometheus) et **http://localhost:3001** (Grafana).

### 3. Déployer les Microservices

La prochaine étape est de déployer les services backend (Phase 2) :
- Auth Service (FastAPI)
- Product Service (FastAPI)
- Order Service (FastAPI)
- ... et autres

### 4. Tester le Flow Complet

Une fois les services backend déployés, testez le flow d'authentification complet :

```bash
# 1. Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# 2. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# 3. Utiliser le token pour accéder aux produits
curl http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## ðŸ“š Documentation Complète

Pour plus de détails, consultez :

- **[PHASE1_COMPLETE.md](PHASE1_COMPLETE.md)** - Documentation complète de la Phase 1
- **[README.md](README.md)** - Guide principal
- **[docs/kong-usage.md](docs/kong-usage.md)** - Guide d'utilisation détaillé
- **[docs/kong-architecture.md](docs/kong-architecture.md)** - Architecture technique

---

## âœ… Checklist de Validation

Avant de passer à la Phase 2, assurez-vous que :

- [x] Kong démarre sans erreur
- [x] Les 7 services exposent leurs ports
- [x] L'Admin API est accessible (http://localhost:8001/status)
- [x] Les 18 tests passent avec succès
- [x] Les tokens JWT sont générés (kong-tokens.txt existe)
- [x] Konga UI est accessible
- [x] Prometheus collecte les métriques Kong
- [x] Grafana est configuré

---

## ðŸŽ‰ Félicitations !

**Kong API Gateway pour AgroLogistic 2.0 est maintenant déployé et opérationnel !**

Vous êtes prêt pour la **Phase 2 : Déploiement des Microservices Backend**.

---

**Version:** 1.0.0  
**Date:** 2026-01-20  
**Status:** âœ… Production Ready


