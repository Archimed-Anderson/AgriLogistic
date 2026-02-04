import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RequirePermission } from '@/router/guards/RequirePermission';
import { AdminPermission } from '@/domain/admin/permissions';
import { UsersTable } from '@/presentation/components/admin/users/UsersTable';
import { UserFilters } from '@/presentation/components/admin/users/UserFilters';
import { useAdminUsers } from '@/application/hooks/admin/useAdminUsers';

export default function UsersPage() {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: '',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useAdminUsers({ ...filters, ...pagination });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {data?.total || 0} utilisateurs au total
          </p>
        </div>

        <RequirePermission permission={AdminPermission.USERS_CREATE}>
          <Button asChild>
            <Link to="/admin/users/new">
              <Plus className="w-4 h-4 mr-2" />
              Nouvel utilisateur
            </Link>
          </Button>
        </RequirePermission>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <UserFilters filters={filters} onChange={setFilters} />
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={data?.users || []}
            pagination={pagination}
            onPaginationChange={setPagination}
            totalCount={data?.total || 0}
          />
        </CardContent>
      </Card>
    </div>
  );
}
