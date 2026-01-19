import { ArrowRight, TrendingUp, Shield, Globe, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const features = [
    {
      icon: TrendingUp,
      title: "Supply Chain Analytics",
      description: "Real-time insights into your agricultural supply chain performance"
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "End-to-end encryption for all your business transactions"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Connect with farmers, suppliers, and buyers worldwide"
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description: "Lightning-fast order processing and delivery tracking"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white">
        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Agricultural Supply Chain
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              AgroLogistic is a comprehensive SaaS platform that connects farmers, suppliers, and buyers in a seamless digital ecosystem.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => onNavigate("/register")}
                size="lg"
                className="bg-white text-[#2563eb] hover:bg-gray-100 px-8"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => onNavigate("/login")}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="200" cy="200" r="150" fill="currentColor" />
            <circle cx="300" cy="100" r="100" fill="currentColor" />
            <circle cx="100" cy="300" r="80" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose AgroLogistic?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides everything you need to streamline your agricultural supply chain operations
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="border-2 transition-all hover:border-[#2563eb] hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-4">
                    <Icon className="h-6 w-6 text-[#2563eb]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "$50M+", label: "Transactions" },
              { value: "150+", label: "Countries" },
              { value: "99.9%", label: "Uptime" }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-[#2563eb] mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of businesses already using AgroLogistic to optimize their agricultural supply chain
          </p>
          <Button
            onClick={() => onNavigate("/register")}
            size="lg"
            className="bg-white text-[#2563eb] hover:bg-gray-100 px-8"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb]">
                <span className="text-lg font-bold text-white">A</span>
              </div>
              <span className="text-lg font-bold">AgroLogistic</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 AgroLogistic. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
