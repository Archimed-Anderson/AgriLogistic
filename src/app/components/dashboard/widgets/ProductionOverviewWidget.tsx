import { DonutChartComponent } from '../charts/DonutChartComponent';
import { getCropDistribution, getDashboardSummary } from '@/data/mockDashboardData';

export function ProductionOverviewWidget() {
  const cropData = getCropDistribution();
  const summary = getDashboardSummary();
  const totalTons = cropData.reduce((sum, crop) => sum + crop.tons, 0);

  const chartData = cropData.map((crop) => ({
    name: crop.name,
    value: crop.tons,
    color: crop.color,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Production Overview</h3>
        <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
          {summary.productionChange}
        </span>
      </div>

      <div className="relative" style={{ height: '300px' }}>
        <DonutChartComponent data={chartData} centerText={totalTons.toString()} />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
        {cropData.map((crop) => (
          <div key={crop.name} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: crop.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{crop.name}</p>
              <p className="text-xs text-slate-500">{crop.percentage}%</p>
            </div>
            <p className="text-sm font-bold text-slate-700">{crop.tons}t</p>
          </div>
        ))}
      </div>
    </div>
  );
}
