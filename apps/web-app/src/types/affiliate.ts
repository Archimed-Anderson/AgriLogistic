/**
 * AFFILIATE TYPES - Module Affiliation Hub
 * 
 * Types et interfaces pour la plateforme d'affiliation AgriLogistic
 * Plateformes supportées: Amazon, Alibaba, Vente Directe
 */

// ============================================================================
// ENUMS & TYPES
// ============================================================================

export type AffiliatePlatform = 'AMAZON' | 'ALIBABA' | 'DIRECT'

export type AffiliateCategory = 
  | 'OUTILLAGE'              // Outils manuels et électriques
  | 'ELECTRONIQUE'           // Capteurs, stations météo, contrôleurs
  | 'GROS_EQUIPEMENTS'       // Pompes, moteurs, générateurs

export type Currency = 'EUR' | 'USD'

// ============================================================================
// MAIN INTERFACE
// ============================================================================

export interface AffiliateProduct {
  // Identification
  id: string
  name: string
  slug: string
  category: AffiliateCategory
  platform: AffiliatePlatform
  
  // Pricing
  price: number
  originalPrice?: number        // Prix avant réduction
  discount?: number             // Pourcentage de réduction
  currency: Currency
  commission: number            // Pourcentage de commission (5-15%)
  
  // Content
  description: string           // Description complète HTML/Markdown
  shortDescription: string      // Résumé 1-2 lignes
  images: string[]             // 3-6 images HD (URLs Unsplash ou produit)
  
  // Features & Details
  features: string[]           // 5-8 features principales
  pros: string[]               // 3-5 avantages
  cons: string[]               // 2-3 inconvénients
  specifications: Record<string, string>  // Specs techniques key-value
  
  // Affiliate Links
  affiliateUrl: string         // URL de redirection avec tracking
  trackingId?: string          // ID tracking spécifique plateforme
  
  // SEO
  seo: {
    title: string              // Titre SEO optimisé
    metaDescription: string    // Meta description 150-160 chars
    keywords: string[]         // Mots-clés principaux
  }
  
  // Metadata
  rating: number               // Note /5
  reviewCount: number          // Nombre d'avis
  inStock: boolean            // Disponibilité
  createdAt: string           // ISO 8601
  updatedAt: string           // ISO 8601
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface AffiliateStats {
  totalProducts: number
  byPlatform: {
    amazon: number
    alibaba: number
    direct: number
  }
  byCategory: {
    outillage: number
    electronique: number
    grosEquipements: number
  }
  totalCommission: number
  averageRating: number
}

export interface AffiliateFilters {
  category?: AffiliateCategory | 'ALL'
  platform?: AffiliatePlatform | 'ALL'
  priceRange?: [number, number]
  inStockOnly?: boolean
  minRating?: number
}

export type SortOption = 
  | 'price-asc' 
  | 'price-desc' 
  | 'commission-desc' 
  | 'rating-desc' 
  | 'name-asc'
