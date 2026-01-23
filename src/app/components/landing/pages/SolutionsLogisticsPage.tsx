import { Truck, Warehouse, MapPin, BarChart3, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import FooterSection from "../sections/FooterSection";

export function SolutionsLogisticsPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Logistique Agroalimentaire"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400 backdrop-blur-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Pour Coopératives & Grands Groupes
            </div>
            <h1 className="text-4xl font-light tracking-tight text-white sm:text-6xl mb-6">
              Optimisez vos <span className="font-bold text-green-500">Flottes</span> et <span className="font-bold text-green-500">Entrepôts</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Une suite logicielle unifiée pour piloter l'ensemble de votre chaîne logistique agroalimentaire. De la collecte à la livraison, gagnez en visibilité et en efficacité.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={() => onNavigate('/demo')}
                className="rounded-lg bg-green-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-all duration-200"
              >
                Demander une démo
              </button>
              <button
                onClick={() => onNavigate('/contact/general')}
                className="text-sm font-semibold leading-6 text-white hover:text-green-400 transition-colors flex items-center gap-2"
              >
                Parler à un expert <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600">Plateforme Unifiée</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Tout ce dont vous avez besoin pour piloter vos opérations
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Remplacez vos outils dispersés par une solution intégrée. Fini les fichiers Excel et les pertes d'informations.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {/* Feature 1: Gestion de Flottes */}
              <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-100">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  Gestion de Flottes
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Suivez vos véhicules en temps réel. Optimisez les tournées de collecte et de livraison pour réduire les kilomètres à vide et l'empreinte carbone.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-500">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Maintenance prédictive</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Géolocalisation Live</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Optimisation de trajets</li>
                  </ul>
                </dd>
              </div>

              {/* Feature 2: Gestion d'Entrepôts */}
              <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-100">
                    <Warehouse className="h-6 w-6 text-orange-600" />
                  </div>
                  Gestion d'Entrepôts
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Digitalisez vos stocks. De la réception à l'expédition, gardez le contrôle total sur vos inventaires avec une traçabilité précise par lot.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-500">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Inventaire temps réel</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Traçabilité QR Code</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Alertes de péremption</li>
                  </ul>
                </dd>
              </div>

              {/* Feature 3: Data & Analytics */}
              <div className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-100">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  Pilotage Data
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                  <p className="flex-auto">
                    Transformez vos données en décisions. Nos tableaux de bord vous donnent une vision claire sur la performance de votre chaîne logistique.
                  </p>
                  <ul className="mt-6 space-y-2 text-sm text-slate-500">
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> KPIs personnalisables</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Rapports automatisés</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Prévisions assistées par IA</li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Real-time Tracking Focus Section */}
      <section className="bg-slate-900 py-24 sm:py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16 items-center">
            <div>
              <div className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400 mb-6">
                <MapPin className="mr-2 h-4 w-4" /> Traçabilité Totale
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                Visibilité en Temps Réel sur toute la chaîne
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Ne perdez plus jamais la trace de vos marchandises. Notre technologie IoT vous permet de suivre la position, la température et l'état de vos produits à chaque instant.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                    <Clock className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Mises à jour instantanées</h3>
                    <p className="text-slate-400 text-sm mt-1">Données rafraîchies toutes les 30 secondes pour une précision maximale.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Conformité garantie</h3>
                    <p className="text-slate-400 text-sm mt-1">Historique immuable des données pour vos audits et certifications.</p>
                  </div>
                </div>
              </div>

               <div className="mt-10">
                <button 
                  onClick={() => onNavigate('/contact/general')}
                  className="text-white border border-slate-700 hover:bg-slate-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Découvrir nos capteurs IoT
                </button>
              </div>
            </div>
            
            <div className="relative">
              {/* Abstract representation of a map/tracking interface */}
              <div className="relative rounded-2xl bg-slate-800/50 border border-slate-700 p-4 aspect-[4/3] shadow-2xl backdrop-blur-sm">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/20 rounded-full animate-ping"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)]"></div>
                 
                 {/* Floating Cards simulating UI elements */}
                 <div className="absolute top-10 right-10 bg-slate-800 border border-slate-600 p-4 rounded-xl shadow-lg w-48 animate-fade-in-down" style={{animationDelay: '0.1s'}}>
                    <div className="flex items-center gap-2 mb-2">
                       <Truck className="h-4 w-4 text-blue-400" />
                       <span className="text-xs font-semibold text-white">Camion #42</span>
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-blue-500 h-full w-3/4"></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-slate-400">
                       <span>En route</span>
                       <span>Arr. 14:30</span>
                    </div>
                 </div>

                 <div className="absolute bottom-10 left-10 bg-slate-800 border border-slate-600 p-4 rounded-xl shadow-lg w-48 animate-fade-in-down" style={{animationDelay: '0.3s'}}>
                    <div className="flex items-center gap-2 mb-2">
                       <Warehouse className="h-4 w-4 text-orange-400" />
                       <span className="text-xs font-semibold text-white">Entrepôt Nord</span>
                    </div>
                    <div className="text-2xl font-bold text-white">85%</div>
                    <div className="text-[10px] text-slate-400">Capacité utilisée</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-green-600 px-6 py-24 text-center shadow-2xl rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à moderniser votre logistique ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-green-100">
              Rejoignez les leaders de l'agroalimentaire qui font confiance à AgroLogistic pour sécuriser et optimiser leurs opérations.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => onNavigate('/demo')}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-green-600 shadow-sm hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Commencer maintenant
              </button>
              <button 
                onClick={() => onNavigate('/contact/general')}
                className="text-sm font-semibold leading-6 text-white flex items-center gap-1"
              >
                Contactez-nous <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
