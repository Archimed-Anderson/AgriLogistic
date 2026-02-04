'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminThemes, ThemeId } from '@/config/admin-themes';
import { useTheme } from '@/context/ThemeContext';

export function AdminThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/5 border border-white/10 hover:border-emerald-500/50 group"
        title="Personnaliser l'apparence"
        style={{ color: 'var(--admin-text-secondary)' }}
      >
        <Palette className="h-5 w-5 group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-56 z-50 p-5 bg-[#0a0c14]/95 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl"
              style={{
                backgroundColor: 'var(--admin-bg-secondary)',
                borderColor: 'var(--admin-border)',
              }}
            >
              <h3
                className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-center opacity-50"
                style={{ color: 'var(--admin-text)' }}
              >
                Sélecteur de Thème
              </h3>

              <div className="grid grid-cols-3 gap-4">
                {(Object.keys(adminThemes) as ThemeId[]).map((id) => {
                  const theme = adminThemes[id];
                  const isSelected = currentTheme === id;

                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setTheme(id);
                        setIsOpen(false);
                      }}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center shadow-lg relative',
                          isSelected ? 'scale-110' : 'hover:scale-105'
                        )}
                        style={{
                          backgroundColor: theme.background,
                          borderColor: isSelected ? theme.accent : 'rgba(255,255,255,0.05)',
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full shadow-md"
                          style={{ backgroundColor: theme.accent }}
                        />
                        {isSelected && (
                          <motion.div
                            layoutId="active-theme-check"
                            className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#0a0c14] shadow-sm"
                            style={{
                              backgroundColor: 'var(--admin-accent)',
                              borderColor: 'var(--admin-bg)',
                            }}
                          >
                            <Check
                              className="w-3 h-3"
                              style={{ color: 'var(--admin-accent-foreground)' }}
                            />
                          </motion.div>
                        )}
                      </div>
                      <span
                        className="text-[8px] font-black uppercase tracking-tight opacity-40 group-hover:opacity-100"
                        style={{ color: 'var(--admin-text)' }}
                      >
                        {id}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center gap-2"
                style={{ borderTopColor: 'var(--admin-border)' }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                  style={{ backgroundColor: 'var(--admin-accent)' }}
                />
                <span
                  className="text-[7px] font-black uppercase tracking-widest opacity-30"
                  style={{ color: 'var(--admin-text)' }}
                >
                  Live CSS Override Engaged
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
