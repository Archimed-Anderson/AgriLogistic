import React, { useState } from 'react';
import { 
  Settings2, 
  ShieldAlert, 
  User as UserIcon,
  ChevronRight,
  Filter,
  Users as UsersIcon,
  Search,
  Eye
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { User, UserRole } from '@/shared/types/user';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { Button } from '@/app/components/ui/button';
import { RoleManagerDialog } from './RoleManagerDialog';

const MOCK_USERS: User[] = [
  { id: 'USR-001', name: 'Moussa Diop', email: 'moussa@dakar.sn', role: 'farmer', status: 'active', lastLogin: 'Il y a 2h' },
  { id: 'USR-002', name: 'Sophie Ndiaye', email: 'sophie@agri.com', role: 'buyer', status: 'active', lastLogin: 'Il y a 15m' },
  { id: 'USR-003', name: 'Ibrahima Faye', email: 'ibra@logistics.sn', role: 'transporter', status: 'active', lastLogin: 'Hier' },
  { id: 'USR-004', name: 'Admin Secondary', email: 'admin2@AgriLogistic.com', role: 'admin', status: 'active', lastLogin: 'En ligne' },
  { id: 'USR-005', name: 'Abdou Konate', email: 'abdou@farm.sn', role: 'farmer', status: 'suspended', lastLogin: '3 jours' },
];

export function UserTable() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const startImpersonation = useAuthStore(state => state.startImpersonation);

  const filteredUsers = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-xl rounded-[40px] overflow-hidden border border-border shadow-2xl">
      {/* Header & Search */}
      <div className="p-8 border-b border-border bg-foreground/5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20">
                <UsersIcon className="w-5 h-5 text-primary" />
             </div>
             <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-tighter">Répertoire Gouvernance</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{MOCK_USERS.length} Comptes Identifiés</p>
             </div>
          </div>
          <Button variant="outline" className="rounded-xl border-border bg-background/50 backdrop-blur-md h-10 gap-2 shadow-sm text-[10px] font-black uppercase tracking-widest">
            <Filter className="w-3.5 h-3.5" />
            Filtres Avancés
          </Button>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Rechercher un utilisateur (Nom, Email, ID)..."
            className="w-full bg-background/50 border border-border rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10 px-6 py-4">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] px-4">
              <th className="pb-4 pl-4">Utilisateur</th>
              <th className="pb-4">Rôle</th>
              <th className="pb-4">Statut</th>
              <th className="pb-4">Dernière Connexion</th>
              <th className="pb-4 text-right pr-4">Actions de Gouvernance</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-foreground/5 transition-all duration-300 rounded-[24px]">
                <td className="py-4 pl-4 rounded-l-[24px]">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-background border border-border flex items-center justify-center text-[10px] font-black group-hover:border-primary/30 transition-colors shadow-sm">
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-foreground">{user.name}</p>
                        <p className="text-[10px] text-muted-foreground font-bold tracking-tight">{user.email}</p>
                      </div>
                   </div>
                </td>
                <td className="py-4">
                   <RoleBadge role={user.role} />
                </td>
                <td className="py-4">
                   <div className={cn(
                     "px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit",
                     user.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                   )}>
                     <div className={cn("w-1 h-1 rounded-full", user.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-rose-500")} />
                     {user.status}
                   </div>
                </td>
                <td className="py-4">
                   <span className="text-[10px] font-bold text-muted-foreground">{user.lastLogin}</span>
                </td>
                <td className="py-4 text-right pr-4 rounded-r-[24px]">
                   <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-9 h-9 rounded-xl hover:bg-primary/10 text-primary transition-all group/btn"
                        onClick={() => startImpersonation(user)}
                        title="Impersonner (God Mode)"
                      >
                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-9 h-9 rounded-xl hover:bg-foreground/10 text-muted-foreground"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsRoleDialogOpen(true);
                        }}
                        title="Gérer les Permissions"
                      >
                        <Settings2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-rose-500/10 text-rose-500">
                        <ShieldAlert className="w-4 h-4" />
                      </Button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-6 bg-foreground/5 border-t border-border flex items-center justify-between font-mono">
         <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">Affichage de {filteredUsers.length} Entrées</p>
         <div className="flex items-center gap-4 text-[9px] font-black text-primary uppercase tracking-widest cursor-pointer hover:underline">
            Exporter JSON <ChevronRight size={12} />
         </div>
      </div>

      {selectedUser && (
        <RoleManagerDialog 
          user={selectedUser} 
          open={isRoleDialogOpen} 
          onOpenChange={setIsRoleDialogOpen} 
        />
      )}
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles = {
    admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]',
    buyer: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    farmer: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    transporter: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  };

  return (
    <div className={cn(
      "px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-[0.1em] w-fit",
      styles[role]
    )}>
      {role}
    </div>
  );
}



