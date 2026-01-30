import React, { useState } from 'react';
import { 
  Bell, 
  Settings2, 
  AlertTriangle, 
  Zap, 
  ShieldCheck,
  ChevronDown,
  Save,
  BellRing
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

interface AlertRule {
  id: string;
  metric: string;
  threshold: number;
  duration: number;
  enabled: boolean;
  severity: 'warning' | 'critical';
}

export function SmartAlerts() {
  const [rules, setRules] = useState<AlertRule[]>([
    { id: '1', metric: 'Charge CPU', threshold: 85, duration: 5, enabled: true, severity: 'critical' },
    { id: '2', metric: 'Latence Réseau', threshold: 500, duration: 2, enabled: true, severity: 'warning' },
    { id: '3', metric: 'Espace Disque', threshold: 90, duration: 1, enabled: false, severity: 'critical' },
  ]);

  const handleToggle = (id: string) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    const rule = rules.find(r => r.id === id);
    if (!rule?.enabled) {
      toast.info(`Alerte activée : ${rule?.metric}`);
    } else {
       toast.warning(`Alerte désactivée : ${rule?.metric}`);
    }
  };

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border rounded-[32px] overflow-hidden flex flex-col h-full shadow-2xl transition-all hover:bg-card/50">
      {/* Header */}
      <div className="p-6 border-b border-border bg-foreground/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-500">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-foreground uppercase tracking-tighter">Alertes Intelligentes</h3>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{rules.filter(r => r.enabled).length} Actives</p>
          </div>
        </div>
        <Settings2 className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
      </div>

      {/* Rules List */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10">
        <div className="flex items-center gap-2 p-3 bg-foreground/5 rounded-2xl border border-border border-dashed text-muted-foreground mb-2">
           <Zap className="w-3 h-3 text-primary" />
           <span className="text-[9px] font-black uppercase tracking-widest">Seuils de Détection Active</span>
        </div>

        {rules.map((rule) => (
          <div key={rule.id} className={cn(
            "p-5 rounded-3xl border transition-all duration-300 relative group",
            rule.enabled ? 'bg-card border-border shadow-md' : 'bg-foreground/5 border-transparent opacity-60'
          )}>
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   {rule.severity === 'critical' ? (
                     <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                   ) : (
                     <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                   )}
                   <span className="text-xs font-black text-foreground uppercase tracking-tight">{rule.metric}</span>
                </div>
                <button 
                  onClick={() => handleToggle(rule.id)}
                  className={cn(
                    "w-10 h-5 rounded-full relative transition-colors duration-300",
                    rule.enabled ? 'bg-primary' : 'bg-muted'
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300",
                    rule.enabled ? 'left-6' : 'left-1'
                  )} />
                </button>
             </div>

             <div className="space-y-3">
               <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Valeur Seuil</span>
                  <span className="text-[10px] font-black text-foreground">{rule.threshold}% / {rule.duration}m</span>
               </div>
               <div className="h-1 bg-foreground/5 rounded-full overflow-hidden">
                  <div className="h-full bg-foreground/10 w-3/4 rounded-full" />
               </div>
               <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 pt-1">
                  <span>SIG_LEVEL: {rule.severity.toUpperCase()}</span>
                  <div className="flex items-center gap-1 group-hover:text-primary transition-colors cursor-pointer">
                    Modifier <ChevronDown className="w-2.5 h-2.5" />
                  </div>
               </div>
             </div>
          </div>
        ))}

        {/* Empty Space / Add Rule Button */}
        <button className="w-full p-4 border border-dashed border-border rounded-3xl flex items-center justify-center gap-2 text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-all">
           <AlertTriangle className="w-4 h-4" />
           <span className="text-[9px] font-black uppercase tracking-widest">Ajouter un nouveau seuil</span>
        </button>
      </div>

      {/* Action Bar */}
      <div className="p-4 bg-primary/10 border-t border-primary/20 flex items-center justify-between gap-4">
         <div className="flex-1">
           <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">Notification Push</p>
           <p className="text-[10px] text-foreground font-medium leading-tight">Canaux: Slack, Email, App</p>
         </div>
         <Button className="rounded-xl h-9 gap-2 shadow-lg shadow-primary/20">
            <Save className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">Appliquer</span>
         </Button>
      </div>
    </div>
  );
}
