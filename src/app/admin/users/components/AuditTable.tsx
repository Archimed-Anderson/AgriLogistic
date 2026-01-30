import React from 'react';
import { 
  History, 
  Search, 
  ShieldCheck, 
  UserCircle, 
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';
import { AuditLog } from '@/shared/types/user';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/shared/lib/utils';

const MOCK_LOGS: AuditLog[] = [
  { id: 'LOG-001', adminId: 'ADMIN-001', adminName: 'Admin Principal', action: 'IMPERSONATE_START', targetUserId: 'USR-002', targetUserName: 'Sophie Ndiaye', timestamp: '2024-01-24T18:45:00Z', details: 'Début d\'impersonation : Vérification erreur panier' },
  { id: 'LOG-002', adminId: 'ADMIN-001', adminName: 'Admin Principal', action: 'ROLE_UPDATE', targetUserId: 'USR-004', targetUserName: 'Admin Secondary', timestamp: '2024-01-24T18:30:00Z', details: 'Ajout permission [Accès CLI]' },
  { id: 'LOG-003', adminId: 'ADMIN-002', adminName: 'Admin Tech', action: 'USER_SUSPEND', targetUserId: 'USR-005', targetUserName: 'Abdou Konate', timestamp: '2024-01-23T14:20:00Z', details: 'Suspension : Activité suspecte détectée' },
  { id: 'LOG-004', adminId: 'ADMIN-001', adminName: 'Admin Principal', action: 'LOGIN', targetUserId: 'ADMIN-001', timestamp: '2024-01-24T08:00:00Z', details: 'Connexion réussie via 2FA' },
];

export function AuditTable() {
  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-xl rounded-[40px] overflow-hidden border border-border shadow-2xl">
      {/* Header */}
      <div className="p-8 border-b border-border bg-foreground/5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
                <History className="w-5 h-5" />
             </div>
             <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-tighter">Journal d'Audit Système</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Traçabilité Immutable • {MOCK_LOGS.length} Entrées</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-foreground/5">
                <Search className="w-4 h-4" />
             </Button>
             <Button variant="outline" className="rounded-xl border-border bg-background/50 backdrop-blur-md h-10 gap-2 shadow-sm text-[10px] font-black uppercase tracking-widest">
                <Filter className="w-3.5 h-3.5" />
                Filtres Temporels
             </Button>
          </div>
        </div>
      </div>

      {/* Logs Stream */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10 p-6 space-y-3">
        {MOCK_LOGS.map((log) => (
          <div key={log.id} className="group p-5 rounded-[32px] bg-foreground/5 border border-border transition-all hover:bg-card hover:shadow-xl hover:border-amber-500/20 flex flex-col md:flex-row md:items-center gap-6">
            
            <div className="flex items-center gap-4 shrink-0">
               <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-amber-500 group-hover:border-amber-500/30 transition-all">
                  <ActionIcon action={log.action} />
               </div>
               <div className="min-w-[120px]">
                  <p className="text-[10px] font-black text-foreground uppercase tracking-tighter">{log.action.replace('_', ' ')}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                     <Clock className="w-3 h-3 text-muted-foreground" />
                     <p className="text-[9px] font-mono font-bold text-muted-foreground">
                       {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </p>
                  </div>
               </div>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Admin Source */}
               <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase">Admin</p>
                    <p className="text-[11px] font-black text-foreground">{log.adminName}</p>
                  </div>
               </div>

               {/* Target User */}
               <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
                    <UserCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase">Cible</p>
                    <p className="text-[11px] font-black text-foreground">{log.targetUserName || log.targetUserId}</p>
                  </div>
               </div>
            </div>

            <div className="md:w-1/3 flex items-center justify-between border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6">
               <p className="text-[10px] italic text-muted-foreground leading-relaxed font-medium">
                 "{log.details}"
               </p>
               <Button variant="ghost" size="icon" className="shrink-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all">
                  <ArrowRight className="w-4 h-4" />
               </Button>
            </div>

          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="p-6 bg-amber-500/5 border-t border-amber-500/20 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Journal Immutable SHA-256 Verifié</span>
         </div>
         <p className="text-[9px] font-mono font-bold text-amber-500 opacity-60">SESS-BLOCK: x9k2-p9L0-v4M1</p>
      </div>
    </div>
  );
}

function ActionIcon({ action }: { action: AuditLog['action'] }) {
  switch (action) {
    case 'IMPERSONATE_START': return <Eye className="w-5 h-5" />;
    case 'ROLE_UPDATE': return <Settings2 className="w-5 h-5" />;
    case 'USER_SUSPEND': return <ShieldAlert className="w-5 h-5" />;
    default: return <UserCircle className="w-5 h-5" />;
  }
}

import { Eye, Settings2, ShieldAlert } from 'lucide-react';
