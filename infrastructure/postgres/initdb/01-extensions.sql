-- =============================================================================
-- PostgreSQL - Extensions (Prompt 4.1 / 4.2)
-- =============================================================================
-- Exécuter en tant que superuser (postgres) au premier init ou manuellement.
-- Utilisé par docker-entrypoint ou scripts d'init.
-- =============================================================================

-- UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crypto (gen_random_uuid, etc.)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Statistiques requêtes (si pas chargé via shared_preload_libraries)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- PostGIS (géométries, GiST index)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Optionnel : pg_partman pour partitionnement automatique (à installer séparément)
-- CREATE EXTENSION IF NOT EXISTS pg_partman;
