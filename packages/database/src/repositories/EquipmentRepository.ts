import { Equipment, PrismaClient } from '../generated/client';
import { BaseRepository } from './BaseRepository';

export class EquipmentRepository extends BaseRepository<
  Equipment,
  any,
  any
> {
  constructor(prisma: PrismaClient) {
    super(prisma, (prisma as any).equipment);
  }

  /**
   * Find equipment nearby using PostGIS ST_DWithin
   */
  async findNearby(lat: number, lon: number, radiusMeters: number = 50000) {
    return this.prisma.$queryRaw`
      SELECT * FROM equipment
      WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326),
        ${radiusMeters}
      )
      AND available = true
      ORDER BY ST_Distance(location, ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326)) ASC
    `;
  }

  async getHeatmapData() {
    return this.prisma.equipment.findMany({
      where: { available: true },
      select: {
        latitude: true,
        longitude: true,
        type: true
      }
    });
  }
}
