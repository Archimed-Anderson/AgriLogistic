import { useState, useEffect, useRef } from 'react';
import {
  Leaf,
  Sprout,
  Sun,
  Droplet,
  Wind,
  TrendingUp,
  Users,
  ShoppingBag,
  Truck,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
} from 'lucide-react';

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  IconComponent: any;
  gradient: string;
  stats: {
    label: string;
    value: string;
    icon: any;
  }[];
}

const heroSlides: HeroSlide[] = [
  {
    title: 'Agriculture Connectée',
    subtitle: "La plateforme qui révolutionne l'agriculture locale",
    description:
      'Connectez producteurs, acheteurs et transporteurs pour une agriculture durable et rentable',
    IconComponent: Leaf,
    gradient: 'from-emerald-600 via-green-500 to-lime-400',
    stats: [
      { label: 'Producteurs', value: '500+', icon: Users },
      { label: 'Produits', value: '1,200+', icon: ShoppingBag },
      { label: 'Livraisons', value: '5,000+', icon: Truck },
    ],
  },
  {
    title: 'Produits Bio & Locaux',
    subtitle: '100% certifiés agriculture biologique',
    description: "Découvrez des produits frais, traçables et respectueux de l'environnement",
    IconComponent: Sprout,
    gradient: 'from-green-600 via-emerald-500 to-teal-400',
    stats: [
      { label: 'Bio Certifié', value: '98%', icon: Sprout },
      { label: 'Rayon Local', value: '50km', icon: TrendingUp },
      { label: 'Fraîcheur', value: '24h', icon: Sun },
    ],
  },
  {
    title: 'Technologie & Innovation',
    subtitle: "Des outils modernes pour l'agriculture de demain",
    description: 'Gestion intelligente, analytics en temps réel et optimisation logistique',
    IconComponent: TrendingUp,
    gradient: 'from-blue-600 via-cyan-500 to-teal-400',
    stats: [
      { label: 'Gain Temps', value: '40%', icon: TrendingUp },
      { label: 'Réduction Coûts', value: '25%', icon: Droplet },
      { label: 'Satisfaction', value: '4.8/5', icon: Sun },
    ],
  },
];

export function ModernHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Auto-play slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Intersection Observer for animations
  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHasEnteredView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <div
      ref={heroRef}
      className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden"
      role="banner"
      aria-labelledby="hero-title"
    >
      {/* Background avec gradient animé */}
      <div className="absolute inset-0">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} transition-all duration-1000 ease-in-out`}
        >
          {/* Pattern overlay moderne */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Illustration agricole animée */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="grid grid-cols-6 gap-6 transform rotate-12 scale-150">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm animate-pulse"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '3s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent" />
      </div>

      {/* Contenu principal */}
      <div
        className={`relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex flex-col justify-center transition-all duration-700 ease-out ${
          hasEnteredView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Icône principale */}
          <div
            className="inline-flex p-8 bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 transform transition-all duration-500 hover:scale-110 hover:rotate-3"
            style={{
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            <slide.IconComponent
              className="h-24 w-24 md:h-32 md:w-32 text-white drop-shadow-2xl"
              strokeWidth={1.5}
            />
          </div>

          {/* Titre et description */}
          <div className="space-y-4">
            <h1
              id="hero-title"
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg font-display"
            >
              {slide.title}
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/95 tracking-wide max-w-3xl mx-auto">
              {slide.subtitle}
            </p>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              {slide.description}
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
            {slide.stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <stat.icon className="h-8 w-8 md:h-10 md:w-10 text-white mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-sm md:text-base text-white/80 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button className="group px-8 py-4 bg-white text-emerald-700 rounded-full font-semibold text-lg hover:bg-opacity-95 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 flex items-center gap-2">
              Commencer
              <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2 backdrop-blur-sm">
              En savoir plus
            </button>
          </div>

          {/* Badges de confiance */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white">100% Sécurisé</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Leaf className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">Éco-responsable</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
              <Sprout className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">Agriculture Durable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation des slides */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4">
          {/* Bouton précédent */}
          <button
            type="button"
            onClick={() => {
              setCurrentSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
              setIsAutoPlaying(false);
            }}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Slide précédent"
          >
            <ChevronLeft className="h-6 w-6 text-white" strokeWidth={2.5} />
          </button>

          {/* Indicateurs */}
          <div className="flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setCurrentSlide(index);
                  setIsAutoPlaying(false);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Aller au slide ${index + 1}`}
                aria-pressed={index === currentSlide}
              />
            ))}
          </div>

          {/* Bouton suivant */}
          <button
            type="button"
            onClick={() => {
              setCurrentSlide((currentSlide + 1) % heroSlides.length);
              setIsAutoPlaying(false);
            }}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg"
            aria-label="Slide suivant"
          >
            <ChevronRight className="h-6 w-6 text-white" strokeWidth={2.5} />
          </button>

          {/* Bouton Play/Pause */}
          <button
            type="button"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg ml-2"
            aria-label={isAutoPlaying ? 'Mettre en pause' : 'Reprendre'}
          >
            {isAutoPlaying ? (
              <Pause className="h-5 w-5 text-white" strokeWidth={2.5} />
            ) : (
              <Play className="h-5 w-5 text-white" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </div>

      {/* Animation CSS pour le float */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
