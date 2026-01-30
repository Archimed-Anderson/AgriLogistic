"use client"

import { TrendingUp, Shield, Zap, Globe, Cpu, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const innovations = [
  {
    id: "analytics",
    title: "Analytics en Temps Réel",
    description: "Visualisez vos stocks et prévoyez la demande grâce à nos algorithmes d'IA de pointe.",
    image: "/landing/innovation/analytics.png",
    icon: TrendingUp,
    accent: "from-cyan-500 to-blue-600",
    bgAccent: "bg-cyan-50",
    iconColor: "text-cyan-600"
  },
  {
    id: "blockchain",
    title: "Blockchain Trust",
    description: "Sécurisation totale des contrats et des paiements par registre distribué.",
    image: "/landing/innovation/blockchain.png",
    icon: Shield,
    accent: "from-emerald-500 to-teal-600",
    bgAccent: "bg-emerald-50",
    iconColor: "text-emerald-600"
  },
  {
    id: "logistics",
    title: "Logistique Intelligente",
    description: "Optimisation dynamique des routes et suivi IoT en temps réel.",
    image: "/landing/innovation/logistics.png",
    icon: Zap,
    accent: "from-orange-500 to-red-600",
    bgAccent: "bg-orange-50",
    iconColor: "text-orange-600"
  },
  {
    id: "network",
    title: "Réseau Mondial",
    description: "Connectez-vous instantanément aux marchés mondiaux.",
    image: "/landing/innovation/network.png",
    icon: Globe,
    accent: "from-purple-500 to-pink-600",
    bgAccent: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    id: "edge-ai",
    title: "Edge AI",
    description: "Intelligence embarquée pour l'analyse prédictive des récoltes.",
    image: "/landing/innovation/edge-ai.png",
    icon: Cpu,
    accent: "from-blue-500 to-indigo-600",
    bgAccent: "bg-blue-50",
    iconColor: "text-blue-600"
  },
  {
    id: "security",
    title: "Confidentialité",
    description: "Chiffrement AES-256 et souveraineté totale de vos données.",
    image: "/landing/innovation/security.png",
    icon: Lock,
    accent: "from-rose-500 to-pink-600",
    bgAccent: "bg-rose-50",
    iconColor: "text-rose-600"
  }
]

export function PerformanceInnovation() {
  return (
    <section className="py-32 relative overflow-hidden bg-linear-to-b from-white via-slate-50/50 to-white">
      {/* Background Decorations */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/30 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[150px]" />
      </div>

      <div className="container px-6 mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-24 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
            <Zap className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700 uppercase tracking-[0.2em]">
              Performance & Innovation
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-[#0A2619] mb-8 leading-tight">
            Une technologie{" "}
            <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent italic">
              robuste
            </span>{" "}
            pour un impact réel.
          </h2>
          
          <p className="text-slate-600 text-xl md:text-2xl font-medium leading-relaxed">
            Nous avons fusionné l'IA de pointe, la blockchain et l'IoT pour créer l'écosystème agricole le plus puissant au monde.
          </p>
        </div>

        {/* Innovation Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {innovations.map((innovation, index) => (
              <div
                key={innovation.id}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Container */}
                <div className="relative h-full bg-white rounded-4xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  
                  {/* Image Section */}
                  <div className="relative aspect-4/3 overflow-hidden">
                    <img
                      src={innovation.image}
                      alt={innovation.title}
                      loading="eager"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    

                    {/* Icon Badge */}
                    <div className="absolute top-6 left-6">
                      <div className={cn(
                        "p-4 rounded-2xl backdrop-blur-xl bg-white/90 shadow-xl border border-white/20 group-hover:scale-110 transition-transform duration-500",
                        innovation.bgAccent
                      )}>
                        <innovation.icon className={cn("h-6 w-6", innovation.iconColor)} />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-[#0A2619] mb-3 group-hover:text-primary transition-colors">
                      {innovation.title}
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {innovation.description}
                    </p>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={cn(
                    "absolute -inset-0.5 bg-linear-to-r opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10 rounded-4xl",
                    innovation.accent
                  )} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-24 text-center">
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 border-2 border-white" />
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-cyan-500 border-2 border-white" />
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-purple-400 to-pink-500 border-2 border-white" />
            </div>
            <span className="text-sm font-bold text-slate-700">
              Rejoignez <span className="text-emerald-600">+10,000</span> utilisateurs qui transforment l'agriculture
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
