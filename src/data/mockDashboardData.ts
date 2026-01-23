import { format, subMonths, addDays } from 'date-fns';

export interface CropData {
  name: string;
  percentage: number;
  tons: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  costs: number;
  production: number;
  orders: number;
  [key: string]: string | number | undefined;
}

export interface LogisticsItem {
  id: string;
  product: string;
  destination: string;
  status: 'in-transit' | 'delivered' | 'pending' | 'delayed';
  estimatedDelivery: string;
  progress: number;
}

export interface KPIData {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
}

// Generate crop distribution data
export const getCropDistribution = (): CropData[] => {
  return [
    { name: 'Blé', percentage: 40, tons: 400, color: '#F59E0B' },
    { name: 'Maïs', percentage: 30, tons: 300, color: '#10B981' },
    { name: 'Riz', percentage: 10, tons: 100, color: '#3B82F6' },
    { name: 'Autres', percentage: 20, tons: 200, color: '#8B5CF6' },
  ];
};

// Generate monthly historical data (last 12 months)
export const getMonthlyHistoricalData = (): MonthlyData[] => {
  const data: MonthlyData[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = subMonths(now, i);
    const monthName = format(date, 'MMM yyyy');
    
    // Seasonal variations for agriculture
    const seasonalFactor = 1 + Math.sin((11 - i) * Math.PI / 6) * 0.3;
    
    data.push({
      month: monthName,
      revenue: Math.round(40000 + Math.random() * 15000 * seasonalFactor),
      costs: Math.round(25000 + Math.random() * 8000 * seasonalFactor),
      production: Math.round(800 + Math.random() * 300 * seasonalFactor),
      orders: Math.round(100 + Math.random() * 50),
    });
  }

  return data;
};

// Generate recent logistics shipments
export const getRecentShipments = (): LogisticsItem[] => {
  const statuses: LogisticsItem['status'][] = ['in-transit', 'delivered', 'pending', 'delayed'];
  const products = ['Blé Bio', 'Maïs Grain', 'Riz Basmati', 'Légumes Frais'];
  const destinations = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse'];

  return Array.from({ length: 8 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const estimatedDays = Math.floor(Math.random() * 5) + 1;
    
    return {
      id: `SHP-2024-${1000 + i}`,
      product: products[Math.floor(Math.random() * products.length)],
      destination: destinations[Math.floor(Math.random() * destinations.length)],
      status,
      estimatedDelivery: format(addDays(new Date(), estimatedDays), 'dd/MM/yyyy'),
      progress: status === 'delivered' ? 100 : status === 'in-transit' ? Math.floor(Math.random() * 70) + 20 : status === 'delayed' ? Math.floor(Math.random() * 40) : 0,
    };
  });
};

// Generate current KPIs
export const getCurrentKPIs = (): KPIData[] => {
  return [
    {
      label: 'Revenus mensuels',
      value: '€45,890',
      change: '+23%',
      trend: 'up',
      icon: 'TrendingUp',
    },
    {
      label: 'Commandes actives',
      value: 127,
      change: '+12%',
      trend: 'up',
      icon: 'ShoppingCart',
    },
    {
      label: 'Produits en stock',
      value: 1234,
      change: '+8%',
      trend: 'up',
      icon: 'Package',
    },
    {
      label: 'Utilisateurs actifs',
      value: 245,
      change: '+15%',
      trend: 'up',
      icon: 'Users',
    },
  ];
};

// Generate inventory data by product
export const getInventoryByProduct = () => {
  const products = ['Blé', 'Maïs', 'Riz', 'Soja', 'Tournesol'];
  return products.map(product => ({
    product,
    stock: Math.floor(Math.random() * 500) + 100,
    reserved: Math.floor(Math.random() * 200),
    threshold: 150,
  }));
};

// Weather data (current)
export const getCurrentWeather = () => {
  return {
    location: 'Paris, France',
    temperature: 24,
    condition: 'Partiellement nuageux',
    high: 27,
    low: 10,
    humidity: 26,
    forecast: [
      { day: 'Mar', temp: 24, condition: 'sunny' },
      { day: 'Mer', temp: 22, condition: 'cloudy' },
      { day: 'Jeu', temp: 20, condition: 'rainy' },
      { day: 'Ven', temp: 23, condition: 'sunny' },
      { day: 'Sam', temp: 25, condition: 'sunny' },
    ],
  };
};

// Get summary statistics
export const getDashboardSummary = () => {
  return {
    totalArea: 1200, // acres
    areaChange: '+8%',
    totalRevenue: 50000, // EUR
    revenueChange: '+12%',
    totalProduction: 1000, // tons
    productionChange: '+5%',
  };
};
