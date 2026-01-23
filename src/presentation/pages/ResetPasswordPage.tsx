import { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '../../infrastructure/api/rest/api-client';
import { useCSRFToken } from '../hooks/use-csrf-token';

interface ResetPasswordPageProps {
  onNavigate: (route: string) => void;
}

export function ResetPasswordPage({ onNavigate }: ResetPasswordPageProps) {
  useCSRFToken();

  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }
    setIsSubmitting(true);
    try {
      // New auth-service: /api/v1/auth/password-reset/confirm
      await apiClient.post('/auth/password-reset/confirm', { token: token.trim(), new_password: password });
      toast.success('Mot de passe mis à jour. Vous pouvez vous connecter.');
      onNavigate('/auth');
    } catch (err: any) {
      toast.error(err?.message || 'Erreur lors de la réinitialisation. Vérifiez le code et réessayez.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Réinitialiser le mot de passe</h1>
        <p className="text-sm text-gray-600 mb-6">
          Saisissez le code reçu par email et votre nouveau mot de passe.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-semibold text-gray-700 mb-2">
              Code de réinitialisation
            </label>
            <input
              id="token"
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
              placeholder="Ex: 4f1a2b3c..."
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('/forgot-password')}
            className="w-full px-6 py-3 border border-gray-200 rounded-lg font-semibold text-gray-800 hover:bg-gray-50 transition"
          >
            Retour
          </button>
        </form>
      </div>
    </div>
  );
}

