import { Leaf, Wind, Sun, Award, ArrowRight, BarChart, RefreshCw } from 'lucide-react';
import FooterSection from '../sections/FooterSection';

export function SustainableLogisticsPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-emerald-900 py-24 sm:py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Agriculture Durable"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 via-emerald-900/50 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center rounded-full bg-green-400/10 px-3 py-1 text-sm font-medium text-green-300 mb-6 border border-green-400/20">
              <Leaf className="mr-2 h-4 w-4" /> Stratégie RSE 2026
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Une Logistique <span className="text-green-400">Responsable</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-emerald-100">
              Réduire l'empreinte carbone de la chaîne alimentaire n'est pas une option, c'est notre
              mission. Découvrez comment nous transformons chaque kilomètre en impact positif.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-emerald-50 relative -mt-12 mx-4 sm:mx-8 lg:mx-auto max-w-7xl rounded-3xl shadow-xl z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-slate-600">CO2 Économisé en 2025</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                12,500 <span className="text-lg text-emerald-600 font-medium">Tonnes</span>
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-slate-600">Kilomètres à vide évités</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                450,000 <span className="text-lg text-emerald-600 font-medium">km</span>
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-slate-600">Partenaires Certifiés Verts</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                85 <span className="text-lg text-emerald-600 font-medium">%</span>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-emerald-600">Notre Méthode</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              L'algorithme au service de la planète
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Notre moteur d'optimisation ne se contente pas de trouver le chemin le plus court. Il
              calcule l'itinéraire le plus efficient énergétiquement.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-3 lg:gap-x-8">
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Mutualisation des Flux</h3>
                <p className="text-slate-600">
                  AgroLogistic regroupe les petits envois de producteurs voisins pour remplir les
                  camions, divisant par 4 les émissions par palette.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Wind className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Transition Énergétique</h3>
                <p className="text-slate-600">
                  Nous privilégions automatique les transporteurs disposant de flottes GNV,
                  Électriques ou Hybrides dans l'attribution des marchés.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Économie Circulaire</h3>
                <p className="text-slate-600">
                  Gestion des retours d'emballages consignés et valorisation des déchets organiques
                  via nos partenaires méthaniseurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Badges */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-12">
            Nos Certifications & Engagements
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder badges - using generic text representation or icon driven badges for now */}
            <div className="flex flex-col items-center gap-2">
              <Award className="h-16 w-16 text-yellow-500" />
              <span className="font-bold text-slate-700">EcoVadis Gold</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Leaf className="h-16 w-16 text-green-600" />
              <span className="font-bold text-slate-700">Carbon Neutral</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Sun className="h-16 w-16 text-orange-500" />
              <span className="font-bold text-slate-700">Solar Powered HQ</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Calculez votre impact potentiel</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-10">
              Découvrez combien de tonnes de CO2 votre entreprise pourrait économiser en passant à
              AgroLogistic dès le premier mois.
            </p>
            <button
              onClick={() => onNavigate('/customer/transport-calculator')}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-2"
            >
              Simuler mon Bilan Carbone <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
