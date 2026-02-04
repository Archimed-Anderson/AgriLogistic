'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/validation/auth-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { RoleSelector } from './RoleSelector';
import { UserRole } from '@/types/auth';
import { signInEmail, signInSocial } from '@/app/actions/auth-actions';

export function LoginForm() {
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<UserRole | undefined>(UserRole.FARMER);
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  React.useEffect(() => {
    if (selectedRole) {
      setValue('role' as any, selectedRole);
    }
  }, [selectedRole, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    
    try {
      const result = await signInEmail(formData);
      if (!result.success) {
        setAuthError(result.error || "Une erreur est survenue lors de la connexion.");
      }
    } catch (error) {
      setAuthError("Une erreur inattendue est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInSocial("google");
      // signInSocial redirects on success; if we reach here without redirect it may be a failure
    } catch (error: unknown) {
      console.error("Google Sign In Error:", error);
      setAuthError(
        "Connexion Google non configurée. Veuillez utiliser Email/Mot de passe ou l'Accès Rapide."
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setAuthError(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Social Login */}
        <Button 
            variant="outline" 
            type="button" 
            className="w-full flex items-center gap-2"
            onClick={handleGoogleSignIn}
        >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                />
                <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                />
                <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                />
                <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                />
            </svg>
            Se connecter avec Google
        </Button>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou avec email</span>
            </div>
        </div>
      
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={handleKeyDown}
        className="space-y-5"
        noValidate
        aria-label="Formulaire de connexion"
      >
        {/* Message d'erreur global */}
        {authError && (
          <Alert
            variant="destructive"
            role="alert"
            className="animate-in fade-in-0 slide-in-from-top-1 border-destructive/50 bg-destructive/5"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-medium">{authError}</AlertDescription>
          </Alert>
        )}

        {/* Sélection du type de compte */}
        <RoleSelector
          value={selectedRole}
          onChange={setSelectedRole}
          error={!!(errors as any)?.role}
        />

        {/* Champ Email */}
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-sm font-semibold text-foreground">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="votre@email.com"
            icon={<Mail className="h-4 w-4" />}
            iconPosition="left"
            error={!!errors.email}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Champ Mot de passe */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
              Mot de passe
            </Label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-xs sm:text-sm font-medium text-primary hover:text-primary/80 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm"
            >
              Mot de passe oublié ?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            iconPosition="left"
            error={!!errors.password}
            aria-invalid={errors.password ? 'true' : 'false'}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
          {errors.password && (
            <p
              id="password-error"
              className="text-sm text-destructive animate-in fade-in-0 slide-in-from-top-1"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Bouton de soumission */}
        <div className="pt-2">
          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={isSubmitting || isLoading}
            aria-busy={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? (
              <>
                <LoadingSpinner size="sm" variant="default" />
                <span>Connexion en cours...</span>
              </>
            ) : (
              'Se connecter'
            )}
          </Button>
        </div>
      </form>
      </div>

      <ForgotPasswordForm open={showForgotPassword} onOpenChange={setShowForgotPassword} />
    </>
  );
}
