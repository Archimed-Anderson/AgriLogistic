import { Leaf, Droplet, Award, Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import CertificationBadge from '../ui/CertificationBadge';

import practicesImg from '../../../assets/landing/practices.webp';
import practicesFloatingImg from '../../../assets/landing/project-4.webp';

const certifications = [
  {
    icon: Leaf,
    label: '100% Bio',
    description: 'Tous nos produits sont certifiés agriculture biologique sans pesticides ni OGM.'
  },
  {
    icon: Droplet,
    label: 'Zéro Pesticide',
    description: 'Aucun produit chimique de synthèse utilisé dans nos méthodes de culture.'
  },
  {
    icon: Award,
    label: 'Commerce Équitable',
    description: 'Rémunération juste pour tous nos producteurs partenaires.'
  },
  {
    icon: Heart,
    label: 'Sans OGM',
    description: 'Garantie de semences naturelles et non modifiées génétiquement.'
  }
];

export default function PracticesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 -translate-x-0' : 'opacity-0 -translate-x-6'}`}>
            <div className="relative">
              {/* Main image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl h-[500px] bg-gradient-to-br from-green-100 to-emerald-200">
                <img
                  src={practicesImg}
                  alt="Pratiques agricoles durables"
                  className="w-full h-full object-cover"
                  width={900}
                  height={1050}
                  decoding="async"
                  loading="lazy"
                />
              </div>
              {/* Small floating image */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 rounded-xl overflow-hidden shadow-xl bg-white/10 backdrop-blur-sm border-4 border-white">
                <img
                  src={practicesFloatingImg}
                  alt="Innovation et agriculture"
                  className="w-full h-full object-cover"
                  width={900}
                  height={600}
                  decoding="async"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className={`space-y-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Pratiques Agricoles
                <span className="block text-emerald-600">Durables</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Pour un avenir meilleur, nous nous engageons à promouvoir des pratiques 
                agricoles respectueuses de l'environnement et socialement responsables.
              </p>
            </div>

            {/* Certifications Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div
                  key={cert.label}
                  className="transition-all duration-500"
                  style={{ transitionDelay: `${(index + 2) * 100}ms` }}
                >
                  <CertificationBadge {...cert} />
                </div>
              ))}
            </div>

            {/* Additional stats */}
            <div className="flex flex-wrap gap-8 pt-6">
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Certified Organic</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">5+</div>
                <div className="text-sm text-gray-600">Certified Farms</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 mb-1">200+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
