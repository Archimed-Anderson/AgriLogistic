import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { ImpersonationBanner } from '@/app/components/ui/ImpersonationBanner';

export default function AdminLayout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <ImpersonationBanner />
        <Toaster position="bottom-right" richColors />
        <Sidebar />
        <Header />
        <main className="pl-20 pt-[70px]">
          <div className="h-[calc(100vh-70px)] overflow-y-auto p-4 md:p-8 bg-[radial-gradient(circle_at_50%_0%,var(--primary-glow)_0%,transparent_70%)] transition-colors duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
