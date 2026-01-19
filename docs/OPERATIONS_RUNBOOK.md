# 📚 Runbook d'Opérations - AgroLogistic Platform

**Version**: 1.0  
**Dernière mise à jour**: 19 janvier 2026  

---

## 📖 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Procédures de démarrage](#procédures-de-démarrage)
3. [Procédures d'arrêt](#procédures-darrêt)
4. [Gestion des incidents](#gestion-des-incidents)
5. [Alertes et résolution](#alertes-et-résolution)
6. [Procédures de rollback](#procédures-de-rollback)
7. [Maintenance planifiée](#maintenance-planifiée)
8. [Contacts d'urgence](#contacts-durgence)

---

## Vue d'ensemble

### Architecture du Système

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│                    (Web / Mobile / API)                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      KONG GATEWAY                               │
│                     (Load Balancer)                              │
│                   Port: 8000 (HTTP)                              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┬───────────────┐
          ▼               ▼               ▼               ▼
     ┌────────┐      ┌────────┐      ┌────────┐      ┌────────┐
     │  Auth  │      │Product │      │ Order  │      │Payment │
     │ :3001  │      │ :3002  │      │ :3003  │      │ :3004  │
     └───┬────┘      └───┬────┘      └───┬────┘      └───┬────┘
         │               │               │               │
         └───────────────┴───────────────┴───────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
     ┌────────┐      ┌────────┐      ┌────────┐
     │Postgres│      │ Redis  │      │MongoDB │
     │ :5433  │      │ :6379  │      │ :27017 │
     └────────┘      └────────┘      └────────┘
```

### URLs Importantes

| Service | URL | Description |
|---------|-----|-------------|
| Application Web | http://localhost:5173 | Frontend développement |
| Kong Gateway | http://localhost:8000 | API Gateway |
| Kong Admin | http://localhost:8001 | Administration Kong |
| Konga | http://localhost:1337 | UI Kong |
| Grafana | http://localhost:4001 | Dashboards |
| Prometheus | http://localhost:9090 | Métriques |
| Jaeger | http://localhost:16686 | Tracing |
| Kibana | http://localhost:5601 | Logs |

---

## Procédures de Démarrage

### Démarrage Complet (Production)

```powershell
# 1. Démarrer l'infrastructure de base
cd AgroDeep
docker-compose up -d postgres redis mongodb

# 2. Attendre que les bases soient prêtes (30s)
Start-Sleep -Seconds 30

# 3. Démarrer les services backend
docker-compose up -d auth-service product-service order-service

# 4. Démarrer l'API Gateway
docker-compose up -d kong-database kong-migrations kong

# 5. Démarrer le monitoring
docker-compose up -d prometheus grafana jaeger

# 6. Démarrer l'application web
docker-compose up -d agrodeep-web

# 7. Vérifier l'état de tous les services
.\scripts\validate-health-endpoints.ps1
```

### Démarrage Développement (Local)

```powershell
# 1. Démarrer seulement l'infrastructure nécessaire
docker-compose up -d postgres redis

# 2. Démarrer l'auth-service en mode dev
cd services\auth-service
npm install
npm run dev

# 3. Dans un autre terminal, démarrer le frontend
cd AgroDeep
$env:VITE_AUTH_PROVIDER="mock"  # ou "real" pour utiliser l'API
npm run dev
```

---

## Procédures d'Arrêt

### Arrêt Graceful

```powershell
# 1. Arrêter d'abord l'application web (plus de trafic entrant)
docker-compose stop agrodeep-web

# 2. Attendre le drainage des connexions (30s)
Start-Sleep -Seconds 30

# 3. Arrêter les services backend
docker-compose stop auth-service product-service order-service payment-service

# 4. Arrêter l'API Gateway
docker-compose stop kong konga

# 5. Arrêter le monitoring
docker-compose stop prometheus grafana jaeger kibana logstash

# 6. Arrêter les bases de données en dernier
docker-compose stop postgres redis mongodb elasticsearch
```

### Arrêt d'Urgence

```powershell
# Arrêt immédiat de tous les containers
docker-compose down

# Ou arrêt brutal si nécessaire
docker-compose kill
```

---

## Gestion des Incidents

### Niveau de Sévérité

| Niveau | Description | Temps de Réponse | Exemple |
|--------|-------------|------------------|---------|
| **SEV1** | Service complètement indisponible | < 15 min | BD principale down |
| **SEV2** | Dégradation majeure | < 30 min | Auth ne fonctionne plus |
| **SEV3** | Dégradation mineure | < 2h | Un service secondaire down |
| **SEV4** | Problème non critique | < 24h | Logs manquants |

### Checklist Incident

1. [ ] **Identifier** - Quel service est impacté?
2. [ ] **Contenir** - Peut-on isoler le problème?
3. [ ] **Diagnostiquer** - Consulter les logs et métriques
4. [ ] **Résoudre** - Appliquer le fix ou rollback
5. [ ] **Valider** - Vérifier que le service fonctionne
6. [ ] **Documenter** - Post-mortem si SEV1/SEV2

---

## Alertes et Résolution

### 🔴 ServiceDown (CRITICAL)

**Symptôme**: Un service ne répond plus aux health checks

**Diagnostic**:
```powershell
# Vérifier l'état du container
docker ps -a | Select-String "<service-name>"

# Voir les logs récents
docker logs --tail 100 <container-name>

# Vérifier les ressources
docker stats <container-name>
```

**Résolution**:
```powershell
# Option 1: Redémarrer le service
docker-compose restart <service-name>

# Option 2: Recréer le container
docker-compose up -d --force-recreate <service-name>

# Option 3: Vérifier les dépendances
docker-compose ps  # Vérifier que postgres/redis sont up
```

### 🔴 PostgreSQLDown (CRITICAL)

**Symptôme**: Base de données PostgreSQL inaccessible

**Diagnostic**:
```powershell
# Vérifier l'état du container
docker logs agrodeep-postgres --tail 50

# Tester la connexion
docker exec agrodeep-postgres pg_isready -U agrodeep
```

**Résolution**:
```powershell
# Redémarrer PostgreSQL
docker-compose restart postgres

# Si corruption des données
docker-compose down postgres
docker volume rm agrodeep_postgres-data  # ⚠️ PERTE DE DONNÉES
docker-compose up -d postgres
# Restaurer depuis le backup
```

### 🔴 RedisDown (CRITICAL)

**Symptôme**: Cache Redis inaccessible

**Diagnostic**:
```powershell
docker logs agrodeep-redis --tail 50
docker exec agrodeep-redis redis-cli -a $REDIS_PASSWORD ping
```

**Résolution**:
```powershell
docker-compose restart redis
```

### 🟡 HighErrorRate (WARNING)

**Symptôme**: Taux d'erreur > 5% sur un service

**Diagnostic**:
```powershell
# Voir les erreurs dans les logs
docker logs <service-container> 2>&1 | Select-String "error" | Select-Object -Last 50

# Vérifier les métriques Prometheus
# http://localhost:9090/graph?g0.expr=rate(http_requests_total{status=~"5.."}[5m])
```

**Résolution**:
- Vérifier les derniers déploiements
- Analyser les patterns d'erreur
- Rollback si nécessaire

### 🟡 SlowResponseTime (WARNING)

**Symptôme**: Temps de réponse P95 > 500ms

**Diagnostic**:
```powershell
# Vérifier l'utilisation des ressources
docker stats --no-stream

# Vérifier les traces Jaeger
# http://localhost:16686
```

**Résolution**:
- Scale horizontal (ajouter des replicas)
- Optimiser les requêtes DB
- Vérifier les indexes

### 🟡 HighMemoryUsage (WARNING)

**Symptôme**: Utilisation mémoire > 85%

**Résolution**:
```powershell
# Identifier le container gourmand
docker stats --no-stream

# Redémarrer le container problématique
docker-compose restart <service-name>
```

---

## Procédures de Rollback

### Rollback Application Web

```powershell
# 1. Identifier la version précédente
docker images | Select-String "agrodeep-web"

# 2. Modifier docker-compose.yml pour utiliser l'ancienne image
# Changer la version de l'image

# 3. Redéployer
docker-compose up -d agrodeep-web
```

### Rollback Kubernetes

```powershell
# Voir l'historique des déploiements
kubectl rollout history deployment/agrodeep-web -n agrodeep

# Rollback vers la version précédente
kubectl rollout undo deployment/agrodeep-web -n agrodeep

# Rollback vers une version spécifique
kubectl rollout undo deployment/agrodeep-web -n agrodeep --to-revision=2
```

### Rollback Base de Données

⚠️ **ATTENTION**: Opération sensible, nécessite coordination

```powershell
# 1. Arrêter le trafic entrant
docker-compose stop kong

# 2. Restaurer depuis le backup
# (procédure dépend du système de backup)

# 3. Vérifier l'intégrité
docker exec agrodeep-postgres psql -U agrodeep -c "SELECT count(*) FROM users;"

# 4. Redémarrer le trafic
docker-compose start kong
```

---

## Maintenance Planifiée

### Mise à jour des Dépendances

```powershell
# 1. Créer une branche
git checkout -b deps/update-$(Get-Date -Format "yyyy-MM-dd")

# 2. Mettre à jour les dépendances
npm update

# 3. Vérifier les vulnérabilités
npm audit

# 4. Lancer les tests
npm run validate:full

# 5. Créer une PR
```

### Backup des Données

```powershell
# Backup PostgreSQL
docker exec agrodeep-postgres pg_dump -U agrodeep agrodeep > backup_$(Get-Date -Format "yyyyMMdd").sql

# Backup MongoDB
docker exec agrodeep-mongodb mongodump --out /backup/$(Get-Date -Format "yyyyMMdd")

# Backup Redis
docker exec agrodeep-redis redis-cli -a $REDIS_PASSWORD BGSAVE
```

### Rotation des Logs

Les logs sont configurés pour rotation automatique dans Docker.
Vérifier la configuration dans `docker-compose.yml` :

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

---

## Contacts d'Urgence

| Rôle | Contact | Disponibilité |
|------|---------|---------------|
| **On-Call Principal** | [À définir] | 24/7 |
| **On-Call Backup** | [À définir] | 24/7 |
| **Tech Lead** | [À définir] | Heures ouvrées |
| **DBA** | [À définir] | Heures ouvrées |
| **DevOps** | [À définir] | Heures ouvrées |

### Canal de Communication

- **Incidents SEV1/SEV2**: Appel immédiat + Slack #incidents
- **Incidents SEV3/SEV4**: Slack #incidents
- **Questions techniques**: Slack #dev-support

---

## Annexes

### A. Commandes Docker Utiles

```powershell
# Voir tous les containers
docker-compose ps

# Voir les logs en temps réel
docker-compose logs -f <service>

# Entrer dans un container
docker exec -it <container> /bin/sh

# Nettoyer les ressources inutilisées
docker system prune -a
```

### B. Requêtes Prometheus Utiles

```promql
# Taux de requêtes par service
sum(rate(http_requests_total[5m])) by (service)

# Taux d'erreur
sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))

# Latence P95
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))

# Services UP/DOWN
up{job=~".*-service"}
```

### C. Liens Utiles

- [Documentation Architecture](./ARCHITECTURE.md)
- [Guide de Développement](./DEVELOPMENT_GUIDE.md)
- [API Endpoints](./API_ENDPOINTS.md)
- [Plan de Stabilisation](./STABILIZATION_PLAN.md)
- [Rapport d'Audit](./SYSTEM_AUDIT_REPORT.md)
