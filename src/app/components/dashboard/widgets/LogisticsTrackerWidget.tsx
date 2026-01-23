import { getRecentShipments } from '@/data/mockDashboardData';
import { Truck, MapPin, Clock, CheckCircle2, AlertCircle, Package } from 'lucide-react';

const statusConfig = {
  'in-transit': {
    label: 'In Transit',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: Truck,
  },
  'delivered': {
    label: 'Delivered',
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: CheckCircle2,
  },
  'pending': {
    label: 'Pending',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    icon: Clock,
  },
  'delayed': {
    label: 'Delayed',
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: AlertCircle,
  },
};

export function LogisticsTrackerWidget() {
  const shipments = getRecentShipments().slice(0, 6);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Recent Shipments</h3>
        <span className="text-sm text-slate-500">Last 24 hours</span>
      </div>

      <div className="space-y-4">
        {shipments.map((shipment) => {
          const config = statusConfig[shipment.status];
          const StatusIcon = config.icon;

          return (
            <div
              key={shipment.id}
              className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-slate-400" />
                    <p className="font-semibold text-slate-900">{shipment.product}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {shipment.destination}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {shipment.estimatedDelivery}
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${config.bg} ${config.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full transition-all duration-500 ${shipment.status === 'delivered' ? 'bg-green-500' : shipment.status === 'delayed' ? 'bg-red-500' : 'bg-blue-500'}`}
                  style={{ width: `${shipment.progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1 text-right">{shipment.id}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
