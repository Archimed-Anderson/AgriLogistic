import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAdminDashboardMetrics, useSystemAlerts, useDismissAlert } from '@/application/hooks/admin/useAdminDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { UsersChart } from '@/presentation/components/admin/charts/UsersChart';
import { RevenueChart } from '@/presentation/components/admin/charts/RevenueChart';

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
}

function KPICard({ label, value, change, icon: Icon, color }: KPICardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
              {value}
            </p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {change >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change >= 0 ? '+' : ''}{change}%
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  vs mois dernier
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data: metrics, isLoading: metricsLoading } = useAdminDashboardMetrics();
  const { data: alerts } = useSystemAlerts();
  const dismissAlert = useDismissAlert();
  
  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard Admin
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Vue d'ensemble de la plateforme
        </p>
      </div>
      
      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Alert key={alert.id} variant={alert.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription className="flex items-center justify-between">
                <span>{alert.message}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => dismissAlert.mutate(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
      
      {/* KPIs Grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="Utilisateurs Totaux"
            value={metrics.totalUsers.toLocaleString()}
            change={metrics.usersChange}
            icon={Users}
            color="blue"
          />
          <KPICard
            label="Utilisateurs Actifs"
            value={metrics.activeUsers.toLocaleString()}
            icon={UserCheck}
            color="green"
          />
          <KPICard
            label="Commandes"
            value={metrics.totalOrders.toLocaleString()}
            change={metrics.ordersChange}
            icon={ShoppingCart}
            color="purple"
          />
          <KPICard
            label="Revenus"
            value={`${(metrics.revenue / 1000).toFixed(1)}k €`}
            change={metrics.revenueChange}
            icon={DollarSign}
            color="orange"
          />
        </div>
      )}
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs Actifs (30 jours)</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics?.usersOverTime ? (
              <UsersChart data={metrics.usersOverTime} height={256} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenus (30 jours)</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics?.revenueOverTime ? (
              <RevenueChart data={metrics.revenueOverTime} height={256} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                Aucune donnée disponible
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity - TODO */}
      <Card>
        <CardHeader>
          <CardTitle>Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 dark:text-gray-400 text-center py-8">
            Liste d'activités à implémenter
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
