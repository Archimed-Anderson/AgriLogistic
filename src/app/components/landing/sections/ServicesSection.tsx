import { ShoppingBag, Radio, Sprout, Leaf } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ServiceCard from '../ui/ServiceCard';

const services = [
  {
    icon: ShoppingBag,
    title: 'E-commerce',
    description: 'Marketplace agricole moderne pour acheter et vendre des produits frais directement du producteur au consommateur.',
    gradient: 'from-emerald-500 to-green-600'
  },
  {
    icon: Radio,
    title: 'IoT Monitoring',
    description: 'Système de capteurs intelligents pour suivre en temps réel l\'état de vos cultures et optimiser votre production.',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    icon: Sprout,
    title: 'Farming',
    description: 'Outils de gestion de cultures intégrés pour planifier, suivre et améliorer vos rendements agricoles.',
    gradient: 'from-lime-500 to-green-600'
  },
  {
    icon: Leaf,
    title: 'Agriculture Durable',
    description: 'Pratiques et conseils pour une agriculture responsable, respectueuse de l\'environnement et économiquement viable.',
    gradient: 'from-teal-500 to-emerald-600'
  }
];

export default function ServicesSection() {
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
      className="py-20 bg-gray-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une suite complète d'outils pour transformer votre façon de produire, 
            d'acheter et de vendre des produits agricoles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-12 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <button className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Voir tous les services
          </button>
        </div>
      </div>
    </section>
  );
}
