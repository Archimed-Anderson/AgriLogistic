-- Inventory Service schema (PostgreSQL)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS inventory_items (
  product_id UUID PRIMARY KEY,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_items_updated_at ON inventory_items (updated_at DESC);

-- Seed minimal data so list endpoints return something.
INSERT INTO inventory_items (product_id, stock, reserved, updated_at)
VALUES
  (gen_random_uuid(), 120, 0, NOW()),
  (gen_random_uuid(), 80, 0, NOW()),
  (gen_random_uuid(), 45, 0, NOW())
ON CONFLICT DO NOTHING;

