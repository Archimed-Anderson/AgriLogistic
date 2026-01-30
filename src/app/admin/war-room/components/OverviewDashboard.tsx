import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Box, 
  Plus, 
  Users, 
  Download,
  Settings
} from 'lucide-react';
import { useOverviewMetrics, OverviewMetrics } from '@/shared/hooks/useOverviewMetrics';
import { MetricSparkCard } from './MetricSparkCard';
import { ActivityTimeline } from './ActivityTimeline';
import { PerformanceRadar } from './PerformanceRadar';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/shared/lib/utils';

export function OverviewDashboard() {
  const metrics = useOverviewMetrics();

  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <MetricSparkCard 
          title="Revenus (Global)" 
          value={metrics.revenue.total.toLocaleString()} 
          delta={metrics.revenue.delta}
          deltaType="up"
          label="FCFA / 24h"
          icon={Zap}
          trend={metrics.revenue.trend}
          color="text-amber-500"
        />
        <MetricSparkCard 
          title="Taux d'erreur" 
          value="0.04%" 
          delta="-0.01%"
          deltaType="up" // Lower error is "up" in quality
          label="SLA: 99.9%"
          icon={Shield}
          trend={[8, 5, 6, 4, 3, 2, 4]}
          color="text-emerald-500"
        />
        <MetricSparkCard 
          title="Transactions" 
          value={metrics.transactions.total.toLocaleString()} 
          delta={metrics.transactions.delta}
          deltaType="up"
          label="Peak: 14 TP/s"
          icon={Box}
          trend={metrics.transactions.trend}
          color="text-primary"
        />
        <MetricSparkCard 
          title="Utilisateurs Actifs" 
          value={metrics.users.active.toString()} 
          delta={metrics.users.delta}
          deltaType="up"
          label="Total: 12.4k"
          icon={Users}
          trend={[280, 310, 305, 340, 350, 335, 360]}
          color="text-blue-500"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Activity & Summary */}
        <div className="lg:col-span-8 space-y-8">
          <div className="h-[500px]">
            <ActivityTimeline activities={metrics.activities} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <QuickActionPanel />
             <SystemStatus metrics={metrics} />
          </div>
        </div>

        {/* Right Col: Performance & Charts */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="h-[450px]">
             <PerformanceRadar />
          </div>
          
          <div className="flex-1 bg-card/40 backdrop-blur-xl border border-border rounded-[40px] p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Settings size={64} className="text-primary" />
             </div>
             <h4 className="text-sm font-black text-foreground uppercase tracking-tighter mb-2">Centre de Commandement</h4>
             <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-relaxed mb-6">
                Configuration avancée des seuils d'automatisation et des politiques de sécurité.
             </p>
             <Button variant="outline" className="w-full rounded-2xl border-border bg-foreground/5 h-12 text-[10px] font-black uppercase tracking-widest gap-2">
                Accéder aux Paramètres
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionPanel() {
  const actions = [
    { label: 'Nouveau Rapport', icon: Download, color: 'text-primary' },
    { label: 'Ajouter Producteur', icon: Plus, color: 'text-emerald-500' },
    { label: 'Audit Sécurité', icon: Shield, color: 'text-amber-500' },
  ];

  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border rounded-[40px] p-8 flex flex-col justify-between shadow-lg">
      <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">Actions Rapides</h4>
      <div className="space-y-4">
        {actions.map((action, i) => (
          <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-foreground/5 border border-border/50 hover:bg-foreground/10 transition-all group">
            <div className="flex items-center gap-3">
              <action.icon className={cn("w-4 h-4", action.color)} />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{action.label}</span>
            </div>
            <Plus className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SystemStatus({ metrics }: { metrics: OverviewMetrics }) {
  return (
    <div className="bg-card/40 backdrop-blur-xl border border-border rounded-[40px] p-8 flex flex-col justify-between shadow-lg">
      <div className="flex items-center justify-between mb-8">
         <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Intégrité Cluster</h4>
         <div className={cn(
           "px-2 py-0.5 rounded-full text-[8px] font-black border uppercase",
           metrics.health.status === 'nominal' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
         )}>
           {metrics.health.status}
         </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-end mb-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Score de Santé</p>
            <p className="text-xl font-black text-foreground tabular-nums">{metrics.health.score.toFixed(2)}%</p>
          </div>
          <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-emerald-500"
               initial={{ width: 0 }}
               animate={{ width: `${metrics.health.score}%` }}
             />
          </div>
        </div>

        <div className="flex items-center gap-4 py-3 border-t border-border/50">
           <StatusMini label="Database" value="9ms" active />
           <StatusMini label="API Gateway" value="12ms" active />
           <StatusMini label="Cache" value="1ms" active />
        </div>
      </div>
    </div>
  );
}

function StatusMini({ label, value, active }: { label: string, value: string, active: boolean }) {
  return (
    <div className="flex flex-col">
       <div className="flex items-center gap-1.5 mb-1">
          <div className={cn("w-1.5 h-1.5 rounded-full", active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-muted')} />
          <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
       </div>
       <span className="text-[10px] font-bold text-foreground ml-3">{value}</span>
    </div>
  );
}
