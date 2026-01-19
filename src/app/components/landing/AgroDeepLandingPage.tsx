import { lazy, Suspense } from 'react';
import HeroSection from './sections/HeroSection';
import StorySection from './sections/StorySection';
import ServicesSection from './sections/ServicesSection';
import PracticesSection from './sections/PracticesSection';
import ContactSection from './sections/ContactSection';
import FooterSection from './sections/FooterSection';

// Lazy load non-critical sections pour optimiser le chargement initial
const ProjectsSection = lazy(() => import('./sections/ProjectsSection'));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'));
const BlogSection = lazy(() => import('./sections/BlogSection'));

interface AgroLogisticLandingPageProps {
  onNavigate: (route: string) => void;
}

// Loading component optimisé
const LoadingFallback = () => (
  <div className="py-20 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export function AgroLogisticLandingPage({ onNavigate }: AgroLogisticLandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Critical sections - Above the fold, loaded immediately */}
      <HeroSection onNavigate={onNavigate} />
      <StorySection />
      <ServicesSection />
      <PracticesSection />

      {/* Non-critical sections - Lazy loaded pour optimiser le First Contentful Paint */}
      <Suspense fallback={<LoadingFallback />}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <BlogSection />
      </Suspense>

      {/* Contact and Footer - Important but below the fold */}
      <ContactSection />
      <FooterSection onNavigate={onNavigate} />
    </div>
  );
}
