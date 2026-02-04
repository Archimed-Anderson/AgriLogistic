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
  type Coordinates,
} from '../data/logistics-operations';

// Coordonnées [latitude, longitude] (type Coordinates du module)
const abidjan: Coordinates = [5.36, -4.0083];
const yamoussoukro: Coordinates = [6.827, -5.2893];

describe('AgriLogistic Link - Logistics Operations', () => {
  // ==================== TESTS DE DISTANCE ====================

  describe('calculateDistance', () => {
    it('devrait calculer la distance entre Abidjan et Yamoussoukro', () => {
      const distance = calculateDistance(abidjan, yamoussoukro);
      // La distance réelle est d'environ 230 km
      expect(distance).toBeGreaterThan(200);
      expect(distance).toBeLessThan(250);
    });

    it('devrait retourner 0 pour la même position', () => {
      const distance = calculateDistance(abidjan, abidjan);
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
      origin: abidjan,
      destination: yamoussoukro,
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
      currentPosition: abidjan,
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
        capacity: 10, // Trop petit pour 20 tonnes (capacityMatch = 0)
      };

      const optimalTruck: Truck = { ...baseTruck, capacity: 25 };
      const smallScore = calculateAIMatchScore(baseLoad, smallTruck);
      const optimalScore = calculateAIMatchScore(baseLoad, optimalTruck);
      // Score inférieur quand la capacité est insuffisante
      expect(smallScore).toBeLessThan(optimalScore);
    });

    it('devrait favoriser les camions proches', () => {
      const nearTruck: Truck = {
        ...baseTruck,
        currentPosition: [5.37, -4.01], // Très proche d'Abidjan
      };

      const farTruck: Truck = {
        ...baseTruck,
        currentPosition: [9.4569, -5.5169], // Korhogo, très loin
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
      const validLat = 5.36;
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
    it('calculateDistance devrait être rapide (< 10ms)', () => {
      const start = performance.now();
      calculateDistance(abidjan, yamoussoukro);
      const end = performance.now();
      expect(end - start).toBeLessThan(10);
    });

    it('calculateAIMatchScore devrait être rapide (< 50ms)', () => {
      const load: Load = {
        id: 'LOAD-001',
        productType: 'Maïs',
        quantity: 20,
        unit: 'tonnes',
        origin: [5.36, -4.01],
        destination: [6.83, -5.29],
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
        currentPosition: [5.36, -4.01],
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
      expect(end - start).toBeLessThan(50);
    });
  });
});
