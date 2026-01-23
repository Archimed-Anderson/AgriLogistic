import { useState, FormEvent } from 'react';
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  User,
  Shield,
  Truck,
  ShoppingCart,
  Zap,
} from 'lucide-react';
import { useLogin } from '@presentation/hooks/use-login';
import { useFormValidation } from '@presentation/hooks/use-form-validation';
import { useCSRFToken } from '@presentation/hooks/use-csrf-token';
import { setSecureCookie, getCookie } from '@presentation/utils/cookie';
import { getErrorMessage } from '@presentation/utils/auth-messages';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Checkbox } from '@components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';

type ProfileType = 'admin' | 'farmer' | 'buyer' | 'transporter';

interface ProfileConfig {
  id: ProfileType;
  label: string;
  description: string;
  icon: typeof User;
  gradient: string;
  bgColor: string;
  selectedColor: string;
  testEmail: string;
  testPassword: string;
}

// Configuration des profils avec emails pré-remplis pour tests
const PROFILES: ProfileConfig[] = [
  {
    id: 'admin',
    label: 'Administrateur',
    description: 'Gestion complète de la plateforme',
    icon: Shield,
    gradient: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100',
    selectedColor: 'bg-purple-100 border-purple-500 ring-2 ring-purple-500/20',
    testEmail: 'admin@agrologistic.com',
    testPassword: 'Admin@123',
  },
  {
    id: 'farmer',
    label: 'Agriculteur',
    description: 'Vente directe de vos produits',
    icon: User,
    gradient: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 border-green-200 hover:border-green-400 hover:bg-green-100',
    selectedColor: 'bg-green-100 border-green-500 ring-2 ring-green-500/20',
    testEmail: 'farmer@agrologistic.com',
    testPassword: 'Farmer@123',
  },
  {
    id: 'buyer',
    label: 'Acheteur',
    description: 'Achetez des produits de qualité',
    icon: ShoppingCart,
    gradient: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100',
    selectedColor: 'bg-blue-100 border-blue-500 ring-2 ring-blue-500/20',
    testEmail: 'buyer@agrologistic.com',
    testPassword: 'Buyer@123',
  },
  {
    id: 'transporter',
    label: 'Transporteur',
    description: 'Services de transport logistique',
    icon: Truck,
    gradient: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50 border-orange-200 hover:border-orange-400 hover:bg-orange-100',
    selectedColor: 'bg-orange-100 border-orange-500 ring-2 ring-orange-500/20',
    testEmail: 'transporter@agrologistic.com',
    testPassword: 'Transport@123',
  },
];

interface ProfileSelectorLoginProps {
  onSuccess: () => void;
  onForgotPassword: () => void;
  onSwitchToRegister: () => void;
}

