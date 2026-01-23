export function TrustSection() {
  const partners = [
    { name: 'BioFrais', logo: '/images/partners/biofrais.png', delay: '0ms' },
    { name: 'AgriTech', logo: '/images/partners/agritech.png', delay: '100ms' },
    { name: 'GreenLog', logo: '/images/partners/greenlog.png', delay: '200ms' },
    { name: 'EcoFerme', logo: '/images/partners/ecoferme.png', delay: '300ms' },
    { name: 'TransExpress', logo: '/images/partners/transexpress.png', delay: '400ms' },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-xl font-bold leading-9 text-slate-700 mb-12 animate-fade-in-up">
          Ils propulsent leur croissance avec AgroLogistic
        </h2>
        <div className="mx-auto grid max-w-lg grid-cols-2 items-center gap-x-12 gap-y-16 sm:max-w-xl sm:grid-cols-3 sm:gap-x-16 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {partners.map((partner) => (
            <div 
              key={partner.name}
              className="relative col-span-1 flex justify-center group"
              style={{ animationDelay: partner.delay }}
            >
              <div className="relative h-20 w-44 sm:h-24 sm:w-56 transition-transform duration-300 ease-in-out transform group-hover:scale-110">
                <img
                  className="absolute inset-0 h-full w-full object-contain filter grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                  src={partner.logo}
                  alt={partner.name}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Styles Inline (if not in global css) */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
