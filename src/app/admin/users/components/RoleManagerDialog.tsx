import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/app/components/ui/dialog';
import { Switch } from '@/app/components/ui/switch';
import { User, Permission } from '@/shared/types/user';
import { Button } from '@/app/components/ui/button';
import { 
  ShieldCheck, 
  Lock, 
  Zap, 
  Database, 
  Users as UsersIcon,
  Settings
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface RoleManagerDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PERMISSIONS: Permission[] = [
  { id: '1', name: 'Can View Analytics', category: 'Analytics', description: 'Accès aux rapports et KPIs profonds' },
  { id: '2', name: 'Can Export Finances', category: 'Finances', description: 'Extraction des journaux de transactions' },
  { id: '3', name: 'Can Manage Users', category: 'Users', description: 'Suspendre ou modifier les comptes' },
  { id: '4', name: 'Can Access CLI', category: 'System', description: 'Accès au terminal d\'administration' },
];

export function RoleManagerDialog({ user, open, onOpenChange }: RoleManagerDialogProps) {
  const [userPermissions, setUserPermissions] = useState<string[]>(user.permissions || ['1', '3']);
  const [loading, setLoading] = useState(false);

  const togglePermission = (id: string) => {
    setUserPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`[RBAC] Updated permissions for ${user.id}:`, userPermissions);
      setLoading(false);
      onOpenChange(false);
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-2xl border-border rounded-[40px] shadow-2xl p-0 overflow-hidden outline-none">
        <div className="bg-primary/5 p-8 border-b border-border">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-foreground uppercase tracking-tighter">Gestionnaire RBAC</DialogTitle>
                <DialogDescription className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                   Modifier les privilèges de : <span className="text-foreground">{user.name}</span> ({user.id})
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8">
          {['Analytics', 'Finances', 'Users', 'System'].map((cat) => (
            <div key={cat} className="space-y-4">
               <div className="flex items-center gap-2 mb-4">
                  <CategoryIcon category={cat as any} />
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{cat}</h4>
                  <div className="flex-1 h-px bg-border/50 ml-2" />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PERMISSIONS.filter(p => p.category === cat).map(permission => (
                    <div 
                      key={permission.id}
                      className={cn(
                        "p-4 rounded-3xl border transition-all flex items-center justify-between group",
                        userPermissions.includes(permission.id) 
                          ? "bg-primary/5 border-primary/30 shadow-inner" 
                          : "bg-foreground/5 border-border/50 hover:bg-foreground/10"
                      )}
                    >
                      <div className="flex-1 pr-4">
                        <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{permission.name}</p>
                        <p className="text-[9px] text-muted-foreground font-medium mt-1 leading-relaxed">{permission.description}</p>
                      </div>
                      <Switch 
                        checked={userPermissions.includes(permission.id)} 
                        onCheckedChange={() => togglePermission(permission.id)}
                      />
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>

        <DialogFooter className="p-8 bg-foreground/5 border-t border-border flex items-center justify-between sm:justify-between">
           <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest italic">Action Protégée (Auditée)</span>
           </div>
           <div className="flex items-center gap-3">
              <Button variant="ghost" className="rounded-xl text-[10px] font-black uppercase tracking-widest" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button 
                className="rounded-xl px-8 h-11 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Sauvegarde...' : 'Appliquer les privilèges'}
              </Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoryIcon({ category }: { category: Permission['category'] }) {
  const icons = {
    Analytics: <Zap className="w-3.5 h-3.5 text-blue-500" />,
    Finances: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
    Users: <UsersIcon className="w-3.5 h-3.5 text-purple-500" />,
    System: <Database className="w-3.5 h-3.5 text-amber-500" />
  };
  return icons[category];
}
