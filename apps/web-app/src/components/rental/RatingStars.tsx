'use client'

import { Star, StarHalf } from 'lucide-react'

interface RatingStarsProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
}

export function RatingStars({ rating, size = 'md', showNumber = true }: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  
  const iconSize = sizeClasses[size]
  
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  
  return (
    <div className="flex items-center gap-1">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className={`${iconSize} fill-yellow-400 text-yellow-400`} />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <StarHalf className={`${iconSize} fill-yellow-400 text-yellow-400`} />
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className={`${iconSize} text-slate-300`} />
      ))}
      
      {/* Rating number */}
      {showNumber && (
        <span className="text-sm font-bold text-slate-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
