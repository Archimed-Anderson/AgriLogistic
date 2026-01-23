import { AreaChartComponent } from '../charts/AreaChartComponent';
import { getMonthlyHistoricalData } from '@/data/mockDashboardData';
import { TrendingUp, DollarSign } from 'lucide-react';

export function RevenueTrendsWidget() {
  const monthlyData = getMonthlyHistoricalData();
  
  // Calculate totals and growth
  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];
  const growth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);

  const chartDataKeys = [
    { key: 'revenue', color: '#10B981', label: 'Revenue' },
    { key: 'costs', color: '#EF4444', label: 'Costs' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Revenue Trends</h3>
          <p className="text-sm text-slate-500 mt-1">Last 12 months</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900">
            €{currentMonth.revenue.toLocaleString()}
          </p>
          <p className={`text-sm font-medium flex items-center gap-1 justify-end ${growth.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
            <TrendingUp className="w-4 h-4" />
            {growth}% vs last month
          </p>
        </div>
      </div>

      <div style={{ height: '300px' }}>
        <AreaChartComponent
          data={monthlyData}
          dataKeys={chartDataKeys}
          yAxisLabel="Amount (€)"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg. Revenue</p>
            <p className="text-lg font-bold text-slate-900">
              €{Math.round(monthlyData.reduce((sum, m) => sum + m.revenue, 0) / monthlyData.length).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg. Costs</p>
            <p className="text-lg font-bold text-slate-900">
              €{Math.round(monthlyData.reduce((sum, m) => sum + m.costs, 0) / monthlyData.length).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
