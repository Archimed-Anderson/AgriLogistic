"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { DemoForm } from "@/components/landing/DemoForm"
import { CheckCircle, BarChart3, ScanFace, ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from "lucide-react"
import Image from "next/image"

export default function RequestDemoPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-primary/10 selection:text-primary">
      <Navbar />

      <main className="relative pt-20">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
          
          {/* Left Side: Strategic Value Illustration */}
          <div className="relative w-full lg:w-1/2 min-h-[500px] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#0A2619] px-8 lg:px-20 py-24">
            
            {/* Background Texture & Effects */}
            <div className="absolute inset-0 z-0">
               <Image 
                src="/images/hero-drone.png" 
                alt="AgriLogistic Advanced Tech" 
                fill 
                className="object-cover opacity-20 mix-blend-soft-light grayscale group-hover:scale-110 transition-transform duration-[20s]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A2619] via-[#0A2619]/95 to-primary/20" />
              
              {/* Subtle Animated Glow */}
              <div className="absolute top-1/4 -right-1/4 w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-2xl space-y-16 animate-fade-in">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                   <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                   <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-400">Standard Excellence AgTech</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter text-white leading-[0.95]">
                  Voir <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-accent">AgriLogistic</span> <br/>
                  en action.
                </h1>
                
                <p className="text-xl lg:text-2xl text-emerald-50/70 font-medium leading-relaxed max-w-xl">
                  L'écosystème IA le plus avancé pour les leaders de la chaîne de valeur agricole en Afrique.
                </p>
              </div>

              {/* Enterprise Points */}
              <div className="grid gap-10">
                {[
                  { 
                    icon: ShieldCheck, 
                    text: "Audit de Maturité Digitale", 
                    sub: "Analyse gratuite de vos flux logistiques par nos ingénieurs." 
                  },
                  { 
                    icon: Globe, 
                    text: "Plateforme Multi-Secteurs", 
                    sub: "De la traçabilité export au scoring financier prédictif." 
                  },
                  { 
                    icon: BarChart3, 
                    text: "Modèles IA Agro-Précis", 
                    sub: "Réduction des pertes post-récolte via intelligence préventive." 
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group items-start">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary group-hover:border-primary/50 group-hover:scale-110 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(45,90,39,0.4)]">
                      <item.icon className="h-7 w-7 text-emerald-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-black text-white group-hover:text-accent transition-colors tracking-tight">{item.text}</p>
                      <p className="text-sm text-emerald-100/40 font-medium leading-relaxed">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Footer */}
              <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row items-center gap-8 opacity-60">
                <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-12 w-12 rounded-full border-4 border-[#0A2619] bg-slate-800 flex items-center justify-center">
                       <ShieldCheck className="h-6 w-6 text-emerald-500" />
                    </div>
                  ))}
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400/80">
                  Déploiement certifié conforme aux normes internationales
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: High-Performance Lead Capture Form */}
          <div className="relative w-full lg:w-1/2 bg-[#F9FAFB] flex items-center justify-center px-6 py-24 lg:py-0 overflow-y-auto">
             {/* Subtle Decorative Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
             
             {/* Floating Blob Accents */}
             <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
             <div className="absolute bottom-1/4 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
             
             <div className="relative z-10 w-full max-w-lg">
                <DemoForm />
             </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}


