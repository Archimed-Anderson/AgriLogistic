'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Sprout,
  AlertTriangle,
  DollarSign,
  Calendar,
  MoreVertical,
  Download,
  Filter,
  Zap,
  Truck,
  Newspaper,
  Settings,
  Shield,
  Activity,
  Bell,
  Plus,
  ArrowUpRight,
  Database,
  Cpu,
  Globe,
  Clock,
  LayoutDashboard,
  Search,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Wifi,
  Navigation,
  Terminal,
  RotateCcw,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- MOCK DATA ---
const analyticsData = [
  { name: 'Jan', yield: 4000, revenue: 2400 },
  { name: 'Feb', yield: 3000, revenue: 1398 },
  { name: 'Mar', yield: 2000, revenue: 9800 },
  { name: 'Apr', yield: 2780, revenue: 3908 },
  { name: 'May', yield: 1890, revenue: 4800 },
  { name: 'Jun', yield: 2390, revenue: 3800 },
  { name: 'Jul', yield: 3490, revenue: 4300 },
];

const enginePerformance = [
  { name: '08:00', load: 32, latency: 45 },
  { name: '10:00', load: 45, latency: 52 },
  { name: '12:00', load: 78, latency: 85 },
  { name: '14:00', load: 56, latency: 48 },
  { name: '16:00', load: 42, latency: 40 },
  { name: '18:00', load: 35, latency: 38 },
];

const systemServices = [
  { name: 'Admin Service', status: 'online', port: 5005, uptime: '12d 4h' },
  { name: 'Incident Service', status: 'online', port: 3015, uptime: '2d 8h' },
  { name: 'Fleet Engine', status: 'warning', port: 3003, uptime: '45m' },
  { name: 'Auth Gateway', status: 'online', port: 8000, uptime: '30d 12h' },
];

