# Monitoring Métier - Apache Superset (Cahier des charges)

## Contexte

Remplacement d’une solution analytics propriétaire par **Apache Superset** (open source) pour le monitoring métier de la plateforme agricole.

## Tâche

Déployer Apache Superset avec :

- **Authentification intégrée** (admin/admin par défaut ; SSO Keycloak optionnel)
- **Connexion PostgreSQL** (données métier) et **ClickHouse** (analytics)
- **Dashboards prédéfinis** par rôle (Executive, Opérations Logistiques, Agriculteur)
- **RLS** (Row Level Security) par rôle utilisateur

## Stack technique

| Composant | Rôle |
|-----------|------|
| Superset 3.x | Application BI (port 8088) |
| PostgreSQL | Metadata Superset (superset-db) |
| Redis | Cache requêtes + broker Celery |
| Celery worker | Tâches async (requêtes, rapports) |
| Celery beat | Planification (alerts, reports) |
| Flower | Monitoring Celery (port 5555) |

## Fichiers

| Fichier | Rôle |
|---------|------|
| `infrastructure/docker-compose.superset.yml` | Stack complète avec init automatique |
| `infrastructure/superset/superset_config.py` | Configuration Python (DB, Redis, Celery, RLS, CORS) |
| `infrastructure/superset/init.sh` | Script post-migration (optionnel) |
| `infrastructure/superset/dashboards/exports/` | Exports JSON des dashboards (à remplir après création dans l’UI) |
| `infrastructure/scripts/validate-superset.ps1` | Script de validation |

## Connecteurs de données (Connecteurs Superset)

### 1. PostgreSQL (OLTP - données métier)

- **URI** : `postgresql+psycopg2://user:pass@postgres:5432/agrilogistic`
- **Tables exposées** (avec limites row count) : users (anonymisé), entities, products (snapshot hebdo), orders, contracts, missions (archivage > 90j vers ClickHouse).
- **Fichier** : `infrastructure/superset/datasources/postgres.yaml`
- **Cache** : 1h (données historiques).

### 2. ClickHouse (OLAP - analytics temps réel)

- **URI** : `clickhouse+native://user:pass@clickhouse:9000/analytics`
- **Tables** : events, iot_telemetry, funnel_analysis (matérialisé).
- **Fichier** : `infrastructure/superset/datasources/clickhouse.yaml`
- **Cache** : 5min (données temps réel).

### 3. Trino (Federated queries - optionnel)

- **URI** : `trino://user:pass@trino:8080/analytics`
- Joins cross-databases sans ETL complexe. Fichier : `infrastructure/superset/datasources/trino.yaml`.

### Datasets optimisés

- **orders_dataset.yaml** : métriques (total_revenue, avg_order_value, order_count, distinct_customers) et dimensions (created_at, status, total, user_id, entity_id). Fichier : `infrastructure/superset/datasets/orders_dataset.yaml`.
- **Cache** : 1h pour données historiques ; 5min pour données temps réel (configurable par dataset/database).
- **Async** : requêtes async pour datasets > 1M lignes (activer "Asynchronous Query Execution" sur chaque base ; Celery + RESULTS_BACKEND Redis).

Import : créer les bases dans l’UI (Data > Connect Database), puis `superset import_datasources -p /app/pythonpath/datasources/postgres.yaml -r -u admin` (idem clickhouse, datasets/orders_dataset.yaml). Voir `superset/datasources/README.md` et `superset/datasets/README.md`.

## Datasources à configurer (résumé)

Dans Superset : **Data > Connect Database**.

1. **agrilogistic_oltp** (PostgreSQL métier) — URI ci-dessus ; tables : users, entities, products, orders, contracts, missions.
2. **agrilogistic_analytics** (ClickHouse) — URI ci-dessus ; tables : events, iot_telemetry, funnel_analysis.
3. **agrilogistic_federated** (Trino, optionnel) — requêtes fédérées.

## RLS (Row Level Security)

- **Agriculteur** : ne voit que ses données (filtre `farmer_id` / `user_id`).
- **Transporteur** : ne voit que ses missions (filtre `transporter_id`).
- **Admin** : voit tout (règle UNFILTERED).

À configurer dans Superset : **Settings > List RLS** (ou via API) pour chaque rôle et dataset.

## Déploiement

```bash
cd infrastructure
docker compose -f docker-compose.superset.yml up -d
```

## Validation

- **UI** : http://localhost:8088 (login **admin** / **admin** par défaut).
- **Flower** : http://localhost:5555 (monitoring Celery).
- **Test SQL** (une fois la datasource PostgreSQL métier connectée) :
  ```sql
  SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '7 days';
  ```
- Script de validation : `.\infrastructure\scripts\validate-superset.ps1`
