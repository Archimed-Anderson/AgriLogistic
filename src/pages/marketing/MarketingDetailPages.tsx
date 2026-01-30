import { useState, type ReactNode } from "react";
import { ProjectDetailPage } from "@/app/components/landing/pages/ProjectDetailPage";
import { ArrowRight, TrendingUp, Truck, ShieldCheck, Leaf } from "lucide-react";
import FooterSection from "@/app/components/landing/sections/FooterSection";

type DetailPageProps = {
  onNavigate: (route: string) => void;
  title: string;
  category: string;
  date: string;
  client: string;
  image: string;
  content: ReactNode;
};

function DetailPage(props: DetailPageProps) {
  return <ProjectDetailPage {...props} />;
}

// Contact pages
export function ContactGeneralPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="General Inquiries"
      category="Contact Us"
      date="24/7 Availability"
      client="AgroLogistic Support"
      image="/assets/images/landing/contact-general.png"
      content={
        <>
          <h2>We're Here to Help</h2>
          <p>
            Have a question about our platform, services, or pricing? Our team is ready to provide you with the answers
            you need to get started.
          </p>
          <h3>How we can assist:</h3>
          <ul>
            <li>Platform demonstrations and walkthroughs.</li>
            <li>Account setup and configuration guidance.</li>
            <li>General information about sustainable farming.</li>
          </ul>
        </>
      }
    />
  );
}

export function ContactSupportPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Technical Support"
      category="Customer Success"
      date="Immediate Response"
      client="Active Users"
      image="/assets/images/landing/contact-support.png"
      content={
        <>
          <h2>Expert Technical Assistance</h2>
          <p>
            Facing a technical issue? Our dedicated support engineers are here to ensure your operations run smoothly
            without interruption.
          </p>
          <h3>Support Services:</h3>
          <ul>
            <li>Real-time troubleshooting for IOT devices.</li>
            <li>Data synchronization and API integration help.</li>
            <li>System upgrade and maintenance support.</li>
          </ul>
        </>
      }
    />
  );
}

export function ContactPartnershipsPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Strategic Partnerships"
      category="Business Development"
      date="Global Network"
      client="Enterprise Partners"
      image="/assets/images/landing/contact-partners.png"
      content={
        <>
          <h2>Grow With Us</h2>
          <p>
            We are always looking to collaborate with organizations that share our vision for a sustainable agricultural
            future. Let's build something great together.
          </p>
          <h3>Partnership Opportunities:</h3>
          <ul>
            <li>Supply chain integration for retailers.</li>
            <li>Technology co-development and research.</li>
            <li>NGO and government sustainability initiatives.</li>
          </ul>
        </>
      }
    />
  );
}

// Story pages
export function StoryEcoPracticesPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Eco-Friendly Farming Practices"
      category="Our Story"
      date="Since 2018"
      client="Internal Initiative"
      image="/assets/images/landing/story-eco-practices.png"
      content={
        <>
          <h2>Preserving Nature, Enhancing Yields</h2>
          <p>
            We believe that high-yield agriculture shouldn't come at the cost of the environment. Our eco-friendly
            practices focus on regenerative agriculture, ensuring soil health and biodiversity are maintained.
          </p>
          <h3>Key Synergies</h3>
          <ul>
            <li>Regenerative Soil Management: Using cover crops and composting to sequester carbon.</li>
            <li>Integrated Pest Management (IPM): Reducing pesticide use by introducing natural predators.</li>
            <li>Water Conservation: Precision irrigation to minimize runoff and waste.</li>
          </ul>
        </>
      }
    />
  );
}

