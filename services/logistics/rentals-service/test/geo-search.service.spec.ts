import { Test, TestingModule } from '@nestjs/testing';
import { GeoSearchService } from '../src/services/geo-search.service';

describe('GeoSearchService', () => {
  let service: GeoSearchService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeoSearchService],
    }).compile();

    service = module.get<GeoSearchService>(GeoSearchService);
  });

  afterAll(async () => {
    await service.onModuleDestroy();
  });

  describe('findNearby', () => {
    it('should find equipment near Dakar', async () => {
      const results = await service.findNearby({
        latitude: 14.7167,
        longitude: -17.4677,
        radiusKm: 50,
      });

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
      
      if ((results as any[]).length > 0) {
        const firstResult = (results as any[])[0];
        expect(firstResult).toHaveProperty('id');
        expect(firstResult).toHaveProperty('name');
        expect(firstResult).toHaveProperty('distanceKm');
        expect(parseFloat(firstResult.distanceKm)).toBeLessThanOrEqual(50);
      }
    });

    it('should filter by equipment type', async () => {
      const results = await service.findNearby({
        latitude: 14.7167,
        longitude: -17.4677,
        radiusKm: 100,
        equipmentType: 'tractor',
      });

      expect(results).toBeDefined();
      
      if ((results as any[]).length > 0) {
        (results as any[]).forEach((equipment) => {
          expect(equipment.type).toBe('tractor');
        });
      }
    });

    it('should validate coordinates', async () => {
      await expect(
        service.findNearby({
          latitude: 100, // Invalid
          longitude: -17.4677,
          radiusKm: 50,
        }),
      ).rejects.toThrow('Invalid latitude');

      await expect(
        service.findNearby({
          latitude: 14.7167,
          longitude: 200, // Invalid
          radiusKm: 50,
        }),
      ).rejects.toThrow('Invalid longitude');
    });

    it('should return results sorted by distance', async () => {
      const results = await service.findNearby({
        latitude: 14.7167,
        longitude: -17.4677,
        radiusKm: 200,
      });

      if ((results as any[]).length > 1) {
        for (let i = 0; i < (results as any[]).length - 1; i++) {
          const current = parseFloat((results as any[])[i].distanceKm);
          const next = parseFloat((results as any[])[i + 1].distanceKm);
          expect(current).toBeLessThanOrEqual(next);
        }
      }
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between Dakar and Thiès', async () => {
      // Note: This test requires actual equipment IDs from the database
      // For now, it tests the distance calculation logic
      
      // Mock equipment IDs (replace with actual IDs from your database)
      const dakarsEquipmentId = '00000000-0000-0000-0001-000000000001';
      const thiesEquipmentId = '00000000-0000-0000-0001-000000000002';

      const distance = await service.calculateDistance(
        dakarsEquipmentId,
        thiesEquipmentId,
      );

      expect(distance).toBeGreaterThan(0);
      // Dakar to Thiès is approximately 70-75 km
      expect(distance).toBeGreaterThan(50);
      expect(distance).toBeLessThan(100);
    });
  });

  describe('getHeatmapData', () => {
    it('should generate heatmap data', async () => {
      const heatmapData = await service.getHeatmapData(10);

      expect(heatmapData).toBeDefined();
      expect(Array.isArray(heatmapData)).toBe(true);

      if ((heatmapData as any[]).length > 0) {
        const firstCluster = (heatmapData as any[])[0];
        expect(firstCluster).toHaveProperty('count');
        expect(firstCluster).toHaveProperty('centerLat');
        expect(firstCluster).toHaveProperty('centerLon');
        expect(parseInt(firstCluster.count)).toBeGreaterThan(0);
      }
    });
  });

  describe('findInPolygon', () => {
    it('should find equipment within Dakar region polygon', async () => {
      // Simplified polygon around Dakar
      const dakarPolygon = [
        [-17.5, 14.6], // Southwest
        [-17.4, 14.6], // Southeast
        [-17.4, 14.8], // Northeast
        [-17.5, 14.8], // Northwest
        [-17.5, 14.6], // Close polygon
      ];

      const results = await service.findInPolygon(dakarPolygon);

      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);

      if ((results as any[]).length > 0) {
        (results as any[]).forEach((equipment) => {
          const lat = parseFloat(equipment.latitude);
          const lon = parseFloat(equipment.longitude);
          
          // Rough bounds check
          expect(lat).toBeGreaterThanOrEqual(14.6);
          expect(lat).toBeLessThanOrEqual(14.8);
          expect(lon).toBeGreaterThanOrEqual(-17.5);
          expect(lon).toBeLessThanOrEqual(-17.4);
        });
      }
    });
  });
});
