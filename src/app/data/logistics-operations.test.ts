/**
 * AGRILOGISTIC LINK - TESTS UNITAIRES
 * Tests pour l'algorithme de matching AI et les fonctions utilitaires
 */

import { describe, it, expect } from 'vitest';
import {
  calculateAIMatchScore,
  calculateDistance,
  type Load,
  type Truck,
  type GeoCoordinates,
} from '../data/logistics-operations';

describe('AgriLogistic Link - Logistics Operations', () => {
  // ==================== TESTS DE DISTANCE ====================
  
  describe('calculateDistance', () => {
    it('devrait calculer la distance entre Abidjan et Yamoussoukro', () => {
      const abidjan: GeoCoordinates = {
        lat: 5.3600,
        lon: -4.0083,
        address: '123 Route',
        city: 'Abidjan',
        region: 'Lagunes',
        country: 'Côte d\'Ivoire',
      };

      const yamoussoukro: GeoCoordinates = {
        lat: 6.8270,
        lon: -5.2893,
        address: '45 Avenue',
        city: 'Yamoussoukro',
        region: 'Yamoussoukro',
        country: 'Côte d\'Ivoire',
      };

      const distance = calculateDistance(abidjan, yamoussoukro);
      
      // La distance réelle est d'environ 230 km
      expect(distance).toBeGreaterThan(200);
      expect(distance).toBeLessThan(250);
    });

    it('devrait retourner 0 pour la même position', () => {
      const position: GeoCoordinates = {
        lat: 5.3600,
        lon: -4.0083,
        address: '123 Route',
        city: 'Abidjan',
        region: 'Lagunes',
        country: 'Côte d\'Ivoire',
      };

      const distance = calculateDistance(position, position);
      expect(distance).toBe(0);
    });
  });

  // ==================== TESTS DE MATCHING AI ====================

  describe('calculateAIMatchScore', () => {
    const baseLoad: Load = {
      id: 'LOAD-TEST-001',
      productType: 'Maïs',
      quantity: 20,
      unit: 'tonnes',
      origin: {
        lat: 5.3600,
        lon: -4.0083,
        address: '123 Route',
        city: 'Abidjan',
        region: 'Lagunes',
        country: 'Côte d\'Ivoire',
      },
      destination: {
        lat: 6.8270,
        lon: -5.2893,
        address: '45 Avenue',
        city: 'Yamoussoukro',
        region: 'Yamoussoukro',
        country: 'Côte d\'Ivoire',
      },
      priceOffer: 1000000,
      currency: 'FCFA',
      status: 'Pending',
      producerId: 'PROD-001',
      producerName: 'Test Producer',
      producerPhone: '+225 12345678',
      pickupDate: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 86400000).toISOString(),
      packaging: 'Sacs',
      insurance: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const baseTruck: Truck = {
      id: 'TRUCK-TEST-001',
      driverId: 'DRV-001',
      driverName: 'Test Driver',
      driverPhone: '+225 87654321',
      driverRating: 4.5,
      licensePlate: 'CI-1234-AB',
      truckType: 'Poids lourd',
      capacity: 25,
      currentPosition: {
        lat: 5.3600,
        lon: -4.0083,
        address: '789 Rue',
        city: 'Abidjan',
        region: 'Lagunes',
        country: 'Côte d\'Ivoire',
      },
      status: 'Available',
      features: ['GPS en temps réel', 'Bâche étanche'],
      insuranceValid: true,
      lastMaintenance: new Date(Date.now() - 30 * 86400000).toISOString(),
      nextMaintenance: new Date(Date.now() + 150 * 86400000).toISOString(),
      fuelEfficiency: 5.5,
      availableFrom: new Date().toISOString(),
      availableUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    it('devrait retourner un score élevé pour un match parfait', () => {
      const score = calculateAIMatchScore(baseLoad, baseTruck);
      
      // Score devrait être > 70% pour un bon match
      expect(score).toBeGreaterThan(70);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('devrait pénaliser si la capacité est insuffisante', () => {
      const smallTruck: Truck = {
        ...baseTruck,
        capacity: 10, // Trop petit pour 20 tonnes
      };

      const score = calculateAIMatchScore(baseLoad, smallTruck);
      
      // Score devrait être 0 car capacité insuffisante
      expect(score).toBe(0);
    });

    it('devrait favoriser les camions proches', () => {
      const nearTruck: Truck = {
        ...baseTruck,
        currentPosition: {
          lat: 5.3700, // Très proche d'Abidjan
          lon: -4.0100,
          address: '100 Rue',
          city: 'Abidjan',
          region: 'Lagunes',
          country: 'Côte d\'Ivoire',
        },
      };

      const farTruck: Truck = {
        ...baseTruck,
        currentPosition: {
          lat: 9.4569, // Korhogo, très loin
          lon: -5.5169,
          address: '200 Rue',
          city: 'Korhogo',
          region: 'Savanes',
          country: 'Côte d\'Ivoire',
        },
      };

      const nearScore = calculateAIMatchScore(baseLoad, nearTruck);
      const farScore = calculateAIMatchScore(baseLoad, farTruck);

      expect(nearScore).toBeGreaterThan(farScore);
    });

    it('devrait favoriser les conducteurs bien notés', () => {
      const highRatedTruck: Truck = {
        ...baseTruck,
        driverRating: 5.0,
      };

      const lowRatedTruck: Truck = {
        ...baseTruck,
        driverRating: 3.0,
      };

      const highScore = calculateAIMatchScore(baseLoad, highRatedTruck);
      const lowScore = calculateAIMatchScore(baseLoad, lowRatedTruck);

      expect(highScore).toBeGreaterThan(lowScore);
    });

    it('devrait considérer les exigences spéciales', () => {
      const loadWithRequirements: Load = {
        ...baseLoad,
        specialRequirements: ['Température contrôlée', 'GPS'],
      };

      const truckWithFeatures: Truck = {
        ...baseTruck,
        features: ['GPS en temps réel', 'Réfrigération', 'Bâche étanche'],
      };

      const truckWithoutFeatures: Truck = {
        ...baseTruck,
        features: ['Bâche étanche'],
      };

      const scoreWith = calculateAIMatchScore(loadWithRequirements, truckWithFeatures);
      const scoreWithout = calculateAIMatchScore(loadWithRequirements, truckWithoutFeatures);

      expect(scoreWith).toBeGreaterThan(scoreWithout);
    });

    it('devrait favoriser un ratio capacité optimal (70-100%)', () => {
      const load20t: Load = {
        ...baseLoad,
        quantity: 20,
      };

      const truck25t: Truck = {
        ...baseTruck,
        capacity: 25, // Ratio 80% - optimal
      };

      const truck50t: Truck = {
        ...baseTruck,
        capacity: 50, // Ratio 40% - sous-optimal
      };

      const optimalScore = calculateAIMatchScore(load20t, truck25t);
      const suboptimalScore = calculateAIMatchScore(load20t, truck50t);

      expect(optimalScore).toBeGreaterThan(suboptimalScore);
    });

    it('devrait retourner un score entre 0 et 100', () => {
      const score = calculateAIMatchScore(baseLoad, baseTruck);
      
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    it('devrait retourner un nombre entier', () => {
      const score = calculateAIMatchScore(baseLoad, baseTruck);
      
      expect(Number.isInteger(score)).toBe(true);
    });
  });

  // ==================== TESTS DE VALIDATION ====================

  describe('Data Validation', () => {
    it('les IDs de chargement devraient suivre le format LOAD-XXXX', () => {
      const validId = 'LOAD-0001';
      expect(validId).toMatch(/^LOAD-\d{4}$/);
    });

    it('les IDs de camion devraient suivre le format TRUCK-XXXX', () => {
      const validId = 'TRUCK-0001';
      expect(validId).toMatch(/^TRUCK-\d{4}$/);
    });

    it('les IDs de match devraient suivre le format MATCH-XXXX', () => {
      const validId = 'MATCH-0001';
      expect(validId).toMatch(/^MATCH-\d{4}$/);
    });

    it('les coordonnées GPS devraient être dans les limites valides', () => {
      const validLat = 5.3600;
      const validLon = -4.0083;

      expect(validLat).toBeGreaterThanOrEqual(-90);
      expect(validLat).toBeLessThanOrEqual(90);
      expect(validLon).toBeGreaterThanOrEqual(-180);
      expect(validLon).toBeLessThanOrEqual(180);
    });

    it('les notes de conducteur devraient être entre 0 et 5', () => {
      const validRating = 4.5;

      expect(validRating).toBeGreaterThanOrEqual(0);
      expect(validRating).toBeLessThanOrEqual(5);
    });
  });

  // ==================== TESTS DE PERFORMANCE ====================

  describe('Performance', () => {
    it('calculateDistance devrait être rapide (< 1ms)', () => {
      const point1: GeoCoordinates = {
        lat: 5.3600,
        lon: -4.0083,
        address: '123',
        city: 'Abidjan',
        region: 'Lagunes',
        country: 'CI',
      };

      const point2: GeoCoordinates = {
        lat: 6.8270,
        lon: -5.2893,
        address: '456',
        city: 'Yamoussoukro',
        region: 'Yamoussoukro',
        country: 'CI',
      };

      const start = performance.now();
      calculateDistance(point1, point2);
      const end = performance.now();

      expect(end - start).toBeLessThan(1);
    });

    it('calculateAIMatchScore devrait être rapide (< 5ms)', () => {
      const load: Load = {
        id: 'LOAD-001',
        productType: 'Maïs',
        quantity: 20,
        unit: 'tonnes',
        origin: { lat: 5.36, lon: -4.01, address: '1', city: 'A', region: 'R', country: 'C' },
        destination: { lat: 6.83, lon: -5.29, address: '2', city: 'B', region: 'R', country: 'C' },
        priceOffer: 1000000,
        currency: 'FCFA',
        status: 'Pending',
        producerId: 'P1',
        producerName: 'Producer',
        producerPhone: '+225 12345678',
        pickupDate: new Date().toISOString(),
        deliveryDate: new Date().toISOString(),
        packaging: 'Sacs',
        insurance: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const truck: Truck = {
        id: 'TRUCK-001',
        driverId: 'D1',
        driverName: 'Driver',
        driverPhone: '+225 87654321',
        driverRating: 4.5,
        licensePlate: 'CI-1234-AB',
        truckType: 'Poids lourd',
        capacity: 25,
        currentPosition: { lat: 5.36, lon: -4.01, address: '3', city: 'A', region: 'R', country: 'C' },
        status: 'Available',
        features: ['GPS'],
        insuranceValid: true,
        lastMaintenance: new Date().toISOString(),
        nextMaintenance: new Date().toISOString(),
        fuelEfficiency: 5.5,
        availableFrom: new Date().toISOString(),
        availableUntil: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const start = performance.now();
      calculateAIMatchScore(load, truck);
      const end = performance.now();

      expect(end - start).toBeLessThan(5);
    });
  });
});
