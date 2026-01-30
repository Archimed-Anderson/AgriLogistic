import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Map as MapIcon, 
  Calendar, 
  Filter,
  Plus
} from 'lucide-react';
import { useLogisticsStream } from '@/shared/hooks/useLogisticsStream';
import { Button } from '@/app/components/ui/button';
import { cn } from '@/shared/lib/utils';

// Widgets
import { FleetMonitor } from './FleetMonitor';
import { LogisticsMap } from './LogisticsMap';
import { DynamicPlanner } from './DynamicPlanner';
import { LogisticsAnalytics } from './LogisticsAnalytics';

export function LogisticsDashboard() {
  const vehicles = useLogisticsStream();
  const [activeView, setActiveView] = useState<'map' | 'fleet' | 'planner'>('map');

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-xl border border-primary/20">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tighter text-foreground uppercase">Centre d'Opérations Flotte</h2>
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{vehicles.length} Véhicules en temps réel</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-card/40 backdrop-blur-md p-1.5 rounded-2xl border border-border shadow-lg">
          <ViewToggle active={activeView === 'map'} icon={MapIcon} label="Carte" onClick={() => setActiveView('map')} />
          <ViewToggle active={activeView === 'fleet'} icon={Truck} label="Flotte" onClick={() => setActiveView('fleet')} />
          <ViewToggle active={activeView === 'planner'} icon={Calendar} label="Planning" onClick={() => setActiveView('planner')} />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-border bg-card/40 backdrop-blur-md h-10 gap-2 shadow-sm uppercase text-[10px] font-black tracking-widest">
            <Filter className="w-3.5 h-3.5" />
            Filtres
          </Button>
          <Button className="rounded-xl h-10 gap-2 shadow-lg shadow-primary/20 uppercase text-[10px] font-black tracking-widest">
            <Plus className="w-4 h-4" />
            Nouvelle Expédition
          </Button>
        </div>
      </div>

      {/* Dynamic Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
        {/* Main Content Area */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="flex-1 rounded-[40px] overflow-hidden border border-border shadow-2xl relative bg-card/5">
              <AnimatePresence mode="wait">
                {activeView === 'map' ? (
                  <motion.div 
                    key="map"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="w-full h-full"
                  >
                    <LogisticsMap />
                  </motion.div>
                ) : activeView === 'fleet' ? (
                  <motion.div 
                    key="fleet"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full h-full"
                  >
                    <FleetMonitor vehicles={vehicles} />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="planner"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full h-full"
                  >
                    <DynamicPlanner />
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
           <KPIGrid vehicles={vehicles} />
           <div className="flex-1">
              <LogisticsAnalytics />
           </div>
           
           <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-6">
              <div className="flex items-center justify-between mb-4">
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Alertes Proactives</h4>
                 <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
              </div>
              <p className="text-xs text-foreground font-bold mb-1">Incident Critique : FL-003</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium capitalize">
                Retard détecté sur l'axe Thiès - Dakar. Ralentissement majeur par congestion. <span className="text-primary font-black ml-1">+25min</span>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

// Define a type for the icon component
type IconComponent = React.ElementType;

function ViewToggle({ active, icon: Icon, label, onClick }: { active: boolean, icon: IconComponent, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl flex items-center gap-2 transition-all group",
        active ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
      )}
    >
      <Icon className={cn("w-4 h-4", active ? 'text-white' : 'text-muted-foreground group-hover:text-primary')} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function KPIGrid({ vehicles }: { vehicles: any[] }) {
  const activeCount = vehicles.filter(v => v.status === 'active').length;
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-card/40 backdrop-blur-md border border-border p-5 rounded-2xl">
         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">En Transit</p>
         <h3 className="text-2xl font-black text-foreground tracking-tighter">{activeCount}</h3>
         <div className="w-full h-1 bg-foreground/5 rounded-full mt-2">
            <div className="h-full bg-primary rounded-full w-3/4" />
         </div>
      </div>
      <div className="bg-card/40 backdrop-blur-md border border-border p-5 rounded-2xl">
         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Utilisation</p>
         <h3 className="text-2xl font-black text-emerald-500 tracking-tighter">88%</h3>
         <div className="w-full h-1 bg-foreground/5 rounded-full mt-2">
            <div className="h-full bg-emerald-500 rounded-full w-4/5" />
         </div>
      </div>
    </div>
  );
}
