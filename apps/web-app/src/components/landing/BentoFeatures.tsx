"use client"

import React from 'react'
import { Shield, TrendingUp, Globe, Zap, Cpu, Lock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Analytics en Temps Réel",
    description: "Visualisez vos stocks et prévoyez la demande grâce à nos algorithmes d'IA de pointe.",
    icon: TrendingUp,
    className: "md:col-span-2 lg:col-span-2 row-span-2",
    color: "from-blue-600/15 to-indigo-600/15 text-blue-700",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200",
    accent: "bg-blue-600",
  },
  {
    title: "Blockchain Trust",
    description: "Sécurisation totale des contrats et des paiements par registre distribué.",
    icon: Shield,
    className: "md:col-span-1 lg:col-span-1",
    color: "from-emerald-600/15 to-teal-600/15 text-emerald-700",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800",
    accent: "bg-emerald-600",
  },
  {
    title: "Logistique Intelligente",
    description: "Optimisation dynamique des routes et suivi IoT en temps réel.",
    icon: Zap,
    className: "md:col-span-1 lg:col-span-1",
    color: "from-orange-600/15 to-amber-600/15 text-orange-700",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800",
    accent: "bg-orange-600",
  },
  {
    title: "Réseau Mondial",
    description: "Connectez-vous instantanément aux marchés mondiaux.",
    icon: Globe,
    className: "md:col-span-1 lg:col-span-1",
    color: "from-purple-600/15 to-fuchsia-600/15 text-purple-700",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10c053b?auto=format&fit=crop&w=800",
    accent: "bg-purple-600",
  },
  {
    title: "Edge AI",
    description: "Intelligence embarquée pour l'analyse prédictive des récoltes.",
    icon: Cpu,
    className: "md:col-span-1 lg:col-span-1",
    color: "from-cyan-600/15 to-sky-600/15 text-cyan-700",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800",
    accent: "bg-cyan-600",
  },
  {
    title: "Confidentialité",
    description: "Chiffrement AES-256 et souveraineté totale de vos données.",
    icon: Lock,
    className: "md:col-span-2 lg:col-span-2",
    color: "from-rose-600/15 to-pink-600/15 text-rose-700",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200",
    accent: "bg-rose-600",
  },
]

export function BentoFeatures() {
  return (
    <section id="features" className="py-32 relative bg-[#F4F7F9] overflow-hidden">
      {/* Enhanced Mesh Gradient Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50">
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-emerald-200/40 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[160px]" />
      </div>

      <div className="container px-6 mx-auto relative z-10">
        <div className="max-w-3xl mb-24">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-emerald-700 text-[11px] font-black uppercase tracking-[0.2em] mb-8 shadow-md border border-slate-100/50">
            <Sparkles className="h-4 w-4 fill-emerald-100" />
            Performance & Innovation
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-950 mb-8 tracking-tight leading-[1.1]">
            Une technologie <span className="text-emerald-600 italic">robuste</span> pour un impact réel.
          </h2>
          <p className="text-slate-600 text-xl font-bold leading-relaxed max-w-xl">
            Nous avons fusionné l'IA de pointe, la blockchain et l'IoT pour créer l'écosystème agricole le plus puissant au monde.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[340px] gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group relative rounded-[3.5rem] overflow-hidden border border-slate-200 bg-white/80 backdrop-blur-3xl transition-all duration-700 hover:border-emerald-500/50 hover:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)]",
                feature.className
              )}
            >
              {/* Sharper Image Layer */}
              <div className="absolute inset-0 z-0 opacity-[0.15] group-hover:opacity-[0.35] transition-all duration-1000">
                <img 
                  src={feature.image} 
                  alt={feature.title} 
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 saturate-[0.8] group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              </div>

              {/* High-Contrast Content */}
              <div className="relative z-10 p-10 h-full flex flex-col justify-end">
                <div className={cn(
                  "p-5 rounded-[2rem] w-fit mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-xl border border-white",
                  feature.color,
                  "bg-white"
                )}>
                  <feature.icon className="h-8 w-8" />
                </div>
                
                <h3 className="text-3xl font-black text-slate-950 mb-4 tracking-tight group-hover:text-emerald-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-700 font-bold leading-relaxed text-[15px] opacity-90 group-hover:opacity-100 transition-opacity">
                  {feature.description}
                </p>

                {/* Vivid Decoration */}
                <div className="absolute bottom-0 left-0 h-2 w-0 group-hover:w-full bg-emerald-500/40 transition-all duration-1000 ease-in-out" />
              </div>

              {/* High-Impact Glow */}
              <div className="absolute -top-16 -right-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
