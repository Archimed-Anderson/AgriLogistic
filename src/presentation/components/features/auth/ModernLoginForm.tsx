import { useState, FormEvent } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLogin } from '@presentation/hooks/use-login';
import { useFormValidation } from '@presentation/hooks/use-form-validation';
import { useCSRFToken } from '@presentation/hooks/use-csrf-token';
import { setSecureCookie, getCookie } from '@presentation/utils/cookie';
import { hashPassword } from '@presentation/utils/password-hash';
import { getErrorMessage } from '@presentation/utils/auth-messages';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Checkbox } from '@components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';

interface ModernLoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
  onSwitchToRegister: () => void;
}

export function ModernLoginForm({
  onSuccess,
  onForgotPassword,
  onSwitchToRegister,
}: ModernLoginFormProps) {
  const { login, isLoading, error: loginError } = useLogin();
  const { validateField, validateAll, errors, clearErrors } = useFormValidation(false);
  useCSRFToken();
  
  const [email, setEmail] = useState(() => {
    const rememberedEmail = getCookie('rememberMe_email');
    return rememberedEmail || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return getCookie('rememberMe') === 'true';
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    clearFieldError('email');
    validateField('email', value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    clearFieldError('password');
    validateField('password', value);
  };

  const clearFieldError = (fieldName: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();
    setFieldErrors({});

    const formData = { email, password };
    if (!validateAll(formData)) {
      setFieldErrors(errors);
      return;
    }

    try {
      let passwordToSend = password;
      try {
        passwordToSend = await hashPassword(password);
      } catch (hashError) {
        console.warn('Erreur lors du hachage côté client:', hashError);
      }

      await login({ email, password: passwordToSend });
      
      if (rememberMe) {
        setSecureCookie('rememberMe', 'true', { maxAge: 30 });
        setSecureCookie('rememberMe_email', email, { maxAge: 30 });
      } else {
        document.cookie = 'rememberMe=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'rememberMe_email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }

      onSuccess();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setFieldErrors({ submit: errorMessage });
    }
  };

  const displayError = fieldErrors.submit || loginError || '';
  const emailError = fieldErrors.email || errors.email;
  const passwordError = fieldErrors.password || errors.password;

  return (
    <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-green-600 shadow-lg">
            <span className="text-3xl font-bold text-white">A</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Bienvenue sur AgroLogistic</CardTitle>
        <CardDescription className="text-base">
          Connectez-vous à votre compte pour continuer
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {displayError && (
            <div
              className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400"
              role="alert"
              aria-live="assertive"
            >
              {displayError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="login-email" className="text-sm font-medium">
              Email
            </Label>
            <div className="relative">
              <Input
                id="login-email"
                name="email"
                type="email"
                placeholder="exemple@AgroLogistic.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => validateField('email', email)}
                disabled={isLoading}
                required
                aria-invalid={!!emailError}
                aria-describedby={emailError ? 'login-email-error' : undefined}
                className={emailError ? 'border-red-500 focus-visible:ring-red-500/20' : ''}
                autoComplete="email"
              />
            </div>
            {emailError && (
              <p id="login-email-error" className="text-xs text-red-600 dark:text-red-400" role="alert">
                {emailError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password" className="text-sm font-medium">
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => validateField('password', password)}
                disabled={isLoading}
                required
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? 'login-password-error' : undefined}
                className={passwordError ? 'border-red-500 focus-visible:ring-red-500/20 pr-10' : 'pr-10'}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {passwordError && (
              <p id="login-password-error" className="text-xs text-red-600 dark:text-red-400" role="alert">
                {passwordError}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={isLoading}
                aria-label="Se souvenir de moi"
              />
              <Label
                htmlFor="remember"
                className="text-sm text-muted-foreground cursor-pointer font-normal"
              >
                Se souvenir de moi
              </Label>
            </div>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-primary hover:underline font-medium transition-colors"
              disabled={isLoading}
            >
              Mot de passe oublié ?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white h-11 text-base font-medium shadow-md transition-all disabled:opacity-50"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Connexion en cours...
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Pas encore de compte ? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary hover:underline font-medium transition-colors"
            disabled={isLoading}
          >
            Créer un compte
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
