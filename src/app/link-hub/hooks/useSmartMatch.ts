/**
 * HOOK USE-SMART-MATCH
 * Logique d'appariement intelligent pilotée par l'IA
 */

import { useState, useCallback } from 'react';
import { type Load, type Truck, calculateAIMatchScore } from '../../data/logistics-operations';

export const useSmartMatch = (loads: Load[], trucks: Truck[]) => {
  const [matchingResult, setMatchingResult] = useState<{
    bestLoad: Load | null;
    bestTruck: Truck | null;
    score: number;
    factors: Record<string, number>;
  } | null>(null);

  const findBestMatchForTruck = useCallback((truck: Truck) => {
    let bestLoad: Load | null = null;
    let maxScore = -1;

    loads.forEach(load => {
      const score = calculateAIMatchScore(load, truck);
      if (score > maxScore) {
        maxScore = score;
        bestLoad = load;
      }
    });

    if (bestLoad) {
      setMatchingResult({
        bestLoad,
        bestTruck: truck,
        score: maxScore,
        factors: {
          capacity: 25,
          proximity: 20,
          time: 20,
          requirements: 15,
          price: 10,
          rating: 10
        }
      });
      return bestLoad;
    }
    return null;
  }, [loads]);

  const findBestMatchForLoad = useCallback((load: Load) => {
    let bestTruck: Truck | null = null;
    let maxScore = -1;

    trucks.forEach(truck => {
      const score = calculateAIMatchScore(load, truck);
      if (score > maxScore) {
        maxScore = score;
        bestTruck = truck;
      }
    });

    if (bestTruck) {
      setMatchingResult({
        bestLoad: load,
        bestTruck,
        score: maxScore,
        factors: {
          capacity: 25,
          proximity: 20,
          time: 20,
          requirements: 15,
          price: 10,
          rating: 10
        }
      });
      return bestTruck;
    }
    return null;
  }, [trucks]);

  const clearMatch = () => setMatchingResult(null);

  return {
    matchingResult,
    findBestMatchForTruck,
    findBestMatchForLoad,
    clearMatch
  };
};
