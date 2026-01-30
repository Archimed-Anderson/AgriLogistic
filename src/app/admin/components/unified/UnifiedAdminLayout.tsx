import React from 'react';
import { Outlet } from 'react-router-dom';
import { UnifiedSidebar } from './UnifiedSidebar';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/shared/providers/ThemeProvider';
import { ImpersonationBanner } from '@/app/components/ui/ImpersonationBanner';

export default function UnifiedAdminLayout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        <ImpersonationBanner />
        <Toaster position="bottom-right" richColors />
        
        {/* Top Navigation */}


        <div className="flex flex-1 overflow-hidden">
          {/* Side Navigation (Consolidated) */}
          <UnifiedSidebar />

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
             <div className="p-6 md:p-8 xl:p-10 max-w-[1920px] mx-auto min-h-full">
                <Outlet />
             </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
