import { useState } from 'react';
import {
  Leaf,
  Droplets,
  Factory,
  TreeDeciduous,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Thermometer,
  Recycle,
} from 'lucide-react';
import FooterSection from '../sections/FooterSection';

// Professional images for sustainability page
import farmerTechnologyImg from '@/app/assets/farmer-technology.png';
import climateAgricultureImg from '@/app/assets/climate-agriculture.png';
import regenerativeAgricultureImg from '@/app/assets/regenerative-agriculture.png';

/**
 * SolutionsFarmersPage - Cloned from Cropin Sustainability page
 * Route: /solutions/farmers ("Nos Logiciels" > "pour les agriculteurs")
 *
 * Design tokens extracted from https://www.cropin.com/cropin-sustainability/
 * - Primary: #002E1B (dark forest green)
 * - Accent: #8BC34A (lime green)
 * - Light BG: #E8F4F8 (soft blue)
 * - Font: Roboto, system-ui, sans-serif
 */

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Utilisation excessive d'eau douce",
    answer:
      "L'agriculture représente environ 70% de l'utilisation mondiale d'eau douce. Nos solutions permettent d'optimiser l'irrigation et de réduire significativement la consommation d'eau grâce à l'analyse de données en temps réel.",
  },
  {
    question: 'Émissions élevées de GES des systèmes alimentaires',
    answer:
      "Les systèmes alimentaires sont responsables d'environ 1/3 des émissions mondiales de gaz à effet de serre. Nous aidons les agriculteurs à adopter des pratiques plus durables pour réduire leur empreinte carbone.",
  },
  {
    question: "Déforestation à grande échelle due à l'expansion agricole",
    answer:
      "90% de la déforestation est liée à l'expansion agricole. Notre technologie permet d'optimiser l'utilisation des terres existantes et de prévenir l'expansion destructrice.",
  },
  {
    question: 'Perte de rendement liée au climat',
    answer:
      "Le changement climatique affecte directement les rendements agricoles. Nos outils d'intelligence artificielle prévoient les risques climatiques et aident à adapter les pratiques culturales.",
  },
  {
    question: 'Faible adoption des pratiques agricoles intelligentes',
    answer:
      "Nous facilitons la transition vers l'agriculture intelligente grâce à des outils numériques accessibles et un accompagnement personnalisé pour chaque exploitation.",
  },
];

const statsData = [
  {
    icons: [Leaf, Droplets, Factory, TreeDeciduous],
    values: ['38%', '70%', '90%', '1/3'],
    title: "Terres utilisées pour l'agriculture",
    description: "La surface terrestre utilisée pour l'agriculture mondiale",
  },
  {
    value: '70%',
    title: "L'eau douce mondiale",
    description: "L'eau douce mondiale est utilisée pour l'agriculture",
  },
  {
    value: '1/3',
    title: 'Émissions mondiales de GES',
    description: 'Les émissions mondiales de GES sont causées par les systèmes alimentaires',
  },
  {
    value: '90%',
    title: 'Taux de déforestation',
    description: "Le taux de déforestation est le résultat de l'expansion agricole",
  },
];

