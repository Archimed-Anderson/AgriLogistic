import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { formatRelativeTime } from '@/shared/utils/format';

interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  responseTime: number;
  lastCheck: Date;
}

export default function SystemPage() {
  // TODO: Fetch real data from API
  const services: ServiceHealth[] = [
    {
      name: 'Kong Gateway',
      status: 'healthy',
      uptime: 99.9,
      responseTime: 45,
      lastCheck: new Date(Date.now() - 30000),
    },
    {
      name: 'Auth Service',
      status: 'healthy',
      uptime: 99.8,
      responseTime: 120,
      lastCheck: new Date(Date.now() - 30000),
    },
    {
      name: 'Product Service',
      status: 'degraded',
      uptime: 95.2,
      responseTime: 450,
      lastCheck: new Date(Date.now() - 30000),
    },
    {
      name: 'Order Service',
      status: 'healthy',
      uptime: 99.5,
      responseTime: 200,
      lastCheck: new Date(Date.now() - 30000),
    },
    {
      name: 'Payment Service',
      status: 'down',
      uptime: 0,
      responseTime: 0,
      lastCheck: new Date(Date.now() - 300000),
    },
    {
      name: 'Analytics Service',
      status: 'healthy',
      uptime: 98.9,
      responseTime: 300,
      lastCheck: new Date(Date.now() - 30000),
    },
  ];

  const healthyCount = services.filter((s) => s.status === 'healthy').length;
  const totalCount = services.length;

  const getStatusConfig = (status: ServiceHealth['status']) => {
    switch (status) {
      case 'healthy':
        return {
          color: 'default' as const,
          icon: CheckCircle,
          label: 'Opérationnel',
          textColor: 'text-green-600',
          bgColor: 'bg-green-100 dark:bg-green-900/20',
        };
      case 'degraded':
        return {
          color: 'secondary' as const,
          icon: AlertTriangle,
          label: 'Dégradé',
          textColor: 'text-yellow-600',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
        };
      case 'down':
        return {
          color: 'destructive' as const,
          icon: XCircle,
          label: 'Hors ligne',
          textColor: 'text-red-600',
          bgColor: 'bg-red-100 dark:bg-red-900/20',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Monitoring Système</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {healthyCount}/{totalCount} services opérationnels
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const config = getStatusConfig(service.status);
          const Icon = config.icon;

          return (
            <Card key={service.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                  <Badge variant={config.color}>
                    <Icon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {service.uptime.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Temps de réponse</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {service.responseTime > 0 ? `${service.responseTime}ms` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Dernière vérification</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatRelativeTime(service.lastCheck)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques Système</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">78%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Memory</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">62%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Disk</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Network</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">34%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '34%' }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Logs Récents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 dark:text-red-400">
                  [ERROR] Payment Service - Connection timeout
                </p>
                <p className="text-xs text-red-700 dark:text-red-500 mt-1">
                  {formatRelativeTime(new Date(Date.now() - 120000))}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/10">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900 dark:text-yellow-400">
                  [WARN] Product Service - High latency detected
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                  {formatRelativeTime(new Date(Date.now() - 300000))}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-400">
                  [INFO] Kong Gateway - Rate limit applied
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-500 mt-1">
                  {formatRelativeTime(new Date(Date.now() - 600000))}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
