import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl p-10">
      <div className="rounded-2xl border border-[#EEF2F7] bg-white p-8 shadow-sm">
        <div className="text-2xl font-semibold text-gray-900">Page introuvable</div>
        <p className="mt-2 text-sm text-gray-600">
          La page demandée n’existe pas (ou a été déplacée).
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            to="/"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Retour à l’accueil
          </Link>
          <Link
            to="/auth"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

