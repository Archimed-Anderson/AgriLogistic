import { useState } from 'react';
import { Sprout, Droplets, Sun, ArrowRight } from 'lucide-react';

const practices = [
  {
    id: 'yield',
    title: '80% Yield Growth',
    description: 'Enhanced crop productivity through AI-driven insights.',
    icon: Sprout,
    color: 'bg-green-50 text-green-600',
    image: '/assets/images/landing/practice-yield-growth.png',
    route: '/practices/yield-growth',
  },
  {
    id: 'water',
    title: '100% Efficient',
    description: 'Smart water management reducing waste significantly.',
    icon: Droplets,
    color: 'bg-blue-50 text-blue-600',
    image: '/assets/images/landing/practice-water-efficiency.png',
    route: '/practices/water-efficiency',
  },
  {
    id: 'energy',
    title: 'Renewable Energy',
    description: 'Powered by solar and clean energy solutions.',
    icon: Sun,
    color: 'bg-orange-50 text-orange-600',
    image: '/assets/images/landing/practice-renewable-energy.png',
    route: '/practices/renewable-energy',
  },
];

interface PracticesSectionProps {
  onNavigate?: (route: string) => void;
}

export default function PracticesSection({ onNavigate }: PracticesSectionProps) {
  const [activeImage, setActiveImage] = useState(practices[0].image);

  const handleNavigate = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    }
  };

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Visual - Interactive */}
          <div className="relative order-2 lg:order-1 group perspective-1000">
            <div className="aspect-[3/4] w-full max-w-md mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-500 transform group-hover:rotate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/50 to-slate-900/80 z-10 transition-opacity duration-500"></div>
              <img
                src={activeImage}
                alt="Sustainable Practice"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-90 hover:scale-105"
              />

              {/* Overlay Content */}
              <div className="absolute bottom-8 left-8 right-8 text-white z-20">
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/10">
                  In Focus
                </div>
                <div className="text-4xl font-bold mb-2">Sustainable</div>
                <p className="text-green-100/90 text-sm">
                  Hover over the cards to see our impact in action.
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-12 -right-12 w-32 h-32 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -z-10 bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2">
            <span className="text-green-600 font-semibold tracking-wide uppercase text-sm">
              Sustainable Practices
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
              Sustainable Farm Practices for a Better Tomorrow
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-10">
              We integrate cutting-edge technology with traditional wisdom to create farming systems
              that are productive, profitable, and planet-friendly.
            </p>

            <div className="grid gap-6">
              {practices.map((practice) => (
                <div
                  key={practice.id}
                  className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-green-100 transition-all cursor-pointer group/card"
                  onMouseEnter={() => setActiveImage(practice.image)}
                  onClick={() => handleNavigate(practice.route)}
                >
                  <div
                    className={`w-12 h-12 ${practice.color} rounded-xl flex shrink-0 items-center justify-center transition-transform group-hover/card:scale-110`}
                  >
                    <practice.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 mb-1 group-hover/card:text-green-700 transition-colors flex items-center justify-between">
                      {practice.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover/card:opacity-100 -translate-x-2 group-hover/card:translate-x-0 transition-all text-green-500" />
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{practice.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
