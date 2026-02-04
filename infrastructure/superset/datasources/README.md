# Connecteurs de données Superset - AgriLogistic

## Vue d'ensemble

| Connecteur | URI | Rôle | Cache |
|------------|-----|------|--------|
| **PostgreSQL** | `postgresql+psycopg2://user:pass@postgres:5432/agrilogistic` | OLTP métier | 1h |
| **ClickHouse** | `clickhouse+native://user:pass@clickhouse:9000/analytics` | OLAP temps réel | 5min |
| **Trino** (optionnel) | `trino://user:pass@trino:8080/analytics` | Requêtes fédérées | défaut |

## Fichiers

- `postgres.yaml` — Base agrilogistic (users, entities, products, orders, contracts, missions) avec limites row count.
- `clickhouse.yaml` — Base analytics (events, iot_telemetry, funnel_analysis).
- `trino.yaml` — Requêtes cross-DB (optionnel, dépend du déploiement Trino).

## Variables d'environnement

Substituer avant import ou configurer dans l’UI Superset :

- **PostgreSQL** : `POSTGRES_USER`, `POSTGRES_PASSWORD` (host `postgres`, db `agrilogistic`).
- **ClickHouse** : `CLICKHOUSE_USER`, `CLICKHOUSE_PASSWORD` (host `clickhouse`, db `analytics`).
- **Trino** : `TRINO_USER`, `TRINO_PASSWORD` (host `trino`).

## Import

Depuis le conteneur Superset (ou après montage des volumes) :

```bash
# Depuis infrastructure/
docker compose -f docker-compose.superset.yml exec superset superset import_datasources -p /app/pythonpath/datasources -r -u admin
```

Si les YAML sont montés sous `./superset/` :

```bash
docker compose -f docker-compose.superset.yml exec superset superset import_datasources -p /app/pythonpath/datasources/postgres.yaml -r -u admin
docker compose -f docker-compose.superset.yml exec superset superset import_datasources -p /app/pythonpath/datasources/clickhouse.yaml -r -u admin
```

**Note** : Les URIs avec `${VAR}` ne sont pas développées par Superset à l’import. Créer les bases dans l’UI (Data > Connect Database) puis importer les YAML pour tables/colonnes/métriques, ou remplacer les variables dans les fichiers avant import.

## Datasets optimisés

- **Cache 1h** : données historiques (PostgreSQL OLTP).
- **Cache 5min** : données temps réel (ClickHouse events, iot_telemetry).
- **Async** : activer "Asynchronous Query Execution" sur chaque base (Data > Databases > Edit) pour les datasets > 1M lignes ; nécessite Celery + RESULTS_BACKEND (Redis).

Voir `superset_config.py` : `DATA_CACHE_CONFIG`, `RESULTS_BACKEND`, `GLOBAL_ASYNC_QUERIES`.
