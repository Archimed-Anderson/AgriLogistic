
export function StatsSection() {
  return (
    <section className="bg-slate-900 py-24 sm:py-32 relative overflow-hidden">
        {/* Background lattice/grid effect */}
        <div className="absolute inset-0 z-0 opacity-10" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
        </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-y-16 gap-x-8 text-center lg:grid-cols-3">
          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base leading-7 text-slate-400">Transactions sécurisées</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              2.5 M€
            </dd>
          </div>
          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base leading-7 text-slate-400">Utilisateurs actifs</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              15,000+
            </dd>
          </div>
          <div className="mx-auto flex max-w-xs flex-col gap-y-4">
            <dt className="text-base leading-7 text-slate-400">Pays couverts</dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              12
            </dd>
          </div>
        </div>
      </div>
    </section>
  );
}
