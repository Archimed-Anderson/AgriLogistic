"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Map as MapIcon, 
  Zap, 
  AlertTriangle, 
  ArrowRight,
  RefreshCcw,
  Layers
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts"

const PRICE_HISTORY = [
    { month: 'Jan', price: 220 },
    { month: 'Feb', price: 235 },
    { month: 'Mar', price: 228 },
    { month: 'Apr', price: 245 },
    { month: 'May', price: 240 },
    { month: 'Jun', price: 255 },
    { month: 'Jul', price: 260 }, // Current
    // Prediction
    { month: 'Aug', price: 265, prediction: [260, 275] },
    { month: 'Sep', price: 270, prediction: [260, 285] },
    { month: 'Oct', price: 265, prediction: [250, 280] },
]

import { BuyerSimulationService } from "@/services/buyer-simulation"

export function MarketIntelligence() {
  const [data, setData] = React.useState<any>(null)
  
  React.useEffect(() => {
      BuyerSimulationService.getMarketAnalytics("CORN").then(setData)
  }, [])
  
  if (!data) return (
      <div className="grid grid-cols-12 gap-6 h-full p-4">
          <div className="col-span-12 h-full flex items-center justify-center text-slate-500 font-mono text-xs">
              INITIALIZING BLOOMBERG TERMINAL LINK...
          </div>
      </div>
  )

  const chartData = [...data.history, ...data.forecast]

  return (
    <div className="grid grid-cols-12 gap-6 h-full">
        {/* Top: Price Analytics & Forecast */}
        <div className="col-span-12 lg:col-span-8">
            <Card className="h-[400px] bg-slate-900 border-slate-800 flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-800">
                    <div>
                        <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <TrendingUp className="text-blue-500" size={16} />
                            Cours du Maïs (CORN-CBOT)
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-400">Historique 6M + Prédiction IA 3M</CardDescription>
                    </div>
                    <div className="flex gap-2">
                         <Badge variant="outline" className="border-blue-500/20 text-blue-400">Confiance IA: {data.meta.confidence * 100}%</Badge>
                    </div>
                </CardHeader>
                <div className="flex-1 w-full p-4">
                     <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                             <defs>
                                 <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                     <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                 </linearGradient>
                                 <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                     <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                 </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                             <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                             <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                             <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                itemStyle={{ fontSize: '12px' }}
                             />
                             <Area type="monotone" dataKey="price" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                             {/* Prediction Zone Mock - In real D3 we'd use area for range, here simulating with line extended */}
                             <ReferenceLine x="Jul" stroke="#64748b" strokeDasharray="3 3" label={{ value: "Aujourd'hui", position: 'insideTopLeft', fill: '#94a3b8', fontSize: 10 }} />
                         </AreaChart>
                     </ResponsiveContainer>
                </div>
            </Card>
        </div>

        {/* Right: AI Insights & Optimization */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            
            {/* Optimization Recommendation */}
            <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/30">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-indigo-400 mb-1">
                        <Zap className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Opportunité d'Arbitrage</span>
                    </div>
                    <CardTitle className="text-white text-lg">Optimisez votre panier</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-indigo-100/80 leading-relaxed">
                        Le cours des Poivrons est en hausse (+12%). Remplacez par des <span className="text-white font-bold underline decoration-indigo-400 decoration-2">Aubergines Violettes</span> pour vos conserves.
                    </p>
                    
                    <div className="p-3 bg-black/20 rounded-lg flex justify-between items-center border border-indigo-500/20">
                         <div className="flex flex-col">
                             <span className="text-[10px] text-indigo-300 uppercase font-bold">Économie Estimée</span>
                             <span className="text-white font-mono font-bold text-lg">-15%</span>
                         </div>
                         <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs">
                             Appliquer
                         </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Heatmap Widget Placeholder */}
            <Card className="flex-1 bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <MapIcon className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Disponibilité Régionale</span>
                    </div>
                </CardHeader>
                <div className="relative flex-1 min-h-[150px] m-4 rounded bg-slate-800/50 overflow-hidden">
                    {/* Simplified Heatmap Visual */}
                    <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5 opacity-60">
                         <div className="bg-red-500/40 flex items-center justify-center text-[10px] font-bold text-red-200">Nord (Tension)</div>
                         <div className="bg-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-200">Sud (Abondance)</div>
                         <div className="bg-amber-500/40 flex items-center justify-center text-[10px] font-bold text-amber-200">Est (Stable)</div>
                         <div className="bg-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-200">Ouest (Abondance)</div>
                    </div>
                </div>
            </Card>
        </div>

        {/* Bottom: Alert Feeds */}
        <div className="col-span-12">
            <Card className="bg-slate-900 border-slate-800">
                 <div className="flex items-center gap-4 p-4 overflow-x-auto">
                     <Badge variant="outline" className="shrink-0 border-red-500/30 bg-red-500/10 text-red-500 gap-2 px-3 py-1">
                         <AlertTriangle size={12} />
                         <span className="font-bold">Alerte Sécheresse</span>
                         <span className="font-mono opacity-70">Zone Nord (-40% Récolte prévue)</span>
                     </Badge>
                     <Badge variant="outline" className="shrink-0 border-blue-500/30 bg-blue-500/10 text-blue-500 gap-2 px-3 py-1">
                         <Layers size={12} />
                         <span className="font-bold">Nouveau Stock</span>
                         <span className="font-mono opacity-70">500T Riz arrivées au Port</span>
                     </Badge>
                     <div className="flex-1" />
                     <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-white">
                         Voir toutes les alertes <ArrowRight size={12} className="ml-1" />
                     </Button>
                 </div>
            </Card>
        </div>
    </div>
  )
}
