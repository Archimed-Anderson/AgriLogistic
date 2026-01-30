"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, PlayCircle, ShieldCheck, Zap, BarChart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-20 lg:pt-32 bg-[#F9FAFB]">
      {/* Background Elements - Ultra Subtle */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[45%] h-[60%] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] left-[-10%] w-[35%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      <div className="container relative z-10 px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* Left Column: Strategic Content */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 border border-primary/10 shadow-sm backdrop-blur-md">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              <span className="text-[11px] font-black text-primary tracking-[0.15em] uppercase">
                IA & BLOCKCHAIN : L'ÉCOSYSTÈME AGTECH MODERNE
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight text-[#0A2619] leading-[1.1] md:leading-[1.05]">
                Ne vendez plus seulement <br className="hidden md:block" />
                vos récoltes.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-600 to-accent">
                  Générez de la Valeur.
                </span>
              </h1>
              <p className="max-w-xl text-lg md:text-xl text-muted-foreground/90 leading-relaxed font-medium">
                AgriLogistic déploie une intelligence de pointe pour transformer vos données agricoles en leviers de rentabilité immédiate. Une vision 360Â° sur votre chaîne de valeur.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 pt-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-black transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_-15px_rgba(45,90,39,0.3)] rounded-2xl bg-primary hover:bg-primary/95 border-b-4 border-primary-foreground/10">
                  Démarrer Maintenant
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/request-demo" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-bold transition-all hover:bg-white hover:border-primary/30 rounded-2xl border-2 border-primary/10 backdrop-blur-sm group bg-white/40">
                  <PlayCircle className="mr-2 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                  Réserver une Démo
                </Button>
              </Link>
            </div>

            {/* Premium Stats - Elegant & Minimal */}
            <div className="pt-12 flex flex-wrap gap-10 md:gap-16 items-center">
              <div className="group cursor-default">
                <p className="text-4xl font-black text-primary tracking-tighter group-hover:scale-110 transition-transform origin-left">150k+</p>
                <div className="flex items-center gap-2">
                   <div className="h-1 w-4 bg-accent/40 rounded-full" />
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hectares <br/>Monitorés</p>
                </div>
              </div>
              <div className="group cursor-default">
                <p className="text-4xl font-black text-primary tracking-tighter group-hover:scale-110 transition-transform origin-left">98%</p>
                <div className="flex items-center gap-2">
                   <div className="h-1 w-4 bg-accent/40 rounded-full" />
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Précision <br/>Prédictive</p>
                </div>
              </div>
              <div className="group cursor-default">
                <p className="text-4xl font-black text-primary tracking-tighter group-hover:scale-110 transition-transform origin-left">B2B</p>
                <div className="flex items-center gap-2">
                   <div className="h-1 w-4 bg-accent/40 rounded-full" />
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Standard de <br/>Confiance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Experience */}
          <div className="lg:col-span-6 xl:col-span-5 relative animate-fade-in group">
            {/* Main Visual Frame */}
            <div className="relative aspect-[4/5] md:aspect-[1/1] xl:aspect-[4/5] w-full rounded-[48px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border-[12px] border-white z-20">
              <Image 
                src="/images/hero-farmer.png" 
                alt="AgriLogistic Tech Farmer" 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
              
              {/* Floating Dashboard Elements inside image */}
              <div className="absolute top-8 right-8 p-3 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="pr-4">
                    <p className="text-[10px] font-black text-white/60 uppercase tracking-tighter">Status</p>
                    <p className="text-xs font-bold text-white">Live Optimization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Layer: The Drone Graphic */}
            <div className="absolute -top-12 -left-12 w-48 h-48 md:w-56 md:h-56 rounded-[32px] overflow-hidden shadow-2xl border-8 border-white z-30 hidden xl:block animate-float-delayed">
              <Image 
                src="/images/hero-drone.png" 
                alt="AgriLogistic Drone Tech" 
                fill 
                className="object-cover"
              />
            </div>

            {/* Smart Badge Overlay */}
            <div className="absolute -bottom-8 -right-4 md:-right-8 lg:-right-4 z-40 w-[280px] md:w-[320px] glass p-6 rounded-[32px] border border-white/40 shadow-2xl backdrop-blur-2xl animate-bounce-slow">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-[#0A2619] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                  <BarChart className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-black text-primary leading-tight">AgriLogistic Intelligence</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Analytics Temps Réel</p>
                  <div className="flex gap-1 mt-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-1.5 w-6 rounded-full bg-primary/10 overflow-hidden">
                        <div className={`h-full bg-primary animate-pulse`} style={{ width: `${20*i}%`, animationDelay: `${i*0.2}s` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Geometric Elements */}
            <div className="absolute top-1/2 -right-12 w-32 h-32 bg-accent/20 rounded-full blur-[60px] -z-10" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[radial-gradient(#2D5A27_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10" />
            
            {/* Feature Badges */}
            <div className="absolute top-1/4 -right-8 glass px-4 py-2 rounded-full border border-white/40 shadow-lg z-30 hidden md:flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-primary tracking-wide">Blockchain Secured</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}


