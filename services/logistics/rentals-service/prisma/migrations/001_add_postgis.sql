-- Migration: Add PostGIS Extension and Create Spatial Schema
-- This migration sets up PostGIS for geographic queries

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create Equipment table with PostGIS geometry
CREATE TABLE IF NOT EXISTS "Equipment" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    description TEXT,
    "pricePerDay" DECIMAL(10, 2) NOT NULL,

-- PostGIS geometry column (Point with SRID 4326 - WGS84)
location geometry (Point, 4326) NOT NULL,

-- Denormalized coordinates for fallback queries

latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    
    address TEXT,
    
    "ownerId" UUID NOT NULL,
    available BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'active',
    
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

-- Create GIST spatial index for fast geographic queries
-- This index enables efficient ST_DWithin and other spatial operations
CREATE INDEX IF NOT EXISTS idx_equipment_location_gist ON "Equipment" USING GIST (location);

-- Create additional indexes
CREATE INDEX IF NOT EXISTS idx_equipment_owner ON "Equipment" ("ownerId");

CREATE INDEX IF NOT EXISTS idx_equipment_status ON "Equipment" (status);

CREATE INDEX IF NOT EXISTS idx_equipment_available ON "Equipment" (available);

CREATE INDEX IF NOT EXISTS idx_equipment_type ON "Equipment"(type);

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Create Booking table
CREATE TABLE IF NOT EXISTS "Booking" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    "equipmentId" UUID NOT NULL REFERENCES "Equipment" (id) ON DELETE CASCADE,
    "renterId" UUID NOT NULL REFERENCES "User" (id) ON DELETE CASCADE,
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP NOT NULL,
    "totalPrice" DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    "paidAt" TIMESTAMP,
    "paymentId" VARCHAR(255),
    "escrowTxHash" VARCHAR(255),
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK ("endDate" > "startDate")
);

-- Create indexes on Booking table
CREATE INDEX IF NOT EXISTS idx_booking_equipment ON "Booking" ("equipmentId");

CREATE INDEX IF NOT EXISTS idx_booking_renter ON "Booking" ("renterId");

CREATE INDEX IF NOT EXISTS idx_booking_status ON "Booking" (status);

CREATE INDEX IF NOT EXISTS idx_booking_dates ON "Booking" ("startDate", "endDate");

-- Function to automatically update location geometry from lat/lon
CREATE OR REPLACE FUNCTION update_equipment_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to keep location in sync with lat/lon
CREATE TRIGGER trigger_update_equipment_location
BEFORE INSERT OR UPDATE OF latitude, longitude ON "Equipment"
FOR EACH ROW
EXECUTE FUNCTION update_equipment_location();

-- Function to calculate distance between two points (in kilometers)
CREATE OR REPLACE FUNCTION calculate_distance_km(
    lat1 DECIMAL,
    lon1 DECIMAL,
    lat2 DECIMAL,
    lon2 DECIMAL
) RETURNS DECIMAL AS $$
BEGIN
    RETURN ST_Distance(
        ST_SetSRID(ST_MakePoint(lon1, lat1), 4326)::geography,
        ST_SetSRID(ST_MakePoint(lon2, lat2), 4326)::geography
    ) / 1000; -- Convert meters to kilometers
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to find nearby equipment (returns table)
CREATE OR REPLACE FUNCTION find_nearby_equipment(
    search_lat DECIMAL,
    search_lon DECIMAL,
    radius_km DECIMAL DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    type VARCHAR,
    "pricePerDay" DECIMAL,
    latitude DECIMAL,
    longitude DECIMAL,
    distance_km DECIMAL,
    available BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id,
        e.name,
        e.type,
        e."pricePerDay",
        e.latitude,
        e.longitude,
        (ST_Distance(
            e.location::geography,
            ST_SetSRID(ST_MakePoint(search_lon, search_lat), 4326)::geography
        ) / 1000)::DECIMAL AS distance_km,
        e.available
    FROM "Equipment" e
    WHERE 
        e.status = 'active'
        AND ST_DWithin(
            e.location::geography,
            ST_SetSRID(ST_MakePoint(search_lon, search_lat), 4326)::geography,
            radius_km * 1000 -- Convert km to meters
        )
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Seed some sample data for testing
INSERT INTO
    "User" (id, email, name, phone)
VALUES (
        '00000000-0000-0000-0000-000000000001',
        'owner1@example.com',
        'Jean Dupont',
        '+221771234567'
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'owner2@example.com',
        'Fatou Sall',
        '+221772345678'
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'renter1@example.com',
        'Mamadou Diop',
        '+221773456789'
    ) ON CONFLICT (email) DO NOTHING;

-- Seed equipment in Senegal (around Dakar and other regions)
INSERT INTO
    "Equipment" (
        id,
        name,
        type,
        description,
        "pricePerDay",
        latitude,
        longitude,
        "ownerId",
        address
    )
VALUES (
        '00000000-0000-0000-0001-000000000001',
        'Tracteur John Deere 5075E',
        'tractor',
        'Tracteur 75CV, parfait pour labour et semis',
        50000,
        14.7167, -- Dakar latitude
        -17.4677, -- Dakar longitude
        '00000000-0000-0000-0000-000000000001',
        'Pikine, Dakar'
    ),
    (
        '00000000-0000-0000-0001-000000000002',
        'Moissonneuse-batteuse CLAAS',
        'harvester',
        'Moissonneuse pour céréales, capacité 8 tonnes/h',
        120000,
        14.8000,
        -16.9700,
        '00000000-0000-0000-0000-000000000001',
        'Thiès'
    ),
    (
        '00000000-0000-0000-0001-000000000003',
        'Semoir de précision',
        'seeder',
        'Semoir 6 rangs, GPS intégré',
        30000,
        14.6928,
        -17.4467,
        '00000000-0000-0000-0000-000000000002',
        'Rufisque, Dakar'
    ),
    (
        '00000000-0000-0000-0001-000000000004',
        'Tracteur Massey Ferguson 5710',
        'tractor',
        'Tracteur 100CV, climatisé, 4x4',
        80000,
        15.9500,
        -15.9167,
        '00000000-0000-0000-0000-000000000002',
        'Saint-Louis'
    ) ON CONFLICT (id) DO NOTHING;

-- Create view for available equipment with location
CREATE OR REPLACE VIEW available_equipment_with_location AS
SELECT 
    e.id,
    e.name,
    e.type,
    e.description,
    e."pricePerDay",
    e.latitude,
    e.longitude,
    e.address,
    u.name as owner_name,
    u.phone as owner_phone,
    ST_AsGeoJSON(e.location)::json as location_geojson
FROM "Equipment" e
JOIN "User" u ON e."ownerId" = u.id
WHERE e.available = true AND e.status = 'active';

COMMENT ON EXTENSION postgis IS 'PostGIS extension for geographic data types and spatial queries';

COMMENT ON INDEX idx_equipment_location_gist IS 'GIST spatial index for efficient geographic queries (ST_DWithin, ST_Distance, etc.)';

COMMENT ON FUNCTION find_nearby_equipment IS 'Find all equipment within a specified radius from a given location';

COMMENT ON FUNCTION calculate_distance_km IS 'Calculate great-circle distance between two lat/lon points in kilometers';