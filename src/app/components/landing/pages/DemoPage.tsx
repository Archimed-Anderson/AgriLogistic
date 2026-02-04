import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, BarChart3, Globe, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';
import FooterSection from '../sections/FooterSection';

interface DemoPageProps {
  onNavigate?: (route: string) => void;
}

export function DemoPage({ onNavigate }: DemoPageProps) {
  const [activeFeature, setActiveFeature] = useState('analytics');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, [activeFeature]);

  const features = [
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Smart Analytics',
      title: 'Real-time Farm Insights',
      description:
        'Visualize your crop health, water usage, and yield predictions in one centralized dashboard using AI-driven data.',
      stats: [
        { label: 'Yield Increase', value: '+35%' },
        { label: 'Water Saved', value: '1.2M L' },
        { label: 'Cost Reduction', value: '24%' },
      ],
      image: '/assets/images/landing/practice-yield-growth.png', // Reusing relevant asset
    },
    {
      id: 'marketplace',
      icon: Globe,
      label: 'B2B Marketplace',
      title: 'Direct Global Access',
      description:
        'Connect directly with verified buyers worldwide. Bypass middlemen and secure better prices for your produce with smart contracts.',
      stats: [
        { label: 'Active Buyers', value: '500+' },
        { label: 'Avg. ROI', value: '18%' },
        { label: 'Traceability', value: '100%' },
      ],
      image: '/assets/images/landing/story-fair-trade.png', // Reusing relevant asset
    },
    {
      id: 'logistics',
      icon: Truck,
      label: 'Smart Logistics',
      title: 'Optimized Supply Chain',
      description:
        'Track shipments in real-time, optimize routes automatically, and ensure cold-chain integrity from farm to table.',
      stats: [
        { label: 'On-time Delivery', value: '99.8%' },
        { label: 'Route Efficiency', value: '+40%' },
        { label: 'Co2 Reduced', value: '150T' },
      ],
      image: '/assets/images/landing/project-logistics.png', // Reusing relevant asset
    },
  ];

  const activeData = features.find((f) => f.id === activeFeature) || features[0];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar Placeholder for consistency if needed, or back button */}
      <div className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate?.('/')}>
          <img src="/assets/images/logo.png" alt="AgroLogistic" className="h-8 w-auto" />
          <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
            AgroLogistic
          </span>
        </div>
        <Button
          variant="ghost"
          className="text-slate-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => onNavigate?.('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      {/* Hero / Dashboard Simulator */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-green-900/5 -skew-y-3 transform origin-top-left z-0 h-[80%]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full border border-green-200 bg-white px-3 py-1 shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                Interactive Demo Environment
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl mb-6">
              Experience the Power of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                AgroLogistic Enterprise
              </span>
            </h1>
            <p className="text-lg text-slate-600">
              Explore our platform's capabilities in a live simulation. See how our integrated tools
              transform agricultural operations.
            </p>
          </div>

          {/* Interactive Interface */}
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
            <div className="grid lg:grid-cols-12 min-h-[600px]">
              {/* Sidebar Controls */}
              <div className="lg:col-span-3 bg-slate-50 border-r border-slate-100 p-6 flex flex-col gap-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                  Select Module
                </p>
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => {
                      setAnimate(false);
                      setTimeout(() => setActiveFeature(feature.id), 50);
                    }}
                    className={`w-full text-left px-4 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 ${
                      activeFeature === feature.id
                        ? 'bg-white shadow-md border border-green-100 text-green-700'
                        : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activeFeature === feature.id
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold">{feature.label}</span>
                  </button>
                ))}

                <div
                  className="mt-auto bg-green-900 rounded-xl p-4 text-white relative overflow-hidden group cursor-pointer"
                  onClick={() => onNavigate?.('/register')}
                >
                  <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="h-16 w-16" />
                  </div>
                  <p className="text-sm font-medium text-green-100 mb-1">Ready to start?</p>
                  <p className="font-bold text-lg mb-3">Get your plan</p>
                  <Button
                    size="sm"
                    className="w-full bg-white text-green-900 hover:bg-green-50 border-none"
                  >
                    View Pricing
                  </Button>
                </div>
              </div>

              {/* Main Viewport */}
              <div className="lg:col-span-9 p-8 lg:p-12 relative bg-white">
                <div
                  className={`transition-all duration-500 ease-out transform ${
                    animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-md text-sm font-medium">
                        <activeData.icon className="h-4 w-4" />
                        {activeData.label}
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900">{activeData.title}</h2>
                      <p className="text-slate-600 text-lg leading-relaxed">
                        {activeData.description}
                      </p>

                      <div className="grid grid-cols-3 gap-4 pt-6">
                        {activeData.stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center"
                          >
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-xs text-slate-500 font-medium uppercase mt-1">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6">
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 h-12 gap-2"
                          onClick={() => onNavigate?.('/register')}
                        >
                          Start Free Trial
                          <CheckCircle2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1 relative">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 aspect-[4/3] group">
                        <img
                          src={activeData.image}
                          alt={activeData.title}
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition-colors duration-500"></div>

                        {/* Floating UI Elements Simulator */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-lg shadow-lg flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          <span className="text-xs font-bold text-slate-700">Live Data</span>
                        </div>
                      </div>
                      {/* Decorative Elements */}
                      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-green-100 rounded-full blur-xl -z-10"></div>
                      <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-50 rounded-full blur-xl -z-10"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-16">
            Trusted by Industry Leaders
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
                <div className="flex text-yellow-400 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s}>★</span>
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">
                  "This platform has completely revolutionized how we manage our supply chain. The
                  analytics are game-changing."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                  <div>
                    <p className="font-bold text-slate-900">Sarah Johnson</p>
                    <p className="text-xs text-slate-500">CEO, Organic Valley</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection onNavigate={onNavigate} />
    </div>
  );
}
