-- Notification Service schema (PostgreSQL)
-- Creates minimal tables required for full CRUD / history.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY,
  user_id UUID NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'push')),
  recipient TEXT NOT NULL,
  subject TEXT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('queued', 'sent', 'failed')),
  error TEXT NULL,
  sent_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_created_at ON notifications (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_status_created_at ON notifications (status, created_at DESC);

