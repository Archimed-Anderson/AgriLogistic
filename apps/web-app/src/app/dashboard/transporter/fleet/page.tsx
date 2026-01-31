"use client"

import dynamic from "next/dynamic"

const FleetCommander = dynamic(() => import("@/components/dashboard/transporter/FleetCommander").then(mod => mod.FleetCommander), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-slate-950 text-slate-500 font-mono">
       <span className="animate-pulse">INITIALISATION JUMEAU NUMÉRIQUE...</span>
    </div>
  )
})

export default function FleetPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2 mb-8">
         <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
           FLOTTE <span className="text-emerald-500">COMMANDER</span>
         </h1>
         <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Maintenance Prédictive & Télémétrie 3D</p>
      </div>
      
      <FleetCommander />
    </div>
  )
}
