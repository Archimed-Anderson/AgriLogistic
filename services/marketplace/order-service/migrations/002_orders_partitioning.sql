-- =============================================================================
-- Order Service - Partitionnement orders par mois (Prompt 4.1)
-- =============================================================================
-- Prérequis : 001_create_orders_schema.sql déjà appliqué.
-- Option A : Nouvelle installation (table partitionnée dès le départ)
-- Option B : Table existante → ajout index BRIN/GIN puis migration manuelle
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) Indexation stratégique (sans changer la table)
-- BRIN sur created_at (grandes tables temporelles, faible coût)
-- GIN sur JSONB (metadata flexibles : shipping_address)
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_orders_created_at_brin
  ON orders USING BRIN (created_at)
  WITH (pages_per_range = 32);

CREATE INDEX IF NOT EXISTS idx_orders_shipping_address_gin
  ON orders USING GIN (shipping_address jsonb_path_ops);

-- Optionnel : GiST sur géométries si colonne geometry ajoutée (PostGIS)
-- CREATE INDEX IF NOT EXISTS idx_orders_geometry_gist ON orders USING GIST (delivery_geometry);

-- -----------------------------------------------------------------------------
-- 2) Fonction : créer une partition mensuelle (pour cron / pg_partman)
-- Usage : SELECT create_orders_partition_for_month('2025-03-01');
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION create_orders_partition_for_month(month_date DATE)
RETURNS TEXT AS $$
DECLARE
  part_name TEXT;
  start_ts   TIMESTAMP;
  end_ts     TIMESTAMP;
  sql_exec   TEXT;
BEGIN
  part_name := 'orders_' || to_char(month_date, 'YYYY_MM');
  start_ts   := date_trunc('month', month_date)::TIMESTAMP;
  end_ts     := start_ts + INTERVAL '1 month';

  sql_exec := format(
    'CREATE TABLE IF NOT EXISTS %I PARTITION OF orders FOR VALUES FROM (%L) TO (%L)',
    part_name, start_ts, end_ts
  );
  EXECUTE sql_exec;
  RETURN part_name;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 3) Migration vers table partitionnée (à exécuter en fenêtre maintenance)
-- Étapes : créer table parent partitionnée, créer partitions, copier données,
-- recréer FKs, renommer. Décommenter et adapter si besoin.
-- -----------------------------------------------------------------------------
/*
-- 3a) Créer table parent partitionnée (structure identique à orders)
CREATE TABLE orders_new (
  id UUID NOT NULL,
  user_id UUID NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  total_amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  shipping_address JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  PRIMARY KEY (id, created_at),
  CONSTRAINT valid_status_new CHECK (status IN (
    'pending', 'confirmed', 'processing', 'shipped',
    'delivered', 'cancelled', 'refunded', 'payment_failed'
  ))
) PARTITION BY RANGE (created_at);

-- 3b) Créer partitions (exemple : 2024-01 à 2025-12)
SELECT create_orders_partition_for_month(d) FROM generate_series('2024-01-01'::date, '2025-12-01'::date, '1 month'::interval) d;

-- 3c) Copier les données
INSERT INTO orders_new SELECT id, user_id, status, total_amount, payment_method, shipping_address, notes, created_at, updated_at, deleted_at FROM orders;

-- 3d) Supprimer ancienne table et renommer (après avoir recréé les FK sur orders_new si nécessaire)
-- ALTER TABLE order_items DROP CONSTRAINT ... ; ALTER TABLE order_status_history DROP CONSTRAINT ... ;
-- DROP TABLE orders; ALTER TABLE orders_new RENAME TO orders;
-- Recréer les FK : order_items.order_id -> orders(id), order_status_history.order_id -> orders(id)
*/
