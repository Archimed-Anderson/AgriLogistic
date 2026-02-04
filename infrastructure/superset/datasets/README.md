# Datasets Superset - AgriLogistic

## Fichiers

- **orders_dataset.yaml** — Dataset `orders` (agrilogistic_oltp) avec dimensions et métriques :
  - Colonnes : id, created_at, updated_at, status, total, user_id, entity_id
  - Métriques : total_revenue (SUM(total)), avg_order_value (AVG(total)), order_count (COUNT(*)), distinct_customers (COUNT(DISTINCT user_id))

## Import

Après avoir créé la base **agrilogistic_oltp** dans Superset (Data > Connect Database) et importé les tables depuis `datasources/postgres.yaml` :

```bash
docker compose -f docker-compose.superset.yml exec superset superset import_datasources -p /app/pythonpath/datasets/orders_dataset.yaml -r -u admin
```

Ou importer depuis l’UI : Settings > Import datasources (YAML).

## Cache

- Par défaut, le cache des données de chart est défini dans `superset_config.py` (DATA_CACHE_CONFIG, 1h pour historique).
- Pour un dataset temps réel, définir `cache_timeout: 300` dans l’extra du dataset ou de la base (5min).
