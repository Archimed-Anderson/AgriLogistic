import { useEffect } from 'react';
import { HeroSection } from './sections/HeroSection';
import { ServicesSection } from './sections/ServicesSection';
import { StatsSection } from './sections/StatsSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { ContactSection } from './sections/ContactSection';
import { TrustSection } from './sections/TrustSection';
import FooterSection from './sections/FooterSection';

interface AgroLogisticRedesignedProps {
  onNavigate: (route: string) => void;
}

export function AgroLogisticRedesigned({ onNavigate }: AgroLogisticRedesignedProps) {
  // Smooth scroll behavior for internal links
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col font-sans">
      <main className="flex-grow">
        <HeroSection onNavigate={onNavigate} />
        <TrustSection />
        <ServicesSection />
        <StatsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <FooterSection onNavigate={onNavigate} />
    </div>
  );
}
