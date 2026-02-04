import { useEffect, useMemo, useState } from 'react';
import { initGA, setConsent, getConsent } from '../lib/analytics/ga';

type ConsentChoice = 'unknown' | 'accepted' | 'declined';

export function ConsentBanner() {
  const [choice, setChoice] = useState<ConsentChoice>('unknown');
  const measurementId = useMemo(() => import.meta.env.VITE_GA_MEASUREMENT_ID || '', []);

  useEffect(() => {
    const existing = getConsent();
    if (existing) {
      setChoice(existing.analytics ? 'accepted' : 'declined');
      if (existing.analytics) {
        initGA(measurementId);
      }
    }
  }, [measurementId]);

  if (choice !== 'unknown') return null;

  const accept = () => {
    setConsent({ analytics: true });
    setChoice('accepted');
    initGA(measurementId);
  };

  const decline = () => {
    setConsent({ analytics: false });
    setChoice('declined');
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white/95 backdrop-blur p-4 shadow-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-700">
            <p className="font-semibold text-gray-900">Cookies & mesure d’audience</p>
            <p className="mt-1">
              Nous utilisons Google Analytics uniquement avec votre consentement, afin d’améliorer
              l’expérience.
            </p>
          </div>

          <div className="flex gap-2 md:shrink-0">
            <button
              type="button"
              onClick={decline}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-50 transition"
            >
              Refuser
            </button>
            <button
              type="button"
              onClick={accept}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
