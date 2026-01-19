import { ArrowRight, Users, ShoppingBag } from 'lucide-react';

import heroImg from '../../../assets/landing/hero.webp';
import heroSmall1 from '../../../assets/landing/story-1.webp';
import heroSmall2 from '../../../assets/landing/story-2.webp';
import { trackEvent } from '../../../lib/analytics/ga';

interface HeroSectionProps {
  onNavigate: (route: string) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

  return (
    <section className="relative min-h-[700px] bg-gradient-to-br from-emerald-800 via-green-700 to-lime-600 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[700px] py-12">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Découvrez des Produits
                <span className="block text-lime-200">Frais et Bio</span>
              </h1>
              <p className="text-lg md:text-xl text-green-50 max-w-xl">
                AgroLogistic connecte producteurs, acheteurs et transporteurs pour une agriculture locale, 
                durable et rentable. Rejoignez notre communauté de passionnés!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  trackEvent(gaMeasurementId, 'cta_click', { cta: 'Commencer', location: 'hero' });
                  onNavigate('/auth');
                }}
                className="group px-8 py-4 bg-white text-emerald-700 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
              >
                Commencer
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => {
                  trackEvent(gaMeasurementId, 'cta_click', { cta: 'En savoir plus', location: 'hero' });
                  document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 bg-transparent text-white border-2 border-white/30 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                En savoir plus
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-8 w-8 text-lime-200" />
                  <span className="text-3xl font-bold text-white">450+</span>
                </div>
                <p className="text-green-100 text-sm">Producteurs Actifs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <ShoppingBag className="h-8 w-8 text-lime-200" />
                  <span className="text-3xl font-bold text-white">1954+</span>
                </div>
                <p className="text-green-100 text-sm">Produits Disponibles</p>
              </div>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Main large image */}
            <div className="col-span-2 rounded-2xl overflow-hidden shadow-2xl h-[300px] bg-white/10 backdrop-blur-sm border border-white/20">
              <img
                src={heroImg}
                alt="Agriculture moderne et produits frais"
                className="w-full h-full object-cover"
                width={1200}
                height={750}
                decoding="async"
                loading="eager"
              />
            </div>

            {/* Two smaller images */}
            <div className="rounded-xl overflow-hidden shadow-xl h-[180px] bg-white/10 backdrop-blur-sm border border-white/20">
              <img
                src={heroSmall1}
                alt="Produits agricoles et culture"
                className="w-full h-full object-cover"
                width={800}
                height={800}
                decoding="async"
                loading="eager"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl h-[180px] bg-white/10 backdrop-blur-sm border border-white/20">
              <img
                src={heroSmall2}
                alt="Équipement et innovation agricole"
                className="w-full h-full object-cover"
                width={800}
                height={800}
                decoding="async"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
