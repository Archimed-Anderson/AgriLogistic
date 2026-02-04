import { useEffect, useRef, useState } from 'react';
import BlogCard from '../ui/BlogCard';

import blogImg1 from '../../../assets/landing/blog-1.webp';
import blogImg2 from '../../../assets/landing/blog-2.webp';
import blogImg3 from '../../../assets/landing/blog-3.webp';

const articles = [
  {
    title: "Smart Agriculture: L'avenir de l'agriculture connectée",
    excerpt:
      "Découvrez comment les technologies IoT et l'intelligence artificielle révolutionnent les pratiques agricoles modernes pour une productivité optimale.",
    date: '15 Janvier 2026',
    category: 'Innovation',
    imageSrc: blogImg1,
    imageAlt: 'Illustration agriculture connectée',
    gradient: 'from-blue-400 to-cyan-600',
  },
  {
    title: 'Les bienfaits des carottes fraîches bio',
    excerpt:
      'Les carottes biologiques fraîchement récoltées regorgent de nutriments essentiels. Apprenez à les choisir et les conserver pour profiter de tous leurs bienfaits.',
    date: '12 Janvier 2026',
    category: 'Nutrition',
    imageSrc: blogImg2,
    imageAlt: 'Produits frais et nutrition',
    gradient: 'from-orange-400 to-red-600',
  },
  {
    title: "Le défi de l'élevage durable en Iowa",
    excerpt:
      "Rencontre avec les éleveurs de l'Iowa qui ont relevé le défi de la durabilité. Leurs pratiques innovantes inspirent toute une génération.",
    date: '10 Janvier 2026',
    category: 'Élevage',
    imageSrc: blogImg3,
    imageAlt: 'Élevage durable',
    gradient: 'from-green-400 to-emerald-600',
  },
];

export default function BlogSection() {
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
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nos Derniers Articles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Restez informé des dernières tendances, conseils et innovations dans le monde de
            l'agriculture durable.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <div
              key={article.title}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <BlogCard {...article} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center transition-all duration-700 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <button className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold text-lg hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            Voir tous les articles
          </button>
        </div>
      </div>
    </section>
  );
}
