import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Activity, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface DrillDownProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  metricValue: string;
  color: string;
  children?: React.ReactNode;
}

export function MetricDrillDown({
  isOpen,
  onClose,
  title,
  metricValue,
  color,
  children,
}: DrillDownProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <React.Fragment>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:max-w-4xl w-full h-[80vh] bg-card border border-border shadow-2xl rounded-[40px] z-[101] flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-border bg-foreground/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'p-3 rounded-2xl border',
                    color
                      .replace('text-', 'bg-')
                      .replace('-500', '-500/10 border-')
                      .concat('-500/20')
                      .concat(' ')
                      .concat(color)
                  )}
                >
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase">
                    {title}
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">
                    Analyse Granulaire & Historique
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-foreground/5 rounded-2xl border border-border hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-foreground/10">
              {/* Hero Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatItem
                  label="Valeur Actuelle"
                  value={metricValue}
                  color={color}
                  icon={Activity}
                />
                <StatItem
                  label="Moyenne (1h)"
                  value="14.2%"
                  color="text-muted-foreground"
                  icon={Clock}
                />
                <StatItem
                  label="Seuil d'Alerte"
                  value="85%"
                  color="text-rose-500"
                  icon={AlertCircle}
                />
              </div>

              {/* Chart Placeholder */}
              <div className="bg-foreground/5 border border-border rounded-[32px] p-8 h-[400px] border-dashed flex flex-col items-center justify-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground/20 mb-4 animate-bounce" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Graphique Haute Résolution en cours de chargement...
                </p>
              </div>

              {/* Children Content */}
              {children}
            </div>

            {/* Footer */}
            <div className="p-6 bg-foreground/5 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                  Flux Synchronisé: OK
                </span>
              </div>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
                Exporter les Données (.CSV)
              </button>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
}

function StatItem({ label, value, color, icon: Icon }: any) {
  return (
    <div className="bg-foreground/5 border border-border p-6 rounded-3xl flex items-center justify-between">
      <div>
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">
          {label}
        </p>
        <h4 className={cn('text-2xl font-black tracking-tighter', color)}>{value}</h4>
      </div>
      <Icon className={cn('w-6 h-6 opacity-30', color)} />
    </div>
  );
}
