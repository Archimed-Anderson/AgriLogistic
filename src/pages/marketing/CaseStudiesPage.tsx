import { ArrowRight, Search } from 'lucide-react';
import FooterSection from '@/app/components/landing/sections/FooterSection';

type CaseStudiesPageProps = {
  onNavigate: (route: string) => void;
};

// Case study data
const caseStudies = [
  {
    id: 1,
    tag: 'Transformation Digitale',
    title:
      "Une bouée de sauvetage numérique pour les agriculteurs : Comment AgroLogistic a construit la résilience climatique en Afrique de l'Ouest",
    image: '/assets/images/landing/case-potatoes.png',
    slug: 'resilience-climatique-afrique',
  },
  {
    id: 2,
    tag: 'Transformation Digitale',
    title:
      "Une révolution numérique dans l'agriculture africaine : combler le fossé pour les petits exploitants",
    image: '/assets/images/landing/case-coffee.png',
    slug: 'revolution-numerique-afrique',
  },
  {
    id: 3,
    tag: 'Transformation Digitale',
    title: 'La révolution verte : le chemin vers une agriculture durable',
    image: '/assets/images/landing/case-grains.png',
    slug: 'revolution-verte-durable',
  },
  {
    id: 4,
    tag: 'Intelligence Agricole',
    title:
      'Intégration des données pour des insights en temps réel : produire des semences résilientes pour un impact mondial',
    image: '/assets/images/landing/smart-warehouse.png',
    slug: 'integration-donnees-semences',
  },
  {
    id: 5,
    tag: 'Transformation Digitale',
    title: "Des semences aux sourires : digitalisation pour l'avenir",
    image: '/assets/images/landing/logistics-dashboard.png',
    slug: 'digitalisation-avenir',
  },
  {
    id: 6,
    tag: 'Transformation Digitale',
    title: "Unifier des opérations multi-pays diversifiées : un chemin vers l'efficacité mondiale",
    image: '/assets/images/landing/supply-chain-impact.png',
    slug: 'operations-multi-pays',
  },
  {
    id: 7,
    tag: 'Intelligence Agricole',
    title:
      "Maximiser le rendement grâce à l'intelligence prédictive et aux solutions de télédétection",
    image: '/assets/images/landing/platform-capabilities.png',
    slug: 'intelligence-predictive-rendement',
  },
  {
    id: 8,
    tag: 'Supply Chain',
    title: 'Digitalisation de la chaîne de valeur des noisettes pour une traçabilité complète',
    image: '/assets/images/landing/industry-food-distributors.png',
    slug: 'chaine-valeur-noisettes',
  },
];

const filterTags = [
  'Tous',
  'Transformation Digitale',
  'Intelligence Agricole',
  'Supply Chain',
  'Durabilité',
];

export default function CaseStudiesPage({ onNavigate }: CaseStudiesPageProps) {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-[#002C17] text-white relative overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#79C25C 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        ></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-[#79C25C] font-semibold text-sm uppercase tracking-wider mb-4 block">
            Études de Cas
          </span>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            L'innovation en action
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
            Découvrez comment les entreprises, les sociétés alimentaires et les gouvernements ont
            atteint efficacité, conformité et durabilité avec nos solutions.
          </p>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-12 px-6 bg-gray-50 border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Filter Tags */}
            <div className="flex flex-wrap gap-3">
              {filterTags.map((tag, index) => (
                <button
                  key={index}
                  className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                    index === 0
                      ? 'bg-[#79C25C] text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#79C25C] hover:text-[#79C25C]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une étude de cas..."
                className="pl-12 pr-6 py-3 rounded-full border border-gray-200 bg-white focus:border-[#79C25C] focus:outline-none w-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#002C17] mb-12">Histoires de succès</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <div
                key={study.id}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                onClick={() => onNavigate(`/case-studies/${study.slug}`)}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#79C25C] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {study.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-[#002C17] mb-4 leading-snug group-hover:text-[#79C25C] transition-colors">
                    {study.title}
                  </h3>
                  <button className="inline-flex items-center gap-2 text-[#79C25C] font-semibold text-sm hover:gap-3 transition-all">
                    Lire la suite <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-16">
            <button className="w-10 h-10 rounded-full bg-[#79C25C] text-white font-bold">1</button>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#79C25C] transition-colors">
              2
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#79C25C] transition-colors">
              3
            </button>
            <span className="mx-2 text-gray-400">...</span>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#79C25C] transition-colors">
              5
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#002C17] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Découvrez les insights pilotés par l'IA avec AgroLogistic Intelligence
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            Rejoignez les entreprises leaders qui transforment leur agriculture avec nos solutions
            innovantes.
          </p>
          <button
            onClick={() => onNavigate('/demo')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-black transition-all hover:scale-105"
            style={{ backgroundColor: '#79C25C' }}
          >
            Planifier une démo <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <FooterSection onNavigate={onNavigate} />
    </div>
  );
}
