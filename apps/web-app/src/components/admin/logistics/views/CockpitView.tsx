"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Truck, 
  Leaf, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Zap,
  Search,
  AlertTriangle,
  Wrench,
  CheckCircle
} from 'lucide-react';
import { useLogisticsStore } from "@/store/useLogisticsStore";
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area"

// Dynamic Map Import
const LogisticsMap = dynamic(() => import("../../../maps/LogisticsMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400">Loading Satellite Data...</div>
});

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

export function CockpitView() {
  const { matches, analytics, alerts, predictiveData, resolveAlert } = useLogisticsStore();
  
  // KPIs for Gauge
  const fleetEfficiencyData = [
    { name: 'Efficient', value: analytics.fleetEfficiency },
    { name: 'Inefficient', value: 100 - analytics.fleetEfficiency },
  ];

  /* --- SUB-COMPONENTS --- */

  const AlertItem = ({ alert }: { alert: any }) => (
    <div className={`flex gap-3 p-3 rounded-lg border mb-2 ${
      alert.status === 'Resolved' ? 'opacity-50' : 'bg-card'
    } ${
      alert.severity === 'critical' ? 'border-red-500/50 bg-red-500/5' : 
      alert.severity === 'warning' ? 'border-orange-500/50 bg-orange-500/5' : 
      'border-blue-500/50 bg-blue-500/5'
    }`}>
      <div className={`mt-1 h-2 w-2 rounded-full ${
        alert.severity === 'critical' ? 'bg-red-500 animate-pulse' : 
        alert.severity === 'warning' ? 'bg-orange-500' : 
        'bg-blue-500'
      }`} />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold">{alert.type} Alert</h4>
          <span className="text-[10px] text-muted-foreground">{new Date(alert.timestamp).toLocaleTimeString()}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{alert.message} - Camion {alert.truckPlate}</p>
        
        {alert.status === 'Open' && (
          <Button 
            size="sm" 
            variant="outline" 
            className="mt-2 h-6 text-[10px] w-full"
            onClick={() => resolveAlert(alert.id)}
          >
            <CheckCircle className="w-3 h-3 mr-1" /> Marquer Résolu
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. TOP METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-xl p-5 shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-20 h-20 bg-emerald-500/10 rounded-bl-full transition-transform group-hover:scale-150 duration-500" />
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Revenu Transport</p>
              <h3 className="text-2xl font-bold mt-1">{(analytics.totalRevenue / 1000000).toFixed(1)}M</h3>
            </div>
            <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-xs text-emerald-600 font-bold">
            <TrendingUp className="w-3 h-3 mr-1" /> +24% ce mois
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-20 h-20 bg-blue-500/10 rounded-bl-full transition-transform group-hover:scale-150 duration-500" />
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Flotte Active</p>
                <h3 className="text-2xl font-bold mt-1">{analytics.activeLoads} / {analytics.totalTrucks}</h3>
              </div>
              <div className="p-2 bg-blue-500/20 text-blue-500 rounded-lg">
                <Truck className="w-5 h-5" />
              </div>
            </div>
             <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(analytics.activeLoads / analytics.totalTrucks) * 100}%` }}></div>
             </div>
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-20 h-20 bg-green-500/10 rounded-bl-full transition-transform group-hover:scale-150 duration-500" />
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-muted-foreground font-medium">CO2 Économisé</p>
                <h3 className="text-2xl font-bold mt-1">{(analytics.co2TotalSaved / 1000).toFixed(1)} T</h3>
              </div>
              <div className="p-2 bg-green-500/20 text-green-500 rounded-lg">
                <Leaf className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Grâce à l'optimisation IA</p>
        </div>

        <div className="bg-card border rounded-xl p-1 shadow-sm flex items-center pr-4">
             <div className="h-24 w-24 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fleetEfficiencyData}
                      innerRadius={25}
                      outerRadius={35}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                    <span className="text-xs font-bold text-emerald-500">{analytics.fleetEfficiency}%</span>
                </div>
             </div>
             <div className="flex-1">
                 <p className="text-sm font-bold">Efficacité Flotte</p>
                 <p className="text-xs text-muted-foreground">Taux d'utilisation optimisé</p>
             </div>
        </div>
      </div>

      {/* 2. MAIN VISUALIZATION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
         {/* MAP */}
         <div className="lg:col-span-2 bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col relative">
             <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur px-3 py-1 rounded-full border shadow-sm">
                <h3 className="text-xs font-bold flex items-center gap-2">
                    <Activity className="w-3 h-3 text-red-500 animate-pulse" />
                    Heatmap: Densité des Chargements
                </h3>
             </div>
             <div className="flex-1 w-full h-full">
                 <LogisticsMap />
             </div>
         </div>

         {/* PREDICTIVE GRAPH */}
         <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col">
             <div className="flex justify-between items-center mb-6">
                 <div>
                     <h3 className="font-bold text-sm">Prévisions IA</h3>
                     <p className="text-xs text-muted-foreground">Offre vs Demande (7j)</p>
                 </div>
                 <div className="flex gap-2 text-[10px]">
                     <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Offre</span>
                     <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-orange-500"></div> Demande</span>
                 </div>
             </div>
             
             <div className="flex-1 w-full h-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={predictiveData}>
                        <defs>
                            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                        <XAxis dataKey="date" tick={{fontSize: 10}} tickFormatter={(val) => val.split('-')[2]} interval={2} />
                        <YAxis tick={{fontSize: 10}} width={25} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            labelStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="demand" stroke="#f97316" fillOpacity={1} fill="url(#colorDemand)" strokeWidth={2} />
                        <Area type="monotone" dataKey="supply" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSupply)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
         </div>
      </div>

      {/* 3. DETAILS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SMART MATCH TABLE */}
          <div className="lg:col-span-2 bg-card border rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                  <h3 className="font-bold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-500" /> Matches Intelligents Récents
                  </h3>
                  <Button variant="ghost" size="sm" className="text-xs">Voir Tout</Button>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                      <thead className="bg-muted/50 text-xs text-muted-foreground uppercase">
                          <tr>
                              <th className="px-4 py-3 text-left">Ref</th>
                              <th className="px-4 py-3 text-left">Trajet</th>
                              <th className="px-4 py-3 text-right">Marge (12%)</th>
                              <th className="px-4 py-3 text-right">CO2 Saved</th>
                              <th className="px-4 py-3 text-center">Score IA</th>
                              <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {matches.slice(0, 5).map(match => (
                              <tr key={match.id} className="border-b transition-colors hover:bg-muted/30">
                                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{match.id.slice(-6)}</td>
                                  <td className="px-4 py-3">
                                      <div className="font-medium text-xs">{match.distance.toFixed(0)} km</div>
                                      <div className="text-[10px] text-muted-foreground">Camion {match.truckId.slice(-4)}</div>
                                  </td>
                                  <td className="px-4 py-3 text-right font-medium text-purple-600">
                                      {match.platformMargin?.toLocaleString()} FCFA
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-green-500/10 text-green-600 font-bold border border-green-500/20">
                                          <Leaf className="w-2 h-2 mr-1" />
                                          -{match.co2Saved?.toFixed(1)} kg
                                      </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                      <span className={`font-bold ${
                                          match.matchScore > 80 ? 'text-emerald-500' : 'text-orange-500'
                                      }`}>{match.matchScore}%</span>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-blue-500/10 hover:text-blue-500">
                                          <Search className="w-3 h-3" />
                                      </Button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* IOT ALERTS PANEL */}
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px]">
              <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                  <h3 className="font-bold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" /> Alertes Flotte IoT
                  </h3>
                  <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-[10px] font-bold text-red-500">{alerts.filter(a => a.status === 'Open').length} Actives</span>
                  </div>
              </div>
              <ScrollArea className="flex-1 p-3">
                  {alerts.map(alert => (
                      <AlertItem key={alert.id} alert={alert} />
                  ))}
                  {alerts.length === 0 && (
                      <div className="text-center py-10 text-muted-foreground text-sm">
                          Aucune alerte. La flotte est saine.
                      </div>
                  )}
              </ScrollArea>
              <div className="p-3 border-t bg-muted/10">
                  <Button variant="secondary" className="w-full text-xs h-8">
                       <Wrench className="w-3 h-3 mr-2" /> Planifier Maintenances
                  </Button>
              </div>
          </div>

      </div>
    </div>
  );
}
