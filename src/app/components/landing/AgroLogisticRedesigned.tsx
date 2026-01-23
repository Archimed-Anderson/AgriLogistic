import { useEffect } from "react";
import { HeroSection } from "./sections/HeroSection";
import StorySection from "./sections/StorySection";
import ServicesSection from "./sections/ServicesSection";
import PracticesSection from "./sections/PracticesSection";
import ProjectsSection from "./sections/ProjectsSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import ContactSection from "./sections/ContactSection";
import { TrustSection } from "./sections/TrustSection"; // Partner Logos
import FooterSection from "./sections/FooterSection";

interface AgroLogisticRedesignedProps {
  onNavigate?: (route: string) => void;
}

export function AgroLogisticRedesigned({ onNavigate }: AgroLogisticRedesignedProps) {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.hash && anchor.hash.startsWith('#') && anchor.origin === window.location.origin) {
        e.preventDefault();
        const element = document.querySelector(anchor.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-green-100 selection:text-green-900">
      
      {/* Hero Section - Hybrid Layout */}
      <HeroSection onNavigate={onNavigate} />
      
      {/* Our Story / Vision */}
      <StorySection onNavigate={onNavigate} />
      
      {/* Services Grid - Clean Look */}
      <ServicesSection />
      
      {/* Sustainable Practices - Feature Highlight */}
      <PracticesSection onNavigate={onNavigate} />
      
      {/* Recent Projects - Gallery */}
      <ProjectsSection />
      
      {/* Testimonials & Feedback */}
      <TestimonialsSection />
      
      {/* Partner Logos */}
      <TrustSection />

      {/* Get In Touch - Contact Form */}
      <ContactSection onNavigate={onNavigate} />
      
      {/* Footer */}
      <FooterSection onNavigate={onNavigate} />
      
    </div>
  );
}