export function StoryFairTradePage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Fair Trade Marketplace"
      category="Social Impact"
      date="Global Reach"
      client="Community Driven"
      image="/assets/images/landing/story-fair-trade.png"
      content={
        <>
          <h2>Empowering Farmers Globally</h2>
          <p>
            AgroLogistic cuts out the middlemen, connecting smallholder farmers directly to global buyers. This ensures
            fairer prices, transparent transactions, and faster payments.
          </p>
          <h3>Marketplace Features</h3>
          <ul>
            <li>Direct Access: Farmers sell directly to retailers and processors.</li>
            <li>Price Transparency: Real-time market data available to all users.</li>
            <li>Secure Payments: Blockchain-verified transactions ensure trust and speed.</li>
          </ul>
        </>
      }
    />
  );
}

// Sustainable practices pages
export function PracticesYieldGrowthPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="80% Yield Growth"
      category="Performance"
      date="Ongoing"
      client="AgroLogistic Standard"
      image="/assets/images/landing/practice-yield-growth.png"
      content={
        <>
          <h2>Maximizing Crop Potential</h2>
          <p>
            Our AI-driven analytics platform processes millions of data points daily to provide actionable insights.
            This allows farmers to optimize planting schedules, nutrient application, and pest control.
          </p>
          <h3>Impact Metrics</h3>
          <ul>
            <li>Average yield increase of 80% within first 2 years.</li>
            <li>Reduction in chemical usage by 35%.</li>
            <li>Real-time disease detection accuracy of 99%.</li>
          </ul>
        </>
      }
    />
  );
}

export function PracticesWaterEfficiencyPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="100% Efficient Water Use"
      category="Sustainability"
      date="Standard Feature"
      client="Global Partners"
      image="/assets/images/landing/practice-water-efficiency.png"
      content={
        <>
          <h2>Smart Water Management</h2>
          <p>
            With precision irrigation powered by IoT sensors and predictive models, AgroLogistic helps farms reduce
            water waste while improving crop quality.
          </p>
          <h3>What you get</h3>
          <ul>
            <li>Soil moisture and evapotranspiration insights.</li>
            <li>Automated irrigation workflows (rules & schedules).</li>
            <li>Water usage analytics and anomaly alerts.</li>
          </ul>
        </>
      }
    />
  );
}

export function PracticesRenewableEnergyPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Renewable Energy Adoption"
      category="Green IT"
      date="2026 Roadmap"
      client="Partner Ecosystem"
      image="/assets/images/landing/practice-renewable-energy.png"
      content={
        <>
          <h2>Lower Costs, Lower Carbon</h2>
          <p>
            AgroLogistic supports farm electrification strategies and energy monitoring to reduce operational costs and
            emissions.
          </p>
          <h3>Key initiatives</h3>
          <ul>
            <li>Solar-powered cold chain monitoring.</li>
            <li>Equipment energy usage dashboards.</li>
            <li>Optimization recommendations via analytics.</li>
          </ul>
        </>
      }
    />
  );
}

// Projects pages
export function ProjectEcoFarmPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Eco Farm Transformation"
      category="Projects"
      date="2025"
      client="Eco Farm Cooperative"
      image="/assets/images/landing/project-eco-farm.png"
      content={
        <>
          <h2>From Traditional to Regenerative</h2>
          <p>
            A full transformation program supported by data-driven agronomy, marketplace access and logistics
            optimization.
          </p>
          <h3>Delivered outcomes</h3>
          <ul>
            <li>Improved soil health indicators and reduced chemical usage.</li>
            <li>Better margins through direct marketplace access.</li>
            <li>Optimized deliveries with real-time tracking.</li>
          </ul>
        </>
      }
    />
  );
}

export function ProjectSmartIrrigationPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <DetailPage
      onNavigate={onNavigate}
      title="Smart Irrigation Program"
      category="Projects"
      date="2025"
      client="Regional Growers"
      image="/assets/images/landing/project-smart-irrigation.png"
      content={
        <>
          <h2>Precision irrigation at scale</h2>
          <p>
            IoT sensor deployment, analytics and automation workflows combined to increase yields and reduce water
            usage.
          </p>
          <h3>Delivered outcomes</h3>
          <ul>
            <li>Reduced water waste and improved uniformity.</li>
            <li>Automated scheduling based on predictive models.</li>
            <li>Operational reporting for compliance and audits.</li>
          </ul>
        </>
      }
    />
  );
}

