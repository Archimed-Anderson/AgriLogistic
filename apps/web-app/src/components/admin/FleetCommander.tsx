'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Truck, 
  Map as MapIcon, 
  Activity, 
  Battery, 
  Thermometer, 
  Fuel, 
  Navigation, 
  Search, 
  Filter, 
  MoreVertical, 
  Settings, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Phone,
  Calendar,
  ShieldCheck,
  History,
  FileText,
  User,
  Zap,
  ArrowUpRight,
  MapPin,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFleetStore, Vehicle, VehicleStatus } from '@/store/fleetStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock Leaflet as it requires window object
const MapPlaceholder = () => (
  <div className="w-full h-full bg-[#0D1525] rounded-[2.5rem] border border-white/5 flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-4.0,5.36,6,0/1200x800?access_token=pk.placeholder')] bg-cover bg-center" />
    <div className="relative z-10 flex flex-col items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-pulse">
        <MapIcon className="w-8 h-8 text-emerald-500" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/60">Vue Satellite Mission Control</p>
    </div>
  </div>
);

export default function FleetCommander() {
  const { vehicles, stats, selectedVehicleId, setSelectedVehicle } = useFleetStore();
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');

  return (
    <div className="flex flex-col h-screen bg-[#0B1120] text-slate-400 overflow-hidden">
      {/* 📡 MISSION CONTROL HEADER */}
      <header className="p-8 shrink-0 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-xl">
                <Truck className="w-8 h-8 text-black" />
              </div>
              Fleet Commander v4.0
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-500" />
              NASA Style Opérations Control Hub • CI-ECOSYSTEM-ALPHA
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
              <button 
                onClick={() => setActiveView('map')}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  activeView === 'map' ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-white"
                )}
              >
                <MapIcon className="w-4 h-4" /> Live Map
              </button>
              <button 
                onClick={() => setActiveView('list')}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  activeView === 'list' ? "bg-emerald-500 text-black" : "text-slate-500 hover:text-white"
                )}
              >
                <Activity className="w-4 h-4" /> Analyse Tech
              </button>
            </div>
            <button className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* 📊 KPI HUD */}
        <div className="grid grid-cols-5 gap-6">
          <KPIBlock label="Actifs / En mission" value={stats.active} icon={Truck} color="emerald" subValue="🟢 Stable" />
          <KPIBlock label="Unités Disponibles" value={stats.available} icon={CheckCircle2} color="blue" subValue="🟡 Prêts" />
          <KPIBlock label="En Maintenance" value={stats.maintenance} icon={AlertTriangle} color="red" subValue="🔴 Hors service" />
          <KPIBlock label="Taux Remplissage" value={`${stats.avgFillRate}%`} icon={Activity} color="purple" subValue="↑ 5% ce mois" />
          <KPIBlock label="Kilométrage Total" value={`${stats.totalKmToday} km`} icon={Navigation} color="amber" subValue="Aujourd'hui" />
        </div>
      </header>

      {/* 🗺️ MAIN MISSION CONTROL AREA */}
      <main className="flex-1 overflow-hidden p-8 pt-0 flex gap-8">
        {/* Left Side: Map/Main View */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {activeView === 'map' ? (
            <MapPlaceholder />
          ) : (
            <div className="bg-slate-900/20 rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col flex-1">
               <VehicleTable />
            </div>
          )}
        </div>

        {/* Right Side: Operations Deck / Mini List */}
        <div className="w-[450px] shrink-0 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 bg-slate-900/40 rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-black text-white italic uppercase tracking-widest">Opérations Deck</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-black text-slate-500 uppercase">Live Feed</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
              {vehicles.map(v => (
                <VehicleCard key={v.id} vehicle={v} isSelected={selectedVehicleId === v.id} onClick={() => setSelectedVehicle(v.id)} />
              ))}
            </div>
          </div>

          <div className="h-64 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] p-8 flex flex-col justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest">Optimisation Dispatch</h4>
              <p className="text-[10px] text-slate-400 leading-relaxed italic">Intelligence Artificielle active. 4 véhicules suggérés pour ré-assignation zone Nord.</p>
            </div>
            <button className="w-full h-14 bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20">
              <Zap className="w-4 h-4" />
              Lancer Optimisation AI
            </button>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedVehicleId && (
          <VehicleDetailSideOver 
            vehicle={vehicles.find(v => v.id === selectedVehicleId)!} 
            onClose={() => setSelectedVehicle(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function KPIBlock({ label, value, icon: Icon, color, subValue }: any) {
  const colors: any = {
    emerald: 'text-emerald-500 bg-emerald-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    red: 'text-red-500 bg-red-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    amber: 'text-amber-500 bg-amber-500/10',
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 space-y-3 hover:border-white/10 transition-all group">
      <div className="flex items-center justify-between">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", colors[color])}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{subValue}</span>
      </div>
      <div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1">{label}</span>
        <span className="text-2xl font-black text-white italic tracking-tighter">{value}</span>
      </div>
    </div>
  );
}

function VehicleCard({ vehicle, isSelected, onClick }: { vehicle: Vehicle, isSelected: boolean, onClick: () => void }) {
  const statusColors = {
    active: 'bg-emerald-500',
    available: 'bg-blue-500',
    maintenance: 'bg-red-500',
    offline: 'bg-slate-500',
    warning: 'bg-amber-500',
  };

  return (
    <motion.div 
      onClick={onClick}
      whileHover={{ x: 4 }}
      className={cn(
        "p-5 rounded-3xl border transition-all cursor-pointer space-y-4 group",
        isSelected 
          ? "bg-emerald-500/10 border-emerald-500/20 shadow-xl shadow-emerald-500/5" 
          : "bg-black/20 border-white/5 hover:border-white/10"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 overflow-hidden relative">
            <img src={vehicle.image} alt={vehicle.plate} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className={cn("absolute bottom-0 right-0 w-3 h-3 border-2 border-[#0B1120] rounded-full", statusColors[vehicle.status])} />
          </div>
          <div>
            <h4 className="text-[12px] font-black text-white tracking-widest uppercase">{vehicle.plate}</h4>
            <span className="text-[9px] font-bold text-slate-500 uppercase">{vehicle.type} • {vehicle.capacity.weight}T</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg">
          <Activity className="w-3 h-3 text-emerald-500" />
          <span className="text-[9px] font-black text-white">{vehicle.sensors.speed} km/h</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-slate-600 uppercase">Carburant</span>
            <div className="flex items-center gap-2">
              <Fuel className="w-3 h-3 text-slate-500" />
              <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full transition-all", vehicle.sensors.fuel < 20 ? "bg-red-500" : "bg-emerald-500")} 
                  style={{ width: `${vehicle.sensors.fuel}%` }} 
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-slate-600 uppercase">Batterie</span>
            <div className="flex items-center gap-2">
              <Battery className="w-3 h-3 text-slate-500" />
              <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${vehicle.sensors.battery}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-slate-600 uppercase italic">Localisation</span>
          <span className="text-[9px] font-bold text-slate-400">{vehicle.location.address}</span>
        </div>
      </div>
    </motion.div>
  );
}

function VehicleTable() {
  const { vehicles, setSelectedVehicle } = useFleetStore();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-slate-950/20">
            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Unité / Immat</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Transporteur</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Status Télémesure</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Capteurs IoT</th>
            <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-500 tracking-widest italic">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {vehicles.map(v => (
            <tr key={v.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => setSelectedVehicle(v.id)}>
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/5 overflow-hidden">
                    <img src={v.image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h5 className="text-[12px] font-black text-white tracking-widest group-hover:text-emerald-500 transition-colors uppercase">{v.plate}</h5>
                    <span className="text-[9px] font-bold text-slate-600 uppercase">{v.type} • {v.capacity.weight}T</span>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white uppercase">{v.driver.name}</div>
                    <div className="text-[9px] text-slate-600">{v.driver.phone}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full animate-pulse",
                      v.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" :
                      v.status === 'warning' ? "bg-amber-500" : "bg-blue-500"
                    )} />
                    <span className="text-[10px] font-black uppercase italic text-slate-300">{v.status}</span>
                  </div>
                  <span className="text-[9px] text-slate-600 flex items-center gap-1.5 font-medium">
                    <Navigation className="w-3 h-3" />
                    {v.location.address}
                  </span>
                </div>
              </td>
              <td className="px-8 py-6">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <Fuel className="w-3 h-3 text-slate-500" />
                      <span className="text-[10px] font-mono text-white">{v.sensors.fuel}%</span>
                    </div>
                    <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${v.sensors.fuel}%` }} />
                    </div>
                  </div>
                  {v.sensors.tempCargo !== undefined && (
                    <div className="flex flex-col gap-1.5 px-4 border-l border-white/5">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-3 h-3 text-blue-500" />
                        <span className="text-[10px] font-mono text-white">{v.sensors.tempCargo}°C</span>
                      </div>
                      <span className="text-[8px] font-black text-blue-500/60 uppercase">Cargo Frigo</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-8 py-6">
                <button className="h-10 px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-500 hover:text-black transition-all">
                  Localiser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VehicleDetailSideOver({ vehicle, onClose }: { vehicle: Vehicle, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'performance' | 'maintenance' | 'docs' | 'history'>('performance');

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-2xl h-full bg-[#0D1525] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-slate-900/10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Truck className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">{vehicle.plate}</h2>
                <span className="px-3 py-1 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest rounded-lg">Online</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                ID UNITÉ: {vehicle.id} • STATUS: {vehicle.status}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Dynamic Data Tabs */}
        <div className="flex px-8 border-b border-white/5">
          {[
            { id: 'performance', label: 'Performance', icon: Activity },
            { id: 'maintenance', label: 'Maintenance', icon: Settings },
            { id: 'docs', label: 'Documents', icon: FileText },
            { id: 'history', label: 'Historique', icon: History },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                activeTab === tab.id ? "text-emerald-500" : "text-slate-500 hover:text-white"
              )}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="w-3 h-3" />
                {tab.label}
              </div>
              {activeTab === tab.id && (
                <motion.div layoutId="detailTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
          {activeTab === 'performance' && (
             <div className="space-y-10">
                <div className="grid grid-cols-3 gap-6">
                  <StatMini label="Eco-Scoring" value="94/100" color="emerald" icon={ShieldCheck} />
                  <StatMini label="Consommation" value="28L/100" color="blue" icon={Fuel} />
                  <StatMini label="Remplissage" value={`${vehicle.capacity.currentLoad}%`} color="purple" icon={Activity} />
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Activité KM Mensuelle</h4>
                  <div className="h-64 bg-black/20 rounded-3xl p-6 border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: '1', km: 120 }, { name: '5', km: 240 }, { name: '10', km: 180 }, 
                        { name: '15', km: 380 }, { name: '20', km: 290 }, { name: '25', km: 450 }, { name: '30', km: 320 }
                      ]}>
                        <defs>
                          <linearGradient id="colorKm" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0B1120', border: 'none', borderRadius: '12px', fontSize: '10px' }} />
                        <Area type="monotone" dataKey="km" stroke="#10b981" fillOpacity={1} fill="url(#colorKm)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 space-y-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Conducteur Assigné</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={vehicle.driver.avatar} className="w-12 h-12 rounded-full border border-white/10" />
                      <div>
                        <div className="text-sm font-black text-white italic uppercase">{vehicle.driver.name}</div>
                        <div className="text-[10px] text-slate-500 font-bold">{vehicle.driver.phone}</div>
                      </div>
                    </div>
                    <button className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <Phone className="w-4 h-4 text-black" />
                    </button>
                  </div>
                </div>
             </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="space-y-8">
               <div className="p-8 rounded-[2rem] bg-red-500/5 border border-red-500/10 space-y-4">
                 <div className="flex items-center gap-3">
                   <AlertTriangle className="w-5 h-5 text-red-500" />
                   <h4 className="text-xs font-black text-red-500 uppercase italic">Alerte IA : Pneus Avant Gauche</h4>
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed italic">Nos capteurs indiquent une usure anormale. Changement recommandé dans les 450 km pour éviter un incident.</p>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-slate-950/50 border border-white/5 space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Dernière Vidange</span>
                    <p className="text-sm font-black text-white italic uppercase">{vehicle.maintenance.lastService}</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-950/50 border border-white/5 space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Prochain Service</span>
                    <p className="text-sm font-black text-emerald-500 italic uppercase">{vehicle.maintenance.nextService}</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="grid grid-cols-1 gap-4">
              <DocRow label="Assurance Tous Risques 2024" expiry="12/12/2024" status="valid" />
              <DocRow label="Contrôle Technique" expiry="15/05/2024" status="warning" />
              <DocRow label="Licence Transport CEMAC" expiry="01/01/2025" status="valid" />
              <DocRow label="Certificat Frigo (ISO)" expiry="30/09/2024" status="valid" />
            </div>
          )}
        </div>

        <div className="p-8 bg-[#0B1120] border-t border-white/10 shrink-0 flex gap-4">
          <button className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" /> Voir Itinéraire Live
          </button>
          <button className="flex-1 h-14 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Nouvelle Mission
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StatMini({ label, value, color, icon: Icon }: any) {
  const colors: any = {
    emerald: 'text-emerald-500 bg-emerald-500/10',
    blue: 'text-blue-500 bg-blue-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
  };

  return (
    <div className="p-5 rounded-3xl bg-slate-950/50 border border-white/5 space-y-2">
      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colors[color])}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <span className="text-[8px] font-black text-slate-600 uppercase block">{label}</span>
        <span className="text-sm font-black text-white italic uppercase tracking-tight">{value}</span>
      </div>
    </div>
  );
}

function DocRow({ label, expiry, status }: { label: string, expiry: string, status: 'valid' | 'warning' | 'expired' }) {
  return (
    <div className="p-5 rounded-3xl bg-slate-950/50 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <FileText className="w-5 h-5 text-slate-500" />
        </div>
        <div>
          <h5 className="text-[11px] font-black text-white uppercase italic">{label}</h5>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-3 h-3 text-slate-600" />
            <span className="text-[9px] font-bold text-slate-500">Expire le {expiry}</span>
          </div>
        </div>
      </div>
      <div className={cn(
        "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest",
        status === 'valid' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
        status === 'warning' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
      )}>
        {status === 'valid' ? 'Valide' : status === 'warning' ? 'Attention' : 'Expiré'}
      </div>
    </div>
  );
}
