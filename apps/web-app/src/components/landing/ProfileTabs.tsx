'use client';

import { useState } from 'react';
import { Sprout, Truck, Store, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const profiles = [
  {
    id: 'farmer',
    title: 'Agriculteurs',
    icon: Sprout,
    image: '/landing/farmer.png',
    accent: 'text-emerald-600',
    bgAccent: 'bg-emerald-50',
    description:
      'Maximisez la valeur de votre récolte avec des outils de prévision et un accès direct aux acheteurs industriels.',
    benefits: [
      'Vente directe sans intermédiaires',
      'Paiement sécurisé par Blockchain',
      'Prévisions de récolte par IA',
      'Suivi des sols en temps réel',
    ],
    impact: '+25% Revenus',
    cta: 'Rejoindre en tant que Producteur',
  },
  {
    id: 'transporter',
    title: 'Transporteurs',
    icon: Truck,
    image: '/landing/transporter.png',
    accent: 'text-blue-600',
    bgAccent: 'bg-blue-50',
    description:
      'Optimisez vos flottes et réduisez vos trajets à vide grâce à notre algorithme de matching intelligent.',
    benefits: [
      'Optimisation des itinéraires',
      'Gestion de flotte intégrée',
      'Preuve de livraison numérique',
      "Réduction de l'empreinte carbone",
    ],
    impact: '-15% Coûts Carburant',
    cta: 'Devenir Partenaire Logistique',
  },
  {
    id: 'buyer',
    title: 'Acheteurs',
    icon: Store,
    image: '/landing/buyer.png',
    accent: 'text-orange-600',
    bgAccent: 'bg-orange-50',
    description:
      'Accédez à des produits frais et tracés directement depuis la source, avec une garantie de qualité totale.',
    benefits: [
      'Traçabilité de bout en bout',
      'Qualité certifiée par capteurs',
      'Approvisionnement stable',
      'Prix justes et transparents',
    ],
    impact: '100% Traçabilité',
    cta: 'Explorer le Catalogue',
  },
];

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState(profiles[0].id);
  const activeProfile = profiles.find((p) => p.id === activeTab) || profiles[0];

  return (
    <section className="py-32 relative overflow-hidden bg-white">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[10%] left-[-5%] w-[30%] h-[30%] bg-emerald-100/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-100/40 rounded-full blur-[120px]" />
      </div>

      <div className="container px-6 mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in">
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">
            Écosystème Vertueux
          </h2>
          <h3 className="text-4xl md:text-6xl font-black text-[#0A2619] mb-8 leading-tight">
            Une solution pour <span className="text-muted-foreground italic">chaque acteur.</span>
          </h3>
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
            AgriLogistic unifie la chaîne de valeur en offrant des outils technologiques de pointe
            adaptés aux besoins spécifiques de chaque métier.
          </p>
        </div>

        {/* Tab Switcher - Premium Modern Design */}
        <div className="flex flex-wrap justify-center p-2 bg-slate-50 rounded-4xl max-w-2xl mx-auto mb-20 border border-slate-100 shadow-sm">
          {profiles.map((profile) => (
            <button
              key={profile.id}
              onClick={() => setActiveTab(profile.id)}
              className={cn(
                'flex items-center gap-3 px-8 py-4 rounded-3xl transition-all duration-500 font-bold text-sm md:text-base',
                activeTab === profile.id
                  ? 'bg-white text-primary shadow-xl shadow-primary/5 scale-105'
                  : 'text-slate-400 hover:text-primary/70'
              )}
            >
              <profile.icon
                className={cn(
                  'h-5 w-5',
                  activeTab === profile.id ? 'text-primary' : 'text-current'
                )}
              />
              {profile.title}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-50 shadow-2xl shadow-slate-200/50">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Textual Content */}
              <div className="space-y-10 order-2 lg:order-1">
                <div
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest',
                    activeProfile.bgAccent,
                    activeProfile.accent
                  )}
                >
                  <activeProfile.icon className="h-4 w-4" />
                  Profil {activeProfile.title}
                </div>

                <h4 className="text-3xl md:text-4xl font-black text-primary leading-tight">
                  {activeProfile.description}
                </h4>

                <div className="grid gap-6">
                  {activeProfile.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="mt-1 p-1 rounded-full bg-slate-50 group-hover:bg-primary/5 transition-colors">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                      <span className="text-slate-600 font-semibold group-hover:text-primary transition-colors">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="h-16 px-10 rounded-2xl bg-primary text-white font-black hover:scale-105 transition-all shadow-xl shadow-primary/20"
                  >
                    {activeProfile.cta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Visual Showcase */}
              <div className="relative order-1 lg:order-2">
                <div className="relative aspect-4/3 rounded-[3rem] overflow-hidden shadow-3xl">
                  <img
                    src={activeProfile.image}
                    alt={activeProfile.title}
                    className="w-full h-full object-cover transition-transform duration-1000 scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating Impact Card */}
                <div className="absolute -bottom-8 -left-8 p-8 glass-dark rounded-4xl shadow-2xl animate-float backdrop-blur-2xl bg-white/90 border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={cn('p-4 rounded-2xl', activeProfile.bgAccent)}>
                      <TrendingUp className={cn('h-8 w-8', activeProfile.accent)} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">
                        Impact Mesuré
                      </span>
                      <span className="text-3xl font-black text-primary">
                        {activeProfile.impact}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtle Glow */}
                <div
                  className={cn(
                    'absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-20',
                    activeProfile.bgAccent
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
