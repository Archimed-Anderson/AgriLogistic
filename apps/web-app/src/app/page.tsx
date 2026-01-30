import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { HeroSection } from "@/components/landing/HeroSection"
import { SolutionsGrid } from "@/components/landing/SolutionsGrid"
import { ProductsShowcase } from "@/components/landing/ProductsShowcase"
import { SocialProof } from "@/components/landing/SocialProof"
import { BentoFeatures } from "@/components/landing/BentoFeatures"
import { ProfileTabs } from "@/components/landing/ProfileTabs"
import { FAQSection } from "@/components/landing/FAQSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <Navbar />

      <main className="pt-16">
        {/* Dynamic sections based on the Cropin model */}
        <HeroSection />
        <SolutionsGrid />
        <ProductsShowcase />
        <SocialProof />
        
        {/* Feature-rich sections */}
        <BentoFeatures />
        
        {/* Engagement sections */}
        <ProfileTabs />
        <FAQSection />
      </main>

      <Footer />
    </div>
  )
}
