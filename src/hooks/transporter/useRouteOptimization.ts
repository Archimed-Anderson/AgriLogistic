/**
 * Route Optimization Hook
 * Handles route optimization logic using VRP algorithm
 */
import { useState, useCallback } from 'react';
import type {
  Route,
  Waypoint,
  RouteOptimizationParams,
  RouteCost,
  VehicleConstraints,
} from '@/types/transporter';

// Simple greedy nearest neighbor algorithm for route optimization
// In production, this should call a backend service with VROOM or OR-Tools
function optimizeRouteGreedy(waypoints: Waypoint[]): Waypoint[] {
  if (waypoints.length <= 2) return waypoints;

  const optimized: Waypoint[] = [];
  const remaining = [...waypoints];

  // Start with first waypoint
  optimized.push(remaining.shift()!);

  // Greedy nearest neighbor
  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    remaining.forEach((point, index) => {
      const distance = calculateDistance(current.coordinates, point.coordinates);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    optimized.push(remaining.splice(nearestIndex, 1)[0]);
  }

  return optimized;
}

// Haversine formula for distance calculation
function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2[1] - coord1[1]);
  const dLon = toRad(coord2[0] - coord1[0]);
  const lat1 = toRad(coord1[1]);
  const lat2 = toRad(coord2[1]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Calculate total route distance
function calculateTotalDistance(waypoints: Waypoint[]): number {
  let total = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    total += calculateDistance(waypoints[i].coordinates, waypoints[i + 1].coordinates);
  }
  return total;
}

// Calculate route duration (including stop times)
function calculateTotalDuration(waypoints: Waypoint[]): number {
  const distance = calculateTotalDistance(waypoints);
  const drivingTime = (distance / 60) * 60; // Assuming 60 km/h average speed
  const stopTime = waypoints.reduce((sum, wp) => sum + wp.duration, 0);
  return drivingTime + stopTime;
}

// Calculate route costs
function calculateRouteCost(
  distance: number,
  duration: number,
  vehicleConstraints?: VehicleConstraints
): RouteCost {
  // Cost assumptions (should be configurable)
  const fuelPricePerLiter = 650; // XOF
  const fuelConsumption = 12; // L/100km
  const tollCostPerKm = 50; // XOF
  const wearCostPerKm = 30; // XOF
  const laborCostPerHour = 2000; // XOF

  const fuel = (distance / 100) * fuelConsumption * fuelPricePerLiter;
  const tolls = distance * tollCostPerKm;
  const wear = distance * wearCostPerKm;
  const labor = (duration / 60) * laborCostPerHour;

  return {
    fuel: Math.round(fuel),
    tolls: Math.round(tolls),
    wear: Math.round(wear),
    labor: Math.round(labor),
    total: Math.round(fuel + tolls + wear + labor),
    currency: 'XOF',
  };
}

export function useRouteOptimization() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationError, setOptimizationError] = useState<string | null>(null);

  const optimizeRoute = useCallback(async (params: RouteOptimizationParams): Promise<Route> => {
    setIsOptimizing(true);
    setOptimizationError(null);

    try {
      // In production, call backend API
      // const response = await apiClient.post('/api/routes/optimize', params);
      // return response.data;

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      let optimizedWaypoints = params.waypoints;

      // Apply optimization if allowed
      if (params.allowReordering) {
        optimizedWaypoints = optimizeRouteGreedy(params.waypoints);
      }

      // Calculate metrics
      const totalDistance = calculateTotalDistance(optimizedWaypoints);
      const totalDuration = calculateTotalDuration(optimizedWaypoints);
      const estimatedCost = calculateRouteCost(
        totalDistance,
        totalDuration,
        params.vehicleConstraints
      );

      const route: Route = {
        id: `route-${Date.now()}`,
        name: `Route ${new Date().toLocaleDateString('fr-FR')}`,
        waypoints: optimizedWaypoints,
        optimized: params.allowReordering,
        totalDistance,
        totalDuration,
        estimatedCost,
        status: 'planned',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return route;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur d'optimisation";
      setOptimizationError(message);
      throw error;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  const recalculateRoute = useCallback(
    (
      waypoints: Waypoint[]
    ): {
      distance: number;
      duration: number;
      cost: RouteCost;
    } => {
      const distance = calculateTotalDistance(waypoints);
      const duration = calculateTotalDuration(waypoints);
      const cost = calculateRouteCost(distance, duration);

      return { distance, duration, cost };
    },
    []
  );

  const exportToGPX = useCallback((route: Route): string => {
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="AgroLogistic">
  <metadata>
    <name>${route.name}</name>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <rte>
    <name>${route.name}</name>
    ${route.waypoints
      .map(
        (wp, index) => `
    <rtept lat="${wp.coordinates[1]}" lon="${wp.coordinates[0]}">
      <name>${wp.type === 'pickup' ? 'P' : wp.type === 'delivery' ? 'D' : 'W'}${index + 1}</name>
      <desc>${wp.address}</desc>
    </rtept>`
      )
      .join('')}
  </rte>
</gpx>`;

    return gpx;
  }, []);

  const exportToGoogleMaps = useCallback((route: Route): string => {
    const waypoints = route.waypoints
      .map((wp) => `${wp.coordinates[1]},${wp.coordinates[0]}`)
      .join('/');

    return `https://www.google.com/maps/dir/${waypoints}`;
  }, []);

  return {
    optimizeRoute,
    recalculateRoute,
    exportToGPX,
    exportToGoogleMaps,
    isOptimizing,
    optimizationError,
  };
}
