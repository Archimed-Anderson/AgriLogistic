import { useState, useEffect } from 'react';
import { useAuth } from '@presentation/contexts/AuthContext';
import { ProfileSelectorLogin } from '../components/features/auth/ProfileSelectorLogin';
import { MultiStepRegisterForm } from '../components/features/auth/MultiStepRegisterForm';
import { AuthTransition } from '../components/features/auth/AuthTransition';

interface ModernAuthPageProps {
  onNavigate: (path: string) => void;
}

export function ModernAuthPage({ onNavigate }: ModernAuthPageProps) {
  const { isAuthenticated, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated && user) {
      // Rediriger selon le rôle
      const role = user.role?.toLowerCase();
      if (role === 'admin') {
        onNavigate('/admin/overview');
      } else if (role === 'farmer' || role === 'buyer') {
        onNavigate('/customer/overview');
      } else if (role === 'transporter') {
        onNavigate('/customer/overview');
      } else {
        onNavigate('/admin/overview');
      }
    }
  }, [isAuthenticated, user, onNavigate]);

  const handleSwitchMode = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsTransitioning(false);
    }, 150);
  };

  const handleLoginSuccess = () => {
    // La redirection sera gérée par le useEffect ci-dessus
    // ou onNavigate sera appelé depuis le contexte
  };

  const handleRegisterSuccess = () => {
    // Rediriger vers le dashboard après inscription réussie
    onNavigate('/admin/overview');
  };

  const handleForgotPassword = () => {
    onNavigate('/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50 dark:from-emerald-950 dark:via-green-950 dark:to-lime-950">
      {/* Background décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-lime-200/30 dark:bg-lime-800/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-200/20 dark:bg-green-800/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-md">
        {/* Toggle Login/Signup */}
        <div className="mb-6 flex items-center justify-center">
          <div className="inline-flex items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg p-1 shadow-lg border border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => !isLogin && handleSwitchMode()}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isLogin
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              aria-pressed={isLogin}
              aria-label="Mode connexion"
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => isLogin && handleSwitchMode()}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                !isLogin
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              aria-pressed={!isLogin}
              aria-label="Mode inscription"
            >
              Inscription
            </button>
          </div>
        </div>

        {/* Formulaire avec transition */}
        <AuthTransition isLogin={isLogin}>
          {isTransitioning ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : isLogin ? (
            <ProfileSelectorLogin
              onSuccess={handleLoginSuccess}
              onForgotPassword={handleForgotPassword}
              onSwitchToRegister={handleSwitchMode}
            />
          ) : (
            <MultiStepRegisterForm
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={handleSwitchMode}
            />
          )}
        </AuthTransition>
      </div>

      {/* Styles pour animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
