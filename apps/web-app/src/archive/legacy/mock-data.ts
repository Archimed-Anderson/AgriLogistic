import { KPI, FieldMetrics, Alert } from '@/types/dashboard';

export const mockKPIs: KPI[] = [
  {
    id: 'yield',
    title: 'Rendement',
    value: 2450,
    unit: 'kg/ha',
    trend: {
      value: 12.5,
      isPositive: true,
      label: '+12.5% vs mois dernier',
    },
    icon: 'Sprout',
    chartData: [
      { date: '2024-01', value: 2100 },
      { date: '2024-02', value: 2250 },
      { date: '2024-03', value: 2400 },
      { date: '2024-04', value: 2450 },
    ],
  },
  {
    id: 'humidity',
    title: 'Humidité du Sol',
    value: 68,
    unit: '%',
    trend: {
      value: -3.2,
      isPositive: false,
      label: '-3.2% vs hier',
    },
    icon: 'Droplet',
    chartData: [
      { date: '2024-04-20', value: 72 },
      { date: '2024-04-21', value: 70 },
      { date: '2024-04-22', value: 69 },
      { date: '2024-04-23', value: 68 },
    ],
  },
  {
    id: 'alerts',
    title: 'Alertes Actives',
    value: 3,
    trend: {
      value: -1,
      isPositive: true,
      label: '-1 depuis hier',
    },
    icon: 'AlertTriangle',
  },
];

export const mockFieldMetrics: FieldMetrics = {
  yield: {
    current: 2450,
    target: 2600,
    unit: 'kg/ha',
    trend: 12.5,
  },
  humidity: {
    current: 68,
    optimal: 70,
    unit: '%',
    trend: -3.2,
  },
  alerts: {
    count: 3,
    critical: 1,
    warnings: 2,
    items: [
      {
        id: '1',
        type: 'critical',
        title: 'Humidité faible',
        message: "Le niveau d'humidité est en dessous du seuil optimal",
        timestamp: new Date('2024-04-23T10:30:00'),
        field: 'Parcelle A',
      },
      {
        id: '2',
        type: 'warning',
        title: 'Irrigation programmée',
        message: "L'irrigation automatique sera activée dans 2 heures",
        timestamp: new Date('2024-04-23T09:00:00'),
        field: 'Parcelle B',
      },
      {
        id: '3',
        type: 'warning',
        title: 'Fertilisation recommandée',
        message: "Il est temps d'appliquer l'engrais azoté",
        timestamp: new Date('2024-04-22T14:15:00'),
        field: 'Parcelle C',
      },
    ],
  },
};
