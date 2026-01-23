import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { formatDateTime } from '@/shared/utils/format';

interface AuditLog {
  id: string;
  timestamp: Date;
  adminUserEmail: string;
  action: string;
  resource: string;
  status: 'success' | 'failure';
}

export default function SecurityPage() {
  // TODO: Fetch real data from API
  const auditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 120000),
      adminUserEmail: 'admin@example.com',
      action: 'create_user',
      resource: 'users',
      status: 'success',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000),
      adminUserEmail: 'admin@example.com',
      action: 'update_product',
      resource: 'products',
      status: 'success',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000),
      adminUserEmail: 'manager@example.com',
      action: 'delete_user',
      resource: 'users',
      status: 'failure',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sécurité & Audit
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Logs d'audit et surveillance des activités
        </p>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Rechercher dans les logs..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Logs d'Audit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.action}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      sur {log.resource}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{log.adminUserEmail}</span>
                    <span>•</span>
                    <span>{formatDateTime(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Sessions Actives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Liste des sessions actives à implémenter
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
