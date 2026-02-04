'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-950 text-white">
          <h2 className="text-2xl font-bold">Une erreur critique est survenue</h2>
          <p className="text-slate-400">Désolé, l'application a rencontré un problème inattendu.</p>
          <button
            className="rounded bg-emerald-500 px-4 py-2 font-bold text-white hover:bg-emerald-600"
            onClick={() => reset()}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
