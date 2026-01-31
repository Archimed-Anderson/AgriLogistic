"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Truck, 
  MapPin, 
  Navigation, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight, 
  Clock, 
  User, 
  Smartphone, 
  FileCheck, 
  Camera, 
  PenTool,
  Activity,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Maximize2,
  Search,
  Droplets,
  Wind,
  Zap,
  Star
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import dynamic from "next/dynamic"

const DynamicLiveMap = dynamic(() => import("./LiveLogisticMap"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#050505] flex items-center justify-center text-[#D4A017] animate-pulse">CHARGEMENT DE LA TÉLÉMÉTRIE...</div>
})

// --- Expanded Mock Data ---

const INITIAL_FLEET = [
  { id: "T-001", model: "Volvo FH16", driver: "Moussa Diop", lat: 48.8566, lng: 2.3522, status: "En route", health: 94, load: "Blé (25T)", destination: "Port de Rouen" },
  { id: "T-002", model: "Scania R500", driver: "Jean Bernard", lat: 48.4000, lng: 2.5000, status: "Disponible", health: 100, load: "Vide", destination: "Hangar Sud" },
  { id: "T-003", model: "MAN TGX", driver: "Karim Ben", lat: 49.0000, lng: 1.8000, status: "Maintenance", health: 42, load: "Entretien", destination: "Atelier Central" },
]

const LOCATIONS = [
  { id: 1, name: "Pôle de Stockage A", lat: 48.2, lng: 2.1 },
  { id: 2, name: "Cooperatice Ouest", lat: 48.6, lng: 1.5 },
  { id: 3, name: "Terminal Maritime", lat: 49.4, lng: 0.1 },
]

