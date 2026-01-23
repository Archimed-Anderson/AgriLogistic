import { 
  Tractor, 
  Sprout, 
  Leaf, 
  Smartphone, 
  BarChart3, 
  ShieldCheck, 
  CloudSun, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  BookOpen, 
  Users,
  Map as MapIcon
} from "lucide-react";
import FooterSection from "../sections/FooterSection";

export function SolutionsFarmersPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-emerald-900 py-20 sm:py-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1625246333195-5848c4282704?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Agriculture Intelligente"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/90 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl animate-fade-in-down">
            <div className="mb-6 inline-flex items-center rounded-full border border-green-400/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-300 backdrop-blur-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              Logiciel de Gestion de Parcelles N°1
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6 leading-tight">
              Du semis à la récolte, gérez votre exploitation de A à Z
            </h1>
            <p className="mt-6 text-xl leading-8 text-emerald-100">
              Tracez, analysez et valorisez vos cultures en quelques clics. Que vous cultiviez des céréales, des légumes ou des fruits, simplifiez votre pilotage réglementaire, agronomique et économique.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={() => onNavigate('/demo')}
                className="rounded-lg bg-green-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-green-500/30 hover:bg-green-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 transition-all duration-200 transform hover:-translate-y-1"
              >
                Découvrir Smag Farmer
              </button>
              <button
                onClick={() => onNavigate('/contact/general')}
                className="text-base font-semibold leading-6 text-white hover:text-green-300 transition-colors flex items-center gap-2"
              >
                Voir une démo <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Value Propositions Grid */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-green-600">Performance & Sérénité</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Une solution complète pour l'agriculteur moderne
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Feature 1: Réglementaire */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center mb-6">
                <ShieldCheck className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Sécurisez votre réglementaire</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Vérifications phyto (+40 points de contrôle)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Alertes temps réel (anomalies phyto)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Compatibilité PAC 2025, CSP, GREN</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Export TelePAC facile</span>
                </li>
              </ul>
            </div>

            {/* Feature 2: Agronomie */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <Sprout className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Ajustez vos pratiques agronomiques</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Cartographie dynamique des cultures</span>
                </li>
                 <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Météo à la commune & préconisations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Connexions OAD (Xarvio, Mileos...)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Optimisation de la fertilisation</span>
                </li>
              </ul>
            </div>

            {/* Feature 3: Rentabilité */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Pilotez votre rentabilité</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Calcul automatique des marges brutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Suivi des coûts de production</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Gestion des stocks et équipements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Tableaux de bord (IFT, Ecorégimes)</span>
                </li>
              </ul>
            </div>

            {/* Feature 4: Connectivité */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                <Tractor className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Connecteurs Machines & Gain de temps</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Zéro ressaisie de données</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Enregistrement automatique temps réel</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Compatible John Deere, Claas, etc.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>Intégrations : Aptimiz, MyEasyFarm...</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features List */}
      <section className="bg-slate-50 py-20 border-t border-slate-200">
         <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Fonctionnalités Clés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="flex gap-4">
                  <MapIcon className="h-8 w-8 text-green-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">Parcellaire & Assolement</h4>
                    <p className="text-slate-600 text-sm mt-1">Création, import et gestion facile de vos parcelles et de vos cultures.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <Leaf className="h-8 w-8 text-green-600 shrink-0" />
                   <div>
                    <h4 className="font-bold text-lg">Traçabilité</h4>
                    <p className="text-slate-600 text-sm mt-1">Saisie des interventions, analyses de sol, et gestion des effluents.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <CloudSun className="h-8 w-8 text-green-600 shrink-0" />
                   <div>
                    <h4 className="font-bold text-lg">Météo Agricole</h4>
                    <p className="text-slate-600 text-sm mt-1">Prévisions locales ultra-précises pour planifier vos travaux.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <Smartphone className="h-8 w-8 text-green-600 shrink-0" />
                   <div>
                    <h4 className="font-bold text-lg">Mobilité Totale</h4>
                    <p className="text-slate-600 text-sm mt-1">Application iOS et Android fonctionnant même sans réseau.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <Users className="h-8 w-8 text-green-600 shrink-0" />
                   <div>
                    <h4 className="font-bold text-lg">Gestion Main d'Œuvre</h4>
                    <p className="text-slate-600 text-sm mt-1">Suivi des temps de travaux et affectation des ressources.</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <BarChart3 className="h-8 w-8 text-green-600 shrink-0" />
                   <div>
                    <h4 className="font-bold text-lg">Module Économique</h4>
                    <p className="text-slate-600 text-sm mt-1">Analyses de coûts, marges et stocks en temps réel.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Support Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
           <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Un accompagnement au quotidien</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                 <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="h-8 w-8 text-green-600" />
                 </div>
                 <h3 className="text-lg font-bold mb-2">Centre d'Aide 24/7</h3>
                 <p className="text-slate-600">Tutos vidéos, notes de mises à jour et documentation en ligne accessible à tout moment.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <Phone className="h-8 w-8 text-green-600" />
                 </div>
                 <h3 className="text-lg font-bold mb-2">Support Client</h3>
                 <p className="text-slate-600">Une équipe à votre écoute du lundi au vendredi, par téléphone, chat et email.</p>
              </div>
              <div className="flex flex-col items-center">
                 <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                 </div>
                 <h3 className="text-lg font-bold mb-2">Webformations</h3>
                 <p className="text-slate-600">Sessions de formation interactive en ligne sur des thématiques spécifiques chaque semaine.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Mobile App CTA */}
      <section className="relative bg-slate-900 py-24 overflow-hidden">
         <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="lg:flex lg:items-center lg:gap-16">
               <div className="lg:w-1/2">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                    L'application Smag Farmer vous accompagne partout
                  </h2>
                  <p className="text-lg text-slate-300 mb-8">
                    Enregistrez vos interventions directement depuis la cabine ou le champ. L'interface est conçue pour être simple, rapide et fonctionnelle même hors connexion.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <button className="flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors">
                        <Smartphone className="h-5 w-5" /> Télécharger sur l'App Store
                     </button>
                      <button className="flex items-center justify-center gap-3 bg-transparent border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                        <Smartphone className="h-5 w-5" /> Disponible sur Google Play
                     </button>
                  </div>
               </div>
               <div className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center">
                  {/* Abstract Phone Mockup */}
                  <div className="relative w-64 h-[500px] bg-slate-800 rounded-[3rem] border-8 border-slate-700 shadow-2xl overflow-hidden">
                     <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-700 rounded-b-2xl z-20"></div>
                     <div className="w-full h-full bg-slate-600 flex flex-col pt-12">
                        {/* App Header */}
                        <div className="px-6 pb-4 border-b border-slate-500/30">
                           <div className="text-white font-bold text-lg">Ma Parcelle Sud</div>
                           <div className="text-green-400 text-sm">Blé Tendre - 12ha</div>
                        </div>
                        {/* App Content */}
                        <div className="p-4 space-y-4">
                           <div className="bg-slate-700/50 p-3 rounded-lg">
                              <div className="text-slate-400 text-xs text-transform uppercase">Intervention</div>
                              <div className="text-white font-medium">Fertilisation Azotée</div>
                           </div>
                           <div className="bg-slate-700/50 p-3 rounded-lg">
                              <div className="text-slate-400 text-xs text-transform uppercase">Date</div>
                              <div className="text-white font-medium">Aujourd'hui, 09:30</div>
                           </div>
                           <div className="mt-8 flex justify-center">
                              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-pulse">
                                 <CheckCircle2 className="h-8 w-8 text-white" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <FooterSection />
    </div>
  );
}
