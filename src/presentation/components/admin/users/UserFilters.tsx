import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminRole } from '@/domain/admin/permissions';

interface UserFiltersProps {
  filters: {
    search: string;
    role: string;
    status: string;
  };
  onChange: (filters: any) => void;
}

export function UserFilters({ filters, onChange }: UserFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Rechercher par nom ou email..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Role filter */}
      <Select value={filters.role} onValueChange={(value) => onChange({ ...filters, role: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Tous les rôles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les rôles</SelectItem>
          <SelectItem value={AdminRole.SUPER_ADMIN}>Super Admin</SelectItem>
          <SelectItem value={AdminRole.ADMIN}>Admin</SelectItem>
          <SelectItem value={AdminRole.MANAGER}>Manager</SelectItem>
          <SelectItem value={AdminRole.SUPPORT}>Support</SelectItem>
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select
        value={filters.status}
        onValueChange={(value) => onChange({ ...filters, status: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Tous les statuts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les statuts</SelectItem>
          <SelectItem value="active">Actif</SelectItem>
          <SelectItem value="inactive">Inactif</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
