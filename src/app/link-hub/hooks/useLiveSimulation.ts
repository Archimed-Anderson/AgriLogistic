/**
 * HOOK USE-LIVE-SIMULATION
 * Simule des micro-mouvements GPS et des mises à jour de données
 * pour rendre l'interface "vivante".
 */

import { useState, useEffect } from 'react';
import { type Load, type Truck } from '../../data/logistics-operations';

export const useLiveSimulation = (initialLoads: Load[], initialTrucks: Truck[]) => {
  const [loads, setLoads] = useState<Load[]>(initialLoads.map((l) => ({ ...l, isNew: false })));
  const [trucks, setTrucks] = useState<Truck[]>(initialTrucks.map((t) => ({ ...t, isNew: false })));

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Simuler un léger Jitter sur les camions (mouvement GPS)
      setTrucks((prevTrucks) => {
        const updated = prevTrucks.map((truck) => {
          if (truck.status === 'In Transit' || truck.status === 'Available') {
            const jitterLat = (Math.random() - 0.5) * 0.005;
            const jitterLon = (Math.random() - 0.5) * 0.005;

            return {
              ...truck,
              isNew: false, // Reset pulse
              currentPosition: [
                truck.currentPosition[0] + jitterLat,
                truck.currentPosition[1] + jitterLon,
              ] as [number, number],
            };
          }
          return { ...truck, isNew: false };
        });

        // Chance d'ajouter un nouveau camion "virtuel"
        if (Math.random() > 0.95 && updated.length < 50) {
          const newTruck = {
            ...updated[0],
            id: `T-${Math.random().toString(36).substr(2, 9)}`,
            driverName: 'Nouveau Chauffeur',
            licensePlate: `AB-${Math.round(Math.random() * 999)}-CD`,
            isNew: true,
          };
          return [newTruck, ...updated];
        }
        return updated;
      });

      // 2. Simuler une dérive de prix ou de nouveaux loads
      setLoads((prevLoads) => {
        const updated = prevLoads.map((load) => {
          if (load.status === 'Pending' && Math.random() > 0.8) {
            const priceDiff = (Math.random() - 0.5) * 500;
            return {
              ...load,
              isNew: Math.random() > 0.5, // Parfois on simule une mise à jour importante via un pulse
              priceOffer: Math.max(load.priceOffer + priceDiff, 5000),
            };
          }
          return { ...load, isNew: false };
        });

        if (Math.random() > 0.95 && updated.length < 100) {
          const newLoad: Load = {
            ...updated[0],
            id: `L-${Math.random().toString(36).substr(2, 9)}`,
            productType: 'Cacao',
            quantity: Math.round(Math.random() * 20),
            isNew: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return [newLoad, ...updated];
        }
        return updated;
      });
    }, 3000); // Mise à jour toutes les 3 secondes

    return () => clearInterval(interval);
  }, []);

  return { loads, trucks };
};
