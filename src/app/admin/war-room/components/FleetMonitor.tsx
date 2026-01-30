import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Fuel, 
  Gauge, 
  Package, 
  Navigation,
  Download,
  ExternalLink,
  Phone
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Vehicle } from '@/shared/hooks/useLogisticsStream';
import { Button } from '@/app/components/ui/button';

interface FleetMonitorProps {
  vehicles: Vehicle[];
}

export function FleetMonitor({ vehicles }: FleetMonitorProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<keyof Vehicle>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredVehicles = vehicles
    .filter(v => 
      v.id.toLowerCase().includes(search.toLowerCase()) || 
      v.driver.toLowerCase().includes(search.toLowerCase()) ||
      v.cargo.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

  const toggleSort = (field: keyof Vehicle) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/40 backdrop-blur-xl rounded-[40px] overflow-hidden border border-border shadow-2xl">
      {/* Table Header / Search */}
      <div className="p-8 border-b border-border bg-foreground/5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20">
                <Truck className="w-5 h-5 text-primary" />
             </div>
             <div>
                <h3 className="text-sm font-black text-foreground uppercase tracking-tighter">Répertoire de la Flotte</h3>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Temps Réel • {vehicles.length} Véhicules</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Connecté</span>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Rechercher par ID, Chauffeur ou Cargaison..."
            className="w-full bg-background/50 border border-border rounded-2xl py-3 pl-12 pr-4 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Interactive Table */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-foreground/10 px-4 py-2">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] px-4">
              <th className="pb-4 pl-4 cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort('id')}>Véhicule <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
              <th className="pb-4 cursor-pointer hover:text-primary transition-colors" onClick={() => toggleSort('status')}>Statut <ArrowUpDown className="inline w-3 h-3 ml-1" /></th>
              <th className="pb-4">Télémétrie</th>
              <th className="pb-4">Cargaison & Destination</th>
              <th className="pb-4 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="group hover:bg-foreground/5 transition-all duration-300 rounded-[20px]">
                <td className="py-4 pl-4 rounded-l-[20px]">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-[10px] font-black group-hover:border-primary/30 transition-colors shadow-sm">
                        {vehicle.id.split('-')[1]}
                      </div>
                      <div>
                        <p className="text-xs font-black text-foreground">{vehicle.id}</p>
                        <p className="text-[10px] text-muted-foreground font-bold tracking-tight">{vehicle.driver}</p>
                      </div>
                   </div>
                </td>
                <td className="py-4">
                   <StatusBadge status={vehicle.status} />
                </td>
                <td className="py-4">
                   <div className="flex items-center gap-4">
                      <MetricMini icon={Gauge} value={`${vehicle.speed} km/h`} color="text-amber-500" />
                      <MetricMini icon={Fuel} value={`${vehicle.fuel}%`} color={vehicle.fuel < 30 ? 'text-rose-500' : 'text-emerald-500'} />
                      <MetricMini icon={Package} value={`${vehicle.load}%`} color="text-primary" />
                   </div>
                </td>
                <td className="py-4">
                   <div>
                      <p className="text-[11px] font-black text-foreground uppercase tracking-tight">{vehicle.cargo}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                         <Navigation className="w-3 h-3 text-muted-foreground" />
                         <p className="text-[10px] font-bold text-muted-foreground">{vehicle.destination} <span className="text-primary ml-1">(ETA: {vehicle.eta})</span></p>
                      </div>
                   </div>
                </td>
                <td className="py-4 text-right pr-4 rounded-r-[20px]">
                   <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-primary/10 text-primary">
                        <Phone className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-foreground/10 text-muted-foreground">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-6 bg-foreground/5 border-t border-border flex items-center justify-between">
         <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">{filteredVehicles.length} Véhicules Affichés</p>
         <Button variant="ghost" className="text-[9px] font-black text-primary uppercase tracking-widest gap-2">
            <Download className="w-4 h-4" />
            Exporter la Liste
         </Button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Vehicle['status'] }) {
  const styles = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    loading: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    maintenance: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    idle: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  };

  return (
    <div className={cn(
      "px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 w-fit",
      styles[status]
    )}>
      <div className={cn("w-1.5 h-1.5 rounded-full", status === 'active' ? 'animate-pulse bg-emerald-500' : 'bg-current opacity-40')} />
      {status}
    </div>
  );
}

function MetricMini({ icon: Icon, value, color }: { icon: any, value: string, color: string }) {
  return (
    <div className="flex items-center gap-1.5 group/metric">
       <Icon className={cn("w-3.5 h-3.5 opacity-40 group-hover/metric:opacity-100 transition-opacity", color)} />
       <span className="text-[10px] font-bold text-foreground tabular-nums">{value}</span>
    </div>
  );
}

import { Truck } from 'lucide-react';
