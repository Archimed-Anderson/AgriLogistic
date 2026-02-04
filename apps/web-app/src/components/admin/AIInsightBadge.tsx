'use client';

import { Sparkles } from 'lucide-react';

interface AIInsightBadgeProps {
  insight: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function AIInsightBadge({ insight, variant = 'default' }: AIInsightBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-800';
      case 'warning':
        return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-800';
      case 'danger':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800';
      default:
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border-2 ${getVariantStyles()} backdrop-blur-sm`}
    >
      <div
        className={`p-2 rounded-xl ${
          variant === 'success'
            ? 'bg-emerald-500'
            : variant === 'warning'
              ? 'bg-orange-500'
              : variant === 'danger'
                ? 'bg-red-500'
                : 'bg-blue-500'
        } shadow-lg shrink-0`}
      >
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-wide mb-1 opacity-70">Analyse IA</p>
        <p className="text-sm font-bold leading-relaxed">{insight}</p>
      </div>
    </div>
  );
}
