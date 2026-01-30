import React from 'react';
import { cn } from '@/shared/lib/utils';

interface WidgetProps {
  title?: string;
  className?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

export function Widget({ title, className, headerAction, children }: WidgetProps) {
  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-5 shadow-2xl transition-all duration-300 hover:border-white/20",
      className
    )}>
      {(title || headerAction) && (
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-[0.85rem] font-semibold uppercase tracking-wider text-muted-foreground transition-colors group-hover:text-white">
              {title}
            </h3>
          )}
          {headerAction}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
