'use client';

import { useEffect } from 'react';
import { useAdminThemeStore } from '@/store/adminThemeStore';

export function AdminThemeInitializer() {
  const { currentTheme, setTheme } = useAdminThemeStore();

  useEffect(() => {
    // Re-apply theme on mount/hydration
    setTheme(currentTheme);
  }, [currentTheme, setTheme]);

  return null;
}
