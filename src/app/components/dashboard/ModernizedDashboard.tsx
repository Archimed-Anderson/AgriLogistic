import { useState } from 'react';
import { ProductionOverviewWidget } from './widgets/ProductionOverviewWidget';
import { RevenueTrendsWidget } from './widgets/RevenueTrendsWidget';
import { KPICardsWidget } from './widgets/KPICardsWidget';
import { LogisticsTrackerWidget } from './widgets/LogisticsTrackerWidget';
import { getCurrentWeather, getDashboardSummary } from '@/data/mockDashboardData';
import { 
  Download, 
  Sun, 
  MapPin,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';

interface ModernizedDashboardProps {
  onNavigate?: (route: string) => void;
}

type TimePeriod = '7d' | '30d' | '3m' | '12m';

export function ModernizedDashboard({ onNavigate }: ModernizedDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const weather = getCurrentWeather();
  const summary = getDashboardSummary();

  const handleExportPDF = () => {
    // TODO: Implement PDF export using jsPDF
    console.log('Exporting dashboard as PDF...');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const periodOptions: { value: TimePeriod; label: string }[] = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '3m', label: '3 Months' },
    { value: '12m', label: '12 Months' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Dashboard Overview
            </h1>
            <p className="text-slate-600">
              Welcome back! Here's what's happening with your farm operations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Time Period Filter */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
              {periodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedPeriod(option.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedPeriod === option.value
                      ? 'bg-green-600 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Weather Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-white/80 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{weather.location}</span>
              </div>
              <p className="text-4xl font-bold">{weather.temperature}°C</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-white/90">{weather.condition}</p>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span>H: {weather.high}°</span>
            <span>L: {weather.low}°</span>
            <span>💧 {weather.humidity}%</span>
          </div>
        </Card>

        {/* Total Area Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              {summary.areaChange}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-1">Total Area</p>
          <p className="text-3xl font-bold text-slate-900">{summary.totalArea} acres</p>
        </Card>

        {/* Revenue Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              {summary.revenueChange}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-slate-900">€{summary.totalRevenue.toLocaleString()}</p>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="mb-8">
        <KPICardsWidget />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Production Overview - Takes 1 column */}
        <div className="lg:col-span-1">
          <ProductionOverviewWidget />
        </div>

        {/* Revenue Trends - Takes 2 columns */}
        <div className="lg:col-span-2">
          <RevenueTrendsWidget />
        </div>
      </div>

      {/* Logistics Tracker - Full Width */}
      <div className="mb-8">
        <LogisticsTrackerWidget />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4"
            onClick={() => onNavigate?.('/admin/crops')}
          >
            <span className="text-2xl">🌱</span>
            <span className="text-sm">Manage Crops</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4"
            onClick={() => onNavigate?.('/admin/logistics')}
          >
            <span className="text-2xl">🚛</span>
            <span className="text-sm">Track Shipments</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4"
            onClick={() => onNavigate?.('/admin/finance')}
          >
            <span className="text-2xl">📊</span>
            <span className="text-sm">Financial Reports</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 py-4"
            onClick={() => onNavigate?.('/admin/marketplace')}
          >
            <span className="text-2xl">🌐</span>
            <span className="text-sm">Marketplace</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
