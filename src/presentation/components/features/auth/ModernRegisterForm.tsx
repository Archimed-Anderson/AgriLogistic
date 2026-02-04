import { useState, FormEvent } from 'react';
import { Eye, EyeOff, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@presentation/contexts/AuthContext';
import { useFormValidation } from '@presentation/hooks/use-form-validation';
import { useCSRFToken } from '@presentation/hooks/use-csrf-token';
import { AUTH_MESSAGES, getErrorMessage } from '@presentation/utils/auth-messages';
import { RegisterRequestDTO } from '@application/dto/request/register-request.dto';
import { UserRole } from '@domain/enums/user-role.enum';
import { PasswordStrength } from './PasswordStrength';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { toast } from 'sonner';

interface ModernRegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export function ModernRegisterForm({ onSuccess, onSwitchToLogin }: ModernRegisterFormProps) {
  const { register: authRegister, isLoading: authLoading } = useAuth();
  const { validateField, validateAll, errors, clearErrors } = useFormValidation(true);
  // CSRF token est automatiquement ajouté par api-client
  useCSRFToken();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldValidated, setFieldValidated] = useState<Record<string, boolean>>({});

  const isLoading = authLoading;

  const handleFieldChange = (fieldName: string, value: string, setter: (value: string) => void) => {
    setter(value);
    clearFieldError(fieldName);

    // Validation en temps réel
    if (fieldName === 'confirmPassword') {
      // Pour confirmPassword, on doit aussi vérifier password
      const passwordValue = password;
      validateField('password', passwordValue);
      validateField('confirmPassword', value);
    } else {
      validateField(fieldName, value);
    }

    // Marquer le champ comme validé après la première interaction
    if (value.trim() !== '') {
      setFieldValidated((prev) => ({ ...prev, [fieldName]: true }));
    }
  };

  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return fieldErrors[fieldName] || errors[fieldName];
  };

  const isFieldValid = (fieldName: string): boolean => {
    const value =
      fieldName === 'firstName'
        ? firstName
        : fieldName === 'lastName'
        ? lastName
        : fieldName === 'email'
        ? email
        : fieldName === 'password'
        ? password
        : fieldName === 'confirmPassword'
        ? confirmPassword
        : '';

    return !getFieldError(fieldName) && value.trim() !== '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearErrors();
    setFieldErrors({});

    // Validation complète
    const formData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    if (!validateAll(formData)) {
      setFieldErrors(errors);
      // Marquer tous les champs comme validés pour afficher les erreurs
      setFieldValidated({
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        confirmPassword: true,
      });
      return;
    }

    try {
      // Préparer les données pour l'inscription
      const registerData: RegisterRequestDTO = {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        phone: '+33600000000', // Requis par le DTO, valeur par défaut
        accountType: UserRole.BUYER, // Par défaut
        acceptTerms: true, // Requis pour soumettre
      };

      const response = await authRegister(registerData);
      if (response.verificationToken) {
        sessionStorage.setItem('email_verification_token', response.verificationToken);
      }
      sessionStorage.setItem('pending_verification_email', response.email);

      toast.success('Compte créé. Vérifiez votre email.', {
        description:
          'Un lien de vérification a été envoyé. En dev, utilisez le token pour vérifier.',
      });
      onSuccess();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setFieldErrors({ submit: errorMessage });
    }
  };

  const displayError = fieldErrors.submit || '';
  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    password.trim() !== '' &&
    confirmPassword.trim() !== '' &&
    Object.keys(errors).length === 0 &&
    Object.keys(fieldErrors).length === 0;

  return (
    <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-green-600 shadow-lg">
            <span className="text-3xl font-bold text-white">A</span>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
        <CardDescription className="text-base">
          Rejoignez la communauté AgroLogistic
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Message d'erreur général */}
          {displayError && (
            <div
              className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400"
              role="alert"
              aria-live="assertive"
            >
              {displayError}
            </div>
          )}

          {/* Prénom et Nom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="register-firstname" className="text-sm font-medium">
                Prénom *
              </Label>
              <div className="relative">
                <Input
                  id="register-firstname"
                  name="firstName"
                  type="text"
                  placeholder="Jean"
                  value={firstName}
                  onChange={(e) => handleFieldChange('firstName', e.target.value, setFirstName)}
                  onBlur={() => validateField('firstName', firstName)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!getFieldError('firstName')}
                  aria-describedby={
                    getFieldError('firstName') ? 'register-firstname-error' : undefined
                  }
                  className={
                    getFieldError('firstName')
                      ? 'border-red-500 focus-visible:ring-red-500/20 pr-8'
                      : 'pr-8'
                  }
                  autoComplete="given-name"
                />
                {fieldValidated.firstName && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isFieldValid('firstName') ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                    )}
                  </div>
                )}
              </div>
              {getFieldError('firstName') && (
                <p
                  id="register-firstname-error"
                  className="text-xs text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {getFieldError('firstName')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-lastname" className="text-sm font-medium">
                Nom *
              </Label>
              <div className="relative">
                <Input
                  id="register-lastname"
                  name="lastName"
                  type="text"
                  placeholder="Dupont"
                  value={lastName}
                  onChange={(e) => handleFieldChange('lastName', e.target.value, setLastName)}
                  onBlur={() => validateField('lastName', lastName)}
                  disabled={isLoading}
                  required
                  aria-invalid={!!getFieldError('lastName')}
                  aria-describedby={
                    getFieldError('lastName') ? 'register-lastname-error' : undefined
                  }
                  className={
                    getFieldError('lastName')
                      ? 'border-red-500 focus-visible:ring-red-500/20 pr-8'
                      : 'pr-8'
                  }
                  autoComplete="family-name"
                />
                {fieldValidated.lastName && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isFieldValid('lastName') ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                    )}
                  </div>
                )}
              </div>
              {getFieldError('lastName') && (
                <p
                  id="register-lastname-error"
                  className="text-xs text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {getFieldError('lastName')}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="register-email" className="text-sm font-medium">
              Email *
            </Label>
            <div className="relative">
              <Input
                id="register-email"
                name="email"
                type="email"
                placeholder="votre.email@example.com"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value, setEmail)}
                onBlur={() => validateField('email', email)}
                disabled={isLoading}
                required
                aria-invalid={!!getFieldError('email')}
                aria-describedby={getFieldError('email') ? 'register-email-error' : undefined}
                className={
                  getFieldError('email')
                    ? 'border-red-500 focus-visible:ring-red-500/20 pr-8'
                    : 'pr-8'
                }
                autoComplete="email"
              />
              {fieldValidated.email && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isFieldValid('email') ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                  )}
                </div>
              )}
            </div>
            {getFieldError('email') && (
              <p
                id="register-email-error"
                className="text-xs text-red-600 dark:text-red-400"
                role="alert"
              >
                {getFieldError('email')}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-sm font-medium">
              Mot de passe *
            </Label>
            <div className="relative">
              <Input
                id="register-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => handleFieldChange('password', e.target.value, setPassword)}
                onBlur={() => validateField('password', password)}
                disabled={isLoading}
                required
                aria-invalid={!!getFieldError('password')}
                aria-describedby={getFieldError('password') ? 'register-password-error' : undefined}
                className={
                  getFieldError('password')
                    ? 'border-red-500 focus-visible:ring-red-500/20 pr-10'
                    : 'pr-10'
                }
                autoComplete="new-password"
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
            {password && <PasswordStrength password={password} />}
            {getFieldError('password') && (
              <p
                id="register-password-error"
                className="text-xs text-red-600 dark:text-red-400"
                role="alert"
              >
                {getFieldError('password')}
              </p>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="register-confirm-password" className="text-sm font-medium">
              Confirmer le mot de passe *
            </Label>
            <div className="relative">
              <Input
                id="register-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) =>
                  handleFieldChange('confirmPassword', e.target.value, setConfirmPassword)
                }
                onBlur={() => validateField('confirmPassword', confirmPassword)}
                disabled={isLoading}
                required
                aria-invalid={!!getFieldError('confirmPassword')}
                aria-describedby={
                  getFieldError('confirmPassword') ? 'register-confirm-password-error' : undefined
                }
                className={
                  getFieldError('confirmPassword')
                    ? 'border-red-500 focus-visible:ring-red-500/20 pr-10'
                    : 'pr-10'
                }
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={
                  showConfirmPassword ? 'Masquer la confirmation' : 'Afficher la confirmation'
                }
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {getFieldError('confirmPassword') && (
              <p
                id="register-confirm-password-error"
                className="text-xs text-red-600 dark:text-red-400"
                role="alert"
              >
                {getFieldError('confirmPassword')}
              </p>
            )}
          </div>

          {/* Bouton de création */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white h-11 text-base font-medium shadow-md transition-all disabled:opacity-50"
            disabled={isLoading || !isFormValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Création en cours...
              </>
            ) : (
              'Créer mon compte'
            )}
          </Button>
        </form>

        {/* Lien vers connexion */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Vous avez déjà un compte ? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary hover:underline font-medium transition-colors"
            disabled={isLoading}
          >
            Se connecter
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
