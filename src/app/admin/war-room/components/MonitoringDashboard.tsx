import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSystemStream, SystemMetrics } from '@/shared/hooks/useSystemStream';
import { 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Clock,
  Zap
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

// Core Widgets
import { ProcessMonitor } from './ProcessMonitor';
import { StorageAnalyzer } from './StorageAnalyzer';
import { SmartAlerts } from './SmartAlerts';
import { DiagnosticSuite } from './DiagnosticSuite';
import { EventJournal } from './EventJournal';
import { FluxChart } from './FluxChart';
import { MetricDrillDown } from './MetricDrillDown';

export function MonitoringDashboard() {
  const metrics = useSystemStream();
  const [history, setHistory] = useState<SystemMetrics[]>([]);
  const [activeDrilldown, setActiveDrilldown] = useState<string | null>(null);

  // Accumulate history for charts
  useEffect(() => {
    setHistory(prev => [...prev, metrics].slice(-20));
  }, [metrics]);

  return (
    <div className="space-y-6">
      {/* Global Status Header */}
      <Header metrics={metrics} onDrilldown={setActiveDrilldown} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real-time Analysis Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[350px]">
              <FluxChart 
                metrics={history} 
                dataKey="cpu" 
                color="#3b82f6" 
                title="Charge CPU (%)" 
                unit="%" 
              />
            </div>
            <div className="h-[350px]">
              <FluxChart 
                metrics={history.map(h => ({ ...h, netTotal: h.network.up + h.network.down }))} 
                dataKey="netTotal" 
                color="#10b981" 
                title="Trafic Réseau (MB/s)" 
                unit="MB/s" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="h-[400px]">
                <StorageAnalyzer />
             </div>
             <div className="h-[400px]">
                <DiagnosticSuite />
             </div>
          </div>

          <div className="h-[500px]">
             <EventJournal />
          </div>
        </div>

        {/* Action & Configuration Section */}
        <div className="lg:col-span-4 space-y-6">
           <div className="h-[600px]">
             <ProcessMonitor />
           </div>
           <div className="h-[714px]">
             <SmartAlerts />
           </div>
        </div>
      </div>

      {/* Drilldown Overlays */}
      <MetricDrillDown 
        isOpen={activeDrilldown === 'cpu'} 
        onClose={() => setActiveDrilldown(null)}
        title="Charge Processeur"
        metricValue={`${metrics.cpu}%`}
        color="text-primary"
      />
      <MetricDrillDown 
        isOpen={activeDrilldown === 'ram'} 
        onClose={() => setActiveDrilldown(null)}
        title="Mémoire Vive"
        metricValue={`${metrics.memory.percent}%`}
        color="text-blue-500"
      />
    </div>
  );
}

function Header({ metrics, onDrilldown }: { metrics: SystemMetrics, onDrilldown: (id: string) => void }) {
  const statusStyles = {
    nominal: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    critical: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-card/40 backdrop-blur-md border border-border p-5 rounded-2xl flex items-center justify-between group transition-all hover:bg-card/60 cursor-default shadow-lg">
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status Global</p>
          <div className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-tighter flex items-center gap-1.5",
            statusStyles[metrics.status]
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", 
              metrics.status === 'nominal' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
              metrics.status === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
            )} />
            {metrics.status}
          </div>
        </div>
        <ShieldCheck className={cn("w-8 h-8 transition-colors duration-500", 
          metrics.status === 'nominal' ? 'text-emerald-500' : 'text-rose-500'
        )} />
      </div>

      <MetricCard 
        label="Charge CPU" 
        value={`${metrics.cpu}%`} 
        icon={Cpu} 
        progress={metrics.cpu}
        color={metrics.cpu > 80 ? 'text-rose-500' : metrics.cpu > 60 ? 'text-amber-500' : 'text-primary'}
        onClick={() => onDrilldown('cpu')}
      />

      <MetricCard 
        label="Mémoire Vive" 
        value={`${metrics.memory.percent}%`} 
        icon={Activity} 
        progress={metrics.memory.percent}
        color="text-blue-500"
        onClick={() => onDrilldown('ram')}
      />

      <div className="bg-card/40 backdrop-blur-md border border-border p-5 rounded-2xl flex items-center justify-between group transition-all hover:bg-card/60 shadow-lg">
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Dernière Sync</p>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-sm font-black font-mono tracking-tight text-foreground transition-all">{metrics.timestamp}</span>
          </div>
        </div>
        <div className="p-2 bg-primary/10 rounded-xl border border-primary/20 group-hover:scale-110 transition-transform">
          <Zap className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, progress, color, onClick }: any) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card/40 backdrop-blur-md border border-border p-5 rounded-2xl flex flex-col justify-between overflow-hidden relative cursor-pointer group transition-all hover:bg-card/60 shadow-lg"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
          <h4 className={cn("text-xl font-black tracking-tighter group-hover:scale-105 origin-left transition-transform", color)}>{value}</h4>
        </div>
        <Icon className={cn("w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity", color)} />
      </div>
      <div className="w-full h-1 bg-foreground/5 rounded-full overflow-hidden mt-auto">
        <motion.div 
          className={cn("h-full bg-current", color)}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
