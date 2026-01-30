import { useState, useEffect } from 'react';

export interface Vehicle {
  id: string;
  driver: string;
  location: [number, number]; // [lon, lat]
  speed: number;
  fuel: number;
  load: number; // percentage
  status: 'active' | 'loading' | 'maintenance' | 'idle';
  cargo: string;
  destination: string;
  eta: string;
}

export function useLogisticsStream() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'FL-001', driver: 'Moussa Diop', location: [-17.4467, 14.6937], speed: 65, fuel: 85, load: 92, status: 'active', cargo: 'Arachides', destination: 'Thiès', eta: '14:20' },
    { id: 'FL-002', driver: 'Oumar Sy', location: [-16.9359, 14.791], speed: 0, fuel: 42, load: 15, status: 'loading', cargo: 'Engrais', destination: 'Saint-Louis', eta: '16:45' },
    { id: 'FL-003', driver: 'Babacar Ndiaye', location: [-13.6703, 13.7707], speed: 82, fuel: 68, load: 100, status: 'active', cargo: 'Produits Frais', destination: 'Dakar', eta: '13:10' },
    { id: 'FL-004', driver: 'Ibrahima Faye', location: [-16.5015, 16.0179], speed: 45, fuel: 28, load: 0, status: 'maintenance', cargo: 'N/A', destination: 'Dakar', eta: 'Indéfini' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status !== 'active') return v;

        // Move vehicle slightly towards a destination (simulated)
        const dLon = (Math.random() * 0.01 - 0.005);
        const dLat = (Math.random() * 0.01 - 0.005);
        const newSpeed = Math.max(0, Math.min(100, v.speed + (Math.random() * 10 - 5)));
        const newFuel = Math.max(0, v.fuel - (newSpeed / 1000));

        return {
          ...v,
          location: [v.location[0] + dLon, v.location[1] + dLat] as [number, number],
          speed: Number(newSpeed.toFixed(1)),
          fuel: Number(newFuel.toFixed(1)),
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return vehicles;
}
