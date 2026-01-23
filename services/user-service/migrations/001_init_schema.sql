-- User Service schema (PostgreSQL)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at DESC);

-- Seed minimal users for list endpoints.
INSERT INTO users (id, email, username, full_name, role, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'admin@agrologistic.local', 'admin', 'Admin User', 'admin', NOW(), NOW()),
  (gen_random_uuid(), 'demo@agrologistic.local', 'demo', 'Demo User', 'user', NOW(), NOW())
ON CONFLICT DO NOTHING;

