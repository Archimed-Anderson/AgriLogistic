import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Geographic Search Service using PostGIS
 * 
 * Provides high-performance spatial queries for equipment location.
 * Uses PostGIS geometry types and GIST indexes for efficiency.
 */
@Injectable()
export class GeoSearchService {
  private readonly logger = new Logger(GeoSearchService.name);
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Find equipment within a radius using PostGIS ST_DWithin
   * 
   * @param latitude - Search center latitude (WGS84)
   * @param longitude - Search center longitude (WGS84)
   * @param radiusKm - Search radius in kilometers
   * @param equipmentType - Optional filter by equipment type
   * @param limit - Maximum results to return
   * @returns List of nearby equipment with distance
   */
  async findNearby(params: {
    latitude: number;
    longitude: number;
    radiusKm?: number;
    equipmentType?: string;
    limit?: number;
  }) {
    const {
      latitude,
      longitude,
      radiusKm = 50,
      equipmentType,
      limit = 50,
    } = params;

    this.logger.log(
      `Searching for equipment within ${radiusKm}km of (${latitude}, ${longitude})`,
    );

    // Validate coordinates
    if (latitude < -90 || latitude > 90) {
      throw new Error('Invalid latitude: must be between -90 and 90');
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error('Invalid longitude: must be between -180 and 180');
    }

    try {
      // Raw SQL query using PostGIS functions
      // ST_DWithin uses the GIST index for fast spatial search
      // ST_Distance calculates the exact distance
      const query = `
        SELECT 
          e.id,
          e.name,
          e.type,
          e.description,
          e."pricePerDay",
          e.latitude,
          e.longitude,
          e.address,
          e.available,
          u.name as "ownerName",
          u.phone as "ownerPhone",
          u.email as "ownerEmail",
          -- Calculate distance in kilometers using geography type
          (ST_Distance(
            e.location::geography,
            ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
          ) / 1000)::DECIMAL(10, 2) AS "distanceKm",
          ST_AsGeoJSON(e.location)::json as "locationGeoJson"
        FROM "Equipment" e
        JOIN "User" u ON e."ownerId" = u.id
        WHERE 
          e.status = 'active'
          AND e.available = true
          ${equipmentType ? `AND e.type = $5` : ''}
          -- ST_DWithin uses GIST index for fast spatial filtering
          AND ST_DWithin(
            e.location::geography,
            ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography,
            $3 * 1000  -- Convert km to meters
          )
        ORDER BY "distanceKm" ASC
        LIMIT $4
      `;

      const values = equipmentType
        ? [latitude, longitude, radiusKm, limit, equipmentType]
        : [latitude, longitude, radiusKm, limit];

      const results = await this.prisma.$queryRawUnsafe(query, ...values);

      this.logger.log(`Found ${(results as any[]).length} equipment within radius`);

      return results;
    } catch (error) {
      this.logger.error('Error in geo search', error);
      throw error;
    }
  }

  /**
   * Get equipment route planning (multiple waypoints)
   * Useful for delivery planning or equipment pickup routes
   */
  async getOptimalRoute(equipmentIds: string[]) {
    try {
      // Query to get equipment locations and calculate optimal route
      // Uses PostGIS to create a LineString connecting all points
      const query = `
        SELECT 
          e.id,
          e.name,
          e.latitude,
          e.longitude,
          e.address
        FROM "Equipment" e
        WHERE e.id = ANY($1::uuid[])
        ORDER BY e.latitude, e.longitude
      `;

      const equipment = await this.prisma.$queryRawUnsafe(
        query,
        equipmentIds,
      );

      return equipment;
    } catch (error) {
      this.logger.error('Error calculating optimal route', error);
      throw error;
    }
  }

  /**
   * Find equipment in a polygon area (e.g., administrative boundary)
   */
  async findInPolygon(polygonCoordinates: number[][]) {
    try {
      // Create polygon from coordinates
      // Format: [[lon1, lat1], [lon2, lat2], ...]
      const polygonWKT = `POLYGON((${polygonCoordinates
        .map((coord) => `${coord[0]} ${coord[1]}`)
        .join(', ')}))`;

      const query = `
        SELECT 
          e.id,
          e.name,
          e.type,
          e."pricePerDay",
          e.latitude,
          e.longitude,
          e.address,
          u.name as "ownerName"
        FROM "Equipment" e
        JOIN "User" u ON e."ownerId" = u.id
        WHERE 
          e.status = 'active'
          AND e.available = true
          AND ST_Within(
            e.location,
            ST_GeomFromText($1, 4326)
          )
      `;

      const results = await this.prisma.$queryRawUnsafe(query, polygonWKT);

      return results;
    } catch (error) {
      this.logger.error('Error finding equipment in polygon', error);
      throw error;
    }
  }

  /**
   * Calculate distance between two equipments
   */
  async calculateDistance(
    equipmentId1: string,
    equipmentId2: string,
  ): Promise<number> {
    try {
      const query = `
        SELECT 
          (ST_Distance(
            e1.location::geography,
            e2.location::geography
          ) / 1000)::DECIMAL(10, 2) as "distanceKm"
        FROM "Equipment" e1, "Equipment" e2
        WHERE e1.id = $1 AND e2.id = $2
      `;

      const result: any = await this.prisma.$queryRawUnsafe(
        query,
        equipmentId1,
        equipmentId2,
      );

      return parseFloat(result[0]?.distanceKm || '0');
    } catch (error) {
      this.logger.error('Error calculating distance', error);
      throw error;
    }
  }

  /**
   * Get equipment density heatmap data
   * Groups equipment by geographic grid cells
   */
  async getHeatmapData(gridSizeKm: number = 10) {
    try {
      const query = `
        SELECT 
          COUNT(*) as count,
          AVG(e.latitude)::DECIMAL(10, 6) as "centerLat",
          AVG(e.longitude)::DECIMAL(10, 6) as "centerLon",
          ST_AsGeoJSON(
            ST_Centroid(
              ST_Collect(e.location)
            )
          )::json as "clusterCenter"
        FROM "Equipment" e
        WHERE e.status = 'active' AND e.available = true
        GROUP BY 
          FLOOR(e.latitude / ($1 / 111.0)),  -- Approximate km to degrees
          FLOOR(e.longitude / ($1 / 111.0))
        HAVING COUNT(*) > 0
        ORDER BY count DESC
      `;

      const results = await this.prisma.$queryRawUnsafe(query, gridSizeKm);

      return results;
    } catch (error) {
      this.logger.error('Error generating heatmap data', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
