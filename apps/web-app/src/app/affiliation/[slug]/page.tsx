import { Metadata } from 'next'
import { getAffiliateProductBySlug, affiliateProducts } from '@/data/affiliate-products'
import { AffiliateProductCard } from '@/components/affiliation/AffiliateProductCard'
import { AffiliateRedirectButton } from '@/components/affiliation/AffiliateRedirectButton'
import { Check, X, Star, Zap, ShieldCheck, Box, TrendingUp, Info } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Dynamic3DBackground } from '@/components/affiliation/Dynamic3DBackground'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = getAffiliateProductBySlug(params.slug)
  if (!product) return { title: 'Produit non trouvé' }

  const baseUrl = 'https://agrilogistic.com' // Mock base URL
  const productUrl = `${baseUrl}/affiliation/${product.slug}`

  return {
    title: `${product.name} | Boutique Partenaires AgriLogistic`,
    description: product.seo.metaDescription,
    keywords: product.seo.keywords,
    openGraph: {
      title: product.name,
      description: product.seo.metaDescription,
      images: [product.images[0]],
      url: productUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.seo.metaDescription,
      images: [product.images[0]],
    }
  }
}

export default function AffiliateProductDetail({ params }: PageProps) {
  const product = getAffiliateProductBySlug(params.slug)
  if (!product) notFound()

  const similarProducts = affiliateProducts
    .filter(p => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3)

  return (
    <div className="relative min-h-screen text-white pt-40 pb-20">
      <Dynamic3DBackground />
      {/* Schema.org Product Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "image": product.images,
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": "AgriLogistic Partner"
            },
            "offers": {
              "@type": "Offer",
              "url": product.affiliateUrl,
              "priceCurrency": product.currency,
              "price": product.price,
              "availability": product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.rating,
              "reviewCount": product.reviewCount
            }
          })
        }}
      />
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 mb-16 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
          <Link href="/" className="hover:text-yellow-500 transition-colors">Accueil</Link>
          <div className="h-1 w-1 rounded-full bg-slate-800" />
          <Link href="/affiliation" className="hover:text-yellow-500 transition-colors">Boutique</Link>
          <div className="h-1 w-1 rounded-full bg-slate-800" />
          <span className="text-yellow-500">{product.category}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
          {/* Left: Gallery */}
          <div className="space-y-8">
            <div className="aspect-square rounded-3xl overflow-hidden border-2 border-white/5 bg-[#242424] shadow-2xl relative group">
              <Image 
                src={product.images[0]} 
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-60" />
              
              {/* Platform floating badge */}
              <div className={cn(
                "absolute top-8 left-8 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl",
                product.platform === 'AMAZON' ? "bg-orange-500 text-black shadow-orange-500/20" : 
                product.platform === 'ALIBABA' ? "bg-yellow-500 text-black shadow-yellow-500/20" : "bg-emerald-500 text-white"
              )}>
                {product.platform}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-white/10 hover:border-yellow-500 hover:scale-105 transition-all cursor-pointer bg-[#242424] relative shadow-xl">
                  <Image src={img} alt={`${product.name} ${i}`} fill className="object-cover" />
                </div>
              ))}
              {/* Placeholder for missing images to maintain grid */}
              {[...Array(Math.max(0, 3 - product.images.length))].map((_, i) => (
                <div key={`pl-${i}`} className="aspect-square rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center">
                  <Box className="h-8 w-8 text-slate-800" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col pt-4">
            <div className="inline-flex items-center gap-3 bg-yellow-500/10 text-yellow-500 px-5 py-2 rounded-full w-fit mb-8 border border-yellow-500/30 text-[10px] font-black uppercase tracking-[0.3em]">
              <ShieldCheck className="h-4 w-4" />
              Certifié Expert Sourcing
            </div>

            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-[0.9] italic">
              {product.name}
            </h1>

            <div className="flex items-center gap-8 mb-10">
              <div className="flex items-center text-yellow-500 text-2xl font-black tracking-tighter">
                <Star className="h-7 w-7 fill-current mr-2" />
                {product.rating}
                <span className="text-slate-600 text-xs ml-3 font-black uppercase tracking-widest">({product.reviewCount} avis)</span>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex items-center gap-3 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                En Stock (Livraison Express)
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-16">
              <p className="text-slate-400 text-xl font-bold leading-relaxed italic border-l-4 border-white/10 pl-8">
                {product.description}
              </p>
            </div>

            {/* Price section - Conversion Optimized */}
            <div className="bg-[#242424]/80 backdrop-blur-md border-2 border-white/5 p-10 rounded-[40px] mb-16 relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                 <Zap className="h-64 w-64 text-yellow-500" />
               </div>
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-10">
                  <div>
                    <div className="text-slate-500 text-[10px] font-black uppercase mb-2 tracking-[0.3em]">Offre Partenaire {product.platform}</div>
                    <div className="flex items-center gap-6">
                       <span className="text-7xl font-black text-white italic tracking-tighter">{product.price.toLocaleString()}€</span>
                       {product.originalPrice && (
                         <span className="text-3xl text-slate-700 line-through font-black italic">{product.originalPrice.toLocaleString()}€</span>
                       )}
                    </div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500/30 p-5 rounded-3xl flex items-center gap-5 shadow-2xl shadow-orange-500/5">
                     <div className="h-14 w-14 rounded-2xl bg-orange-500 flex items-center justify-center text-black">
                        <TrendingUp className="h-7 w-7" />
                     </div>
                     <div>
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Indice Market</div>
                       <div className="text-orange-500 font-black text-lg tracking-tighter">-14% vs Public</div>
                     </div>
                  </div>
               </div>

               {/* GROS BOUTON CTA MULTI-PLATEFORME */}
               <AffiliateRedirectButton 
                url={product.affiliateUrl} 
                platform={product.platform} 
                productId={product.id}
                className="py-8 text-2xl h-24 shadow-[0_30px_60px_rgba(234,179,8,0.15)] hover:shadow-[0_30px_80px_rgba(234,179,8,0.25)] rounded-[20px] hover:scale-[1.02] active:scale-[0.98]"
               />

               <div className="flex flex-wrap items-center justify-center gap-10 mt-8">
                  <div className="flex items-center gap-3 text-[10px] text-slate-600 font-black uppercase tracking-widest">
                     <ShieldCheck className="h-4 w-4 text-yellow-500/50" /> Tracking SSL 256
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-600 font-black uppercase tracking-widest">
                     <Zap className="h-4 w-4 text-yellow-500/50" /> Direct Link
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-600 font-black uppercase tracking-widest">
                     <Check className="h-4 w-4 text-yellow-500/50" /> Expert Sourced
                  </div>
               </div>
            </div>

            {/* AVANTAGES / INCONVÉNIENTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b-2 border-emerald-500/30 pb-6">
                     <div className="h-10 w-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <Check className="h-6 w-6 stroke-[3]" />
                     </div>
                     <h3 className="text-2xl font-black uppercase tracking-tighter italic">Points Forts</h3>
                  </div>
                  <div className="space-y-4">
                    {product.pros.map((pro, i) => (
                      <div key={i} className="flex items-start gap-5 bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
                         <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                         <span className="text-sm font-black text-slate-300 leading-tight uppercase">{pro}</span>
                      </div>
                    ))}
                  </div>
               </div>
               <div className="space-y-8">
                  <div className="flex items-center gap-4 border-b-2 border-orange-500/30 pb-6">
                     <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/20">
                        <X className="h-6 w-6 stroke-[3]" />
                     </div>
                     <h3 className="text-2xl font-black uppercase tracking-tighter italic">Limitations</h3>
                  </div>
                  <div className="space-y-4">
                    {product.cons.map((con, i) => (
                      <div key={i} className="flex items-start gap-5 bg-orange-600/5 p-5 rounded-2xl border border-orange-600/10 hover:bg-orange-600/10 transition-colors grayscale opacity-70">
                         <div className="h-2 w-2 rounded-full bg-orange-600 mt-2 shrink-0" />
                         <span className="text-sm font-black text-slate-300 leading-tight uppercase">{con}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Technical Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mb-32 py-32 border-t border-white/5">
           {/* Detailed Features */}
           <div className="lg:col-span-2 space-y-16">
              <div className="flex items-center gap-6">
                 <h2 className="text-5xl font-black uppercase tracking-tighter italic">
                   Expertise <span className="text-yellow-500">Industrielle</span>
                 </h2>
                 <div className="h-1 flex-grow bg-gradient-to-r from-yellow-500/20 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {product.features.map((feature, i) => (
                   <div key={i} className="group relative">
                      <div className="absolute inset-0 bg-yellow-500/5 blur-2xl group-hover:bg-yellow-500/10 transition-colors rounded-3xl" />
                      <div className="relative flex items-center gap-6 p-10 bg-[#242424]/50 border-2 border-white/5 rounded-[32px] hover:border-yellow-500/30 transition-all shadow-xl group-hover:scale-105 duration-500">
                         <div className="h-16 w-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:rotate-12 transition-transform shadow-2xl">
                            <Zap className="h-8 w-8 fill-current" />
                         </div>
                         <span className="font-black uppercase text-base tracking-tighter leading-[1.1] italic">{feature}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Specifications Table */}
           <div className="space-y-16">
              <div className="flex items-center gap-4">
                 <h2 className="text-5xl font-black uppercase tracking-tighter italic text-yellow-500">
                   Specs
                 </h2>
              </div>
              <div className="bg-[#242424]/80 backdrop-blur-md border-2 border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                 {Object.entries(product.specifications).map(([key, value], i) => (
                   <div key={key} className={cn(
                     "flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors",
                     i !== Object.entries(product.specifications).length - 1 && "border-b border-white/5"
                   )}>
                      <div className="flex items-center gap-4">
                         <Info className="h-5 w-5 text-slate-700" />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{key}</span>
                      </div>
                      <span className="text-sm font-black text-white italic tracking-tight">{value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="space-y-20 py-32 border-t border-white/5 relative bg-gradient-to-b from-[#1a1a1a] to-[#141414]">
            <div className="flex items-center justify-between">
               <h2 className="text-6xl font-black uppercase tracking-tighter italic">
                 Vous pourriez <span className="text-yellow-500">Aimer</span>
               </h2>
               <Link 
                href="/affiliation" 
                className="group flex items-center gap-5 text-[10px] font-black uppercase text-yellow-500 tracking-[0.4em]"
               >
                 Toutes les offres <div className="h-12 w-12 rounded-2xl border-2 border-yellow-500/30 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-black transition-all group-hover:scale-110 shadow-2xl">→</div>
               </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
               {similarProducts.map(p => (
                 <AffiliateProductCard key={p.id} product={p} />
               ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
