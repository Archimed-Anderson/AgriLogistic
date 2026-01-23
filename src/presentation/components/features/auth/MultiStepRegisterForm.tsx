import { useState, FormEvent } from 'react';
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Building2,
  Truck,
  ShoppingCart,
  Shield,
} from 'lucide-react';
import { useAuth } from '@presentation/contexts/AuthContext';
import { useCSRFToken } from '@presentation/hooks/use-csrf-token';
import { getErrorMessage } from '@presentation/utils/auth-messages';
import { RegisterRequestDTO } from '@application/dto/request/register-request.dto';
import { UserRole } from '@domain/enums/user-role.enum';
import { BusinessType } from '@domain/enums/business-type.enum';
import { FarmerSpecialization, LogisticsSpecialization } from '@domain/enums/specialization.enum';
import { PasswordStrength } from './PasswordStrength';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Checkbox } from '@components/ui/checkbox';
import { toast } from 'sonner';

interface MultiStepRegisterFormProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

// Configuration des types de comptes avec leurs caractéristiques
const ACCOUNT_TYPES = [
  {
    role: UserRole.FARMER,
    label: 'Agriculteur',
    description: 'Vendez vos produits directement aux acheteurs',
    icon: User,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-50 border-green-200 hover:border-green-400',
    selectedColor: 'bg-green-100 border-green-500 ring-2 ring-green-500/20',
  },
  {
    role: UserRole.BUYER,
    label: 'Acheteur',
    description: 'Achetez des produits agricoles de qualité',
    icon: ShoppingCart,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50 border-blue-200 hover:border-blue-400',
    selectedColor: 'bg-blue-100 border-blue-500 ring-2 ring-blue-500/20',
  },
  {
    role: UserRole.TRANSPORTER,
    label: 'Transporteur',
    description: 'Proposez vos services de transport logistique',
    icon: Truck,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50 border-orange-200 hover:border-orange-400',
    selectedColor: 'bg-orange-100 border-orange-500 ring-2 ring-orange-500/20',
  },
  {
    role: UserRole.ADMIN,
    label: 'Administrateur',
    description: 'Gérez la plateforme (réservé aux gestionnaires)',
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50 border-purple-200 hover:border-purple-400',
    selectedColor: 'bg-purple-100 border-purple-500 ring-2 ring-purple-500/20',
  },
];

const BUSINESS_TYPES = [
  { value: BusinessType.INDIVIDUAL, label: 'Entrepreneur Individuel' },
  { value: BusinessType.FAMILY_FARM, label: 'Exploitation Familiale' },
  { value: BusinessType.COOPERATIVE, label: 'Coopérative Agricole' },
  { value: BusinessType.SARL, label: 'SARL' },
  { value: BusinessType.SAS, label: 'SAS' },
  { value: BusinessType.SA, label: 'Société Anonyme' },
  { value: BusinessType.OTHER, label: 'Autre' },
];

const FARMER_SPECIALIZATIONS = [
  { value: FarmerSpecialization.CEREALS, label: 'Céréales' },
  { value: FarmerSpecialization.VEGETABLES, label: 'Légumes' },
  { value: FarmerSpecialization.FRUITS, label: 'Fruits' },
  { value: FarmerSpecialization.LIVESTOCK, label: 'Élevage' },
  { value: FarmerSpecialization.DAIRY, label: 'Produits Laitiers' },
  { value: FarmerSpecialization.VITICULTURE, label: 'Viticulture' },
  { value: FarmerSpecialization.ORGANIC, label: 'Agriculture Biologique' },
  { value: FarmerSpecialization.POULTRY, label: 'Volaille' },
  { value: FarmerSpecialization.MIXED, label: 'Polyculture-Élevage' },
  { value: FarmerSpecialization.OTHER, label: 'Autre' },
];

const LOGISTICS_SPECIALIZATIONS = [
  { value: LogisticsSpecialization.REFRIGERATED, label: 'Transport Frigorifique' },
  { value: LogisticsSpecialization.DRY_GOODS, label: 'Marchandises Sèches' },
  { value: LogisticsSpecialization.BULK, label: 'Transport en Vrac' },
  { value: LogisticsSpecialization.PERISHABLES, label: 'Denrées Périssables' },
  { value: LogisticsSpecialization.LIVESTOCK_TRANSPORT, label: "Transport d'Animaux" },
  { value: LogisticsSpecialization.MULTIMODAL, label: 'Transport Multimodal' },
  { value: LogisticsSpecialization.OTHER, label: 'Autre' },
];

