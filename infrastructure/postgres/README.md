# PostgreSQL - Production (Cahiers 4.1 / 4.2)

Configuration, partitionnement, indexation, réplication et maintenance pour AgriLogistic.

## Fichiers

| Fichier | Rôle |
|---------|------|
| `postgresql-production.conf` | Tuning production (16 GB RAM, OLTP+OLAP) |
| `pg_hba.conf.example` | Exemple contrôle d'accès (réplication, apps) |
| `initdb/01-extensions.sql` | Extensions (uuid-ossp, pgcrypto, postgis, pg_stat_statements) |
| `migrations/001_analytics_events.sql` | Table analytics_events (sync ClickHouse) |
| `migrations/002_notifications_platform.sql` | Table notifications (schéma plateforme) |
| `migrations/003_feature_flags.sql` | Table feature_flags + seed |
| `migrations/004_audit_logs.sql` | Table audit_logs partitionnée par mois |
| `../scripts/maintenance/vacuum.sh` | VACUUM ANALYZE hebdo + REINDEX mensuel |
| `../scripts/backup/s3-backup.sh` | pg_dump quotidien vers S3/MinIO |

## Partitionnement

### Orders (par mois)

- **Indexation** : BRIN sur `created_at`, GIN sur `shipping_address` (JSONB). Voir `services/marketplace/order-service/migrations/002_orders_partitioning.sql`.
- **Fonction** : `create_orders_partition_for_month('YYYY-MM-01')` pour créer une partition mensuelle.
- **Cron** (exemple) : le 1er de chaque mois à 1h :
  ```bash
  0 1 1 * * psql -h localhost -U postgres -d agrodeep_orders -c "SELECT create_orders_partition_for_month(date_trunc('month', CURRENT_DATE + interval '1 month')::date);"
  ```
- **pg_partman** (optionnel) : extension pour création automatique de partitions ; installer puis configurer les tables gérées.

### Audit logs (par mois)

- Table `audit_logs` créée en `PARTITION BY RANGE (changed_at)` avec partition DEFAULT.
- Créer des partitions mensuelles : `SELECT create_audit_logs_partition_for_month('2025-03-01');`
- Même principe cron que pour orders.

## Indexation stratégique

| Type | Usage | Exemple |
|------|--------|--------|
| **BRIN** | Grandes tables temporelles (`created_at`) | `CREATE INDEX ... ON orders USING BRIN (created_at);` |
| **GIN** | Colonnes JSONB (metadata, properties) | `CREATE INDEX ... ON analytics_events USING GIN (properties jsonb_path_ops);` |
| **GiST** | Géométries PostGIS | `CREATE INDEX ... ON parcels USING GIST (geometry);` |

## Réplication (Streaming Replication)

- **Topologie** : 1 primaire, 2 réplicas.
  - Réplica 1 : lecture (load balancing).
  - Réplica 2 : backups (pg_dump) et requêtes analytics.
- **Configuration** (primaire) : dans `postgresql-production.conf` déjà : `wal_level = replica`, `max_wal_senders = 3`, `wal_keep_size = 1GB`, `hot_standby = on`.
- **Slots** (recommandé) : sur le primaire,
  ```sql
  SELECT * FROM pg_create_physical_replication_slot('replica1_slot');
  SELECT * FROM pg_create_physical_replication_slot('replica2_slot');
  ```
- **Vérification lag** : `SELECT * FROM pg_stat_replication;` (colonnes `replay_lag`, `state`).
- **Failover** : manuel ou outil type **Patroni** pour bascule automatique.
- **Accès** : utilisateur dédié avec droit de réplication ; exemple dans `pg_hba.conf.example` (`host replication replicator ...`).

## Maintenance automatisée

| Tâche | Fréquence | Script / Commande |
|-------|-----------|-------------------|
| VACUUM ANALYZE | Hebdomadaire (ex. dimanche 3h) | `infrastructure/scripts/maintenance/vacuum.sh` |
| REINDEX | Mensuel (ex. 1er à 4h) | `infrastructure/scripts/maintenance/vacuum.sh --reindex` |
| pg_dump vers S3 | Quotidien (ex. 2h) | `infrastructure/scripts/backup/s3-backup.sh` |

### Variables (vacuum.sh)

- `PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`.

### Variables (s3-backup.sh)

- `PGHOST`, `PGPORT`, `PGUSER`, `PGDATABASE`, `PGPASSWORD`
- `S3_BUCKET` (défaut : agrilogistic-backups), `S3_ENDPOINT` (MinIO : http://minio:9000), `S3_PREFIX` (ex. postgres)
- `RETENTION_DAYS` (défaut : 30) pour nettoyage des anciens dumps sur S3.

## Migrations complémentaires (4.2)

Exécuter dans l’ordre sur la base cible (agrilogistic ou schéma dédié) :

```bash
psql -h localhost -U postgres -d agrilogistic -f infrastructure/postgres/initdb/01-extensions.sql
psql -h localhost -U postgres -d agrilogistic -f infrastructure/postgres/migrations/001_analytics_events.sql
psql -h localhost -U postgres -d agrilogistic -f infrastructure/postgres/migrations/002_notifications_platform.sql
psql -h localhost -U postgres -d agrilogistic -f infrastructure/postgres/migrations/003_feature_flags.sql
psql -h localhost -U postgres -d agrilogistic -f infrastructure/postgres/migrations/004_audit_logs.sql
```

Les schémas **notification-service** et **orders** ont leurs propres migrations dans `services/communication/notification-service/migrations/` et `services/marketplace/order-service/migrations/` (dont 002_orders_partitioning.sql).
