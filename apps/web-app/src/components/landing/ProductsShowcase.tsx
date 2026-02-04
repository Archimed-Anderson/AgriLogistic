'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  Leaf,
  ShieldCheck,
  ArrowRight,
  Satellite,
  Brain,
  Droplets,
  Bug,
  QrCode,
  Lock,
  Globe,
  ClipboardCheck,
  Truck,
  Store,
  ShoppingCart,
  Zap,
  Package,
} from 'lucide-react';
import { CircularAIHub } from './CircularAIHub';
import { TraceSecureFlow } from './TraceSecureFlow';
import { LogisticsConnectivity } from './LogisticsConnectivity';
import { AgroMarketVisual } from './AgroMarketVisual';
import { useState } from 'react';
import Image from 'next/image';

const products = [
  {
    id: 'farm',
    title: 'AgriLogistic Farm',
    tagline: "L'IA au service du champ.",
    description:
      "Transformez vos données agricoles en décisions profitables. Suivez vos parcelles par satellite et optimisez vos rendements avec l'IA.",
    features: [
      {
        title: 'Satellite',
        label: 'Suivi par satellite haute résolution',
        image: '/images/farm-satellite.png',
        icon: Satellite,
        gradient: 'from-emerald-500/40 to-teal-500/40',
      },
      {
        title: 'IA',
        label: 'Optimisation prédictive des récoltes',
        image: '/images/farm-ai.png',
        icon: Brain,
        gradient: 'from-blue-500/40 to-indigo-500/40',
      },
      {
        title: 'Irrigation',
        label: 'Gestion de précision de l’eau',
        image: '/images/farm-irrigation.png',
        icon: Droplets,
        gradient: 'from-sky-500/40 to-blue-500/40',
      },
      {
        title: 'Alertes',
        label: 'Détection précoce des maladies',
        image: '/images/farm-alert.png',
        icon: Bug,
        gradient: 'from-orange-500/40 to-red-500/40',
      },
    ],
    icon: Leaf,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    id: 'link',
    title: 'AgriLogistic Link',
    tagline: 'Logistique sans friction.',
    description:
      'Digitalisez vos flux de transport. Connectez-vous aux transporteurs certifiés et suivez vos cargaisons en temps réel.',
    features: [
      {
        title: 'Matching',
        label: 'Appairage IA transport - chargeur',
        image: '/images/landing/link-map.png',
        icon: Zap,
        gradient: 'from-blue-600/40 to-indigo-600/40',
      },
      {
        title: 'Fret',
        label: 'Bourse de fret panafricaine',
        image: '/images/link-market.png',
        icon: Package,
        gradient: 'from-orange-500/40 to-red-500/40',
      },
      {
        title: 'IoT',
        label: 'Tracking GPS & Capteurs IoT',
        image: '/images/landing/link-tracking.png',
        icon: Truck,
        gradient: 'from-emerald-500/40 to-teal-500/40',
      },
      {
        title: 'Escrow',
        label: 'Paiements sécurisés garantis',
        image: '/images/link-finance.png',
        icon: Lock,
        gradient: 'from-slate-700/40 to-slate-900/40',
      },
    ],
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    id: 'market',
    title: 'AgroMarket',
    tagline: 'Vendez en direct, partout.',
    description:
      'La marketplace vivrière B2B. Supprimez les intermédiaires, accédez aux meilleurs prix et vendez vos récoltes instantanément.',
    features: [
      {
        title: 'Marketplace',
        label: 'Vente directe sans intermédiaires',
        image: '/images/landing/market-visual.png',
        icon: ShoppingCart,
        gradient: 'from-emerald-500/40 to-emerald-600/40',
      },
      {
        title: 'Catalogue',
        label: 'Indexation intelligente des stocks',
        image: '/images/landing/market-catalog.png',
        icon: Brain,
        gradient: 'from-blue-400/40 to-indigo-600/40',
      },
      {
        title: 'Prix',
        label: 'Cours du marché en temps réel',
        image: '/images/link-market.png',
        icon: Globe,
        gradient: 'from-orange-400/40 to-red-600/40',
      },
      {
        title: 'Certifs',
        label: 'Certification qualité automatisée',
        image: '/images/trace-quality.png',
        icon: ClipboardCheck,
        gradient: 'from-slate-700/40 to-slate-900/40',
      },
    ],
    icon: Store,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    border: 'border-purple-100',
  },
  {
    id: 'trace',
    title: 'AgriLogistic Trace',
    tagline: 'Confiance & Transparence.',
    description:
      'Garantissez l’origine de vos produits avec la Blockchain. Valorisez vos exportations et respectez les normes internationales.',
    features: [
      {
        title: 'Blockchain',
        label: 'Traçabilité décentralisée immuable',
        image: '/images/trace-blockchain.png',
        icon: Lock,
        gradient: 'from-slate-700/40 to-slate-900/40',
      },
      {
        title: 'QR Code',
        label: 'Étiquetage intelligent d’origine',
        image: '/images/trace-qrcode.png',
        icon: QrCode,
        gradient: 'from-orange-400/40 to-red-600/40',
      },
      {
        title: 'Audit',
        label: 'Historique de production vérifié',
        image: '/images/trace-quality.png',
        icon: ClipboardCheck,
        gradient: 'from-blue-400/40 to-indigo-600/40',
      },
      {
        title: 'Export',
        label: 'Conformité EUDR & GlobalGAP',
        image: '/images/trace-export.png',
        icon: Globe,
        gradient: 'from-emerald-400/40 to-emerald-600/40',
      },
    ],
    icon: ShieldCheck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    border: 'border-orange-100',
  },
];

