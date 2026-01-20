import { ArrowRight, ChevronRight, Play } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface HeroSectionProps {
  onNavigate?: (route: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <div className="relative h-screen min-h-[800px] w-full overflow-hidden bg-slate-900 text-white">
      {/* Background Image with Parallax-like fixed position */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60 transition-transform duration-[10s] hover:scale-105"
        style={{
          backgroundImage: `url('/assets/images/landing/hero-bg.png')`,
          // Fallback gradient if image not found immediately
          backgroundColor: '#0f172a'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-6 md:px-12">
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="mb-6 inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse" />
            <span className="text-sm font-medium text-green-300">
              La plateforme #1 pour l'agrologistique
            </span>
            <ChevronRight className="ml-1 h-4 w-4 text-green-300" />
          </div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-7xl lg:text-8xl">
            Cultivez l'avenir <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
              Logistique & IA
            </span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed">
            Optimisez votre chaîne d'approvisionnement agricole de la récolte à la livraison. 
            Marketplace B2B, traçabilité temps réel et intelligence artificielle au service de votre rendement.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button 
              size="lg" 
              className="group bg-green-600 hover:bg-green-700 text-white border-none h-14 px-8 text-lg rounded-full"
              onClick={() => onNavigate?.('/register')}
            >
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="h-14 px-8 text-lg rounded-full border-slate-600 bg-slate-800/50 text-white hover:bg-slate-800 hover:text-white backdrop-blur-md"
              onClick={() => onNavigate?.('/demo')}
            >
              <Play className="mr-2 h-5 w-5 fill-current" />
              Démo interactive
            </Button>
          </div>

          {/* Stats quick view */}
          <div className="mt-16 flex gap-12 border-t border-slate-700/50 pt-8">
            <div>
              <div className="text-3xl font-bold text-white">15k+</div>
              <div className="text-sm text-slate-400">Agriculteurs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-sm text-slate-400">Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">2.5M€</div>
              <div className="text-sm text-slate-400">Transités</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-slate-500/50 p-1">
          <div className="h-2 w-1.5 rounded-full bg-slate-400" />
        </div>
      </div>
    </div>
  );
}
