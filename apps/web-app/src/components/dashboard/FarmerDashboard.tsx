"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Sprout, 
  ArrowRight,
  Plus,
  History,
  LayoutDashboard
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFarmerStore } from "@/store/farmerStore"
import { farmApi } from "@/services/farmApi"
import { toast } from "sonner"
import dynamic from "next/dynamic"

// Import Modules
import { FarmerOverview } from "./FarmerOverview"
import { HarvestInputModule } from "./HarvestInputModule"
import { FarmerMarketplaceWidget } from "./FarmerMarketplaceWidget"
import { AIIntelligenceModule } from "./AIIntelligenceModule"
import { AgriAcademyModule } from "./AgriAcademyModule"
import { AgriLinkLogisticsModule } from "./AgriLinkLogisticsModule"

const Parcel3DViewer = dynamic(() => import("./Parcel3DViewer"), { 
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-black/5 text-muted-foreground animate-pulse">Initialisation du moteur 3D...</div>
})

export function FarmerDashboard() {
  const { 
    activeTab,
    setParcels, 
    setWeather
  } = useFarmerStore()

  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadData() {
      try {
        const [parcelsData, weatherData] = await Promise.all([
          farmApi.getParcels(),
          farmApi.getWeather()
        ])
        setParcels(parcelsData)
        setWeather(weatherData)
      } catch (error) {
        toast.error("Erreur lors du chargement des données de la ferme")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [setParcels, setWeather])

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1B4D3E] border-t-[#D4A017]" />
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-5xl font-black text-[#1B4D3E] dark:text-white tracking-tighter"
                >
                  AgriLogic <span className="text-[#D4A017]">OS v2.4</span>
                </motion.h1>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Système de Surveillance Prédictive Actif
                </p>
              </div>
              <div className="flex gap-4">
                <Button className="bg-[#1B4D3E] hover:bg-[#1B4D3E]/90 text-white rounded-2xl h-14 px-8 font-black shadow-2xl shadow-[#1B4D3E]/30 transition-all hover:scale-105 active:scale-95">
                  <Plus className="mr-3 h-5 w-5 text-[#D4A017]" /> NOUVELLE RÉCOLTE
                </Button>
                <Button variant="outline" className="rounded-2xl h-14 px-6 font-black border-slate-200 hover:bg-white dark:hover:bg-white/5 transition-all">
                  <History className="mr-3 h-5 w-5" /> AUDIT LOGS
                </Button>
              </div>
            </div>

            <FarmerOverview />

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1B4D3E] to-[#D4A017] rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <Card className="overflow-hidden border-none bg-white dark:bg-[#050505] rounded-[2rem] shadow-2xl relative">
                <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-slate-50 dark:border-white/5">
                  <div>
                    <CardTitle className="text-2xl font-black text-[#1B4D3E] dark:text-white flex items-center gap-3">
                      <LayoutDashboard className="h-6 w-6 text-[#D4A017]" /> Jumeau Numérique Temps Réel
                    </CardTitle>
                    <CardDescription className="font-medium">Analyse multispectrale par satellite augmentée IA</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1.5 rounded-full font-black text-[10px]">SYNC: MQTT/SSL</Badge>
                    <Badge className="bg-[#D4A017]/10 text-[#D4A017] border-none px-4 py-1.5 rounded-full font-black text-[10px]">MODE: 3D_VR</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 relative">
                  <div className="h-[600px] w-full bg-[#050505]">
                    <Parcel3DViewer />
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )
      case "entry":
        return (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto"
          >
            <HarvestInputModule />
          </motion.div>
        )
      case "marketplace":
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pb-20"
          >
            <FarmerMarketplaceWidget />
          </motion.div>
        )
      case "plots":
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-[calc(100vh-200px)] w-full rounded-[3.5rem] overflow-hidden shadow-3xl relative border border-slate-100 dark:border-white/5 bg-[#050505]"
          >
             <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 dark:border-white/2 rounded-[3.5rem] z-20" />
             <div className="absolute top-10 left-10 z-30 pointer-events-none">
                <Badge className="bg-[#D4A017] text-white px-6 py-2 rounded-full font-black text-xs tracking-widest shadow-2xl">VUE SATELLITE 3D ACTIVE</Badge>
             </div>
             <Parcel3DViewer />
          </motion.div>
        )
      case "ai":
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-20"
          >
            <AIIntelligenceModule />
          </motion.div>
        )
      case "training":
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pb-20"
          >
            <AgriAcademyModule />
          </motion.div>
        )
      case "logistics":
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pb-20"
          >
            <AgriLinkLogisticsModule />
          </motion.div>
        )
      default:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-20"
          >
            <FarmerOverview />
          </motion.div>
        )
    }
  }

  return (
    <div className="pb-12 h-full">
      <AnimatePresence mode="wait">
        <div key={activeTab}>
          {renderContent()}
        </div>
      </AnimatePresence>
    </div>
  )
}
