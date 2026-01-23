import { Server, Database, Shield, Radio } from "lucide-react";
import FooterSection from "../sections/FooterSection";

export function PartnersEcosystemPage({ onNavigate }: { onNavigate: (route: string) => void }) {
  const logisticsPartners = [
    { name: "BioFrais", logo: "/images/partners/biofrais.png", type: "Transport Frigorifique" },
    { name: "GreenLog", logo: "/images/partners/greenlog.png", type: "Logistique Urbaine" },
    { name: "TransExpress", logo: "/images/partners/transexpress.png", type: "Fret International" },
    { name: "AgriTech", logo: "/images/partners/agritech.png", type: "Collecte Groupée" },
    { name: "EcoFerme", logo: "/images/partners/ecoferme.png", type: "Distribution Circuit-Court" },
  ];

  const techPartners = [
    { name: "IoT Valley", icon: Radio, desc: "Capteurs connectés & Réseaux LPWAN" },
    { name: "BlockChain Alliance", icon: Database, desc: "Traçabilité inviolable & Smart Contracts" },
    { name: "Cloud Secure", icon: Server, desc: "Hébergement Haute Disponibilité" },
    { name: "Cyber Shield", icon: Shield, desc: "Sécurité & Conformité RGPD" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-700">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            Notre Écosystème <span className="text-green-500">Partenaires</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Nous ne construisons pas le futur de l'agrologistique seuls. Découvrez le réseau d'excellence qui propulse AgroLogistic.
          </p>
        </div>
      </section>

      {/* Logistics Partners Grid */}
      <section className="py-24 sm:py-32 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Partenaires Logistiques</h2>
            <p className="mt-4 text-lg text-slate-600">Ils assurent le mouvement physique de vos marchandises avec fiabilité.</p>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {logisticsPartners.map((partner) => (
              <div key={partner.name} className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 group">
                <div className="h-24 w-full flex items-center justify-center mb-6 grayscale group-hover:grayscale-0 transition-all duration-300 opacity-80 group-hover:opacity-100">
                  <img src={partner.logo} alt={partner.name} className="max-h-16 object-contain" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{partner.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{partner.type}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-center mb-16">
              Excellence Technologique
            </h2>
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
              {techPartners.map((partner) => {
                const Icon = partner.icon;
                return (
                  <div key={partner.name} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                      <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-green-600">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      {partner.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                      <p className="flex-auto">{partner.desc}</p>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="relative isolate overflow-hidden bg-slate-900 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Devenir Partenaire</h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Vous proposez des services logistiques, technologiques ou financiers innovants ? Rejoignez l'écosystème AgroLogistic.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <button
                onClick={() => onNavigate('/contact/partnerships')}
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-green-600 shadow-sm hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Rejoindre le réseau
              </button>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
