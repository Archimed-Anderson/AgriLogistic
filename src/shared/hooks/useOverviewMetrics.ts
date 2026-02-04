import { useState, useEffect } from 'react';

export interface OverviewMetrics {
  revenue: {
    total: number;
    delta: string;
    trend: number[];
  };
  transactions: {
    total: number;
    delta: string;
    trend: number[];
  };
  users: {
    active: number;
    total: number;
    delta: string;
  };
  health: {
    status: 'nominal' | 'warning' | 'critical';
    score: number;
  };
  activities: {
    id: string;
    type: 'order' | 'registration' | 'system' | 'security';
    title: string;
    user: string;
    timestamp: string;
    amount?: string;
  }[];
}

export function useOverviewMetrics() {
  const [metrics, setMetrics] = useState<OverviewMetrics>({
    revenue: { total: 4285000, delta: '+12.5%', trend: [40, 45, 42, 48, 52, 50, 55] },
    transactions: { total: 1420, delta: '+82', trend: [120, 140, 130, 150, 160, 145, 170] },
    users: { active: 342, total: 12450, delta: '+4.2%' },
    health: { status: 'nominal', score: 99.98 },
    activities: [
      {
        id: '1',
        type: 'order',
        title: 'Nouvelle commande #TR-9421',
        user: 'Aminata K.',
        timestamp: 'Il y a 2m',
        amount: '45,000 FCFA',
      },
      {
        id: '2',
        type: 'registration',
        title: 'Nouveau producteur inscrit',
        user: 'GIE Samba',
        timestamp: 'Il y a 5m',
      },
      {
        id: '3',
        type: 'system',
        title: 'Mise à jour noyau logistique v2.1.0',
        user: 'System',
        timestamp: 'Il y a 12m',
      },
      {
        id: '4',
        type: 'security',
        title: 'Tentative de connexion bloquée',
        user: 'IP 192.168.x.x',
        timestamp: 'Il y a 15m',
      },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        ...prev,
        revenue: {
          ...prev.revenue,
          total: prev.revenue.total + Math.random() * 5000,
          trend: [...prev.revenue.trend.slice(1), 50 + Math.random() * 10],
        },
        transactions: {
          ...prev.transactions,
          total: prev.transactions.total + (Math.random() > 0.7 ? 1 : 0),
          trend: [...prev.transactions.trend.slice(1), 150 + Math.random() * 20],
        },
        health: {
          ...prev.health,
          score: Math.max(99, Math.min(100, prev.health.score + (Math.random() * 0.02 - 0.01))),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}
