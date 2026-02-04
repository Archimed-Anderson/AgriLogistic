/**
 * HOOK USE-ECO-ROUTE
 * Calcul des émissions CO2 et optimisation de route écologique
 */

import { useMemo } from 'react';
import { type Load, type Truck } from '../../data/logistics-operations';

interface EcoRouteResult {
  standardCO2: number;
  ecoCO2: number;
  savings: number;
  treesEquivalent: number;
  recommendation: 'standard' | 'eco';
}

export const useEcoRoute = (load: Load | null, truck: Truck | null, distance: number) => {
  const ecoData = useMemo<EcoRouteResult | null>(() => {
    if (!load || !truck || distance === 0) return null;

    // Facteurs d'émissions (simulés)
    // Poids lourd moyen: ~0.8kg CO2 / km / tonne
    const baseEmissionFactor = 0.8;

    // Route standard
    const standardCO2 = distance * load.quantity * baseEmissionFactor;

    // Route écologique (optimisation de 15% à 30%)
    const optimizationFactor = 0.75; // 25% d'économie
    const ecoCO2 = standardCO2 * optimizationFactor;

    const savings = standardCO2 - ecoCO2;
    const savingsPercent = ((standardCO2 - ecoCO2) / standardCO2) * 100;

    // 1 arbre absorbe environ 20kg de CO2 par an
    const treesEquivalent = savings / 20;

    return {
      standardCO2,
      ecoCO2,
      savings: savingsPercent,
      treesEquivalent,
      recommendation: savingsPercent > 10 ? 'eco' : 'standard',
    };
  }, [load, truck, distance]);

  return ecoData;
};
