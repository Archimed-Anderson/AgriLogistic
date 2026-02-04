import { useState } from 'react';
import { useLogin } from '@presentation/hooks/use-login';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Checkbox } from '@components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';

interface LoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword, onRegister }: LoginFormProps) {
  const { login, isLoading } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      onSuccess();
    } catch (error) {
      // Error is handled by the hook (toast)
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2563eb]">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
        </div>
        <CardTitle className="text-2xl">Bienvenue sur AgroLogistic</CardTitle>
        <CardDescription>Connectez-vous à votre compte pour continuer</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@AgroLogistic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isLoading}
              />
              <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Se souvenir de moi
              </label>
            </div>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-[#2563eb] hover:underline"
              disabled={isLoading}
            >
              Mot de passe oublié ?
            </button>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Pas encore de compte ? </span>
          <button
            onClick={onRegister}
            className="text-[#2563eb] hover:underline font-medium"
            disabled={isLoading}
          >
            Créer un compte
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
