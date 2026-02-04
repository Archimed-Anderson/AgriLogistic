import { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import FooterSection from '@/app/components/landing/sections/FooterSection';

type DigitalTransformationPageProps = {
  onNavigate: (route: string) => void;
};

// Filter tags
const filterTags = [
  { id: 'all', label: 'Tous', active: true },
  { id: 'digital', label: 'Transformation Digitale', active: false },
  { id: 'intelligence', label: 'Intelligence Agricole', active: false },
  { id: 'supply', label: 'Supply Chain', active: false },
  { id: 'sustainability', label: 'Durabilité', active: false },
];

// Case studies data
const caseStudies = [
  {
    id: 1,
    title:
      "Une bouée de sauvetage numérique pour les agriculteurs : Comment nous avons construit la résilience climatique en Afrique de l'Ouest",
    excerpt:
      "Les petits exploitants agricoles d'Afrique de l'Ouest sont le pilier de la région, mais leurs moyens de subsistance sont constamment menacés par les conditions météorologiques extrêmes.",
    category: 'Étude de Cas',
    image: '/assets/images/landing/case-potatoes.png',
    slug: 'resilience-climatique',
  },
  {
    id: 2,
    title:
      'Promouvoir la transparence et la visibilité dans la supply chain pour une entreprise suisse de commerce équitable',
    excerpt:
      'Digitaliser et standardiser les opérations multi-pays et promouvoir la transparence et la visibilité pour le commerce mondial.',
    category: 'Étude de Cas',
    image: '/assets/images/landing/case-coffee.png',
    slug: 'transparence-supply-chain',
  },
  {
    id: 3,
    title:
      'Numérisation de la chaîne de valeur du cacao avec une multinationale américaine leader de la confiserie',
    excerpt:
      "Favoriser un engagement efficace avec les producteurs de cacao en encourageant l'adoption de pratiques durables.",
    category: 'Étude de Cas',
    image: '/assets/images/landing/case-grains.png',
    slug: 'chaine-valeur-cacao',
  },
  {
    id: 4,
    title:
      "Autonomiser les principaux meuniers du Nigeria avec une solution agricole basée sur l'intelligence profonde",
    excerpt:
      "Détection des cultures et estimation des superficies via l'analyse des données d'observation de la Terre.",
    category: 'Étude de Cas',
    image: '/assets/images/landing/smart-warehouse.png',
    slug: 'meuniers-nigeria',
  },
  {
    id: 5,
    title:
      "Solution numérique pour l'approvisionnement en soja avec une société multinationale de négoce",
    excerpt:
      "Optimisation de l'approvisionnement en matières premières grâce à des solutions numériques avancées.",
    category: 'Étude de Cas',
    image: '/assets/images/landing/logistics-dashboard.png',
    slug: 'approvisionnement-soja',
  },
  {
    id: 6,
    title:
      "Une révolution numérique dans l'agriculture africaine : combler le fossé pour les petits exploitants",
    excerpt:
      'Transformer les pratiques agricoles traditionnelles grâce à la technologie moderne pour améliorer les rendements.',
    category: 'Étude de Cas',
    image: '/assets/images/landing/supply-chain-impact.png',
    slug: 'revolution-numerique-afrique',
  },
  {
    id: 7,
    title: 'La révolution de la feuille verte : le chemin vers un tabac durable',
    excerpt:
      'Accompagner la transition vers des pratiques agricoles plus durables et responsables.',
    category: 'Étude de Cas',
    image: '/assets/images/landing/platform-capabilities.png',
    slug: 'tabac-durable',
  },
  {
    id: 8,
    title:
      'Intégration des données pour des insights en temps réel : produire des semences résilientes',
    excerpt:
      'Unifier les sources de données pour permettre des décisions agricoles éclairées et rapides.',
    category: 'Étude de Cas',
    image: '/assets/images/landing/industry-food-distributors.png',
    slug: 'integration-donnees',
  },
  {
    id: 9,
    title: "Comment l'industrie agroalimentaire peut relever les défis de la numérisation",
    excerpt:
      'Débloquer la croissance en adoptant les solutions technologiques adaptées au secteur alimentaire.',
    category: 'Blog',
    image: '/assets/images/landing/industry-agri-input.png',
    slug: 'defis-numerisation',
  },
  {
    id: 10,
    title: "Des semences aux sourires : digitalisation pour l'avenir",
    excerpt:
      'Améliorer la vie des agriculteurs grâce à des outils numériques accessibles et efficaces.',
    category: 'Étude de Cas',
    image: '/assets/images/landing/industry-food-retail.png',
    slug: 'semences-sourires',
  },
  {
    id: 11,
    title: "Unifier des opérations multi-pays diversifiées : un chemin vers l'efficacité mondiale",
    excerpt: 'Standardiser et optimiser les opérations agricoles à travers plusieurs continents.',
    category: 'Étude de Cas',
    image: '/assets/images/landing/industry-cpg.png',
    slug: 'operations-multi-pays',
  },
  {
    id: 12,
    title: 'Loacker : digitalisation de la chaîne de valeur des noisettes',
    excerpt: "Traçabilité complète de la ferme à l'usine pour garantir qualité et durabilité.",
    category: 'Étude de Cas',
    image: '/assets/images/landing/case-potatoes.png',
    slug: 'loacker-noisettes',
  },
];

export default function DigitalTransformationPage({ onNavigate }: DigitalTransformationPageProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section - Dark Green Banner */}
      <section className="py-6 bg-[#002C17] relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#79C25C 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        ></div>
      </section>

      {/* Filter Section */}
      <section className="py-12 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-4 justify-center">
            {filterTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveFilter(tag.id)}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-all ${
                  activeFilter === tag.id
                    ? 'bg-[#79C25C] text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-[#79C25C] hover:text-[#79C25C]'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Page Header */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#002C17] mb-4">
                Transformation Digitale
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Découvrez comment les entreprises agricoles du monde entier adoptent la
                transformation digitale pour améliorer leur efficacité, leur durabilité et leur
                rentabilité.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full lg:w-80 pl-12 pr-6 py-3 rounded-full border border-gray-200 bg-white focus:border-[#79C25C] focus:outline-none focus:ring-2 focus:ring-[#79C25C]/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <article
                key={study.id}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                onClick={() => onNavigate(`/case-studies/${study.slug}`)}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-[#79C25C] uppercase tracking-wider">
                      {study.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-[#002C17] mb-3 leading-snug group-hover:text-[#79C25C] transition-colors line-clamp-2">
                    {study.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {study.excerpt}
                  </p>

                  {/* Read More Link */}
                  <button className="inline-flex items-center gap-2 text-[#79C25C] font-semibold text-sm group-hover:gap-3 transition-all">
                    Lire la suite <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-16">
            <button className="w-10 h-10 rounded-full bg-[#79C25C] text-white font-bold shadow-lg">
              1
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#79C25C] hover:text-[#79C25C] transition-colors">
              2
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#79C25C] hover:text-[#79C25C] transition-colors">
              3
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#002C17] to-[#004D2C] text-white relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#79C25C 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        ></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Prêt à transformer votre agriculture ?
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Rejoignez les leaders du secteur qui utilisent nos solutions numériques pour
            révolutionner leurs opérations agricoles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('/demo')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-[#002C17] transition-all hover:scale-105 shadow-lg"
              style={{ backgroundColor: '#79C25C' }}
            >
              Planifier une démo <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onNavigate('/case-studies')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white border-2 border-white/30 hover:border-white transition-all"
            >
              Voir toutes les études de cas
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSection onNavigate={onNavigate} />
    </div>
  );
}
