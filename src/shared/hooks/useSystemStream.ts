import { useState, useEffect } from 'react';

export interface SystemMetrics {
  cpu: number;
  memory: {
    total: number;
    used: number;
    percent: number;
  };
  disk: {
    total: number;
    used: number;
    percent: number;
  };
  network: {
    up: number;
    down: number;
  };
  status: 'nominal' | 'warning' | 'critical';
  timestamp: string;
}

export function useSystemStream() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 12,
    memory: { total: 32, used: 4.8, percent: 15 },
    disk: { total: 512, used: 128, percent: 25 },
    network: { up: 1.2, down: 4.5 },
    status: 'nominal',
    timestamp: new Date().toLocaleTimeString(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const newCpu = Math.max(5, Math.min(95, prev.cpu + (Math.random() * 10 - 5)));
        const newNetUp = Math.max(0.1, prev.network.up + (Math.random() * 0.5 - 0.25));
        const newNetDown = Math.max(0.5, prev.network.down + (Math.random() * 2 - 1));
        
        let status: SystemMetrics['status'] = 'nominal';
        if (newCpu > 85) status = 'critical';
        else if (newCpu > 70) status = 'warning';

        return {
          ...prev,
          cpu: Number(newCpu.toFixed(1)),
          network: { 
            up: Number(newNetUp.toFixed(2)), 
            down: Number(newNetDown.toFixed(2)) 
          },
          status,
          timestamp: new Date().toLocaleTimeString(),
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}
