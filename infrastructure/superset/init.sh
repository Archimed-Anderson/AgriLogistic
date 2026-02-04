#!/bin/sh
# =============================================================================
# Apache Superset - Init post-migration (Cahier Monitoring Métier)
# =============================================================================
# Création admin (déjà fait par superset fab create-admin dans le command).
# Connecteurs : créer d'abord les bases dans l'UI (Data > Connect Database)
# avec les URI postgres/clickhouse, puis importer tables/datasets depuis YAML :
#   superset import_datasources -p /app/pythonpath/datasources/postgres.yaml -r -u admin
#   superset import_datasources -p /app/pythonpath/datasources/clickhouse.yaml -r -u admin
#   superset import_datasources -p /app/pythonpath/datasets/orders_dataset.yaml -r -u admin
# Optionnel : import dashboards JSON depuis superset/dashboards/exports/
# =============================================================================
set -e
echo "[init.sh] Superset init post-migration"
# Les URIs dans les YAML utilisent ${VAR} : non développées à l'import.
# Créer les DB dans l'UI puis lancer les imports ci-dessus manuellement ou via CI.
echo "[init.sh] Done"
