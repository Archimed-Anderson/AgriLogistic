import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Importing generated images (assuming they are placed in public/images/solutions)
// Since we generated them as artifacts, we will use the absolute paths for now for the USER to verify,
// but in a real app we'd move them to public.
// For this step I will reference the artifact paths directly which Next.js might not serve by default without config.
// HOWEVER, standard practice is to put them in public.
// I will assume for this "mock" implementation we are using the artifact URLs or I should move them.
// To make it easy, I will assume they are available at the URLs provided by the artifacts system if I could,
// but since I can't move files easily to public without 'run_command' cp using absolute paths.

const challenges = [
  {
    title: 'Efficience Supply Chain',
    description: 'Digitalisez vos flux logistiques pour réduire les pertes post-récolte de 30%.',
    image: '/images/solutions/supply_chain.png', // Placeholder path, I will need to move files
    link: '/solutions/supply-chain',
  },
  {
    title: 'Amélioration des Rendements',
    description:
      "Utilisez l'intelligence agronomique pour prédire et maximiser la qualité de vos récoltes.",
    image: '/images/solutions/yield.png',
    link: '/solutions/yield',
  },
  {
    title: 'Traçabilité & Conformité',
    description:
      'Assurez la transparence du champ à la table et répondez aux normes internationales (EUDR).',
    image: '/images/solutions/traceability.png',
    link: '/solutions/traceability',
  },
  {
    title: 'Résilience Climatique',
    description:
      'Anticipez les risques météorologiques grâce à des modèles prédictifs haute résolution.',
    image: '/images/solutions/climate.png',
    link: '/solutions/climate',
  },
  {
    title: 'Accès au Financement',
    description:
      "Simplifiez l'accès au crédit et à l'assurance grâce au scoring basé sur les données réelles.",
    image: '/images/solutions/finance.png',
    link: '/solutions/finance',
  },
  {
    title: 'Agriculture Régénérative',
    description: 'Passez à des pratiques durables tout en maintenant une productivité optimale.',
    image: '/images/solutions/regenerative.png',
    link: '/solutions/regenerative',
  },
];

export function SolutionsGrid() {
  return (
    <section id="solutions" className="py-24 bg-[#FDFDFD]">
      <div className="container px-6 mx-auto">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-xs font-black text-primary uppercase tracking-[0.25em] mb-6 bg-primary/5 inline-block px-4 py-2 rounded-full border border-primary/10">
            Défis & Solutions
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A2619] leading-[1.1] mb-6">
            L'excellence opérationnelle <br />
            <span className="text-emerald-500 italic">à chaque étape.</span>
          </h3>
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            Une suite complète d'outils interconnectés pour transformer vos défis quotidiens en
            opportunités de croissance durable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challenges.map((challenge, index) => (
            <Link
              href={challenge.link}
              key={challenge.title}
              className="group relative flex flex-col h-[480px] rounded-[40px] overflow-hidden cursor-pointer"
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <Image
                  src={challenge.image}
                  alt={challenge.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A2619] via-[#0A2619]/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end h-full p-10">
                <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                  <h4 className="text-2xl font-black text-white mb-4 leading-tight">
                    {challenge.title}
                  </h4>
                  <div className="w-12 h-1 bg-emerald-500 mb-6 transition-all duration-300 group-hover:w-20" />
                  <p className="text-emerald-50 font-medium text-sm leading-relaxed mb-6 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 text-shadow-sm">
                    {challenge.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 opacity-0 transform translate-y-4 transition-all duration-700 delay-100 group-hover:opacity-100 group-hover:translate-y-0">
                    Découvrir la solution <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            href="/request-demo"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#0A2619] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary transition-all shadow-xl hover:scale-105"
          >
            Voir toutes nos solutions <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
