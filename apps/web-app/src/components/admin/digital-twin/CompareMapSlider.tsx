'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CompareMapSliderProps {
  leftLabel: string;
  rightLabel: string;
  leftChildren: React.ReactNode;
  rightChildren: React.ReactNode;
}

export function CompareMapSlider({
  leftLabel,
  rightLabel,
  leftChildren,
  rightChildren,
}: CompareMapSliderProps) {
  const [split, setSplit] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    const el = document.querySelector('[data-compare-container]');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
    setSplit(x);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => handleMove(e.clientX);
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, handleMove]);

  return (
    <div
      data-compare-container
      className="relative w-full h-full overflow-hidden select-none"
    >
      {/* BOTTOM: 2023 (gauche) */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 opacity-90" style={{ filter: 'sepia(0.3)' }}>
          {leftChildren}
        </div>
        <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-slate-950/90 backdrop-blur border border-amber-500/30 rounded-lg">
          <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">
            {leftLabel}
          </span>
        </div>
      </div>

      {/* TOP: 2024 (droite) - clip-path révèle la partie droite */}
      <div
        className="absolute inset-0 z-[2]"
        style={{ clipPath: `inset(0 0 0 ${split}%)` }}
      >
        <div className="absolute inset-0">{rightChildren}</div>
        <div className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-slate-950/90 backdrop-blur border border-emerald-500/30 rounded-lg">
          <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">
            {rightLabel}
          </span>
        </div>
      </div>

      {/* DIVIDER DRAGGABLE */}
      <div
        className={cn(
          'absolute top-0 bottom-0 w-2 cursor-col-resize z-[10] flex items-center justify-center -ml-1',
          isDragging && 'bg-emerald-500/20'
        )}
        style={{ left: `${split}%` }}
        onMouseDown={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
      >
        <div className="w-1 h-20 rounded-full bg-white/90 group-hover:bg-emerald-500 transition-colors shadow-xl hover:scale-110" />
      </div>

      {/* LABEL CENTRE */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-slate-950/90 backdrop-blur border border-white/10 rounded-xl pointer-events-none">
        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
          Glisser pour comparer Avant / Après
        </span>
      </div>
    </div>
  );
}
