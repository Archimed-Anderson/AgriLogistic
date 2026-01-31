"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowRight,
  Sparkles,
  Wheat,
  Milk,
  Apple,
  Leaf,
  Check,
  Loader2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { MOCK_MISSIONS } from "@/data/transporter-mock-data"

const getIcon = (name: string) => {
  switch (name) {
    case "Wheat": return Wheat;
    case "Milk": return Milk;
    case "Apple": return Apple;
    case "Leaf": return Leaf;
    default: return Sparkles;
  }
}

export function MissionCarousel() {
  const [missions, setMissions] = React.useState(MOCK_MISSIONS)
  const [processingId, setProcessingId] = React.useState<string | null>(null)

  const handleAccept = async (id: string) => {
    setProcessingId(id)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    toast.success("Mission Acceptée !", {
       description: `La mission ${id} a été ajoutée à votre planning optimisé. Notification envoyée au chauffeur.`,
       icon: <Sparkles className="text-emerald-500" />
    })
    
    // Remove after animation
    setTimeout(() => {
       setMissions(prev => prev.filter(m => m.id !== id))
       setProcessingId(null)
    }, 500)
  }

  return (
    <div className="w-full relative overflow-hidden py-4">
       <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory px-1 custom-scrollbar">
          <AnimatePresence>
            {missions.map((mission, i) => {
               const Icon = getIcon(mission.icon)
               const isProcessing = processingId === mission.id

               return (
                 <motion.div 
                   key={mission.id}
                   initial={{ opacity: 0, x: 50 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                   transition={{ delay: i * 0.1 }}
                   className="snap-center shrink-0 w-[300px] md:w-[350px]"
                 >
                    <Card className="bg-slate-900/80 backdrop-blur-md border-white/5 shadow-xl hover:border-emerald-500/30 transition-all duration-300 group rounded-[2rem] overflow-hidden relative">
                       {/* AI Header */}
                       <div className="bg-emerald-500/10 p-3 flex justify-between items-center border-b border-white/5">
                          <div className="flex items-center gap-2">
                             <Sparkles className="h-3 w-3 text-emerald-500" />
                             <span className="text-[10px] font-black uppercase text-emerald-400">AGRO-AI MATCH</span>
                          </div>
                          <Badge className="bg-emerald-500 text-slate-900 border-none font-black text-[9px]">{mission.aiScore}% SCORE</Badge>
                       </div>
    
                       <CardContent className="p-5 space-y-4">
                          {/* Cargo Info */}
                          <div className="flex items-start justify-between">
                             <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:bg-emerald-500 group-hover:scale-110 transition-all duration-500">
                                   <Icon size={20} />
                                </div>
                                <div>
                                   <h4 className="font-black text-white text-sm uppercase">{mission.cargo}</h4>
                                   <p className="text-[10px] font-bold text-slate-500">{mission.weight} • {mission.from}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="font-black text-emerald-400 text-lg">€{mission.price - mission.cost}</p>
                                <p className="text-[8px] font-bold text-slate-500 uppercase">Gain Net Est.</p>
                             </div>
                          </div>
    
                          {/* Route Stats */}
                          <div className="grid grid-cols-2 gap-2 bg-black/20 p-3 rounded-xl">
                             <div className="flex items-center gap-2">
                                <ArrowRight className="h-3 w-3 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-300">{mission.distEmpty}km à vide</span>
                             </div>
                             <div className="flex items-center gap-2 justify-end">
                                <Leaf className="h-3 w-3 text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-500">-12kg CO2</span>
                             </div>
                          </div>
    
                          {/* Action Button with Morphing Effect */}
                          <Button 
                            onClick={() => handleAccept(mission.id)}
                            disabled={isProcessing}
                            className={`w-full font-black uppercase text-[10px] h-10 rounded-xl shadow-lg transition-all duration-500 ${
                               isProcessing 
                               ? "bg-emerald-500 text-white w-full" 
                               : "bg-slate-100 hover:bg-emerald-500 hover:text-white text-slate-900"
                            }`}
                          >
                             {isProcessing ? (
                                <span className="flex items-center gap-2">
                                   <Check className="h-4 w-4 animate-in zoom-in spin-in-90 duration-300" /> CONFIRMÉ
                                </span>
                             ) : (
                                "Accepter en 1-Clic"
                             )}
                          </Button>
                       </CardContent>
                    </Card>
                 </motion.div>
               )
            })}
          </AnimatePresence>
          
          {/* Empty State Card */}
          <div className="snap-center shrink-0 w-[100px] flex items-center justify-center opacity-50">
             <div className="h-12 w-12 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-700">FIN</span>
             </div>
          </div>
       </div>
    </div>
  )
}