export function SolutionsFarmersPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Roboto', system-ui, sans-serif" }}
    >
      {/* Hero Section */}
      <section
        className="relative min-h-[600px] flex items-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #001a10 0%, #002E1B 50%, #003d23 100%)',
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='20' y='60' font-size='60' fill='%238BC34A' opacity='0.1'%3ECropin%3C/text%3E%3C/svg%3E")`,
            backgroundSize: '300px 300px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="animate-fade-in">
              <p
                className="text-sm font-semibold uppercase tracking-wider mb-6"
                style={{ color: '#8BC34A' }}
              >
                Agriculture Durable
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Numériser la voie vers une agriculture{' '}
                <span style={{ color: '#8BC34A' }}>durable et résiliente</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                Construisez un avenir plus vert et plus résilient grâce à l'intelligence de
                durabilité alimentée par l'IA pour les exploitations agricoles et les chaînes
                d'approvisionnement alimentaire.
              </p>
              <button
                onClick={() => onNavigate('/contact/general')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: '#8BC34A',
                  boxShadow: '0 4px 20px rgba(139, 195, 74, 0.3)',
                }}
              >
                Nous Contacter
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>

            {/* Right content - Dashboard mockup */}
            <div className="hidden lg:block">
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  backgroundColor: '#1a3a2a',
                  border: '1px solid rgba(139, 195, 74, 0.2)',
                }}
              >
                {/* Dashboard header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm text-gray-400 ml-2">AgroLogistic Cloud</span>
                </div>

                {/* Dashboard content */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#0d2818] rounded-lg p-4">
                      <p className="text-gray-400 text-xs mb-1">Gestion de la Durabilité</p>
                      <p className="text-white font-bold text-xl">85%</p>
                      <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                        <div
                          className="h-full rounded-full"
                          style={{ width: '85%', backgroundColor: '#8BC34A' }}
                        />
                      </div>
                    </div>
                    <div className="bg-[#0d2818] rounded-lg p-4">
                      <p className="text-gray-400 text-xs mb-1">Réduction CO2</p>
                      <p className="text-white font-bold text-xl">-23%</p>
                      <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: '77%' }} />
                      </div>
                    </div>
                  </div>

                  {/* Chart mockup */}
                  <div className="bg-[#0d2818] rounded-lg p-4">
                    <p className="text-gray-400 text-xs mb-3">Performance Environnementale</p>
                    <div className="flex items-end gap-2 h-24">
                      {[40, 65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t transition-all duration-300"
                          style={{
                            height: `${height}%`,
                            backgroundColor: i === 5 ? '#8BC34A' : 'rgba(139, 195, 74, 0.4)',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Map mockup */}
                  <div className="mt-4 bg-[#0d2818] rounded-lg p-4 relative overflow-hidden h-32">
                    <img
                      src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=200&fit=crop"
                      alt="Carte satellite des cultures"
                      className="absolute inset-0 w-full h-full object-cover opacity-60 rounded"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d2818] to-transparent" />
                    <p className="relative text-white text-sm font-medium">Vue Satellite</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Role Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Le double rôle de l'agriculture dans la crise climatique
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Le changement climatique est l'un des plus grands défis auxquels l'humanité est
                confrontée aujourd'hui, et l'agriculture se trouve au cœur de cette crise.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                D'un côté, le changement climatique est le plus grand perturbateur de l'agriculture
                mondiale. De l'autre, l'agriculture elle-même contribue de manière significative à
                la crise.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Transformer les pratiques agricoles pour qu'elles soient durables, respectueuses du
                climat et responsables est une priorité absolue pour les gouvernements, les
                organisations multilatérales et les entreprises agroalimentaires du monde entier.
              </p>
            </div>

            {/* Right image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={farmerTechnologyImg}
                  alt="Agriculteur utilisant la technologie dans un champ"
                  className="w-full h-96 object-cover"
                />
                {/* Overlay icons */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-8 p-8">
                    {[Leaf, Droplets, Thermometer, Recycle].map((Icon, i) => (
                      <div
                        key={i}
                        className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
                        style={{
                          backgroundColor: 'rgba(139, 195, 74, 0.2)',
                          border: '2px solid rgba(139, 195, 74, 0.5)',
                        }}
                      >
                        <Icon className="h-8 w-8" style={{ color: '#8BC34A' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Section */}
      <section className="py-20 lg:py-32 relative" style={{ backgroundColor: '#E8F4F8' }}>
        {/* Topographical pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 100 Q75 50 100 100 T150 100' stroke='%2390CAF9' fill='none' stroke-width='1'/%3E%3Cpath d='M30 120 Q80 70 130 120 T180 120' stroke='%2390CAF9' fill='none' stroke-width='1'/%3E%3Cpath d='M20 140 Q70 90 120 140 T170 140' stroke='%2390CAF9' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Statistiques clés qui façonnent l'équation climat-agriculture
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez pourquoi il y a un besoin urgent de solutions agricoles plus intelligentes
              avec ces statistiques clés qui révèlent l'impact réel du changement climatique sur
              l'agriculture.
            </p>
          </div>

          {/* Stats visualization */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto">
              <div className="flex justify-between items-end mb-6">
                {[
                  { icon: Leaf, value: '38%', label: 'Terres' },
                  { icon: Droplets, value: '70%', label: 'Eau' },
                  { icon: Factory, value: '90%', label: 'Émissions' },
                  { icon: TreeDeciduous, value: '1/3', label: 'Forêts' },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div
                      className="w-20 h-20 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: `rgba(139, 195, 74, ${0.2 + i * 0.15})` }}
                    >
                      <stat.icon className="h-10 w-10" style={{ color: '#2E7D32' }} />
                    </div>
                    <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    <span className="text-sm text-gray-500">{stat.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-600">
                La surface terrestre utilisée pour l'agriculture
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-4xl font-bold text-gray-900 mb-2">70%</p>
              <p className="text-gray-600">L'eau douce mondiale est utilisée pour l'agriculture</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-4xl font-bold text-gray-900 mb-2">1/3</p>
              <p className="text-gray-600">
                Les émissions mondiales de GES sont causées par les systèmes alimentaires
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-4xl font-bold text-gray-900 mb-2">90%</p>
              <p className="text-gray-600">
                Le taux de déforestation est le résultat de l'expansion agricole
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <p className="text-4xl font-bold text-gray-900 mb-2">-40%</p>
              <p className="text-gray-600">
                Baisse prévue des rendements agricoles due au changement climatique
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Solutions Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {/* Left Content - Text */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Solutions technologiques pour un avenir{' '}
                <span style={{ color: '#8BC34A' }}>résilient et régénératif</span>
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Chez AgroLogistic, nous permettons cette transition plus rapidement et plus
                efficacement grâce à nos solutions technologiques de pointe. Associez-vous à nous
                pour construire un avenir agricole durable et intelligent face au climat.
              </p>
            </div>

            {/* Right Content - Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Climate Smart Agriculture Card */}
              <div
                className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl h-[400px]"
                onClick={() => onNavigate('/practices/water-efficiency')}
              >
                <div className="absolute inset-0">
                  <img
                    src={climateAgricultureImg}
                    alt="Agriculture Intelligente face au Climat"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002E1B] via-[#002E1B]/60 to-transparent" />
                </div>
                <div className="relative p-8 h-full flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Agriculture Intelligente face au Climat
                  </h3>
                  <span
                    className="inline-flex items-center gap-2 font-semibold transition-colors"
                    style={{ color: '#8BC34A' }}
                  >
                    En savoir plus <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              {/* Regenerative Agriculture Card */}
              <div
                className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl h-[400px]"
                onClick={() => onNavigate('/story/eco-practices')}
              >
                <div className="absolute inset-0">
                  <img
                    src={regenerativeAgricultureImg}
                    alt="Agriculture Régénératrice"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002E1B] via-[#002E1B]/60 to-transparent" />
                </div>
                <div className="relative p-8 h-full flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white mb-2">Agriculture Régénératrice</h3>
                  <span
                    className="inline-flex items-center gap-2 font-semibold transition-colors"
                    style={{ color: '#8BC34A' }}
                  >
                    En savoir plus <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-center">
            Questions fréquentes
          </h2>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 shrink-0" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 lg:py-32 relative overflow-hidden"
        style={{ backgroundColor: '#002E1B' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(139, 195, 74, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 70% 50%, rgba(139, 195, 74, 0.2) 0%, transparent 50%)`,
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Conduisez un changement mesurable, commencez votre chemin vers la durabilité
          </h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
            Rejoignez des milliers d'agriculteurs et d'entreprises agroalimentaires qui transforment
            leurs pratiques pour un avenir plus durable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('/demo')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-black transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: '#8BC34A',
                boxShadow: '0 4px 20px rgba(139, 195, 74, 0.3)',
              }}
            >
              Planifier une démo
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate('/contact/general')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:bg-white/10"
              style={{
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
