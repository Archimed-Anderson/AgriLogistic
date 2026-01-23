-- Delivery/Logistics Service schema (PostgreSQL)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  driver_id UUID NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  pickup_address JSONB NOT NULL,
  delivery_address JSONB NOT NULL,
  scheduled_at TIMESTAMPTZ NULL,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deliveries_order_id ON deliveries (order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_driver_id ON deliveries (driver_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status_created_at ON deliveries (status, created_at DESC);

CREATE TABLE IF NOT EXISTS delivery_status_history (
  id UUID PRIMARY KEY,
  delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_status_history_delivery_id ON delivery_status_history (delivery_id, created_at DESC);

CREATE TABLE IF NOT EXISTS delivery_locations (
  id UUID PRIMARY KEY,
  delivery_id UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  driver_id UUID NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION NULL,
  speed DOUBLE PRECISION NULL,
  heading DOUBLE PRECISION NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_delivery_locations_delivery_id ON delivery_locations (delivery_id, created_at DESC);