export function ProductsShowcase() {
  const [activeTab, setActiveTab] = useState(products[0].id);
  const activeProduct = products.find((p) => p.id === activeTab) || products[0];

  return (
    <section id="products" className="py-32 bg-[#F8FAFC] overflow-hidden">
      <div className="container px-6 mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 animate-in fade-in slide-in-from-top-12 duration-1000">
          <div className="max-w-3xl">
            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6 bg-white/80 inline-block px-6 py-3 rounded-2xl border border-primary/5 shadow-sm">
              AgriLogistic Suite v3.0
            </h2>
            <h3 className="text-5xl md:text-7xl font-black text-[#0A2619] leading-[1.05] tracking-tight">
              Une technologie pour <br />
              <span className="text-primary">chaque maillon.</span>
            </h3>
          </div>
          <p className="max-w-md text-xl text-slate-500 font-medium leading-relaxed">
            Une architecture modulaire interconnectée pour transformer radicalement l'agriculture et
            le commerce en Afrique.
          </p>
        </div>

        {/* Improved Tabs Navigation */}
        <div className="relative mb-24 animate-in fade-in zoom-in-95 duration-1000 delay-200">
          <div className="flex flex-wrap justify-between p-2 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl relative z-10">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => setActiveTab(product.id)}
                className={cn(
                  'flex-1 min-w-[180px] flex items-center justify-center gap-4 px-8 py-5 rounded-[2rem] transition-all duration-700 font-black text-sm relative overflow-hidden group',
                  activeTab === product.id ? 'text-white' : 'text-slate-500 hover:text-primary'
                )}
              >
                {activeTab === product.id && (
                  <div
                    className={cn(
                      'absolute inset-0 z-0 bg-primary shadow-xl animate-in fade-in zoom-in-95 duration-500'
                    )}
                  />
                )}
                <product.icon
                  className={cn(
                    'h-6 w-6 relative z-10 transition-transform duration-700 group-hover:scale-110',
                    activeTab === product.id ? 'text-white' : 'text-current'
                  )}
                />
                <span className="relative z-10 tracking-widest uppercase">{product.title}</span>
              </button>
            ))}
          </div>
          {/* Subtle reflection under tabs */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-black/5 blur-2xl rounded-full" />
        </div>

        {/* Content Area */}
        <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-12">
              <div
                className={cn(
                  'inline-flex items-center gap-3 px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl border-b-4',
                  activeProduct.bgColor,
                  activeProduct.color,
                  activeProduct.border,
                  'border-b-primary/10'
                )}
              >
                <activeProduct.icon className="h-6 w-6" />
                {activeProduct.title}
              </div>

              <div>
                <h4 className="text-4xl md:text-6xl font-black text-[#0A2619] mb-8 leading-[1.05] tracking-tighter">
                  {activeProduct.tagline}
                </h4>
                <p className="text-2xl text-slate-500 leading-relaxed font-medium">
                  {activeProduct.description}
                </p>
              </div>

              {/* Modern Feature Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(activeProduct.features as any[]).map((feature) => (
                  <div
                    key={feature.title}
                    className="group/card relative h-56 rounded-[3rem] overflow-hidden bg-white border border-slate-100 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl"
                  >
                    <Image
                      src={feature.image}
                      alt={feature.label}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover/card:scale-110"
                    />
                    <div
                      className={cn(
                        'absolute inset-0 bg-linear-to-t from-[#0A2619] via-[#0A2619]/40 to-transparent transition-opacity duration-300 group-hover/card:opacity-90'
                      )}
                    />

                    {/* Feature Card Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-3xl flex items-center justify-center border border-white/30 shadow-lg">
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-sm opacity-90 group-hover/card:opacity-100 transition-opacity">
                          {feature.title}
                        </span>
                      </div>
                      <p className="text-white font-bold text-lg leading-tight tracking-tight drop-shadow-md">
                        {feature.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-6">
                <Link
                  href="/request-demo"
                  className={cn(
                    'flex-1 inline-flex items-center justify-center gap-4 px-12 py-6 rounded-3xl font-black text-lg transition-all shadow-2xl hover:scale-105 active:scale-95 group/btn text-center',
                    'bg-primary text-white hover:bg-primary/95 shadow-primary/30'
                  )}
                >
                  Démarrer avec {activeProduct.title}
                  <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-2 transition-transform" />
                </Link>
                <Link
                  href="/solutions"
                  className="inline-flex items-center justify-center gap-4 px-10 py-6 rounded-3xl font-bold text-lg border-2 border-slate-200 hover:border-primary/20 hover:bg-white transition-all text-center"
                >
                  Voir Détails
                </Link>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full aspect-square animate-float-slow">
                {activeProduct.id === 'farm' ? (
                  <CircularAIHub />
                ) : activeProduct.id === 'link' ? (
                  <LogisticsConnectivity />
                ) : activeProduct.id === 'market' ? (
                  <AgroMarketVisual />
                ) : (
                  <TraceSecureFlow />
                )}
              </div>

              {/* Decorative elements around the visual */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[radial-gradient(#2D5A27_1.5px,transparent_1.5px)] bg-size-[24px_24px] opacity-10" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
