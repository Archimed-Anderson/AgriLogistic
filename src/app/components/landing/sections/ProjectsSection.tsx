import { useEffect, useRef, useState } from 'react';
import ProjectCard from '../ui/ProjectCard';

import projectImg1 from '../../../assets/landing/project-1.webp';
import projectImg2 from '../../../assets/landing/project-2.webp';
import projectImg3 from '../../../assets/landing/project-3.webp';
import projectImg4 from '../../../assets/landing/project-4.webp';

const projects = [
  {
    title: 'Ferme Biologique Durand',
    category: 'Agriculture Bio',
    imageSrc: projectImg1,
    imageAlt: 'Projet de ferme biologique',
    gradient: 'from-green-600 to-emerald-700'
  },
  {
    title: 'Serre Intelligente IoT',
    category: 'Smart Farming',
    imageSrc: projectImg2,
    imageAlt: 'Serre intelligente et capteurs IoT',
    gradient: 'from-blue-600 to-cyan-700'
  },
  {
    title: 'Maraîchage Local Martin',
    category: 'Circuits Courts',
    imageSrc: projectImg3,
    imageAlt: 'Maraîchage local et circuits courts',
    gradient: 'from-lime-600 to-green-700'
  },
  {
    title: 'Exploitation Céréalière',
    category: 'Grande Culture',
    imageSrc: projectImg4,
    imageAlt: 'Exploitation céréalière et grande culture',
    gradient: 'from-amber-600 to-orange-700'
  }
];

export default function ProjectsSection() {
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
            Projets Récemment Réalisés
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez comment AgroLogistic aide concrètement les agriculteurs à moderniser 
            et optimiser leurs exploitations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <ProjectCard {...project} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <button className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Voir tous les projets
          </button>
        </div>
      </div>
    </section>
  );
}
