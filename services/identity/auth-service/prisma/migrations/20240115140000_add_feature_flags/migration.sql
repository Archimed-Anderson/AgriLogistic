-- Feature Flags - Prisma migration
CREATE TABLE IF NOT EXISTS "feature_flags" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "key" VARCHAR(50) UNIQUE NOT NULL,
    "description" TEXT,
    "enabled" BOOLEAN DEFAULT false,
    "rules" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "idx_feature_flags_key" ON "feature_flags"("key");
CREATE INDEX IF NOT EXISTS "idx_feature_flags_enabled" ON "feature_flags"("enabled") WHERE "enabled" = true;

INSERT INTO "feature_flags" ("key", "description", "enabled") VALUES
    ('new_dashboard_ui', 'Nouvelle interface dashboard', false),
    ('ai_price_prediction', 'Prédiction prix IA', true),
    ('advanced_routing', 'Routage avancé VRP', false)
ON CONFLICT ("key") DO NOTHING;
