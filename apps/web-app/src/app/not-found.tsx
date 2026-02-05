import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-slate-950 px-4 text-white">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-slate-400">Cette page n’existe pas.</p>
      <Link
        href="/"
        className="rounded bg-emerald-500 px-6 py-3 font-bold text-white hover:bg-emerald-600"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
