-- War Room - Incidents Schema
-- Table incidents dans AgriLogistic_orders (réutilise DB existante)

CREATE TABLE IF NOT EXISTS incidents (
  id VARCHAR(36) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  location_lat FLOAT NOT NULL,
  location_lng FLOAT NOT NULL,
  region VARCHAR(100) NOT NULL,
  severity SMALLINT NOT NULL DEFAULT 50,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_type ON incidents(type);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_created ON incidents(created_at DESC);
