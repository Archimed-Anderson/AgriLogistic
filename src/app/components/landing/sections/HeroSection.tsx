import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface HeroSectionProps {
  onNavigate?: (route: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-white via-slate-50 to-green-50/30 pt-10 pb-8 lg:pt-16 lg:pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col max-w-2xl relative z-10">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-green-100 bg-white/80 backdrop-blur-md px-4 py-1.5 shadow-sm transition-all hover:shadow-md hover:border-green-200 cursor-default group">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 group-hover:bg-green-600 transition-colors"></span>
              </span>
              <span className="text-sm font-bold text-slate-700 tracking-wide flex items-center gap-1.5">
                N°1 Plateforme Agrologistique
              </span>
            </div>

            <h1 className="text-4xl font-light tracking-tight text-slate-800 sm:text-5xl lg:text-6xl mb-6 leading-[1.15]">
              Discover Fresh, <br />
              <span className="font-medium text-green-600">Organic Delights</span>
            </h1>

            <p className="text-lg font-normal text-slate-500 mb-8 leading-relaxed max-w-lg">
              Optimisez votre chaîne d'approvisionnement agricole.
              <strong className="font-bold text-slate-700"> Marketplace B2B</strong>,
              <strong className="font-bold text-slate-700"> traçabilité temps réel</strong> et
              <strong className="font-bold text-slate-700"> IA</strong> pour booster votre
              rendement.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white rounded-md px-8 h-12 text-base font-bold shadow-sm hover:shadow-md transition-all"
                onClick={() => onNavigate?.('/register')}
              >
                Commencer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-600 hover:border-green-600 hover:text-green-700 rounded-md px-8 h-12 text-base font-medium"
                onClick={() => onNavigate?.('/demo')}
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                Démo Interactive
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8 border-t border-slate-100">
              <div>
                <p className="text-3xl font-light text-slate-800">15k+</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Agriculteurs
                </p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div>
                <p className="text-3xl font-light text-slate-800">2.5M€</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Transités
                </p>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] bg-cover bg-center"
                    style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i + 10})` }}
                  ></div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-green-50 text-green-600 flex items-center justify-center text-xs font-bold">
                  +
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Grid - Modernized */}
          <div className="relative h-[450px] lg:h-[600px] w-full hidden lg:block perspective-1000">
            {/* Main Image */}
            <div className="absolute top-0 right-0 w-[90%] h-[75%] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-green-900/10 transition-transform hover:scale-[1.01] duration-700 ease-out group">
              <img
                src="/assets/images/landing/hero-bg.png"
                alt="Agriculture moderne"
                className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2s]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-green-900/20 via-transparent to-transparent"></div>

              {/* Overlay Tag */}
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm">
                <p className="text-sm font-bold text-green-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Live Dashboard
                </p>
              </div>
            </div>

            {/* Floating Card 1 - Growth/Security (New Asset) */}
            <div className="absolute bottom-20 left-4 w-[220px] h-[220px] lg:w-[260px] lg:h-[260px] animate-float">
              <div className="relative w-full h-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/50 p-4 transition-transform hover:-translate-y-2 duration-300">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                  <span className="text-white text-xl font-bold">$</span>
                </div>
                <img
                  src="/assets/images/landing/hero-floating-growth.png"
                  alt="Financial Growth"
                  className="w-full h-full object-contain filter drop-shadow-lg transform hover:scale-110 transition-transform duration-500"
                />
                {/* Floating badge */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    +124% Revenue
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Card 2 - Marketplace (Existing Asset Refined) */}
            <div className="absolute top-20 -left-8 w-[180px] h-[180px] animate-float-delayed">
              <div className="relative w-full h-full bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/50 p-4 flex items-center justify-center transition-transform hover:-translate-y-2 duration-300">
                <img
                  src="/assets/images/landing/hero-floating-market.png"
                  alt="Marketplace"
                  className="w-[120%] h-[120%] object-contain -mt-2 ml-2 filter drop-shadow-md"
                />
                <div className="absolute bottom-3 bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-lg">
                  B2B MARKET
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-green-400/5 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite 1s;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;
