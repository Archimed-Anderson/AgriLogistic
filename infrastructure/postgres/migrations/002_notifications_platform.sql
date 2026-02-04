-- =============================================================================
-- Notifications (Prompt 4.2 - schéma plateforme)
-- =============================================================================
-- À utiliser si un schéma unifié est préféré au notification-service existant.
-- Sinon, adapter dans services/communication/notification-service/migrations.
-- =============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('push', 'email', 'sms', 'whatsapp')),
  title VARCHAR(200) NULL,
  content TEXT NULL,
  data JSONB NULL,
  read_at TIMESTAMP NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP NULL,
  failed_at TIMESTAMP NULL,
  error_message TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications (user_id, read_at)
  WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_sent_at ON notifications (sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications (type);
