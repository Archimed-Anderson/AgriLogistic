-- Analytics Events (sync ClickHouse) - Prisma migration
CREATE TABLE IF NOT EXISTS "analytics_events" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "event_type" VARCHAR(50) NOT NULL,
    "user_id" UUID,
    "session_id" VARCHAR(100),
    "properties" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sent_to_clickhouse" BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS "idx_analytics_event_type" ON "analytics_events"("event_type");
CREATE INDEX IF NOT EXISTS "idx_analytics_created_at" ON "analytics_events"("created_at");
CREATE INDEX IF NOT EXISTS "idx_analytics_sent" ON "analytics_events"("sent_to_clickhouse") WHERE "sent_to_clickhouse" = false;
CREATE INDEX IF NOT EXISTS "idx_analytics_properties_gin" ON "analytics_events" USING GIN ("properties" jsonb_path_ops);