const DRIVERS = [
  { id: 1, name: "Amadou S.", rating: 4.9, hours: "142h", avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=100", status: "Driving" },
  { id: 2, name: "Jean-Luc M.", rating: 4.7, hours: "156h", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100", status: "Resting" },
  { id: 3, name: "Sarah K.", rating: 5.0, hours: "128h", avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=100", status: "Loading" },
]

const FLEET_STATS = [
  { label: "Consommation Moy.", value: "32.4", unit: "L/100", change: "-2.1%", icon: Droplets, color: "text-blue-400" },
  { label: "Emissions CO2", value: "1.4", unit: "T/mois", change: "-12%", icon: Wind, color: "text-emerald-400" },
  { label: "Taux de Service", value: "98.2", unit: "%", change: "+0.5%", icon: Zap, color: "text-[#D4A017]" },
  { label: "Alertes Temp.", value: "02", unit: "Actives", change: "Stable", icon: AlertCircle, color: "text-red-400" },
]

// --- Refined Components ---

function StatCard({ stat }: { stat: any }) {
  return (
    <Card className="bg-[#0a0a0a] border-white/5 p-6 space-y-4 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
        <stat.icon size={80} />
      </div>
      <div className="flex justify-between items-start relative z-10">
        <div className={cn("p-3 rounded-2xl bg-white/5", stat.color)}>
          <stat.icon size={20} />
        </div>
        <Badge className="bg-white/5 text-slate-400 border-none text-[10px] font-black">{stat.change}</Badge>
      </div>
      <div className="space-y-1 relative z-10">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
        <div className="flex items-baseline gap-2">
           <h4 className="text-3xl font-black text-white tabular-nums">{stat.value}</h4>
           <span className="text-xs font-bold text-slate-500">{stat.unit}</span>
        </div>
      </div>
    </Card>
  )
}

/**
 * RouteOptimizer Form
 */
function RouteOptimizer({ onOptimize }: { onOptimize: (points: any[]) => void }) {
  const [points, setPoints] = React.useState<string[]>([])
  const [inputValue, setInputValue] = React.useState("")

  const addPoint = () => {
    if (inputValue && points.length < 5) {
      setPoints([...points, inputValue])
      setInputValue("")
    }
  }

  const handleOptimize = () => {
    onOptimize(LOCATIONS)
    toast.success("ITINÉRAIRE OPTIMISÉ", {
      description: "Algorithme TSP appliqué : Distance réduite de 22%."
    })
  }

  return (
    <Card className="bg-[#0a0a0a] border-white/5 rounded-[3rem] p-10 space-y-8 shadow-3xl overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[80px] rounded-full" />
      
      <div className="space-y-2 relative z-10">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">PLANIFICATEUR <span className="text-[#D4A017]">IA</span></h3>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Optimisation de tournée Multi-Points</p>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex gap-3">
          <Input 
            placeholder="Rechercher un point..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-white/5 border-none h-14 rounded-2xl px-6 text-sm font-bold text-white"
          />
          <Button onClick={addPoint} className="bg-[#D4A017] hover:bg-amber-600 text-black h-14 w-14 rounded-2xl shrink-0"><MapPin size={22} /></Button>
        </div>

        <div className="space-y-3">
           {points.map((p, i) => (
             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={i} className="flex items-center gap-4 p-4 bg-white/2 rounded-2xl border border-white/5">
                <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-black">{i+1}</div>
                <span className="text-[10px] font-black text-white uppercase">{p}</span>
                <button className="ml-auto text-slate-600 hover:text-red-400"><Trash2 size={14} /></button>
             </motion.div>
           ))}
        </div>
      </div>

      <Button onClick={handleOptimize} className="w-full bg-[#1B4D3E] hover:bg-emerald-700 text-white rounded-2xl h-16 font-black gap-3 shadow-2xl relative z-10 uppercase tracking-widest text-xs">
         <Navigation size={20} className="text-[#D4A017]" /> CALCULER LE CHEMIN CRITIQUE
      </Button>
    </Card>
  )
}

/**
 * Proof of Delivery Form
 */
function DeliveryValidation() {
  const [signature, setSignature] = React.useState(false)

  const handleSign = () => {
    setSignature(true)
    toast.success("SIGNATURE ENREGISTRÉE", { description: "Certificat de livraison prêt pour validation blockchain." })
  }

  return (
    <Card className="bg-[#0a0a0a] border-[#D4A017]/20 border rounded-[3rem] p-10 space-y-8 shadow-[0_30px_60px_rgba(212,160,23,0.1)]">
       <div className="space-y-2">
          <Badge className="bg-[#D4A017] text-black font-black text-[10px] px-4 py-1 rounded-full mb-2">VALIDATION_FINALE</Badge>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">PREUVE DE LIVRAISON</h3>
       </div>

       <div className="grid grid-cols-2 gap-6">
          <button className="flex flex-col items-center justify-center gap-4 h-40 bg-white/2 border border-dashed border-white/10 rounded-[2.5rem] hover:bg-white/5 hover:border-[#D4A017]/40 transition-all active:scale-95">
             <Camera className="text-[#D4A017] h-10 w-10" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Photo</span>
          </button>
          <button 
            onClick={handleSign}
            className={cn(
              "flex flex-col items-center justify-center gap-4 h-40 border-dashed rounded-[2.5rem] transition-all active:scale-95",
              signature ? "bg-emerald-500/20 border-emerald-500" : "bg-white/2 border-white/10 hover:border-[#D4A017]/40"
            )}
          >
             {signature ? <CheckCircle2 className="text-emerald-400 h-10 w-10" /> : <PenTool className="text-[#D4A017] h-10 w-10" />}
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{signature ? "Signé" : "Signer"}</span>
          </button>
       </div>

       <Button disabled={!signature} className="w-full bg-[#D4A017] hover:bg-amber-600 text-black rounded-2xl h-16 font-black gap-3 shadow-2xl transition-all uppercase tracking-widest text-xs">
          <FileCheck size={20} /> CERTIFIER LA RÉCEPTION
       </Button>
    </Card>
  )
}

// --- Main Module ---

export function AgriLinkLogisticsModule() {
  const [activeTrucks, setActiveTrucks] = React.useState(INITIAL_FLEET)
  const [route, setRoute] = React.useState<[number, number][]>([])

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveTrucks((prev: any[]) => prev.map((t: any) => ({
        ...t,
        lat: t.status === "En route" ? t.lat + (Math.random() - 0.5) * 0.001 : t.lat,
        lng: t.status === "En route" ? t.lng + (Math.random() - 0.5) * 0.001 : t.lng,
      })))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-[1800px] mx-auto space-y-10 p-2">
      {/* High-Tech Stealth Header */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 shadow-3xl">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#D4A017] flex items-center justify-center text-black shadow-[0_0_30px_rgba(212,160,23,0.3)]">
               <Activity size={24} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
                AGRILINK <span className="text-[#D4A017]">COMMAND</span> CENTER
              </h1>
              <p className="text-slate-500 font-bold uppercase text-[11px] tracking-[0.5em] mt-2 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Surveillance Fleet-IQ v4.2 | 12 Unités en Ligne
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
           {["SÉCURITÉ: OK", "GPS: OPTIMAL", "SAT: 12/12"].map((txt, i) => (
             <Badge key={i} variant="outline" className="border-white/10 text-white/40 font-black text-[9px] px-4 py-2 rounded-xl bg-white/5 tracking-widest uppercase">
               {txt}
             </Badge>
           ))}
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {FLEET_STATS.map((stat, i) => <StatCard key={i} stat={stat} />)}
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Intelligence View */}
        <div className="lg:col-span-8 space-y-10">
           {/* Immersive Map with Technical Frame */}
           <div className="relative rounded-[4rem] overflow-hidden bg-black border-[12px] border-[#0a0a0a] shadow-3xl h-[700px]">
              <div className="absolute top-10 left-10 z-20 flex flex-col gap-4">
                 <div className="bg-black/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 space-y-1">
                    <p className="text-[10px] font-black text-[#D4A017] uppercase tracking-widest">Temps Moyen de Livraison</p>
                    <p className="text-2xl font-black text-white italic">14h 22m <span className="text-xs text-emerald-500 font-bold not-italic ml-2">-15%</span></p>
                 </div>
                 <div className="bg-black/80 backdrop-blur-xl p-5 rounded-3xl border border-white/10 flex items-center gap-4">
                    <div className="h-4 w-4 rounded-full bg-blue-500 animate-pulse" />
                    <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Analyse Télémétrique Live</p>
                 </div>
              </div>

              <div className="absolute bottom-10 right-10 z-20">
                 <Button className="bg-[#D4A017] hover:bg-amber-600 text-black h-16 px-8 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl flex gap-3">
                    <Maximize2 size={20} /> Plein Écran
                 </Button>
              </div>

              <DynamicLiveMap trucks={activeTrucks} route={route} />
           </div>

           {/* Planning & Proof Section */}
           <div className="grid md:grid-cols-2 gap-10">
              <RouteOptimizer onOptimize={(pts) => setRoute(pts.map(p => [p.lat, p.lng]))} />
              <DeliveryValidation />
           </div>
        </div>

        {/* Fleet Sidebar Monitor */}
        <div className="lg:col-span-4 space-y-10">
           <Card className="bg-[#0a0a0a] border-white/10 rounded-[3.5rem] p-10 space-y-8 shadow-3xl min-h-[500px]">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">MONITEUR <span className="text-[#D4A017]">FLOTTE</span></h3>
                 <Badge className="bg-[#1B4D3E] text-[#D4A017] px-4 py-1.5 rounded-full font-black text-[10px]">SCAN EN COURS...</Badge>
              </div>

              <div className="space-y-6">
                 {activeTrucks.map((truck) => (
                   <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={truck.id} className="p-6 bg-white/5 rounded-[2.5rem] border border-white/5 hover:border-[#D4A017]/30 transition-all cursor-pointer group">
                      <div className="flex gap-5 mb-5">
                         <div className="h-16 w-16 rounded-2xl bg-black overflow-hidden border border-white/10 group-hover:border-[#D4A017]/40 transition-colors">
                            <img src="https://images.unsplash.com/photo-1586191582151-f737730a1632?auto=format&fit=crop&q=80&w=200" className="w-full h-full object-cover opacity-80" alt="truck" />
                         </div>
                         <div className="flex-1">
                            <div className="flex justify-between items-start">
                               <h4 className="text-lg font-black text-white">{truck.id}</h4>
                               <Badge className={cn(
                                 "text-[8px] font-black uppercase border-none",
                                 truck.status === "En route" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"
                               )}>{truck.status}</Badge>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Modèle: {truck.model}</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5 mb-4">
                         <div className="space-y-1">
                            <p className="text-[9px] font-black text-slate-600 uppercase">Cargaison</p>
                            <p className="text-xs font-black text-white italic truncate">{truck.load}</p>
                         </div>
                         <div className="space-y-1 text-right">
                            <p className="text-[9px] font-black text-slate-600 uppercase">Destination</p>
                            <p className="text-xs font-black text-white italic truncate">{truck.destination}</p>
                         </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase">
                           <span className="text-slate-500">Intégrité Télémétrique</span>
                           <span className="text-[#D4A017]">{truck.health}%</span>
                        </div>
                        {/* @ts-ignore */}
                        <Progress value={truck.health} className="h-1.5 bg-black [&>div]:bg-[#D4A017]" />
                      </div>
                   </motion.div>
                 ))}
              </div>
           </Card>

           {/* Divers & Mobile Extension */}
           <div className="space-y-6">
              <h4 className="text-xl font-black text-white uppercase italic ml-6">ÉQUIPAGE <span className="text-[#D4A017]">CONNECTÉ</span></h4>
              <div className="grid grid-cols-1 gap-4">
                 {DRIVERS.map(driver => (
                   <div key={driver.id} className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                      <div className="flex items-center gap-5">
                         <div className="h-14 w-14 rounded-2xl bg-slate-800 overflow-hidden border border-white/10 group-hover:scale-105 transition-transform">
                            <img src={driver.avatar} className="w-full h-full object-cover" alt={driver.name} />
                         </div>
                         <div>
                            <p className="font-black text-white text-sm uppercase">{driver.name}</p>
                            <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase">
                               <Star size={10} className="text-[#1B4D3E] fill-[#1B4D3E]" /> {driver.rating} | {driver.hours} de route
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <Badge className="bg-emerald-500/10 text-emerald-400 border-none font-black text-[8px] px-3">{driver.status}</Badge>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Mobile App QR Simulation */}
           <Card className="bg-gradient-to-br from-[#1B4D3E] to-[#0a1f18] border-none rounded-[3.5rem] p-10 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
                 <Smartphone size={200} />
              </div>
              <div className="relative z-10 space-y-6">
                 <Badge className="bg-white/10 text-white font-black text-[9px] px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/20">Mobile HUB v4.0</Badge>
                 <h4 className="text-3xl font-black text-white tracking-tighter uppercase leading-[0.9]">PILOTAGE <br/> CHAUFFEUR</h4>
                 <p className="text-white/60 text-xs font-bold uppercase leading-relaxed">Installez l'Agent AgriLink sur les terminaux de votre flotte pour synchroniser la blockchain.</p>
                 <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 border-white/20 text-white rounded-xl h-14 font-black text-[10px] uppercase">APP STORE</Button>
                    <Button variant="outline" className="flex-1 border-white/20 text-white rounded-xl h-14 font-black text-[10px] uppercase">PLAY STORE</Button>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
