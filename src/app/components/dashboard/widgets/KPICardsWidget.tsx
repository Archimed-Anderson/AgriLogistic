import { getCurrentKPIs } from '@/data/mockDashboardData';
import { TrendingUp, TrendingDown, ShoppingCart, Package, Users, DollarSign, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  TrendingUp: TrendingUp,
  ShoppingCart: ShoppingCart,
  Package: Package,
  Users: Users,
};

export function KPICardsWidget() {
  const kpis = getCurrentKPIs();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = iconMap[kpi.icon] || DollarSign;
        const isPositive = kpi.trend === 'up';

        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                <Icon className={`w-6 h-6 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {kpi.change}
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-2">{kpi.label}</p>
            <p className="text-3xl font-bold text-slate-900">{kpi.value}</p>
          </div>
        );
      })}
    </div>
  );
}
