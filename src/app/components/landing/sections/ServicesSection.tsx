import { ArrowRight } from "lucide-react";

const services = [
  {
    id: "marketplace",
    title: "Marketplace B2B",
    description: "Connectez-vous directement avec des acheteurs et fournisseurs certifiés. Vendez vos récoltes au meilleur prix sans intermédiaires.",
    icon: "/assets/images/landing/icon-marketplace.png",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    id: "logistics",
    title: "Logistique Intelligente",
    description: "Optimisez vos tournées et suivez vos livraisons en temps réel. Réduisez vos coûts de transport grâce à notre algorithme de groupage.",
    icon: "/assets/images/landing/icon-logistics.png",
    color: "bg-orange-500/10 text-orange-500",
  },
  {
    id: "ai",
    title: "IA & Prédictions",
    description: "Anticipez les rendements et les maladies grâce à nos modèles prédictifs basés sur l'IA et les données satellites.",
    icon: "/assets/images/landing/icon-ai.png",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    id: "finance",
    title: "Finance Agricole",
    description: "Accédez à des solutions de financement adaptées et gérez votre trésorerie avec nos outils de facturation intégrés.",
    icon: "/assets/images/landing/icon-finance.png",
    color: "bg-green-500/10 text-green-500",
  },
];

export function ServicesSection() {
  return (
    <section className="relative py-24 bg-white sm:py-32 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -mr-400 -mt-24 h-[500px] w-[500px] rounded-full bg-green-50 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-24 h-[500px] w-[500px] rounded-full bg-blue-50 opacity-50 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base font-semibold leading-7 text-green-600">Solutions Complètes</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Tout ce dont vous avez besoin pour grandir
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Une suite d'outils interconnectés pour moderniser chaque aspect de votre exploitation agricole ou activité logistique.
          </p>
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="flex flex-col sm:flex-row gap-6 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-900/10 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:ring-green-500/30"
            >
              <div className="flex-none">
                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${service.color} p-2`}>
                  <img 
                    src={service.icon} 
                    alt={service.title} 
                    className="h-full w-full object-contain drop-shadow-md"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-xl font-bold leading-8 text-slate-900">
                  {service.title}
                </h3>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  {service.description}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center text-sm font-semibold leading-6 text-green-600 hover:text-green-500 cursor-pointer group">
                    En savoir plus
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
