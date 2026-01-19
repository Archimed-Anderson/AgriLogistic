import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TestimonialCard from '../ui/TestimonialCard';

import avatar1 from '../../../assets/landing/story-1.webp';
import avatar2 from '../../../assets/landing/story-2.webp';
import avatar3 from '../../../assets/landing/story-3.webp';
import avatar4 from '../../../assets/landing/story-4.webp';
import partner1 from '../../../assets/landing/project-1.webp';
import partner2 from '../../../assets/landing/project-2.webp';
import partner3 from '../../../assets/landing/project-3.webp';
import partner4 from '../../../assets/landing/project-4.webp';

const testimonials = [
  {
    name: 'Marie Dupont',
    role: 'Agricultrice Bio',
    content: 'AgroLogistic a transformé ma façon de travailler. Grâce à la plateforme, j\'ai pu élargir ma clientèle locale et mieux valoriser mes produits. Un outil indispensable!',
    rating: 5,
    avatarSrc: avatar1
  },
  {
    name: 'Jean-Pierre Martin',
    role: 'Maraîcher',
    content: 'Le système de capteurs IoT m\'a permis d\'optimiser mes rendements de 30% tout en réduisant ma consommation d\'eau. Une vraie révolution pour mon exploitation.',
    rating: 5,
    avatarSrc: avatar2
  },
  {
    name: 'Sophie Bernard',
    role: 'Restauratrice',
    content: 'En tant que restauratrice, pouvoir me fournir directement auprès des producteurs locaux via AgroLogistic garantit la fraîcheur et la qualité que mes clients recherchent.',
    rating: 5,
    avatarSrc: avatar3
  },
  {
    name: 'Laurent Dubois',
    role: 'Transporteur',
    content: 'L\'optimisation des tournées proposée par la plateforme m\'a fait économiser du temps et du carburant. C\'est win-win pour tout le monde!',
    rating: 4,
    avatarSrc: avatar4
  }
];

const partnerLogos = [partner1, partner2, partner3, partner4];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length]
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Témoignages de Nos Clients
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que nos utilisateurs pensent d'AgroLogistic et comment 
            la plateforme les aide au quotidien.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mb-16">
          <div className="grid md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="p-3 bg-white border-2 border-gray-200 rounded-full hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 hover:scale-110"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={nextTestimonial}
              className="p-3 bg-white border-2 border-gray-200 rounded-full hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 hover:scale-110"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Aller au témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Partner Logos */}
        <div className={`transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <p className="text-center text-gray-500 text-sm mb-8">Ils nous font confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-40">
            {partnerLogos.map((logo, index) => (
              <div
                key={index}
                className="w-16 h-10 rounded-md overflow-hidden grayscale hover:grayscale-0 transition-all duration-300 bg-white/60"
              >
                <img
                  src={logo}
                  alt={`Logo partenaire ${index + 1}`}
                  className="w-full h-full object-cover"
                  width={180}
                  height={120}
                  decoding="async"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