export default function CommandCenter() {
  const [activeView, setActiveView] = useState<'overview' | 'operations' | 'system'>('overview');

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-400 pb-20 overflow-x-hidden">
      {/* 🛸 MISSION CONTROL HEADER */}
      <header className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-xl">
                <LayoutDashboard className="w-8 h-8 text-black" />
              </div>
              Command Center
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
              Intelligence Opérationnelle • Temps Réel Alpha v4.2
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-slate-900/50 p-1 rounded-2xl border border-white/5">
              {[
                { id: 'overview', label: 'Vue Globale', icon: Globe },
                { id: 'operations', label: 'Opérations', icon: Zap },
                { id: 'system', label: 'Système', icon: Cpu },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                    activeView === tab.id ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20" : "text-slate-500 hover:text-white"
                  )}
                >
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              ))}
            </div>
            <button className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Settings className="w-4 h-4" /> Config Platform
            </button>
          </div>
        </div>

        {/* 📊 TOP PERFORMANCE HUD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPIBlock label="Utilisateurs Actifs" value="2,845" trend="+12%" icon={Users} color="blue" />
          <KPIBlock label="Volume d'Affaire" value="45,230€" trend="+8%" icon={DollarSign} color="emerald" />
          <KPIBlock label="Missions en Cours" value="32" trend="-2" icon={Truck} color="purple" />
          <KPIBlock label="Alertes Critiques" value="03" trend="STABLE" icon={AlertTriangle} color="red" />
        </div>
      </header>

      {/* 🚀 MAIN DASHBOARD CONTENT */}
      <main className="px-8 grid grid-cols-12 gap-8">
        {/* Left Column (8/12): Main Visuals */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          <AnimatePresence mode="wait">
            {activeView === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* 🗺️ STRATEGIC INTELLIGENCE MAP SNIPPET */}
                <div className="h-96 bg-slate-900/40 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-0.3,7.5,4,0/1200x600?access_token=pk.placeholder')] bg-cover bg-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent" />
                  
                  <div className="relative z-10 p-8 flex flex-col h-full justify-between">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Flux Logistiques Globaux</h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Temps réel • Côte d'Ivoire / Afrique de l'Ouest</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] font-black text-emerald-500 uppercase">32 Live Tracks</div>
                        <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[9px] font-black text-blue-500 uppercase">12 Zones Pickup</div>
                      </div>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div className="flex gap-4">
                         <MapStat label="Volume Transporté" value="450 Tons" />
                         <MapStat label="Délai Moyen" value="4.2h" />
                      </div>
                      <Link href="/admin/operations/fleet" className="h-12 px-8 bg-emerald-500 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">
                        <Navigation className="w-4 h-4" /> Piloter la Flotte
                      </Link>
                    </div>
                  </div>
                </div>

                {/* 📊 CONSOLE & MISSIONS PULSE */}
                <div className="grid grid-cols-2 gap-8">
                   <div className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 space-y-6">
                      <div className="flex items-center justify-between">
                         <h3 className="text-sm font-black text-white italic uppercase tracking-widest flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-emerald-500" /> System Console
                         </h3>
                         <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                         </div>
                      </div>
                      <div className="bg-black/60 rounded-2xl p-6 font-mono text-[10px] space-y-2 h-48 overflow-y-auto custom-scrollbar border border-white/5">
                         <p className="text-emerald-500/80">[SYSTEM] Initialization sequence complete.</p>
                         <p className="text-blue-400">[IOT] 1,452 sensors synchronized.</p>
                         <p className="text-slate-500">[LOG] Admin_Root accessed Global Settings.</p>
                         <p className="text-emerald-500/80">[AUTO] Dispatch optimization algorithm started.</p>
                         <p className="text-amber-500">[WARN] Latency spike detected on incident-service.</p>
                         <p className="text-slate-500">[LOG] New harvest lot #QR-8892 created.</p>
                         <p className="text-emerald-500 shadow-[0_0_8px_#10b981]">_ (listening for inputs)</p>
                      </div>
                   </div>

                   <div className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 flex flex-col justify-between">
                      <div className="space-y-4">
                         <h3 className="text-sm font-black text-white italic uppercase tracking-widest">Live Missions Pulse</h3>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col">
                               <span className="text-[20px] font-black text-white italic">14</span>
                               <span className="text-[9px] font-black text-slate-500 uppercase">Collectes</span>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col">
                               <span className="text-[20px] font-black text-white italic">18</span>
                               <span className="text-[9px] font-black text-slate-500 uppercase">Livraisons</span>
                            </div>
                         </div>
                      </div>
                      <div className="pt-6 border-t border-white/5">
                         <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 w-[65%] animate-pulse" />
                            </div>
                            <span className="text-[10px] font-black text-white">65% Progress</span>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeView === 'operations' && (
              <motion.div 
                key="operations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-8"
              >
                <OperationCard 
                  title="Commandes Logistiques" 
                  desc="Gérer les flux de transport et d'expédition en temps réel." 
                  icon={Truck} 
                  stats="8 active" 
                  link="/admin/operations/fleet" 
                />
                <OperationCard 
                  title="Notification Engine" 
                  desc="Diffuser des alertes et campagnes multi-canal." 
                  icon={Bell} 
                  stats="12 pending" 
                  link="/admin/notifications" 
                />
                <OperationCard 
                  title="Content Management" 
                  desc="Publier des actualités et gérer les événements forum." 
                  icon={Newspaper} 
                  stats="4 drafts" 
                  link="/admin/blog-events" 
                />
                <OperationCard 
                  title="War Room Activity" 
                  desc="Monitoring des incidents critiques et crises terrain." 
                  icon={Shield} 
                  stats="0 active" 
                  link="/admin/war-room" 
                />
              </motion.div>
            )}

            {activeView === 'system' && (
              <motion.div 
                key="system"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-8">
                  {/* System Services Status */}
                  <div className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5">
                    <h3 className="text-sm font-black text-white italic uppercase tracking-widest mb-6">Service Health Cloud</h3>
                    <div className="space-y-4">
                      {systemServices.map(svc => (
                        <div key={svc.name} className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                               "w-2 h-2 rounded-full animate-pulse",
                               svc.status === 'online' ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-amber-500"
                             )} />
                             <div>
                               <div className="text-[11px] font-black text-white uppercase italic">{svc.name}</div>
                               <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Port: {svc.port} • Uptime: {svc.uptime}</div>
                             </div>
                          </div>
                          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Engine Performance */}
                  <div className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 space-y-6">
                    <h3 className="text-sm font-black text-white italic uppercase tracking-widest">Charge CPU & Latence</h3>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={enginePerformance}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                          <Bar dataKey="load" radius={[4, 4, 0, 0]}>
                            {enginePerformance.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.load > 70 ? '#ef4444' : '#10b981'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500 italic">
                       <span>Débit : 1.2 GB/s</span>
                       <span>Mémoire : 4.5/16 GB</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column (4/12): Quick Access & Sidebar Ops */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* ⚡ DIRECT COMMANDS (QUICK ACTIONS) */}
          <div className="p-8 bg-slate-900/40 rounded-[2.5rem] border border-white/5 flex flex-col gap-6">
            <h3 className="text-sm font-black text-white italic uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-500" /> Direct Commands
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              <CommandBtn label="Diffuser Alerte Flash" icon={Bell} color="red" />
              <CommandBtn label="Optimiser Tournées AI" icon={Cpu} color="emerald" />
              <CommandBtn label="Nouvelle Campagne SMS" icon={Plus} color="blue" />
              <CommandBtn label="Purger Cache Redis" icon={Database} color="purple" />
              <CommandBtn label="Activer Maintenance Mode" icon={PowerCircle} color="amber" />
            </div>
          </div>

          {/* 📬 RECENT LOGS / ACTIVITY */}
          <div className="p-8 bg-slate-950/20 rounded-[2.5rem] border border-white/5 flex flex-col h-fit">
            <h3 className="text-sm font-black text-white italic uppercase tracking-widest mb-6">Système Audits</h3>
            <div className="space-y-6">
              <AuditRow type="AUTH" text="Connexion Admin Root IP: 192.168.1.1" time="2m ago" />
              <AuditRow type="FLEET" text="Véhicule CI-235-AB a quitté la zone Nord-A" time="15m ago" />
              <AuditRow type="FINANCE" text="Paiement validé - Commande #ORD-5541" time="45m ago" />
              <AuditRow type="CMS" text="Nouvel article publié par Dr. Diallo" time="2h ago" />
            </div>
            <button className="mt-8 font-black uppercase text-[9px] text-slate-500 hover:text-white transition-colors tracking-[0.2em] w-full text-center">
              Consulter les logs complets
            </button>
          </div>

          {/* 🌡️ SENSOR HEALTH SUMMARY */}
          <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2.5rem] space-y-4">
             <div className="flex items-center gap-3">
               <Wifi className="w-5 h-5 text-emerald-500" />
               <h4 className="text-xs font-black text-emerald-500 uppercase italic">Connectivité IOT</h4>
             </div>
             <p className="text-[11px] text-slate-400 leading-relaxed italic">84% des capteurs en zone rurale sont connectés. Latence moyenne : 120ms.</p>
             <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[84%]" />
             </div>
          </div>
        </div>
      </main>

      {/* 🛠️ BOTTOM FLOATING STATUS BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-8 shadow-2xl z-[50]">
         <StatusMini label="GATEWAY" status="online" />
         <div className="w-px h-4 bg-white/10" />
         <StatusMini label="DATABASE" status="online" />
         <div className="w-px h-4 bg-white/10" />
         <StatusMini label="CACHE" status="online" />
         <div className="w-px h-4 bg-white/10" />
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-white uppercase italic tracking-widest">Live Sync Alpha-Node</span>
         </div>
      </div>
    </div>
  );
}

// --- COMPONENTS ---

function KPIBlock({ label, value, trend, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'bg-blue-500/10 text-blue-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    purple: 'bg-purple-500/10 text-purple-500',
    red: 'bg-red-500/10 text-red-500',
  };

  return (
    <div className="p-8 rounded-[2rem] bg-slate-900/40 border border-white/5 flex flex-col gap-4 group hover:border-white/10 transition-all">
       <div className="flex items-start justify-between">
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", colors[color])}>
             <Icon className="w-6 h-6" />
          </div>
          <div className={cn("text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg", trend.startsWith('+') ? "text-emerald-500 bg-emerald-500/10" : "text-amber-500 bg-amber-500/10")}>
            {trend}
          </div>
       </div>
       <div>
         <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block mb-1">{label}</span>
         <span className="text-3xl font-black text-white italic tracking-tighter">{value}</span>
       </div>
    </div>
  );
}

function MapStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
       <span className="text-[9px] font-black text-slate-500 uppercase italic tracking-widest">{label}</span>
       <span className="text-sm font-black text-white italic tracking-tight">{value}</span>
    </div>
  );
}

function OperationCard({ title, desc, icon: Icon, stats, link }: any) {
  return (
    <Link href={link} className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] flex flex-col gap-6 hover:border-emerald-500/30 transition-all group">
       <div className="flex items-start justify-between">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 transition-all">
             <Icon className="w-7 h-7 text-emerald-500 group-hover:text-black" />
          </div>
          <span className="text-[10px] font-black text-white bg-black/40 px-3 py-1 rounded-lg uppercase italic">{stats}</span>
       </div>
       <div className="space-y-2">
          <h4 className="text-sm font-black text-white uppercase italic tracking-widest group-hover:text-emerald-500 transition-colors">{title}</h4>
          <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{desc}</p>
       </div>
       <div className="mt-2 flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Ouvrir le Module <ArrowUpRight className="w-3 h-3" />
       </div>
    </Link>
  );
}

function CommandBtn({ label, icon: Icon, color }: any) {
  const colors: any = {
    red: 'hover:bg-red-500/10 hover:text-red-500 border-red-500/20',
    emerald: 'hover:bg-emerald-500/10 hover:text-emerald-500 border-emerald-500/20',
    blue: 'hover:bg-blue-500/10 hover:text-blue-500 border-blue-500/20',
    purple: 'hover:bg-purple-500/10 hover:text-purple-500 border-purple-500/20',
    amber: 'hover:bg-amber-500/10 hover:text-amber-500 border-amber-500/20',
  };

  return (
    <button className={cn(
      "h-12 w-full px-5 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between transition-all group",
      colors[color]
    )}>
       <div className="flex items-center gap-4">
          <Icon className="w-4 h-4 text-slate-600 group-hover:text-current" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{label}</span>
       </div>
       <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function AuditRow({ type, text, time }: { type: string, text: string, time: string }) {
  return (
    <div className="flex items-start gap-4 group">
       <div className="text-[9px] font-black px-2 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5 group-hover:border-emerald-500/30 group-hover:text-emerald-500 transition-all">{type}</div>
       <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-300 leading-tight">{text}</p>
          <span className="text-[9px] font-black text-slate-700 uppercase">{time}</span>
       </div>
    </div>
  );
}

function StatusMini({ label, status }: { label: string, status: 'online' | 'offline' }) {
  return (
    <div className="flex items-center gap-3">
       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
       <div className={cn(
         "w-2 h-2 rounded-full",
         status === 'online' ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-red-500"
       )} />
    </div>
  );
}

function PowerCircle(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    >
      <path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>
    </svg>
  );
}
