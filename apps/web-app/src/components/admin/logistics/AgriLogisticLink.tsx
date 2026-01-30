"use client"

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  AlertTriangle 
} from 'lucide-react';

import { CockpitView } from './views/CockpitView';
import { CargosView } from './views/CargosView';
import { FleetView } from './views/FleetView';
import { AlertsView } from './views/AlertsView';

export function AgriLogisticLink() {
  const [activeTab, setActiveTab] = useState<'cockpit' | 'cargos' | 'fleet' | 'alerts'>('cockpit');
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      
      {/* HEADER & TABS NAVIGATION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            AgriLogistic Cockpit
          </h2>
          <p className="text-muted-foreground text-sm">Centre de contrôle des opérations logistiques et du matching IA.</p>
        </div>
        
        <div className="flex bg-muted/50 p-1 rounded-lg border">
             <button
                onClick={() => setActiveTab('cockpit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'cockpit' 
                    ? 'bg-background shadow-sm text-primary ring-1 ring-black/5 dark:ring-white/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
             >
                <LayoutDashboard className="w-4 h-4" /> Cockpit
             </button>
             <button
                onClick={() => setActiveTab('cargos')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'cargos' 
                    ? 'bg-background shadow-sm text-primary ring-1 ring-black/5 dark:ring-white/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
             >
                <Package className="w-4 h-4" /> Cargos
             </button>
             <button
                onClick={() => setActiveTab('fleet')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'fleet' 
                    ? 'bg-background shadow-sm text-primary ring-1 ring-black/5 dark:ring-white/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
             >
                <Truck className="w-4 h-4" /> Flotte
             </button>
             <button
                onClick={() => setActiveTab('alerts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'alerts' 
                    ? 'bg-background shadow-sm text-primary ring-1 ring-black/5 dark:ring-white/10' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
             >
                <AlertTriangle className="w-4 h-4" /> Alertes
             </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[500px]">
        {activeTab === 'cockpit' && <CockpitView />}
        {activeTab === 'cargos' && <CargosView />}
        {activeTab === 'fleet' && <FleetView />}
        {activeTab === 'alerts' && <AlertsView />}
      </div>
    </div>
  );
}

export default AgriLogisticLink;