export function ProfileSelectorLogin({
  onSuccess,
  onForgotPassword,
  onSwitchToRegister,
}: ProfileSelectorLoginProps) {
  const { login, isLoading, error: loginError } = useLogin();
  const { validateField, validateAll, errors, clearErrors } = useFormValidation(false);
  useCSRFToken();

  // Step management: 'select' or 'login'
  const [step, setStep] = useState<'select' | 'login'>('select');
  const [selectedProfile, setSelectedProfile] = useState<ProfileConfig | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Form state
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
  const [quickLoginLoading, setQuickLoginLoading] = useState(false);

  const handleProfileSelect = (profile: ProfileConfig) => {
    setIsTransitioning(true);
    setSelectedProfile(profile);
    
    // Pre-fill email for the selected profile
    if (!getCookie('rememberMe_email')) {
      setEmail(profile.testEmail);
    }
    
    setTimeout(() => {
      setStep('login');
      setIsTransitioning(false);
    }, 200);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep('select');
      setSelectedProfile(null);
      setPassword('');
      setFieldErrors({});
      clearErrors();
      setIsTransitioning(false);
    }, 200);
  };

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

  const performLogin = async (emailToUse: string, passwordToUse: string) => {
    try {
      // Password is sent in clear over HTTPS; server hashes with bcrypt
      await login({ email: emailToUse, password: passwordToUse });

      if (rememberMe) {
        setSecureCookie('rememberMe', 'true', { maxAge: 30 });
        setSecureCookie('rememberMe_email', emailToUse, { maxAge: 30 });
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();
    setFieldErrors({});

    const formData = { email, password };
    if (!validateAll(formData)) {
      setFieldErrors(errors);
      return;
    }

    await performLogin(email, password);
  };

  // Quick login with pre-filled credentials (mock mode)
  const handleQuickLogin = async () => {
    if (!selectedProfile) return;
    
    setQuickLoginLoading(true);
    setFieldErrors({});
    
    try {
      await performLogin(selectedProfile.testEmail, selectedProfile.testPassword);
    } finally {
      setQuickLoginLoading(false);
    }
  };

  const displayError = fieldErrors.submit || loginError || '';
  const emailError = fieldErrors.email || errors.email;
  const passwordError = fieldErrors.password || errors.password;

  // Step 1: Profile Selection
  if (step === 'select') {
    return (
      <Card className={`w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-green-600 shadow-lg">
              <span className="text-3xl font-bold text-white">A</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Bienvenue sur AgroLogistic</CardTitle>
          <CardDescription className="text-base">
            Sélectionnez votre profil pour vous connecter
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {PROFILES.map((profile) => {
              const Icon = profile.icon;
              return (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => handleProfileSelect(profile)}
                  className={`p-4 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${profile.bgColor}`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${profile.gradient} shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{profile.label}</h3>
                      <p className="text-xs text-gray-500 mt-1 leading-tight">{profile.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Pas encore de compte ? </span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary hover:underline font-medium transition-colors"
            >
              Créer un compte
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Step 2: Login Form with selected profile
  const ProfileIcon = selectedProfile?.icon || User;

  return (
    <Card className={`w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <CardHeader className="space-y-1 pb-4">
        {/* Back button and profile indicator */}
        <div className="flex items-center gap-3 mb-2">
          <button
            type="button"
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Retour à la sélection de profil"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-2 flex-1">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedProfile?.gradient}`}>
              <ProfileIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-gray-700">{selectedProfile?.label}</span>
          </div>
        </div>

        <CardTitle className="text-xl font-bold">Connexion {selectedProfile?.label}</CardTitle>
        <CardDescription>
          Entrez vos identifiants pour accéder à votre espace
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
            <Input
              id="login-email"
              name="email"
              type="email"
              placeholder={selectedProfile?.testEmail || 'exemple@agrologistic.com'}
              value={email}
              onChange={handleEmailChange}
              onBlur={() => validateField('email', email)}
              disabled={isLoading || quickLoginLoading}
              required
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'login-email-error' : undefined}
              className={emailError ? 'border-red-500 focus-visible:ring-red-500/20' : ''}
              autoComplete="email"
            />
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
                disabled={isLoading || quickLoginLoading}
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
                disabled={isLoading || quickLoginLoading}
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
              disabled={isLoading || quickLoginLoading}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Standard Login Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white h-11 text-base font-medium shadow-md transition-all disabled:opacity-50"
            disabled={isLoading || quickLoginLoading || !email || !password}
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

          {/* Quick Login Button (Mock mode) */}
          <Button
            type="button"
            variant="outline"
            onClick={handleQuickLogin}
            disabled={isLoading || quickLoginLoading}
            className={`w-full h-11 text-base font-medium border-2 transition-all ${selectedProfile?.bgColor.replace('hover:', '')}`}
          >
            {quickLoginLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Connexion rapide...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" aria-hidden="true" />
                Connexion rapide ({selectedProfile?.label})
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Mode démo : connexion rapide avec identifiants pré-configurés
          </p>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Pas encore de compte ? </span>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary hover:underline font-medium transition-colors"
            disabled={isLoading || quickLoginLoading}
          >
            Créer un compte
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
