import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeId, adminThemes } from '@/config/admin-themes';

interface AdminThemeStore {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export const useAdminThemeStore = create<AdminThemeStore>()(
  persist(
    (set) => ({
      currentTheme: 'cyber', // Default theme as seen in previous steps
      setTheme: (theme) => {
        const colors = adminThemes[theme];
        const root = document.documentElement;

        // Apply CSS Variables
        root.style.setProperty('--admin-bg', colors.background);
        root.style.setProperty('--admin-bg-secondary', colors.backgroundSecondary);
        root.style.setProperty('--admin-text', colors.textPrimary);
        root.style.setProperty('--admin-text-secondary', colors.textSecondary);
        root.style.setProperty('--admin-accent', colors.accent);
        root.style.setProperty('--admin-accent-foreground', colors.accentForeground);
        root.style.setProperty('--admin-border', colors.border);
        root.style.setProperty('--admin-ring', colors.ring);

        set({ currentTheme: theme });
      },
    }),
    {
      name: 'admin-theme-storage',
    }
  )
);
