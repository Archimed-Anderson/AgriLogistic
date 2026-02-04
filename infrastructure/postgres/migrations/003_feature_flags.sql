-- =============================================================================
-- Feature Flags (Prompt 4.2)
-- =============================================================================

CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(50) UNIQUE NOT NULL,
  description TEXT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  rules JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags (key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags (enabled) WHERE enabled = TRUE;

-- Seed (Prompt 4.2)
INSERT INTO feature_flags (key, description, enabled) VALUES
  ('new_dashboard_ui', 'Nouvelle interface dashboard', FALSE),
  ('ai_price_prediction', 'Prédiction prix IA', TRUE),
  ('advanced_routing', 'Routage avancé VRP', FALSE)
ON CONFLICT (key) DO NOTHING;
