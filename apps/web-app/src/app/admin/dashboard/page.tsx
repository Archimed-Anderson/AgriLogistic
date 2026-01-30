"use client"

import React from "react"
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
  Filter
} from "lucide-react"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts"

const analyticsData = [
  { name: "Jan", yield: 4000, revenue: 2400 },
  { name: "Feb", yield: 3000, revenue: 1398 },
  { name: "Mar", yield: 2000, revenue: 9800 },
  { name: "Apr", yield: 2780, revenue: 3908 },
  { name: "May", yield: 1890, revenue: 4800 },
  { name: "Jun", yield: 2390, revenue: 3800 },
  { name: "Jul", yield: 3490, revenue: 4300 },
]

const recentActivities = [
  { id: 1, type: "Alert", msg: "Anomalie d'irrigation détectée - Secteur B4", time: "Il y a 12 min", status: "Critical" },
  { id: 2, type: "Crop", msg: "Récolte terminée - Maïs Parcelle #12", time: "Il y a 45 min", status: "Success" },
  { id: 3, type: "User", msg: "Nouvel analyste ajouté au projet 'Soil Monitoring'", time: "Il y a 2h", status: "Info" },
  { id: 4, type: "IOT", msg: "Capteur d'humidité S-88 reconnecté", time: "Il y a 4h", status: "Success" },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tableau de Bord</h1>
          <p className="text-slate-500 font-medium">Vue d'ensemble de vos opérations à l'échelle mondiale.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-11 px-6 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Filter className="h-4 w-4" /> Filtrer
          </button>
          <button className="h-11 px-6 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10">
            <Download className="h-4 w-4" /> Rapport PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Utilisateurs Actifs", value: "2,845", change: "+12.5%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Rendement Moyen", value: "94%", change: "+3.2%", icon: Sprout, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Recettes Mensuelles", value: "45,230â‚¬", change: "-0.8%", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Alertes Système", value: "14", change: "+2", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
        ].map((kpi, i) => (
          <div key={i} className="group p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
             <div className="flex items-start justify-between mb-4">
               <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                 <kpi.icon className="h-6 w-6" />
               </div>
               <div className={`flex items-center gap-1 text-xs font-black ${kpi.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                 {kpi.change.startsWith('+') ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                 {kpi.change}
               </div>
             </div>
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
             <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{kpi.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Yield Chart */}
        <div className="lg:col-span-2 p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Intelligence Rendement</h3>
              <p className="text-sm text-slate-500 font-medium">Analyse comparative mensuelle 2024</p>
            </div>
            <select className="h-10 px-4 rounded-xl bg-slate-50 border-none text-xs font-bold text-slate-600 outline-none">
              <option>Derniers 6 mois</option>
              <option>Dernière année</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  labelStyle={{fontWeight: '900', color: '#0f172a', marginBottom: '4px'}}
                />
                <Area type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Info Card / Recent Activity */}
        <div className="p-8 rounded-[40px] bg-slate-900 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
           <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black tracking-tight">Flux Activité</h3>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-6 flex-1">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex gap-4 group">
                    <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-xs
                      ${act.status === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white'}
                    `}>
                      {act.type[0]}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-tight group-hover:text-emerald-400 transition-colors cursor-pointer">{act.msg}</p>
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> {act.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-8 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                Voir tout l'historique
              </button>
           </div>
        </div>
      </div>

      {/* Bottom Row: Distribution & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">État des Capteurs</h3>
            <div className="space-y-6">
               {[
                 { label: "Capteurs Humidité", current: 142, max: 150, color: "bg-blue-500" },
                 { label: "Stations Météo", current: 28, max: 30, color: "bg-amber-500" },
                 { label: "Analyseurs Sols", current: 85, max: 120, color: "bg-emerald-500" },
                 { label: "Drones Autonomes", current: 8, max: 10, color: "bg-purple-500" },
               ].map((stat, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                       <span className="text-slate-500 uppercase tracking-widest text-[11px]">{stat.label}</span>
                       <span className="text-slate-900">{stat.current} / {stat.max}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full ${stat.color} rounded-full`} style={{width: `${(stat.current/stat.max)*100}%`}} />
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="p-8 rounded-[40px] bg-emerald-500 text-slate-900 flex flex-col justify-center items-center text-center">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mb-6">
               <Sprout className="h-10 w-10 text-white" strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-black tracking-tighter mb-4 leading-tight">
               Prêt pour la Récolte ?
            </h3>
            <p className="text-slate-900/70 font-bold max-w-sm mb-8">
               L'IA AgriLogistic prédit un pic de maturité dans 4 jours pour le secteur Nord.
            </p>
            <button className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-slate-900/20">
               Lancer l'automatisation
            </button>
         </div>
      </div>
    </div>
  )
}


