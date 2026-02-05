'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-white">
      <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
      <p className="text-slate-400">Désolé, cette page a rencontré un problème.</p>
      <button
        type="button"
        className="rounded bg-emerald-500 px-6 py-3 font-bold text-white hover:bg-emerald-600"
        onClick={() => reset()}
      >
        Réessayer
      </button>
    </div>
  );
}
