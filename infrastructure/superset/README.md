# Monitoring Métier - Apache Superset (Cahier des charges)

Remplacement solution analytics propriétaire par **Apache Superset** (open source) pour le monitoring métier de la plateforme agricole.

## Contexte (cahier des charges)

Remplacement d’une solution analytics propriétaire par Apache Superset 100 % open source pour le monitoring métier de la plateforme agricole.

## Tâche

Déployer Apache Superset avec :

- **Authentification intégrée** (admin/admin par défaut ; SSO via Keycloak optionnel)
- **Connexion PostgreSQL** (données métier) et **ClickHouse** (analytics)
- **Dashboards prédéfinis** pour chaque rôle (Executive, Opérations Logistiques, Agriculteur)
- **Row Level Security (RLS)** par rôle utilisateur

## Stack technique

- **Superset 3.x** (dernière stable)
- **PostgreSQL** (metadata Superset, superset-db)
- **Redis** (cache requêtes + broker Celery)
- **Celery worker** (tâches async)
- **Celery beat** (planification)
- **Flower** (monitoring Celery, port 5555)

## Configuration requise (cahier des charges)

1. **Docker Compose complet** avec init automatique (db upgrade, admin, init, init.sh).
2. **Datasources configurées** :
   - **agrilogistic_prod** (PostgreSQL métier) — orders, products, parcels, payments, etc.
   - **analytics_warehouse** (ClickHouse) — events, missions, incidents, feedbacks.
   - **kafka_streams** (optionnel) — via ksqlDB ou JDBC.
3. **Row Level Security (RLS)** par rôle utilisateur (agriculteur, transporteur, admin).

## Fichiers à générer / existants

| Fichier | Rôle |
|---------|------|
| `docker-compose.superset.yml` | Stack complète (infrastructure/) avec init automatique |
| `superset/superset_config.py` | Configuration Python (DB, Redis, Celery, RLS, CORS, cache, async) |
| `superset/init.sh` | Post-migration (création admin, préparation datasources) |
| `superset/datasources/` | Connecteurs YAML : postgres.yaml, clickhouse.yaml, trino.yaml |
| `superset/datasets/` | Datasets optimisés (orders_dataset.yaml avec metrics/dimensions) |
| `superset/charts/` | Templates charts (revenue_chart.json) |
| `superset/dashboards/exports/` | Exports JSON des dashboards (à remplir après création dans l’UI) |
| `scripts/validate-superset.ps1` | Script de validation |

## Déploiement

```bash
# Depuis le répertoire infrastructure/ (pour que les volumes ./superset/ soient résolus)
cd infrastructure
docker compose -f docker-compose.superset.yml up -d
```

Ou depuis la racine du projet : `cd infrastructure && docker compose -f docker-compose.superset.yml up -d`

Variables d'environnement optionnelles : `SUPERSET_SECRET_KEY`, `SUPERSET_DB_PASSWORD`, `SUPERSET_ADMIN_PASSWORD` (défaut admin/admin).

## Connecteurs de données

- **PostgreSQL (OLTP)** : `postgresql+psycopg2://user:pass@postgres:5432/agrilogistic` — tables users (anonymisé), entities, products (snapshot hebdo), orders, contracts, missions (archivage > 90j vers ClickHouse). Limites row count par table. Cache 1h.
- **ClickHouse (OLAP)** : `clickhouse+native://user:pass@clickhouse:9000/analytics` — tables events, iot_telemetry, funnel_analysis. Cache 5min.
- **Trino (optionnel)** : requêtes fédérées cross-DB. Voir `superset/datasources/README.md`.

Import YAML : créer les bases dans l’UI (Data > Connect Database), puis `superset import_datasources -p /app/pythonpath/datasources/postgres.yaml -r -u admin` (idem clickhouse, datasets/orders_dataset.yaml).

**Datasets optimisés** : cache 1h pour données historiques (PostgreSQL), cache 5min pour temps réel (ClickHouse). Requêtes async pour datasets > 1M lignes (activer "Asynchronous Query Execution" sur chaque DB ; Celery + RESULTS_BACKEND Redis).

## Dashboards à créer (charts définis — cahier des charges)

### Dashboard "Executive - Vue Générale"

| Chart | Type | Source | Filtres |
|-------|------|--------|---------|
| GMV Temps Réel | Big Number + Trend | orders | date_range |
| Carte Transactions | Deck.GL Scatter | orders + parcels | product_type, date |
| Funnel Conversion | Funnel | events | cohort_date |
| Top Produits | Bar Chart | products | region, date |
| Satisfaction NPS | Gauge | feedbacks | — |

### Dashboard "Opérations Logistiques"

| Chart | Type | Source | Filtres |
|-------|------|--------|---------|
| Carte Flotte Temps Réel | Deck.GL Path | missions + iot | status, transporter |
| Performance Transport | Mixed Chart | missions | date_range |
| Taux Remplissage | Pie Chart | vehicles | type |
| Alertes Temps Réel | Table Log | incidents | severity |

### Dashboard "Agriculteur - Performance"

| Chart | Type | Source | Filtres |
|-------|------|--------|---------|
| Revenus Mensuels | Line Chart | payments | farmer_id, date |
| Rendement vs Prévision | Bar Chart | parcels + predictions | crop_type, season |
| Qualité Produits | Box Plot | quality_scores | product_category |

Voir `superset/dashboards/exports/README.md` pour le détail des charts et l’import des exports JSON.

## Sécurité — RLS (Row Level Security)

- **Agriculteur** : ne voit que ses données (filtre `farmer_id` / `user_id`).
- **Transporteur** : ne voit que ses missions (filtre `transporter_id`).
- **Admin** : voit tout (règle UNFILTERED).

À configurer dans Superset : **Settings > List RLS** (ou via API) pour chaque rôle et dataset.

## Validation (cahier des charges)

- **UI** : http://localhost:8088 (login **admin** / **admin** par défaut).
- **Flower** : http://localhost:5555 (monitoring Celery).
- **Test requête SQL** (une fois la datasource PostgreSQL métier connectée) :
  ```sql
  SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '7 days';
  ```
- **Script de validation** : `.\infrastructure\scripts\validate-superset.ps1`

Documentation détaillée : `infrastructure/docs/superset-monitoring-metier.md`.
