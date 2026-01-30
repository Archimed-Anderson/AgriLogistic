import { Metadata } from 'next'
import { affiliateProducts, getTopPicks } from '@/data/affiliate-products'
import { AffiliationCatalogue } from '@/components/affiliation/AffiliationCatalogue'
import { ComparisonTable } from '@/components/affiliation/ComparisonTable'
import { Zap, ShoppingBag, Clock, TrendingUp, ShieldCheck, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dynamic3DBackground } from '@/components/affiliation/Dynamic3DBackground'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Boutique Partenaires | AgriLogistic Affiliation',
  description: 'Découvrez notre sélection de meilleurs outils, capteurs et équipements industriels recommandés par nos experts. Prix Amazon et Alibaba garantis.',
  keywords: ['affiliation agricole', 'outils amazon agriculture', 'capteurs alibaba industry']
}

export default function AffiliationPage() {
  const topPicks = getTopPicks(3)

  return (
    <div className="relative min-h-screen text-white">
      {/* NAVIGATION LOGO - REQUIRED BY USER */}
      <div className="fixed top-8 left-8 z-50">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500 shadow-2xl shadow-yellow-500/20 group-hover:scale-110 transition-transform">
            <Sprout className="h-7 w-7 text-black" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter text-white">
              AgriLogistic
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500/80">
              Solutions Pro
            </span>
          </div>
        </Link>
      </div>

      {/* 3D BACKGROUND LAYER - ÉTAPE 2 RÉFÉRENCE */}
      <div className="absolute top-0 left-0 w-full h-screen -z-10 overflow-hidden pointer-events-none">
        <Dynamic3DBackground className="absolute inset-0 w-full h-full" />
        {/* Glassmorphism Readability Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        {/* Abstract Industrial Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-yellow-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-orange-600/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Promo Flash Badge */}
            <div className="inline-flex items-center gap-3 bg-orange-600/10 border border-orange-600/30 px-6 py-2 rounded-full mb-10 animate-pulse shadow-[0_0_40px_rgba(234,88,12,0.1)]">
              <Zap className="h-5 w-5 text-orange-500 fill-current" />
              <span className="text-orange-500 font-black uppercase text-[10px] tracking-[0.3em]">Promotions Flash Actives</span>
              <div className="w-px h-4 bg-orange-600/30" />
              <div className="flex items-center gap-2 text-white font-black text-xs tabular-nums tracking-widest">
                <Clock className="h-4 w-4 text-slate-500" />
                02:45:12
              </div>
            </div>

            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-[0.85] italic">
              Boutique <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-600">
                Partenaires
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl font-bold max-w-2xl mx-auto mb-16 leading-relaxed italic">
              Nous sélectionnons pour vous les équipements les plus robustes au meilleur prix 
              chez nos partenaires mondiaux. <span className="text-yellow-500 font-black">Expertise Industrielle incluse.</span>
            </p>

            {/* Top Picks Icons */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-20 opacity-40">
              <div className="flex items-center gap-3 group">
                <ShieldCheck className="h-6 w-6 text-yellow-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Fiabilité Garantie</span>
              </div>
              <div className="flex items-center gap-3 group">
                <TrendingUp className="h-6 w-6 text-yellow-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Meilleurs Prix</span>
              </div>
              <div className="flex items-center gap-3 group">
                <ShoppingBag className="h-6 w-6 text-yellow-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sourcing Expert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE - TOP PICKS */}
      <section className="py-24 bg-black/40 backdrop-blur-sm border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="mb-16 flex items-center justify-between">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic border-l-4 border-yellow-500 pl-8">
              Les Incontournables <span className="text-yellow-500">2026</span>
            </h2>
          </div>
          <ComparisonTable products={topPicks} />
        </div>
      </section>

      {/* CATALOGUE SECTION */}
      <section className="py-24 container mx-auto px-6">
        <div className="flex items-center gap-6 mb-16">
          <h2 className="text-5xl font-black uppercase tracking-tighter italic whitespace-nowrap">
            Tout le <span className="text-yellow-500">Catalogue</span>
          </h2>
          <div className="h-1 flex-grow bg-gradient-to-r from-yellow-500/20 to-transparent" />
        </div>
        
        <AffiliationCatalogue initialProducts={affiliateProducts} />
      </section>
      
      {/* FOOTER CTA */}
      <section className="py-32 bg-gradient-to-t from-yellow-500/10 to-transparent border-t border-white/5 relative overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-20" />
         <div className="container mx-auto px-6 text-center relative z-10">
            <h3 className="text-5xl font-black uppercase italic mb-8 tracking-tighter">Un besoin spécifique ?</h3>
            <p className="text-slate-400 font-bold mb-12 max-w-lg mx-auto text-lg leading-relaxed">Nos experts peuvent sourcer du matériel sur-mesure pour vos besoins industriels les plus extrêmes.</p>
            <button className="h-20 px-16 bg-[#fbbf24] text-black font-black uppercase hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all rounded-2xl tracking-widest shadow-2xl shadow-yellow-500/20 text-lg">
              Contacter le Sourcing Pro
            </button>
         </div>
      </section>
    </div>
  )
}
