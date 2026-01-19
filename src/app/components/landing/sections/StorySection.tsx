import { Target, Eye } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import storyImg1 from '../../../assets/landing/story-1.webp';
import storyImg2 from '../../../assets/landing/story-2.webp';
import storyImg3 from '../../../assets/landing/story-3.webp';
import storyImg4 from '../../../assets/landing/story-4.webp';

export default function StorySection() {
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
      id="story"
      ref={sectionRef}
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Notre Histoire
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AgroLogistic est née d'une vision simple : rendre l'agriculture locale accessible à tous 
            tout en préservant notre planète et en soutenant nos producteurs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Image Grid */}
          <div className={`grid grid-cols-2 gap-4 lg:col-span-2 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'}`}>
            {/* First row - 2 images */}
            <div className="rounded-xl overflow-hidden shadow-lg h-[250px] bg-gradient-to-br from-green-100 to-emerald-200">
              <img
                src={storyImg1}
                alt="Agriculteur et exploitation agricole"
                className="w-full h-full object-cover"
                width={800}
                height={800}
                decoding="async"
                loading="lazy"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg h-[250px] bg-gradient-to-br from-blue-100 to-cyan-200">
              <img
                src={storyImg2}
                alt="Culture et croissance des plantes"
                className="w-full h-full object-cover"
                width={800}
                height={800}
                decoding="async"
                loading="lazy"
              />
            </div>

            {/* Second row - 2 images */}
            <div className="rounded-xl overflow-hidden shadow-lg h-[250px] bg-gradient-to-br from-lime-100 to-green-200">
              <img
                src={storyImg3}
                alt="Produits frais et récolte"
                className="w-full h-full object-cover"
                width={800}
                height={800}
                decoding="async"
                loading="lazy"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg h-[250px] bg-gradient-to-br from-amber-100 to-orange-200">
              <img
                src={storyImg4}
                alt="Agriculture durable et terroir"
                className="w-full h-full object-cover"
                width={800}
                height={800}
                decoding="async"
                loading="lazy"
              />
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className={`space-y-6 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'}`}>
            {/* Notre Mission */}
            <div className="bg-emerald-50 rounded-xl p-6 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Notre Mission</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Faciliter l'accès aux produits bio et locaux tout en valorisant 
                    le travail de nos agriculteurs partenaires.
                  </p>
                </div>
              </div>
            </div>

            {/* Notre Vision */}
            <div className="bg-lime-50 rounded-xl p-6 border-2 border-lime-100 hover:border-lime-300 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-lime-500 rounded-lg">
                  <Eye className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Notre Vision</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Créer un écosystème agricole durable où producteurs, consommateurs 
                    et transporteurs collaborent harmonieusement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats or additional content */}
        <div className={`bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl p-8 md:p-12 text-white transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-green-100">Produits Bio Certifiés</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50km</div>
              <div className="text-green-100">Rayon Local Moyen</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24h</div>
              <div className="text-green-100">Fraîcheur Garantie</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
