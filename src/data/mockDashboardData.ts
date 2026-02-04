/**
 * Mock data for dashboard widgets (KPIs, production, revenue, shipments, weather).
 */

export function getCurrentWeather() {
  return {
    temp: 24,
    temperature: 24,
    condition: 'Sunny',
    location: 'Dakar',
    icon: 'sun',
    high: 28,
    low: 18,
    humidity: 65,
  };
}

export function getDashboardSummary() {
  return {
    productionChange: '+12%',
    revenueChange: '+8%',
    ordersChange: '+5%',
    areaChange: '+5%',
    totalArea: '1,240 ha',
    totalRevenue: '€124.5k',
  };
}

export function getCurrentKPIs() {
  return [
    {
      icon: 'TrendingUp',
      label: 'Revenue',
      value: '€124.5k',
      change: '+8.2%',
      trend: 'up' as const,
    },
    { icon: 'ShoppingCart', label: 'Orders', value: '342', change: '+5.1%', trend: 'up' as const },
    { icon: 'Package', label: 'Shipments', value: '128', change: '-2.3%', trend: 'down' as const },
    { icon: 'Users', label: 'Active Users', value: '1.2k', change: '+12%', trend: 'up' as const },
  ];
}

export function getMonthlyHistoricalData(): { month: string; revenue: number; costs: number }[] {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return months.map((month, i) => ({
    month,
    revenue: 80000 + i * 5000 + Math.random() * 10000,
    costs: 40000 + i * 2000 + Math.random() * 5000,
  }));
}

export function getRecentShipments(): {
  id: string;
  product: string;
  destination: string;
  estimatedDelivery: string;
  status: 'in-transit' | 'delivered' | 'pending' | 'delayed';
  progress: number;
}[] {
  return [
    {
      id: 'SH-001',
      product: 'Maïs',
      destination: 'Thiès',
      estimatedDelivery: '2h',
      status: 'in-transit',
      progress: 65,
    },
    {
      id: 'SH-002',
      product: 'Riz',
      destination: 'Saint-Louis',
      estimatedDelivery: 'Delivered',
      status: 'delivered',
      progress: 100,
    },
    {
      id: 'SH-003',
      product: 'Tomates',
      destination: 'Ziguinchor',
      estimatedDelivery: '5h',
      status: 'pending',
      progress: 10,
    },
  ];
}

export function getCropDistribution(): {
  name: string;
  tons: number;
  color: string;
  percentage: number;
}[] {
  return [
    { name: 'Maïs', tons: 420, color: '#22c55e', percentage: 35 },
    { name: 'Riz', tons: 300, color: '#eab308', percentage: 25 },
    { name: 'Tomates', tons: 240, color: '#ef4444', percentage: 20 },
    { name: 'Oignons', tons: 180, color: '#a855f7', percentage: 15 },
    { name: 'Autres', tons: 60, color: '#64748b', percentage: 5 },
  ];
}
