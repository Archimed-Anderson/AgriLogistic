import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Marketplace B2B",
    description: "Connectez-vous directement avec des acheteurs et vendeurs vérifiés.",
    icon: "/assets/images/landing/icon-marketplace.png",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Logistique Intelligente",
    description: "Suivi en temps réel et optimisation des itinéraires de livraison.",
    icon: "/assets/images/landing/icon-logistics.png",
    color: "bg-orange-50 text-orange-600",
  },
  {
    title: "Prévisions IA",
    description: "Anticipez les rendements et les prix du marché grâce à l'IA.",
    icon: "/assets/images/landing/icon-ai.png",
    color: "bg-purple-50 text-purple-600",
  },
  {
    title: "Solutions Financières",
    description: "Accédez à des financements adaptés à votre cycle de production.",
    icon: "/assets/images/landing/icon-finance.png",
    color: "bg-green-50 text-green-600",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-green-600 font-semibold tracking-wide uppercase text-sm">
            Our Services
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tout ce dont vous avez besoin pour grandir
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Une suite complète d'outils interconnectés pour gérer votre activité agricole.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group relative p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                 <img 
                   src={service.icon} 
                   alt={service.title} 
                   className="w-10 h-10 object-contain drop-shadow-sm" 
                 />
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-green-700 transition-colors">
                {service.title}
              </h3>
              
              <p className="text-slate-500 mb-6 leading-relaxed text-sm">
                {service.description}
              </p>
              
              <div className="flex items-center text-green-600 font-medium text-sm group-hover:translate-x-2 transition-transform cursor-pointer">
                En savoir plus <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
