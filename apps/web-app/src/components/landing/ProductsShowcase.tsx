"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
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
  ClipboardCheck
} from "lucide-react"
import { CircularAIHub } from "./CircularAIHub"
import { TraceSecureFlow } from "./TraceSecureFlow"

const products = [
  {
    id: "farm",
    title: "AgriLogistic Farm",
    tagline: "L'Intelligence Artificielle au service du champ.",
    description: "Une suite d'applications intégrées pour la transformation numérique des opérations sur le terrain, de la gestion parcellaire au suivi cultural précis.",
    features: [
      {
        title: "Suivi Satellite",
        label: "Suivi des cultures en temps réel via satellite",
        image: "/images/farm-satellite.png",
        icon: Satellite,
        gradient: "from-emerald-500/20 to-teal-500/20"
      },
      {
        title: "Conseils IA",
        label: "Conseils agronomiques personnalisés par IA",
        image: "/images/farm-ai.png",
        icon: Brain,
        gradient: "from-blue-500/20 to-indigo-500/20"
      },
      {
        title: "Irrigation",
        label: "Gestion optimisée des intrants et de l'irrigation",
        image: "/images/farm-irrigation.png",
        icon: Droplets,
        gradient: "from-sky-500/20 to-blue-500/20"
      },
      {
        title: "Alertes Santé",
        label: "Alertes précoces sur les maladies et ravageurs",
        image: "/images/farm-alert.png",
        icon: Bug,
        gradient: "from-orange-500/20 to-red-500/20"
      }
    ],
    icon: Leaf,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    image: "/images/product-farm.jpg"
  },
  {
    id: "trace",
    title: "AgriLogistic Trace",
    tagline: "La confiance totale du champ à l'assiette.",
    description: "Garantissez l'authenticité et la qualité de vos produits grâce à la traçabilité blockchain. Luttez contre la contrefaçon et valorisez vos labels.",
    features: [
      {
        title: "Blockchain",
        label: "Traçabilité immuable par Blockchain",
        image: "/images/trace-blockchain.png",
        icon: Lock,
        gradient: "from-slate-700/20 to-slate-900/20"
      },
      {
        title: "Labels ID",
        label: "Labels intelligents et QR codes d'origine",
        image: "/images/trace-qrcode.png",
        icon: QrCode,
        gradient: "from-orange-400/20 to-red-600/20"
      },
      {
        title: "Qualité",
        label: "Certification de qualité automatisée",
        image: "/images/trace-quality.png",
        icon: ClipboardCheck,
        gradient: "from-blue-400/20 to-indigo-600/20"
      },
      {
        title: "Export",
        label: "Conformité aux normes d'exportation",
        image: "/images/trace-export.png",
        icon: Globe,
        gradient: "from-emerald-400/20 to-emerald-600/20"
      }
    ],
    icon: ShieldCheck,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    image: "/images/product-trace.jpg"
  }
]

export function ProductsShowcase() {
  return (
    <section id="products" className="py-24 bg-slate-50/50 overflow-hidden">
      <div className="container px-6 mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">Notre Écosystème</h2>
          <h3 className="text-4xl md:text-5xl font-black text-primary mb-6">
            Des outils puissants pour <span className="text-muted-foreground italic">chaque acteur.</span>
          </h3>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Découvrez nos modules spécialisés conçus pour apporter intelligence, transparence et rentabilité à votre activité.
          </p>
        </div>

        <div className="space-y-32">
          {products.map((product, index) => (
            <div 
              key={product.id}
              className={cn(
                "flex flex-col gap-16 items-center",
                index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              )}
            >
              {/* Product Info */}
              <div className="flex-1 w-full max-w-2xl">
                <div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6 font-bold", product.bgColor, product.color)}>
                  <product.icon className="h-5 w-5" />
                  {product.title}
                </div>
                <h4 className="text-4xl md:text-5xl font-black text-primary mb-6 leading-[1.1]">
                  {product.tagline}
                </h4>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                  {product.description}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                  {(product.features as any[]).map((feature) => (
                    <div 
                      key={feature.title} 
                      className="group/card relative h-48 rounded-3xl overflow-hidden border border-white/20 shadow-xl transition-all duration-500 hover:scale-[1.02]"
                    >
                      <img 
                        src={feature.image} 
                        alt={feature.label}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                      />
                      <div className={cn("absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent", feature.gradient)} />
                      
                      <div className="absolute inset-0 p-5 flex flex-col justify-end">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                            <feature.icon className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-white/70 text-xs font-bold uppercase tracking-wider">{feature.title}</span>
                        </div>
                        <p className="text-white font-semibold text-sm leading-snug">
                          {feature.label}
                        </p>
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  ))}
                </div>

                <Link href="/request-demo" className={cn(
                  "inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg transition-all hover:shadow-2xl hover:translate-y-[-2px] active:scale-95",
                  "bg-primary text-white",
                  product.id === 'farm' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200" : 
                  "bg-orange-600 hover:bg-orange-700 shadow-orange-200"
                )}>
                  Découvrir {product.title}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>

              {/* Product Visual */}
              <div className="flex-1 w-full aspect-square relative flex items-center justify-center">
                {product.id === 'farm' ? (
                  <CircularAIHub />
                ) : product.id === 'trace' ? (
                  <TraceSecureFlow />
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


