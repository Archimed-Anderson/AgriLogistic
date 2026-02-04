-- Productions & Telemetry Schema
-- Compatible with PostgreSQL. Add TimescaleDB extension for hypertables:
--   CREATE EXTENSION IF NOT EXISTS timescaledb;
--   SELECT create_hypertable('production_telemetry', 'time');

CREATE TABLE IF NOT EXISTS productions (
  id VARCHAR(64) PRIMARY KEY,
  parcel_id VARCHAR(64) NOT NULL,
  parcel_name VARCHAR(255) NOT NULL,
  farmer_name VARCHAR(255) NOT NULL,
  crop_type VARCHAR(64) NOT NULL,
  region VARCHAR(128) NOT NULL,
  stage VARCHAR(32) NOT NULL CHECK (stage IN ('Semis','Croissance','Floraison','Maturité','Récolte')),
  start_date TIMESTAMPTZ NOT NULL,
  expected_harvest_date TIMESTAMPTZ NOT NULL,
  health_score INT DEFAULT 0,
  moisture_level INT DEFAULT 0,
  quality_prediction CHAR(1) DEFAULT 'B',
  estimated_tonnage DECIMAL(10,2),
  location_lat DECIMAL(10,6) DEFAULT 6.82,
  location_lng DECIMAL(10,6) DEFAULT -5.25,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO productions (id, parcel_id, parcel_name, farmer_name, crop_type, region, stage, start_date, expected_harvest_date, health_score, moisture_level, quality_prediction, estimated_tonnage, location_lat, location_lng)
SELECT 'PROD-7721','PARCEL-001','Champ Nord Yamoussoukro','Koffi Amani','Maïs','Yamoussoukro','Maturité','2024-01-10 08:00:00+00','2024-04-15 00:00:00+00',88,42,'A',15,6.82,-5.25
WHERE NOT EXISTS (SELECT 1 FROM productions WHERE id = 'PROD-7721');
INSERT INTO productions (id, parcel_id, parcel_name, farmer_name, crop_type, region, stage, start_date, expected_harvest_date, health_score, moisture_level, quality_prediction, estimated_tonnage, location_lat, location_lng)
SELECT 'PROD-8842','PARCEL-002','Vignoble de Bouaké','Marie Konan','Café','Bouaké','Floraison','2023-11-20 08:00:00+00','2024-06-20 00:00:00+00',62,15,'B',3,6.85,-5.30
WHERE NOT EXISTS (SELECT 1 FROM productions WHERE id = 'PROD-8842');
INSERT INTO productions (id, parcel_id, parcel_name, farmer_name, crop_type, region, stage, start_date, expected_harvest_date, health_score, moisture_level, quality_prediction, estimated_tonnage, location_lat, location_lng)
SELECT 'PROD-9912','PARCEL-003','Plantation Cacao Abengourou','Jean Kouassi','Cacao','Abengourou','Récolte','2023-09-01 08:00:00+00','2024-04-01 00:00:00+00',95,55,'A',8,6.79,-3.50
WHERE NOT EXISTS (SELECT 1 FROM productions WHERE id = 'PROD-9912');

CREATE TABLE IF NOT EXISTS production_telemetry (
  id SERIAL,
  production_id VARCHAR(64) NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
  time TIMESTAMPTZ NOT NULL,
  temp DECIMAL(5,2) NOT NULL,
  humidity DECIMAL(5,2) NOT NULL,
  light DECIMAL(8,2) NOT NULL,
  PRIMARY KEY (id, time)
);

CREATE INDEX IF NOT EXISTS idx_telemetry_production_time ON production_telemetry(production_id, time DESC);

CREATE TABLE IF NOT EXISTS production_alerts (
  id SERIAL PRIMARY KEY,
  production_id VARCHAR(64) NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
  type VARCHAR(32) NOT NULL,
  severity VARCHAR(16) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS irrigation_events (
  id SERIAL PRIMARY KEY,
  production_id VARCHAR(64) NOT NULL,
  valve_id VARCHAR(64) NOT NULL,
  action VARCHAR(16) NOT NULL CHECK (action IN ('activate','deactivate')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
