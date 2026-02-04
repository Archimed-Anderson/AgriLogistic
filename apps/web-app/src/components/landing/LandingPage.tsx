import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from './HeroSection';
import { SolutionsGrid } from './SolutionsGrid';
import { ProductsShowcase } from './ProductsShowcase';
import { SocialProof } from './SocialProof';
import { BentoFeatures } from './BentoFeatures';
import { PerformanceInnovation } from './PerformanceInnovation';
import { ProfileTabs } from './ProfileTabs';
import { FAQSection } from './FAQSection';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <Navbar />

      <main className="pt-16">
        <HeroSection />
        <SolutionsGrid />
        <ProductsShowcase />
        <SocialProof />
        <BentoFeatures />
        <PerformanceInnovation />
        <ProfileTabs />
        <FAQSection />
      </main>

      <Footer />
    </div>
  );
}
