export type ThemeId = 'zinc' | 'slate' | 'indigo' | 'emerald' | 'cyber';

export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentForeground: string;
  border: string;
  ring: string;
}

export const adminThemes: Record<ThemeId, ThemeColors> = {
  zinc: {
    background: '#fafafa', // zinc-50
    backgroundSecondary: '#f4f4f5', // zinc-100
    textPrimary: '#09090b', // zinc-950
    textSecondary: '#52525b', // zinc-600
    accent: '#18181b', // zinc-900
    accentForeground: '#ffffff',
    border: '#e4e4e7', // zinc-200
    ring: '#71717a', // zinc-500
  },
  slate: {
    background: '#f8fafc', // slate-50
    backgroundSecondary: '#f1f5f9', // slate-100
    textPrimary: '#0f172a', // slate-900
    textSecondary: '#475569', // slate-600
    accent: '#334155', // slate-700
    accentForeground: '#ffffff',
    border: '#e2e8f0', // slate-200
    ring: '#64748b', // slate-500
  },
  indigo: {
    background: '#f5f3ff', // indigo-50
    backgroundSecondary: '#ede9fe', // indigo-100
    textPrimary: '#1e1b4b', // indigo-950
    textSecondary: '#4f46e5', // indigo-600
    accent: '#4338ca', // indigo-700
    accentForeground: '#ffffff',
    border: '#ddd6fe', // indigo-200
    ring: '#818cf8', // indigo-400
  },
  emerald: {
    background: '#ecfdf5', // emerald-50
    backgroundSecondary: '#d1fae5', // emerald-100
    textPrimary: '#064e3b', // emerald-950
    textSecondary: '#059669', // emerald-600
    accent: '#047857', // emerald-700
    accentForeground: '#ffffff',
    border: '#a7f3d0', // emerald-200
    ring: '#34d399', // emerald-400
  },
  cyber: {
    background: '#020617', // slate-950
    backgroundSecondary: '#0f172a', // slate-900
    textPrimary: '#e2e8f0', // slate-200
    textSecondary: '#94a3b8', // slate-400
    accent: '#10b981', // emerald-500
    accentForeground: '#020617',
    border: '#1e293b', // slate-800
    ring: '#10b981', // emerald-500
  },
};
