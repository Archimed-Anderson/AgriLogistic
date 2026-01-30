-- AI Service schema (PostgreSQL)
-- Minimal tables required by RecommendationService and ForecastService.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  image_url TEXT NULL,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_active_rating ON products (is_active, rating DESC);

CREATE TABLE IF NOT EXISTS user_product_interactions (
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_product_interactions_user ON user_product_interactions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_product_interactions_product ON user_product_interactions (product_id, created_at DESC);

-- Minimal order tables for demand forecasting queries.
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status_created_at ON orders (status, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items (product_id, created_at DESC);

-- Minimal price history table for price forecasting.
CREATE TABLE IF NOT EXISTS product_price_history (
  id UUID PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_price_history_product ON product_price_history (product_id, created_at DESC);

-- Seed a few products so recommendation endpoints return data.
INSERT INTO products (id, name, category, price, image_url, rating, tags, is_active, created_at)
VALUES
  (gen_random_uuid(), 'Maïs grain', 'Fourrage', 195.00, 'https://via.placeholder.com/400', 4.20, ARRAY['fourrage','maïs'], TRUE, NOW()),
  (gen_random_uuid(), 'Blé tendre', 'Céréales', 230.00, 'https://via.placeholder.com/400', 4.10, ARRAY['céréales','blé'], TRUE, NOW()),
  (gen_random_uuid(), 'Pomme de terre', 'Légumes', 150.00, 'https://via.placeholder.com/400', 4.30, ARRAY['légumes','pdt'], TRUE, NOW())
ON CONFLICT DO NOTHING;

