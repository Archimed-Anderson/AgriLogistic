import { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '../../infrastructure/api/rest/api-client';
import { useCSRFToken } from '../hooks/use-csrf-token';

interface ForgotPasswordPageProps {
  onNavigate: (route: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  useCSRFToken();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/auth/forgot-password', { email: email.trim() });
      // Message générique (évite l’énumération d’emails)
      toast.success('Si ce compte existe, un code de réinitialisation a été envoyé.');
      onNavigate('/reset-password');
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de la demande. Réessayez plus tard.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mot de passe oublié</h1>
        <p className="text-sm text-gray-600 mb-6">
          Entrez votre email. Si un compte existe, vous recevrez un code de réinitialisation.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
              placeholder="votre@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Envoi...' : 'Envoyer le code'}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/auth')}
            className="w-full px-6 py-3 border border-gray-200 rounded-lg font-semibold text-gray-800 hover:bg-gray-50 transition"
          >
            Retour à la connexion
          </button>
        </form>
      </div>
    </div>
  );
}

