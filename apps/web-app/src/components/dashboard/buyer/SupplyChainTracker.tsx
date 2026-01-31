"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  MapPin, 
  Sprout, 
  Tractor, 
  Truck, 
  PackageCheck, 
  Thermometer, 
  Droplets,
  QrCode,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

const IOT_DATA = Array.from({ length: 20 }, (_, i) => ({
    time: `${10 + i}:00`,
    temp: 4 + Math.random() * 2, // 4-6°C (Refrigerated)
    humidity: 55 + Math.random() * 5
}))

const STEPS = [
    {
        id: "origin",
        label: "Origine Vérifiée",
        sub: "Coopérative Vallée, Sénégal",
        date: "12 Oct, 08:30",
        icon: MapPin,
        status: "completed",
        details: { type: "image", src: "/sat-view.png", Label: "Vue Satellite" }
    },
    {
        id: "culture",
        label: "Culture & Intrants",
        sub: "Semences Bio Certifiées #8821",
        date: "15 Oct - 20 Dec",
        icon: Sprout,
        status: "completed",
        details: { type: "data", labels: ["NPK: Optimal", "Eau: 1200L/ha"] }
    },
    {
        id: "harvest",
        label: "Récolte & Tri",
        sub: "Lot #BATCH-2023-X9",
        date: "22 Dec, 14:00",
        icon: Tractor,
        status: "completed",
        details: { type: "text", text: "Quality Grade A verified via AI Scan." }
    },
    {
        id: "transport",
        label: "Transport Frigorifique",
        sub: "En Transit - 45km Restant",
        date: "Aujourd'hui, 09:15",
        icon: Truck,
        status: "active",
        details: { type: "chart" }
    },
    {
        id: "reception",
        label: "Réception & Paiement",
        sub: "Estimation: 14:30",
        date: "En attente",
        icon: PackageCheck,
        status: "pending",
        details: null
    }
]

export function SupplyChainTracker() {
  const [activeStep, setActiveStep] = React.useState("transport")

  return (
    <div className="grid grid-cols-12 gap-8 h-full">
        {/* Left: Timeline */}
        <div className="col-span-12 lg:col-span-5 relative">
            <div className="absolute top-4 left-6 bottom-10 w-0.5 bg-slate-800" />
            
            <div className="space-y-8 relative">
                {STEPS.map((step, index) => {
                    const isActive = step.status === "active"
                    const isCompleted = step.status === "completed"
                    
                    return (
                        <motion.div 
                           key={step.id}
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: index * 0.1 }}
                           className={`relative pl-14 group cursor-pointer ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                           onClick={() => setActiveStep(step.id)}
                        >
                            {/* Icon Dot */}
                            <div className={`absolute left-2.5 -translate-x-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-slate-950 z-10 transition-colors ${
                                isActive ? 'border-blue-500 text-blue-500 shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)]' : 
                                isCompleted ? 'border-emerald-500 text-emerald-500' : 
                                'border-slate-700 text-slate-700'
                            }`}>
                                <step.icon size={14} />
                            </div>

                            <div className={`p-4 rounded-xl border transition-all ${
                                isActive ? 'bg-slate-900/80 border-blue-500/50 shadow-lg' : 
                                'bg-slate-900/30 border-slate-800 hover:bg-slate-900/50'
                            }`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>{step.label}</h4>
                                    <span className="text-[10px] text-slate-500 font-mono">{step.date}</span>
                                </div>
                                <p className="text-xs text-slate-500 mb-2">{step.sub}</p>
                                
                                {isCompleted && <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase"><CheckCircle2 size={10} /> Validé Blockchain</div>}
                                {isActive && <div className="flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> En Cours</div>}
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </div>

        {/* Right: Detail View */}
        <div className="col-span-12 lg:col-span-7">
            <Card className="h-full bg-slate-900 border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
                
                <CardContent className="p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                         <div>
                             <h2 className="text-2xl font-black text-white uppercase tracking-tight">Chain of Trust</h2>
                             <p className="text-sm text-slate-400">Suivi d'intégrité du lot #BATCH-2023-X9</p>
                         </div>
                         <div className="p-2 bg-white rounded-lg">
                             <QrCode className="h-16 w-16 text-slate-900" />
                         </div>
                    </div>

                    {/* Content Logic based on active step */}
                    <div className="flex-1 rounded-xl bg-slate-950/50 border border-slate-800 p-6 relative">
                         {activeStep === 'transport' ? (
                             <div className="h-full flex flex-col">
                                 <div className="flex items-center justify-between mb-6">
                                     <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                         <Thermometer className="text-blue-500" size={16} /> 
                                         Conditions de Transport
                                     </h3>
                                     <div className="flex gap-4">
                                         <div className="text-right">
                                             <span className="text-[10px] text-slate-500 uppercase block">Temp. Moyenne</span>
                                             <span className="text-emerald-400 font-mono font-bold text-sm">4.8°C</span>
                                         </div>
                                         <div className="text-right">
                                             <span className="text-[10px] text-slate-500 uppercase block">Humidité</span>
                                             <span className="text-blue-400 font-mono font-bold text-sm">58%</span>
                                         </div>
                                     </div>
                                 </div>
                                 
                                 <div className="flex-1 w-full min-h-[200px]">
                                     <ResponsiveContainer width="100%" height="100%">
                                         <LineChart data={IOT_DATA}>
                                             <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                             <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                                             <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} domain={[0, 10]} />
                                             <Tooltip 
                                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                                itemStyle={{ fontSize: '12px' }}
                                             />
                                             <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
                                         </LineChart>
                                     </ResponsiveContainer>
                                 </div>
                                 
                                 <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                                     <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
                                     <div>
                                         <span className="text-xs font-bold text-red-500 block">Alerte Seuil (Simulé)</span>
                                         <p className="text-[10px] text-red-300">Pic de température détecté à 10:45 (6.2°C). Rétabli automatiquement.</p>
                                     </div>
                                 </div>
                             </div>
                         ) : activeStep === 'culture' ? (
                             <div className="space-y-4">
                                 <h3 className="text-sm font-bold text-white mb-4">Données de Culture (IoT Farm)</h3>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                                         <Sprout className="mx-auto text-emerald-500 mb-2" />
                                         <span className="text-2xl font-bold text-white block">A+</span>
                                         <span className="text-xs text-slate-500">Santé Végétale</span>
                                     </div>
                                     <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                                         <Droplets className="mx-auto text-blue-500 mb-2" />
                                         <span className="text-2xl font-bold text-white block">Ok</span>
                                         <span className="text-xs text-slate-500">Irrigation Opt.</span>
                                     </div>
                                 </div>
                             </div>
                         ) : (
                             <div className="h-full flex items-center justify-center text-slate-500 text-xs italic">
                                 Sélectionnez une étape active pour voir les détails IoT/Blockchain.
                             </div>
                         )}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