// Validation helpers
const validateEmail = (email: string): string | null => {
  if (!email || email.trim() === '') return "L'email est requis";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format d'email invalide";
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password || password.trim() === '') return 'Le mot de passe est requis';
  if (password.length < 8) return 'Minimum 8 caractères';
  if (!/[a-z]/.test(password)) return 'Au moins une minuscule requise';
  if (!/[A-Z]/.test(password)) return 'Au moins une majuscule requise';
  if (!/[0-9]/.test(password)) return 'Au moins un chiffre requis';
  if (!/[^a-zA-Z0-9]/.test(password)) return 'Au moins un caractère spécial requis';
  return null;
};

const validatePhone = (phone: string): string | null => {
  if (!phone || phone.trim() === '') return 'Le téléphone est requis';
  // Format français ou international
  if (!/^(\+33|0)[1-9](\d{8}|\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2})$/.test(phone.replace(/\s/g, ''))) {
    return 'Format de téléphone invalide';
  }
  return null;
};

const validateName = (name: string, field: string): string | null => {
  if (!name || name.trim() === '') return `Le ${field} est requis`;
  if (name.trim().length < 2) return `Minimum 2 caractères pour le ${field}`;
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) return `${field} invalide`;
  return null;
};

export function MultiStepRegisterForm({ onSuccess, onSwitchToLogin }: MultiStepRegisterFormProps) {
  const { register: authRegister, isLoading: authLoading } = useAuth();
  useCSRFToken();

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form data
  const [accountType, setAccountType] = useState<UserRole>(UserRole.BUYER);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Business fields
  const [businessType, setBusinessType] = useState<BusinessType>(BusinessType.INDIVIDUAL);
  const [farmSize, setFarmSize] = useState('');
  const [farmerSpecialization, setFarmerSpecialization] = useState<FarmerSpecialization>(
    FarmerSpecialization.OTHER
  );
  const [logisticsSpecialization, setLogisticsSpecialization] = useState<LogisticsSpecialization>(
    LogisticsSpecialization.OTHER
  );

  // Terms
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // UI state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 1:
        // Account type is always valid (one is always selected)
        break;

      case 2:
        {
          const firstNameErr = validateName(firstName, 'prénom');
          if (firstNameErr) errors.firstName = firstNameErr;

          const lastNameErr = validateName(lastName, 'nom');
          if (lastNameErr) errors.lastName = lastNameErr;

          const emailErr = validateEmail(email);
          if (emailErr) errors.email = emailErr;

          const phoneErr = validatePhone(phone);
          if (phoneErr) errors.phone = phoneErr;

          const passwordErr = validatePassword(password);
          if (passwordErr) errors.password = passwordErr;

          if (password !== confirmPassword) {
            errors.confirmPassword = 'Les mots de passe ne correspondent pas';
          }
          break;
        }

      case 3:
        // Business information - conditional validation
        if (accountType === UserRole.FARMER) {
          if (!farmSize || parseFloat(farmSize) <= 0) {
            errors.farmSize = "La taille de l'exploitation est requise";
          }
        }
        break;

      case 4:
        if (!acceptTerms) {
          errors.acceptTerms = "Vous devez accepter les conditions d'utilisation";
        }
        break;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateStep(currentStep)) return;

    setIsLoading(true);

    try {
      // Build registration data
      const registerData: RegisterRequestDTO = {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        phone,
        accountType,
        businessType,
        acceptTerms,
        newsletterSubscribed,
      };

      // Add role-specific fields
      if (accountType === UserRole.FARMER) {
        registerData.farmSize = parseFloat(farmSize) || 0;
        registerData.farmerSpecialization = farmerSpecialization;
      }

      if (accountType === UserRole.TRANSPORTER) {
        registerData.logisticsSpecialization = logisticsSpecialization;
      }

      // Log for debugging
      console.log('📝 Registration data:', {
        ...registerData,
        password: '[HIDDEN]',
        confirmPassword: '[HIDDEN]',
      });

      const resp = await authRegister(registerData);
      if (resp.verificationToken) {
        sessionStorage.setItem('email_verification_token', resp.verificationToken);
      }
      sessionStorage.setItem('pending_verification_email', resp.email);

      toast.success(`Bienvenue ${firstName} !`, {
        description: `Votre compte ${ACCOUNT_TYPES.find((t) => t.role === accountType)
          ?.label} a été créé avec succès.`,
        duration: 5000,
      });

      onSuccess();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setFieldErrors({ submit: errorMessage });
      toast.error("Erreur lors de l'inscription", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Choisissez votre profil';
      case 2:
        return 'Informations personnelles';
      case 3:
        return 'Informations professionnelles';
      case 4:
        return 'Finalisation';
      default:
        return '';
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className={`flex items-center ${step < totalSteps ? 'flex-1' : ''}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step < currentStep
                ? 'bg-primary text-white'
                : step === currentStep
                ? 'bg-primary text-white ring-4 ring-primary/20'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {step < currentStep ? <CheckCircle2 className="w-4 h-4" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`h-1 flex-1 mx-2 rounded ${
                step < currentStep ? 'bg-primary' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground mb-6">
        Sélectionnez le type de compte qui correspond à votre activité
      </p>
      <div className="grid grid-cols-1 gap-3">
        {ACCOUNT_TYPES.map(({ role, label, description, icon: Icon, bgColor, selectedColor }) => (
          <button
            key={role}
            type="button"
            onClick={() => setAccountType(role)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              accountType === role ? selectedColor : bgColor
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${ACCOUNT_TYPES.find(
                  (t) => t.role === role
                )?.color}`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{label}</h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              </div>
              {accountType === role && (
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      {/* Name fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reg-firstname">Prénom *</Label>
          <Input
            id="reg-firstname"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              clearFieldError('firstName');
            }}
            placeholder="Jean"
            className={fieldErrors.firstName ? 'border-red-500' : ''}
            autoComplete="given-name"
          />
          {fieldErrors.firstName && <p className="text-xs text-red-600">{fieldErrors.firstName}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg-lastname">Nom *</Label>
          <Input
            id="reg-lastname"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              clearFieldError('lastName');
            }}
            placeholder="Dupont"
            className={fieldErrors.lastName ? 'border-red-500' : ''}
            autoComplete="family-name"
          />
          {fieldErrors.lastName && <p className="text-xs text-red-600">{fieldErrors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="reg-email">Email *</Label>
        <Input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError('email');
          }}
          placeholder="votre.email@example.com"
          className={fieldErrors.email ? 'border-red-500' : ''}
          autoComplete="email"
        />
        {fieldErrors.email && <p className="text-xs text-red-600">{fieldErrors.email}</p>}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="reg-phone">Téléphone *</Label>
        <Input
          id="reg-phone"
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            clearFieldError('phone');
          }}
          placeholder="+33 6 12 34 56 78"
          className={fieldErrors.phone ? 'border-red-500' : ''}
          autoComplete="tel"
        />
        {fieldErrors.phone && <p className="text-xs text-red-600">{fieldErrors.phone}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="reg-password">Mot de passe *</Label>
        <div className="relative">
          <Input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError('password');
            }}
            placeholder="••••••••"
            className={fieldErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {password && <PasswordStrength password={password} />}
        {fieldErrors.password && <p className="text-xs text-red-600">{fieldErrors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="reg-confirm-password">Confirmer le mot de passe *</Label>
        <div className="relative">
          <Input
            id="reg-confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearFieldError('confirmPassword');
            }}
            placeholder="••••••••"
            className={fieldErrors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {fieldErrors.confirmPassword && (
          <p className="text-xs text-red-600">{fieldErrors.confirmPassword}</p>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-gray-50 border">
        <p className="text-sm text-gray-600">
          <span className="font-medium">
            {ACCOUNT_TYPES.find((t) => t.role === accountType)?.label}
          </span>{' '}
          - Informations spécifiques à votre activité
        </p>
      </div>

      {/* Business Type */}
      <div className="space-y-2">
        <Label htmlFor="reg-business-type">Type d'entreprise</Label>
        <select
          id="reg-business-type"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value as BusinessType)}
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          {BUSINESS_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Farmer-specific fields */}
      {accountType === UserRole.FARMER && (
        <>
          <div className="space-y-2">
            <Label htmlFor="reg-farm-size">Taille de l'exploitation (hectares) *</Label>
            <Input
              id="reg-farm-size"
              type="number"
              min="0"
              step="0.1"
              value={farmSize}
              onChange={(e) => {
                setFarmSize(e.target.value);
                clearFieldError('farmSize');
              }}
              placeholder="Ex: 25.5"
              className={fieldErrors.farmSize ? 'border-red-500' : ''}
            />
            {fieldErrors.farmSize && <p className="text-xs text-red-600">{fieldErrors.farmSize}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-farmer-spec">Spécialisation</Label>
            <select
              id="reg-farmer-spec"
              value={farmerSpecialization}
              onChange={(e) => setFarmerSpecialization(e.target.value as FarmerSpecialization)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              {FARMER_SPECIALIZATIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {/* Transporter-specific fields */}
      {accountType === UserRole.TRANSPORTER && (
        <div className="space-y-2">
          <Label htmlFor="reg-logistics-spec">Spécialisation logistique</Label>
          <select
            id="reg-logistics-spec"
            value={logisticsSpecialization}
            onChange={(e) => setLogisticsSpecialization(e.target.value as LogisticsSpecialization)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            {LOGISTICS_SPECIALIZATIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Buyer-specific message */}
      {accountType === UserRole.BUYER && (
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-800">
            En tant qu'acheteur, vous aurez accès au marketplace et pourrez passer des commandes
            auprès des agriculteurs partenaires.
          </p>
        </div>
      )}

      {/* Admin-specific message */}
      {accountType === UserRole.ADMIN && (
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
          <p className="text-sm text-purple-800">
            ⚠️ Le compte administrateur nécessite une validation manuelle par notre équipe. Vous
            recevrez un email de confirmation une fois votre compte activé.
          </p>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      {/* Summary */}
      <div className="p-4 rounded-lg bg-gray-50 border space-y-3">
        <h3 className="font-semibold text-gray-900">Récapitulatif</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-500">Type de compte:</span>
          <span className="font-medium">
            {ACCOUNT_TYPES.find((t) => t.role === accountType)?.label}
          </span>

          <span className="text-gray-500">Nom complet:</span>
          <span className="font-medium">
            {firstName} {lastName}
          </span>

          <span className="text-gray-500">Email:</span>
          <span className="font-medium">{email}</span>

          <span className="text-gray-500">Téléphone:</span>
          <span className="font-medium">{phone}</span>

          {accountType === UserRole.FARMER && farmSize && (
            <>
              <span className="text-gray-500">Exploitation:</span>
              <span className="font-medium">{farmSize} hectares</span>
            </>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="accept-terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => {
              setAcceptTerms(checked === true);
              clearFieldError('acceptTerms');
            }}
            className={fieldErrors.acceptTerms ? 'border-red-500' : ''}
          />
          <label
            htmlFor="accept-terms"
            className="text-sm text-gray-600 leading-tight cursor-pointer"
          >
            J'accepte les{' '}
            <a href="/terms" className="text-primary hover:underline" target="_blank">
              conditions générales d'utilisation
            </a>{' '}
            et la{' '}
            <a href="/privacy" className="text-primary hover:underline" target="_blank">
              politique de confidentialité
            </a>
            {' *'}
          </label>
        </div>
        {fieldErrors.acceptTerms && (
          <p className="text-xs text-red-600 ml-7">{fieldErrors.acceptTerms}</p>
        )}

        <div className="flex items-start space-x-3">
          <Checkbox
            id="newsletter"
            checked={newsletterSubscribed}
            onCheckedChange={(checked) => setNewsletterSubscribed(checked === true)}
          />
          <label
            htmlFor="newsletter"
            className="text-sm text-gray-600 leading-tight cursor-pointer"
          >
            Je souhaite recevoir les actualités et offres exclusives d'AgroLogistic
          </label>
        </div>
      </div>

      {/* Submit error */}
      {fieldErrors.submit && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {fieldErrors.submit}
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full max-w-lg shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-green-600 shadow-lg">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
        </div>
        <CardTitle className="text-xl font-bold">{getStepTitle()}</CardTitle>
        <CardDescription>
          Étape {currentStep} sur {totalSteps}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-4">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                Suivant
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !acceptTerms}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  'Créer mon compte'
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Switch to login */}
        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Déjà un compte ? </span>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary hover:underline font-medium"
            disabled={isLoading}
          >
            Se connecter
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
