'use client'

import { useState } from 'react'
import { ExternalLink, Loader2, ShoppingBag, Box, Zap } from 'lucide-react'
import { AffiliatePlatform } from '@/types/affiliate'
import { cn } from '@/lib/utils'

interface AffiliateRedirectButtonProps {
  url: string
  platform: AffiliatePlatform
  productId: string
  className?: string
  variant?: 'primary' | 'outline'
}

export function AffiliateRedirectButton({
  url,
  platform,
  productId,
  className,
  variant = 'primary'
}: AffiliateRedirectButtonProps) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleRedirect = async () => {
    setIsRedirecting(true)
    
    // Simuler un appel API de tracking
    console.log(`[TRACKING] Click detected for product ${productId} on platform ${platform}`)
    await new Promise(resolve => setTimeout(resolve, 800)) // Délai UX pour montrer le tracking
    
    // Ouverture sécurisée
    window.open(url, '_blank', 'noopener,noreferrer,nofollow')
    
    setIsRedirecting(false)
  }

  const platformIcons = {
    AMAZON: ShoppingBag,
    ALIBABA: Box,
    DIRECT: Zap
  }

  const Icon = platformIcons[platform]

  return (
    <button
      onClick={handleRedirect}
      disabled={isRedirecting}
      className={cn(
        "group relative flex items-center justify-center gap-2 w-full py-4 rounded-xl font-black uppercase tracking-wider transition-all duration-300 overflow-hidden",
        variant === 'primary' 
          ? "bg-gradient-to-r from-yellow-500 to-orange-600 text-black shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:scale-105 active:scale-95"
          : "border-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10 hover:scale-105 active:scale-95",
        isRedirecting && "opacity-80 cursor-wait",
        className
      )}
    >
      {isRedirecting ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Redirection Sécurisée...</span>
        </>
      ) : (
        <>
          <Icon className="h-5 w-5" />
          <span>Acheter au meilleur prix</span>
          <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
        </>
      )}

      {/* Gloss effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
    </button>
  )
}
