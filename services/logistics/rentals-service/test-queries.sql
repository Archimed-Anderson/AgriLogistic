-- Test queries for validation

-- Count equipment
SELECT COUNT(*) as equipment_count FROM "Equipment";

-- List all equipment
SELECT
    id,
    name,
    type,
    latitude,
    longitude,
    available
FROM "Equipment"
ORDER BY name;

-- Test PostGIS function - Find equipment near Dakar
SELECT * FROM find_nearby_equipment (14.7167, -17.4677, 100);

-- Test distance calculation (Dakar to Thiès)
SELECT
    calculate_distance_km (
        14.7167,
        -17.4677,
        14.8000,
        -16.9700
    ) as distance_km;

-- Check PostGIS version
SELECT PostGIS_Version ();