export function ProjectLogisticsPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [activeTab, setActiveTab] = useState(0);

  const capabilities = [
    {
      title: "Analytique Prédictive des Rendements",
      content: "L'analytique prédictive des rendements d'AgroLogistic est reconnue parmi les meilleures solutions pour l'optimisation de la supply chain en agriculture. Elle exploite des données avancées et des modèles prédictifs pilotés par l'IA pour prévoir avec précision la production des cultures. Cela permet aux responsables des achats et de la supply chain de planifier de manière proactive, de réduire les risques, d'améliorer l'efficacité de l'approvisionnement et d'assurer une traçabilité avec une visibilité cohérente sur les rendements."
    },
    {
      title: "Intelligence Climatique & Météo",
      content: "Notre module d'intelligence climatique offre des prévisions hyper-locales et des alertes en temps réel sur les événements météorologiques extrêmes. En intégrant ces données aux cycles de vie des cultures, nous permettons une adaptation agile des stratégies logistiques pour minimiser les pertes et sécuriser l'approvisionnement face aux aléas climatiques."
    },
    {
      title: "Prédiction Qualité & Durée de Vie",
      content: "Grâce à des algorithmes d'apprentissage automatique analysant les conditions de récolte et de transport, nous prédisons la qualité et la durée de conservation des produits. Cela permet une distribution intelligente : les produits à durée de vie courte sont priorisés pour les marchés locaux, réduisant ainsi le gaspillage alimentaire."
    },
    {
      title: "Traçabilité & Provenance",
      content: "Assurez une transparence totale de la ferme à la table. Notre système de traçabilité blockchain garantit l'authenticité de l'origine, certifie les pratiques durables et renforce la confiance des consommateurs grâce à des données vérifiables à chaque étape de la chaîne de valeur."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden" 
        style={{ background: 'linear-gradient(180deg, #002C17 0%, #001a0e 100%)' }}>
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
                <h5 className="text-[#79C25C] font-bold tracking-wider mb-4 uppercase text-sm">
                    INTELLIGENCE SUPPLY CHAIN
                </h5>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                    Plateforme d'Intelligence <span className="text-[#79C25C]">Supply Chain</span> alimentée par l'IA
                </h1>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    Naviguez dans la volatilité de la chaîne d'approvisionnement avec des prévisions guidées par l'IA, 
                    une intelligence régionale et une atténuation intelligente des risques pour sécuriser votre écosystème d'approvisionnement.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => onNavigate('/contact/general')}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-black transition-all hover:scale-105"
                    style={{ backgroundColor: '#79C25C' }}
                  >
                    Connectez-vous avec nous <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
            </div>
            <div className="hidden lg:block relative group perspective-1000">
                {/* 3D tilt effect container */}
                <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-white/5 bg-gray-900/50 backdrop-blur-sm transform transition-transform duration-500 hover:rotate-y-2 hover:rotate-x-2">
                   <img 
                      src="/assets/images/landing/logistics-dashboard.png" 
                      alt="Dashboard Logistique IA" 
                      className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                   />
                   
                   {/* Overlay gradient */}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#002C17]/80 via-transparent to-transparent pointer-events-none"></div>
                </div>
            </div>
        </div>
      </section>

      {/* Rethinking Supply Chain Section (New) */}
      <section className="py-20 px-6 relative overflow-hidden text-white" style={{ backgroundColor: '#002C17' }}>
         {/* Background pattern - subtle topograhic lines effect */}
         <div className="absolute inset-0 opacity-10" 
              style={{ 
                  backgroundImage: 'radial-gradient(#79C25C 1px, transparent 1px)', 
                  backgroundSize: '30px 30px' 
              }}>
         </div>
         
         <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-16">
               <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  Repenser votre Supply Chain Alimentaire avec AgroLogistic
               </h2>
               <p className="text-gray-300 text-lg leading-relaxed">
                  Le manuel d'approvisionnement traditionnel n'a jamais été conçu pour les réalités d'aujourd'hui. 
                  Les crises climatiques, les maladies des cultures, les retards d'expédition et les tensions géopolitiques réécrivent les règles, 
                  laissant les détaillants alimentaires vulnérables.
               </p>
            </div>

            <div className="w-full h-px bg-white/20 mb-16"></div>

            <div className="grid lg:grid-cols-2 gap-16">
               {/* Left Column */}
               <div>
                  <h3 className="font-bold text-xl mb-8 leading-relaxed">
                     Pour réussir, les leaders de la supply chain doivent réimaginer leur fonctionnement. 
                     La numérisation, les données et l'IA leur permettent de :
                  </h3>
                  <div className="space-y-4">
                     {[
                        "Prendre des décisions d'approvisionnement intelligentes",
                        "Gérer la volatilité du marché avec confiance",
                        "S'approvisionner durablement",
                        "Assurer un approvisionnement constant et sans surprise"
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/10 rounded-full px-6 py-4 hover:bg-white/20 transition-colors">
                           <div className="w-8 h-8 rounded-full bg-[#79C25C] flex items-center justify-center shrink-0">
                              <Leaf className="w-4 h-4 text-[#002C17]" />
                           </div>
                           <span className="font-medium">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Right Column */}
               <div>
                  <h3 className="font-bold text-xl mb-8 leading-relaxed">
                     AgroLogistic fournit une intelligence basée sur les données sur le potentiel de rendement, 
                     vous donnant des informations exploitables pour :
                  </h3>
                  <div className="space-y-4">
                     {[
                        "Évaluer les risques à court et long terme pour la performance",
                        "Prévoir l'impact des changements climatiques sur les régions",
                        "Identifier de nouvelles régions stables pour l'expansion",
                        "Naviguer dans la volatilité des prix sans compromettre la résilience"
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/10 rounded-full px-6 py-4 hover:bg-white/20 transition-colors">
                           <div className="w-8 h-8 rounded-full bg-[#79C25C] flex items-center justify-center shrink-0">
                              <Leaf className="w-4 h-4 text-[#002C17]" />
                           </div>
                           <span className="font-medium">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>



      {/* Building a Predictive Supply Chain Section (New) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16 text-[#002C17]">
                Construire une Supply Chain Prédictive
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Card 1: Early Yield Signals */}
                <div className="bg-[#F0FDF4] p-8 rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="mb-6">
                        <Leaf className="w-10 h-10 text-[#79C25C]" />
                    </div>
                    <h3 className="font-bold text-xl text-[#002C17] mb-4">
                        Signaux de Rendement Précoces
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        Avec les signaux précoces, les responsables de la supply chain accèdent à des informations clés sur la production avec des données en temps réel sur les champs, la météo et la santé des cultures. Cela améliore la traçabilité avec une meilleure visibilité et permet une planification proactive.
                    </p>
                </div>

                {/* Card 2: Regional Risk Scores */}
                <div className="bg-[#F0FDF4] p-8 rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="mb-6">
                        <ShieldCheck className="w-10 h-10 text-[#79C25C]" />
                    </div>
                    <h3 className="font-bold text-xl text-[#002C17] mb-4">
                        Scores de Risque Régionaux
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        Les scores de risque aident à évaluer les menaces potentielles liées à la météo, aux ravageurs ou aux problèmes socio-politiques. Cela ajoute une couche prédictive à la gestion de la supply chain, permettant d'atténuer les risques et de prendre des décisions éclairées sur les zones vulnérables.
                    </p>
                </div>

                {/* Card 3: Volume Forecasting */}
                <div className="bg-[#F0FDF4] p-8 rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="mb-6">
                        <TrendingUp className="w-10 h-10 text-[#79C25C]" />
                    </div>
                    <h3 className="font-bold text-xl text-[#002C17] mb-4">
                        Prévision des Volumes
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        La prévision des volumes prédit la disponibilité future des cultures via l'analyse de données et les tendances historiques. Cela renforce la gestion des stocks, soutient les stratégies d'approvisionnement et assure des livraisons ponctuelles à travers le cadre de traçabilité.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Platform Capabilities Section (New) */}
      <section className="py-24 px-6 bg-[#E0F7FA]/30">
         <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Tabs */}
            <div className="lg:col-span-5">
               <h2 className="text-3xl lg:text-4xl font-bold text-[#002C17] mb-12 leading-tight">
                  Fonctionnalités de la Plateforme Essentielles pour les Responsables Achats
               </h2>
               <div className="space-y-2">
                  {capabilities.map((cap, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTab(index)}
                      className={`w-full text-left px-8 py-5 rounded-full text-lg font-medium transition-all duration-300 flex items-center justify-between group ${
                        activeTab === index 
                          ? "bg-[#79C25C] text-white shadow-lg transform scale-105" 
                          : "text-gray-600 hover:bg-gray-100 hover:text-[#002C17]"
                      }`}
                    >
                      {cap.title}
                      {activeTab === index && <ArrowRight className="w-5 h-5" />}
                    </button>
                  ))}
               </div>
            </div>

            {/* Right Column: Content preview */}
            <div className="lg:col-span-7">
               <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 relative">
                  {/* Image Area */}
                  <div className="relative h-64 lg:h-80 overflow-hidden group">
                     <img 
                        src="/assets/images/landing/platform-capabilities.png" 
                        alt="Platform Capabilities" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#002C17] to-transparent opacity-60"></div>
                     <div className="absolute bottom-6 left-6">
                        <span className="bg-[#79C25C] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                           Technologie IA
                        </span>
                     </div>
                  </div>
                  
                  {/* Text Content Area */}
                  <div className="p-8 lg:p-10">
                     <h3 className="text-2xl font-bold text-[#002C17] mb-4">
                        {capabilities[activeTab].title}
                     </h3>
                     <p className="text-gray-600 leading-relaxed text-lg">
                        {capabilities[activeTab].content}
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Delivering Real Impact Section (New) */}
      <section className="py-24 px-6 bg-[#E0F2FE]/30 relative overflow-hidden">
         {/* Background pattern - subtle contour lines */}
         <div className="absolute inset-0 opacity-40 pointer-events-none" 
              style={{ 
                  backgroundImage: 'radial-gradient(#94A3B8 0.5px, transparent 0.5px)', 
                  backgroundSize: '20px 20px' 
              }}>
         </div>

         <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
               {/* Left Column: Title & Visual */}
               <div className="lg:col-span-5 space-y-8 sticky top-24">
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#002C17] leading-tight">
                     Un impact réel sur toute la chaîne d'approvisionnement alimentaire
                  </h2>
                  <div className="rounded-2xl overflow-hidden shadow-xl border border-white">
                      <img 
                        src="/assets/images/landing/supply-chain-impact.png" 
                        alt="Impact Supply Chain" 
                        className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                      />
                  </div>
               </div>

               {/* Right Column: Cards Grid */}
               <div className="lg:col-span-7 grid md:grid-cols-2 gap-6">
                  {/* Card 1 */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                     <h3 className="font-bold text-lg text-[#002C17] mb-3">Expertise Globale</h3>
                     <p className="text-gray-600 text-sm leading-relaxed">
                        Une expertise éprouvée dans l'alimentation des opérations d'approvisionnement et de supply chain pour les plus grandes marques de distribution et de CPG au monde.
                     </p>
                  </div>
                  
                  {/* Card 2 */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                     <h3 className="font-bold text-lg text-[#002C17] mb-3">Planification Climatique</h3>
                     <p className="text-gray-600 text-sm leading-relaxed">
                        Opérations à l'épreuve des intempéries avec détection des stades de culture, prévisions basées sur l'IA et alertes de risques hyperlocales.
                     </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                     <h3 className="font-bold text-lg text-[#002C17] mb-3">Achats Intelligents</h3>
                     <p className="text-gray-600 text-sm leading-relaxed">
                        Planifiez précisément les achats, protégez vos marges grâce à une tarification cohérente, optimisez la qualité et la durée de vie.
                     </p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                     <h3 className="font-bold text-lg text-[#002C17] mb-3">Logistique Optimisée</h3>
                     <p className="text-gray-600 text-sm leading-relaxed">
                        Alignez la planification des récoltes avec les modèles de maturité des cultures (GDD) pour optimiser la logistique et la gestion de la chaîne du froid.
                     </p>
                  </div>

                  {/* Card 5 */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                     <h3 className="font-bold text-lg text-[#002C17] mb-3">Résilience par la Donnée</h3>
                     <p className="text-gray-600 text-sm leading-relaxed">
                        Permet des décisions plus intelligentes à tous les niveaux, aidant les organisations à prospérer malgré la volatilité du marché.
                     </p>
                  </div>

                  {/* Card 6 */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                     <h3 className="font-bold text-lg text-[#002C17] mb-3">Suivi de Durabilité</h3>
                     <p className="text-gray-600 text-sm leading-relaxed">
                        Alignez les décisions avec les objectifs réglementaires et environnementaux, et suivez les émissions, l'utilisation de l'eau et la déforestation.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Industries We Serve Section (New) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header with navigation */}
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002C17]">
              Industries que nous servons
            </h2>
            <div className="flex gap-3">
              <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#79C25C] hover:text-[#79C25C] transition-colors">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <button className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-[#79C25C] hover:text-[#79C25C] transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1: Food Distributors */}
            <div className="group">
              <div className="rounded-3xl overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <img 
                  src="/assets/images/landing/industry-food-distributors.png" 
                  alt="Distributeurs Alimentaires" 
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-xl text-[#002C17] mb-3">Distributeurs Alimentaires</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nous aidons les distributeurs alimentaires avec des logiciels de traçabilité pour l'industrie alimentaire, garantissant une livraison ponctuelle et l'intégrité des produits. La visibilité et l'analytique améliorées permettent une gestion des stocks fluide et une logistique optimisée.
              </p>
            </div>

            {/* Card 2: Agri-Input Companies */}
            <div className="group">
              <div className="rounded-3xl overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <img 
                  src="/assets/images/landing/industry-agri-input.png" 
                  alt="Entreprises Agri-Intrants" 
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-xl text-[#002C17] mb-3">Entreprises Agri-Intrants</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                AgroLogistic équipe les entreprises agrochimiques et d'intrants avec une intelligence en temps réel au niveau parcellaire pour optimiser les opérations, augmenter les ventes et assurer la conformité tout en analysant les performances sous divers climats et sols.
              </p>
            </div>

            {/* Card 3: Food Retail */}
            <div className="group">
              <div className="rounded-3xl overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <img 
                  src="/assets/images/landing/industry-food-retail.png" 
                  alt="Distribution Alimentaire" 
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-xl text-[#002C17] mb-3">Distribution Alimentaire</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                AgroLogistic permet aux détaillants alimentaires d'améliorer la traçabilité et la transparence de la chaîne d'approvisionnement, avec des produits frais de haute qualité. Nous aidons à réduire le gaspillage et optimiser les stratégies d'approvisionnement avec des données fiables.
              </p>
            </div>

            {/* Card 4: CPG Manufacturers */}
            <div className="group">
              <div className="rounded-3xl overflow-hidden mb-6 shadow-lg group-hover:shadow-xl transition-shadow">
                <img 
                  src="/assets/images/landing/industry-cpg.png" 
                  alt="Fabricants CPG" 
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="font-bold text-xl text-[#002C17] mb-3">Fabricants CPG</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nous permettons aux fabricants de biens de consommation d'améliorer leur planification de production et leur contrôle qualité via une intelligence actionnable. Cela permet une meilleure gestion de la chaîne d'approvisionnement avec une visibilité complète.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sector Insights Section (New) */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Header with CTA */}
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#002C17]">
              Perspectives sectorielles avec des histoires réelles
            </h2>
            <button 
              onClick={() => onNavigate('/case-studies')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
              style={{ backgroundColor: '#79C25C' }}
            >
              Voir tous les cas <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Case Study Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group cursor-pointer" onClick={() => onNavigate('/case-studies')}>
              <div className="relative rounded-2xl overflow-hidden h-72 shadow-lg group-hover:shadow-xl transition-shadow">
                <img 
                  src="/assets/images/landing/case-potatoes.png" 
                  alt="Maximizing yield" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-medium text-lg leading-snug">
                    Maximiser le rendement grâce à l'intelligence prédictive et aux solutions de télédétection
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group cursor-pointer" onClick={() => onNavigate('/case-studies')}>
              <div className="relative rounded-2xl overflow-hidden h-72 shadow-lg group-hover:shadow-xl transition-shadow">
                <img 
                  src="/assets/images/landing/case-coffee.png" 
                  alt="Sustainable coffee" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-medium text-lg leading-snug">
                    Sucafina: assurer une culture du café durable
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group cursor-pointer" onClick={() => onNavigate('/case-studies')}>
              <div className="relative rounded-2xl overflow-hidden h-72 shadow-lg group-hover:shadow-xl transition-shadow">
                <img 
                  src="/assets/images/landing/case-grains.png" 
                  alt="Streamlining procurement" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-medium text-lg leading-snug">
                    Rationalisation des achats pour une production sans faille
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Background visual element */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
            <img src="/assets/images/landing/smart-warehouse.png" className="w-full h-full object-cover grayscale" alt="Warehouse Pattern" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Avantages Clés pour Nos Clients</h2>
                <div className="w-20 h-1 bg-[#79C25C] mx-auto mb-8"></div>
                <p className="text-gray-600 mb-8">
                    Notre plateforme cloud permet une transformation complète de votre chaîne d'approvisionnement grâce à des données précises.
                </p>
                
                {/* Featured Image - High tech warehouse */}
                <div className="rounded-2xl overflow-hidden shadow-xl mb-12 border border-gray-200">
                   <img src="/assets/images/landing/smart-warehouse.png" alt="Entrepôt Intelligent" className="w-full h-64 lg:h-80 object-cover hover:scale-105 transition-transform duration-700" />
                   <div className="bg-white p-4 text-left border-t border-gray-100 flex items-center justify-between">
                      <span className="font-bold text-gray-800">Logistique Automatisée</span>
                      <span className="text-sm text-[#79C25C] font-semibold tracking-wider uppercase">Future Ready</span>
                   </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Achats Plus Intelligents", icon: TrendingUp, desc: "Planifiez mieux, sécurisez les marges et assurez la qualité avec des insights prédictifs sur les récoltes." },
                    { title: "Logistique Optimisée", icon: Truck, desc: "Modèles de maturité des cultures pour aligner parfaitement la logistique avec les périodes de récolte." },
                    { title: "Résilience des Données", icon: ShieldCheck, desc: "Prenez des décisions éclairées malgré la volatilité des marchés et les perturbations climatiques." },
                    { title: "Suivi Durabilité", icon: Leaf, desc: "Surveillez et rapportez les métriques de durabilité pour répondre aux exigences réglementaires." }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-[#79C25C]/30">
                        <div className="w-14 h-14 rounded-xl bg-[#002C17]/5 group-hover:bg-[#79C25C] transition-colors flex items-center justify-center mb-6">
                            <item.icon className="w-7 h-7 text-[#002C17] group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-bold text-lg mb-3 text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      {/* Footer is typically in layout, but previous pages included it manually. Adding it here for consistency. */}
      <FooterSection onNavigate={onNavigate} />
    </div>
  );
}

