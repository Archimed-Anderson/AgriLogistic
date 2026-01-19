import { useEffect } from 'react';
import { ModernAuthPage } from './ModernAuthPage';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

/**
 * Page de connexion - Redirige vers ModernAuthPage
 * Conservée pour compatibilité avec les routes existantes
 */
export function LoginPage({ onNavigate }: LoginPageProps) {
  // Rediriger vers la page d'authentification moderne
  useEffect(() => {
    // Optionnel: redirection automatique
    // Sinon, on peut simplement utiliser ModernAuthPage directement
  }, []);

  return <ModernAuthPage onNavigate={onNavigate} />;
}
