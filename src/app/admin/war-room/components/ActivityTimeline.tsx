import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, UserPlus, Settings, ShieldAlert, ExternalLink, Clock } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface Activity {
  id: string;
  type: 'order' | 'registration' | 'system' | 'security';
  title: string;
  user: string;
  timestamp: string;
  amount?: string;
}

export function ActivityTimeline({ activities }: { activities: Activity[] }) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'order':
        return ShoppingBag;
      case 'registration':
        return UserPlus;
      case 'system':
        return Settings;
      case 'security':
        return ShieldAlert;
      default:
        return Clock;
    }
  };

  const getColor = (type: Activity['type']) => {
    switch (type) {
      case 'order':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'registration':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'system':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'security':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-xl border border-border rounded-[40px] overflow-hidden shadow-2xl transition-all hover:bg-card/50">
      <div className="p-8 border-b border-border bg-foreground/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-foreground uppercase tracking-tighter">
            Flux d'Activité
          </h3>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
            Temps Réel • {activities.length} alertes
          </p>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10 p-4 space-y-3">
        <AnimatePresence initial={false}>
          {activities.map((activity) => {
            const Icon = getIcon(activity.type);
            const style = getColor(activity.type);

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group p-4 rounded-3xl bg-foreground/5 border border-border transition-all hover:bg-card hover:shadow-xl hover:border-primary/20 flex items-center gap-4 cursor-pointer"
              >
                <div
                  className={cn(
                    'p-3 rounded-2xl border shrink-0 transition-transform group-hover:scale-110',
                    style
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[11px] font-black text-foreground truncate uppercase tracking-tight">
                      {activity.title}
                    </p>
                    {activity.amount && (
                      <span className="text-[10px] font-black text-emerald-500 tabular-nums">
                        {activity.amount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">
                      {activity.user}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-[9px] font-mono text-muted-foreground font-bold">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3.5 h-3.5 text-primary" />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <button className="p-6 bg-foreground/5 border-t border-border text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] hover:text-primary hover:bg-foreground/10 transition-all">
        Voir tout l'historique
      </button>
    </div>
  );
}
