
export function TrustSection() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 text-slate-900">
          Ils propulsent leur croissance avec AgroLogistic
        </h2>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
           {/* Placeholder logos - using text or placeholder images if available, using text for now to be safe or generating svgs? Text is boring. I'll use simple SVGs with inline shapes for "fake" logos */}
           
           <div className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 flex justify-center items-center opacity-70 grayscale hover:grayscale-0 transition-all font-bold text-xl text-slate-800">
             <span className="text-green-600 mr-1">Bio</span>Frais
           </div>
           
           <div className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 flex justify-center items-center opacity-70 grayscale hover:grayscale-0 transition-all font-bold text-xl text-slate-800">
             Agri<span className="text-blue-600">Tech</span>
           </div>
           
           <div className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 flex justify-center items-center opacity-70 grayscale hover:grayscale-0 transition-all font-bold text-xl text-slate-800">
             Green<span className="font-light">Log</span>
           </div>
           
           <div className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 flex justify-center items-center opacity-70 grayscale hover:grayscale-0 transition-all font-bold text-xl text-slate-800">
             <span className="text-amber-500">Eco</span>Ferme
           </div>
           
           <div className="col-span-2 max-h-12 w-full object-contain lg:col-span-1 flex justify-center items-center opacity-70 grayscale hover:grayscale-0 transition-all font-bold text-xl text-slate-800">
             Trans<span className="text-purple-600">Express</span>
           </div>

        </div>
      </div>
    </section>
  );
}
