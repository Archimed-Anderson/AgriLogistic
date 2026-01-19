type ConsentState = {
  analytics: boolean;
  timestamp: number;
};

const CONSENT_KEY = 'AgroLogistic_consent_v1';

export function getConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (typeof parsed?.analytics !== 'boolean') return null;
    if (typeof parsed?.timestamp !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setConsent(next: { analytics: boolean }): void {
  const state: ConsentState = { analytics: next.analytics, timestamp: Date.now() };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics === true;
}

export function initGA(measurementId: string): void {
  // Ne charge jamais GA sans consentement explicite
  if (!hasAnalyticsConsent()) return;
  if (!measurementId) return;

  // Déjà initialisé
  if (window.__AgroLogistic_ga_initialized) return;
  window.__AgroLogistic_ga_initialized = true;

  // Charger la lib gtag
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);

  // Init gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = window.gtag || gtag;

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    send_page_view: false, // SPA: on gère nous-mêmes les pageviews
  });
}

export function trackPageView(measurementId: string, path: string): void {
  if (!hasAnalyticsConsent()) return;
  if (!measurementId) return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', 'page_view', {
    page_path: path,
  });
}

export function trackEvent(
  measurementId: string,
  name: string,
  params?: Record<string, unknown>
): void {
  if (!hasAnalyticsConsent()) return;
  if (!measurementId) return;
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', name, params || {});
}

