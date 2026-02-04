import { useState } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface StorySectionProps {
  onNavigate?: (route: string) => void;
}

const stories = [
  {
    id: 'default',
    title: '100% Organic',
    description: 'Certified Production',
    image: '/assets/images/landing/story-innovation.png',
    route: '/story/innovation', // Or loop back to top/default
    isDefault: true,
  },
  {
    id: 'eco',
    title: 'Eco-Friendly Practices',
    description: 'Supporting sustainable farming methods that protect our soil and water.',
    image: '/assets/images/landing/story-eco-practices.png',
    route: '/story/eco-practices',
  },
  {
    id: 'fair',
    title: 'Fair Trade Marketplace',
    description: 'Ensuring farmers get the best price for their hard work without intermediaries.',
    image: '/assets/images/landing/story-fair-trade.png',
    route: '/story/fair-trade',
  },
];

export default function StorySection({ onNavigate }: StorySectionProps) {
  const [activeStory, setActiveStory] = useState(stories[0]);

  const handleMouseEnter = (storyId: string) => {
    const story = stories.find((s) => s.id === storyId);
    if (story) setActiveStory(story);
  };

  const handleMouseLeave = () => {
    // Optionally reset to default or keep last hovered.
    // Keeping last hovered feels smoother usually, or reset to 'default' if preferred.
    // Let's keep the last hovered for now, or reset to default if user hovers out of main area?
    // User request: "hover over the cards to see impact".
    // Usually resetting to main image is good for "Our Story" context.
    setActiveStory(stories[0]);
  };

  return (
    <section id="story" className="py-24 bg-slate-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Images Composition */}
          <div className="relative group perspective-1000">
            <div className="aspect-[4/3] w-full bg-slate-200 rounded-2xl overflow-hidden shadow-xl transform transition-transform duration-700 group-hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60"></div>
              <img
                src={activeStory.image}
                alt={activeStory.title}
                className="w-full h-full object-cover transition-opacity duration-500"
                key={activeStory.image} // Key change forces fade effect if handled by css animation, or just src replacement
              />
              {/* Text Overlay for Image */}
              <div className="absolute bottom-6 left-6 z-20 text-white">
                <p className="font-bold text-xl">{activeStory.title}</p>
                {activeStory.isDefault && (
                  <p className="text-sm text-slate-200">Revolutionizing Agriculture</p>
                )}
              </div>
            </div>

            {/* Floating Badge (Only show on default or relevant state) */}
            <div
              className={`absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-2xl max-w-xs border border-green-100 hidden sm:block transition-all duration-300 ${
                activeStory.id === 'default'
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-green-100 rounded-full text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">100% Organic</p>
                  <p className="text-sm text-slate-500">Certified Production</p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-green-500/10 rounded-full blur-2xl"></div>
          </div>

          {/* Right Content */}
          <div>
            <span className="text-green-600 font-semibold tracking-wide uppercase text-sm">
              Our Story
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
              Empowering Agriculture through Innovation
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Founded with a vision to revolutionize the agricultural supply chain, AgroLogistic
              bridges the gap between traditional farming and modern technology. We believe in a
              future where every harvest is optimized, traceable, and profitable.
            </p>

            <div className="space-y-4">
              {/* Eco-Friendly Practices Item */}
              <div
                className="flex gap-4 p-4 rounded-xl transition-all cursor-pointer hover:bg-white hover:shadow-md border border-transparent hover:border-green-100 group"
                onMouseEnter={() => handleMouseEnter('eco')}
                onMouseLeave={handleMouseLeave}
                onClick={() => onNavigate && onNavigate('/story/eco-practices')}
              >
                <div className="flex-none p-2 bg-green-50 rounded-lg h-fit group-hover:bg-green-100 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    Eco-Friendly Practices
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-green-500 transition-opacity" />
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Supporting sustainable farming methods that protect our soil and water.
                  </p>
                </div>
              </div>

              {/* Fair Trade Marketplace Item */}
              <div
                className="flex gap-4 p-4 rounded-xl transition-all cursor-pointer hover:bg-white hover:shadow-md border border-transparent hover:border-green-100 group"
                onMouseEnter={() => handleMouseEnter('fair')}
                onMouseLeave={handleMouseLeave}
                onClick={() => onNavigate && onNavigate('/story/fair-trade')}
              >
                <div className="flex-none p-2 bg-green-50 rounded-lg h-fit group-hover:bg-green-100 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    Fair Trade Marketplace
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-green-500 transition-opacity" />
                  </h3>
                  <p className="text-slate-500 mt-1">
                    Ensuring farmers get the best price for their hard work without intermediaries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
