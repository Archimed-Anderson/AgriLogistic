import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@presentation/contexts/AuthContext';

interface VerifyEmailPageProps {
  onNavigate: (route: string) => void;
}

export function VerifyEmailPage({ onNavigate }: VerifyEmailPageProps) {
  const { verifyEmail, isLoading } = useAuth();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    try {
      const t = sessionStorage.getItem('email_verification_token') || '';
      const e = sessionStorage.getItem('pending_verification_email') || '';
      if (t) setToken(t);
      if (e) setEmail(e);
    } catch {
      // ignore
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) return;
    const ok = await verifyEmail(trimmed);
    if (ok) {
      toast.success('Email vérifié. Vous pouvez vous connecter.');
      onNavigate('/auth');
    } else {
      toast.error('Échec de vérification. Vérifiez le token et réessayez.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérifier votre email</h1>
        <p className="text-sm text-gray-600 mb-6">
          Entrez le token de vérification{email ? ` pour ${email}` : ''}.
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="token" className="block text-sm font-semibold text-gray-700 mb-2">
              Token de vérification
            </label>
            <input
              id="token"
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300"
              placeholder="Ex: AbcDef123..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Vérification...' : 'Vérifier'}
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
