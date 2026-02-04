'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeId, adminThemes } from '@/config/admin-themes';

interface ThemeContextType {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'agrilogistic_admin_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentThemeState] = useState<ThemeId>('cyber');

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as ThemeId;
    if (savedTheme && adminThemes[savedTheme]) {
      setTheme(savedTheme);
    } else {
      setTheme('cyber'); // Default
    }
  }, []);

  const setTheme = (theme: ThemeId) => {
    const colors = adminThemes[theme];
    const root = document.documentElement;

    // 1. Sync State
    setCurrentThemeState(theme);

    // 2. Persist
    localStorage.setItem(STORAGE_KEY, theme);

    // 3. Apply Data Attribute for CSS Selectors if needed
    root.setAttribute('data-theme', theme);

    // 4. Apply CSS Variables for Dynamic Styling
    root.style.setProperty('--admin-bg', colors.background);
    root.style.setProperty('--admin-bg-secondary', colors.backgroundSecondary);
    root.style.setProperty('--admin-text', colors.textPrimary);
    root.style.setProperty('--admin-text-secondary', colors.textSecondary);
    root.style.setProperty('--admin-accent', colors.accent);
    root.style.setProperty('--admin-accent-foreground', colors.accentForeground);
    root.style.setProperty('--admin-border', colors.border);
    root.style.setProperty('--admin-ring', colors.ring);

    // Helper for RGB if needed (for radial gradients or transparency)
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : null;
    };
    const rgbAccent = hexToRgb(colors.accent);
    if (rgbAccent) root.style.setProperty('--admin-accent-rgb', rgbAccent);

    const rgbBg = hexToRgb(colors.background);
    if (rgbBg) root.style.setProperty('--admin-bg-rgb', rgbBg);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
