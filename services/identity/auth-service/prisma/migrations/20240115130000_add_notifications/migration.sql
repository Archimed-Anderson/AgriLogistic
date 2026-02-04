-- Notifications (schéma plateforme) - Prisma migration
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "type" VARCHAR(20) NOT NULL CHECK ("type" IN ('push', 'email', 'sms', 'whatsapp')),
    "title" VARCHAR(200),
    "content" TEXT,
    "data" JSONB,
    "read_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3),
    "failed_at" TIMESTAMP(3),
    "error_message" TEXT
);

CREATE INDEX IF NOT EXISTS "idx_notifications_user_unread" ON "notifications"("user_id", "read_at") WHERE "read_at" IS NULL;
CREATE INDEX IF NOT EXISTS "idx_notifications_sent_at" ON "notifications"("sent_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_notifications_type" ON "notifications"("type");
