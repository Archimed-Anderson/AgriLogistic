import { useEffect, useRef, useState } from 'react';
import { Apple, Beef, ChevronLeft, ChevronRight, Egg, Leaf, Milk, Sprout } from 'lucide-react';

const slides = [
  {
    title: 'Fruits de Saison',
    subtitle: 'Découvrez notre sélection de fruits frais directement des producteurs',
    color: 'from-orange-500 to-red-500',
    IconComponent: Apple,
    stats: { label: 'Produits disponibles', value: '150+' },
  },
  {
    title: 'Nouveaux Producteurs',
    subtitle: "Soutenez les agriculteurs locaux et l'économie circulaire",
    color: 'from-green-500 to-emerald-500',
    IconComponent: Leaf,
    stats: { label: 'Producteurs partenaires', value: '500+' },
  },
  {
    title: 'Produits Bio',
    subtitle: '100% certifiés agriculture biologique et traçables',
    color: 'from-blue-500 to-cyan-500',
    IconComponent: Sprout,
    stats: { label: 'Certifications bio', value: '98%' },
  },
];

const heroCategories = [
  { name: 'Légumes', IconComponent: Leaf, count: 45 },
  { name: 'Fruits', IconComponent: Apple, count: 38 },
  { name: 'Produits Laitiers', IconComponent: Milk, count: 22 },
  { name: 'Viandes', IconComponent: Beef, count: 18 },
  { name: 'Œufs', IconComponent: Egg, count: 12 },
];

export function MarketplaceHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Auto-play slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

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
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        ref={heroRef}
        className="relative h-80 md:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl"
        role="banner"
        aria-labelledby="marketplace-hero-title"
        aria-describedby="marketplace-hero-subtitle"
      >
        {/* Image de fond moderne - Agriculture et technologie */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-lime-700">
          {/* Pattern overlay pour effet moderne */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Illustration agricole moderne avec icônes */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="grid grid-cols-4 gap-8 transform rotate-12 scale-150">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm" />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent" />

        <div
          className={`relative inset-0 h-full flex flex-col items-center justify-center px-6 md:px-10 text-white transition-all duration-700 ease-out ${
            hasEnteredView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="text-center space-y-6 max-w-3xl">
            <div className="inline-flex p-6 bg-white/15 backdrop-blur-md rounded-3xl shadow-xl border border-white/25">
              {(() => {
                const Icon = slides[currentSlide].IconComponent;
                return (
                  <Icon
                    className="h-20 w-20 md:h-24 md:w-24 text-white drop-shadow-2xl"
                    strokeWidth={1.5}
                  />
                );
              })()}
            </div>

            <div className="space-y-3">
              <h2
                id="marketplace-hero-title"
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-lg font-display"
              >
                {slides[currentSlide].title}
              </h2>
              <p
                id="marketplace-hero-subtitle"
                className="text-lg md:text-xl lg:text-2xl font-light opacity-95 tracking-wide max-w-2xl mx-auto"
              >
                {slides[currentSlide].subtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group px-8 py-4 bg-white text-[#15803d] rounded-full font-semibold text-lg hover:bg-opacity-95 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 flex items-center gap-2">
                Découvrir
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group px-8 py-4 bg-white/10 text-white border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-2 backdrop-blur-sm">
                En savoir plus
              </button>
            </div>

            {/* Statistiques en temps réel */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 md:gap-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  {slides[currentSlide].stats.value} {slides[currentSlide].stats.label}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <Leaf className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">100% Local</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                <Sprout className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">Agriculture Durable</span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
            setIsAutoPlaying(false);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Voir la catégorie précédente"
        >
          <ChevronLeft className="h-6 w-6 text-white" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => {
            setCurrentSlide((currentSlide + 1) % slides.length);
            setIsAutoPlaying(false);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-lg"
          aria-label="Voir la catégorie suivante"
        >
          <ChevronRight className="h-6 w-6 text-white" strokeWidth={2.5} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
              aria-label={`Aller au slide ${index + 1}`}
              aria-pressed={index === currentSlide}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {heroCategories.map((category) => (
          <button
            key={category.name}
            type="button"
            className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-2xl hover:scale-105 hover:border-[#15803d] transition-all duration-300 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#15803d]/0 to-emerald-500/0 group-hover:from-[#15803d]/5 group-hover:to-emerald-500/5 transition-all duration-300 rounded-2xl" />

            <div className="relative mb-4">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#15803d]/10 via-emerald-500/10 to-lime-400/10 rounded-2xl flex items-center justify-center group-hover:from-[#15803d]/20 group-hover:via-emerald-500/20 group-hover:to-lime-400/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                {(() => {
                  const Icon = category.IconComponent;
                  return (
                    <Icon
                      className="h-10 w-10 text-[#15803d] group-hover:text-emerald-600 transition-colors"
                      strokeWidth={1.5}
                    />
                  );
                })()}
              </div>
            </div>

            <div className="relative">
              <div className="font-semibold text-gray-900 dark:text-white text-base group-hover:text-[#15803d] transition-colors">
                {category.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {category.count} produits
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
