import { useRegister, RegistrationStep } from '@presentation/hooks/use-register';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Checkbox } from '@components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { Progress } from '@components/ui/progress';
import { UserRole } from '@domain/enums/user-role.enum';
import { BusinessType } from '@domain/enums/business-type.enum';
import { FarmerSpecialization, LogisticsSpecialization } from '@domain/enums/specialization.enum';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface RegisterFormProps {
  onSuccess: () => void;
  onLogin: () => void;
}

export function RegisterForm({ onSuccess, onLogin }: RegisterFormProps) {
  const {
    currentStep,
    isLoading,
    error,
    step1Data,
    step2Data,
    step3Data,
    nextStep,
    previousStep,
    updateStepData,
    register,
    canGoNext,
    canGoPrevious,
    isLastStep,
  } = useRegister();

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = calculatePasswordStrength(step1Data.password);

  const getStrengthLabel = (): string => {
    if (passwordStrength <= 25) return 'Faible';
    if (passwordStrength <= 50) return 'Moyen';
    if (passwordStrength <= 75) return 'Bon';
    return 'Excellent';
  };

  const getStrengthColor = (): string => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLastStep) {
      try {
        await register();
        onSuccess();
      } catch (error) {
        // Error is handled by the hook
      }
    } else {
      nextStep();
    }
  };

  const getStepTitle = (): string => {
    switch (currentStep) {
      case 1:
        return 'Créez votre compte';
      case 2:
        return 'Informations personnelles';
      case 3:
        return 'Conditions d\'utilisation';
      default:
        return '';
    }
  };

  const getStepDescription = (): string => {
    switch (currentStep) {
      case 1:
        return 'Commençons par vos identifiants de connexion';
      case 2:
        return 'Parlez-nous un peu de vous';
      case 3:
        return 'Dernière étape avant de rejoindre AgroLogistic';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#2563eb]">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
        </div>
        <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
        <CardDescription>{getStepDescription()}</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Étape {currentStep} sur 3</span>
            <span className="text-sm text-muted-foreground">
              {currentStep === 1 && 'Compte'}
              {currentStep === 2 && 'Profil'}
              {currentStep === 3 && 'Finalisation'}
            </span>
          </div>
          <Progress value={(currentStep / 3) * 100} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-3">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                  step < currentStep
                    ? 'bg-green-500 text-white'
                    : step === currentStep
                    ? 'bg-[#2563eb] text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step < currentStep ? <Check className="h-4 w-4" /> : step}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Account Credentials */}
          {currentStep === 1 && (
            <Step1Form
              data={step1Data}
              onChange={(data) => updateStepData(1, data)}
              passwordStrength={passwordStrength}
              getStrengthLabel={getStrengthLabel}
              getStrengthColor={getStrengthColor}
              isLoading={isLoading}
            />
          )}

          {/* Step 2: Profile Information */}
          {currentStep === 2 && (
            <Step2Form
              data={step2Data}
              onChange={(data) => updateStepData(2, data)}
              isLoading={isLoading}
            />
          )}

          {/* Step 3: Terms and Preferences */}
          {currentStep === 3 && (
            <Step3Form
              data={step3Data}
              onChange={(data) => updateStepData(3, data)}
              isLoading={isLoading}
              onLogin={onLogin}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {canGoPrevious && (
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                disabled={isLoading}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}
            
            <Button
              type="submit"
              disabled={!canGoNext || isLoading}
              className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8]"
            >
              {isLoading ? (
                'En cours...'
              ) : isLastStep ? (
                'Créer mon compte'
              ) : (
                <>
                  Continuer
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Sign In Link */}
        {currentStep === 1 && (
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Vous avez déjà un compte ? </span>
            <button
              onClick={onLogin}
              className="text-[#2563eb] hover:underline font-medium"
              disabled={isLoading}
            >
              Se connecter
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Step 1 Component
interface Step1FormProps {
  data: any;
  onChange: (data: any) => void;
  passwordStrength: number;
  getStrengthLabel: () => string;
  getStrengthColor: () => string;
  isLoading: boolean;
}

function Step1Form({ data, onChange, passwordStrength, getStrengthLabel, getStrengthColor, isLoading }: Step1FormProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre.email@example.com"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe *</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={data.password}
          onChange={(e) => onChange({ password: e.target.value })}
          required
          disabled={isLoading}
        />
        {data.password && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Force du mot de passe :</span>
              <span
                className={`font-medium ${
                  passwordStrength <= 25
                    ? 'text-red-500'
                    : passwordStrength <= 50
                    ? 'text-orange-500'
                    : passwordStrength <= 75
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              >
                {getStrengthLabel()}
              </span>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${passwordStrength}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={data.confirmPassword}
          onChange={(e) => onChange({ confirmPassword: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>
    </>
  );
}

// Step 2 Component - Profile Information with Dynamic Fields
interface Step2FormProps {
  data: any;
  onChange: (data: any) => void;
  isLoading: boolean;
}

function Step2Form({ data, onChange, isLoading }: Step2FormProps) {
  const accountTypeLabels = {
    [UserRole.FARMER]: 'Agriculteur / Producteur',
    [UserRole.BUYER]: 'Acheteur / Distributeur',
    [UserRole.TRANSPORTER]: 'Transporteur / Logisticien',
  };

  const businessTypeLabels = {
    [BusinessType.SA]: 'Société Anonyme (SA)',
    [BusinessType.SAS]: 'Société par Actions Simplifiée (SAS)',
    [BusinessType.SARL]: 'Société à Responsabilité Limitée (SARL)',
    [BusinessType.FAMILY_FARM]: 'Exploitation Familiale',
    [BusinessType.COOPERATIVE]: 'Coopérative Agricole',
    [BusinessType.INDIVIDUAL]: 'Entrepreneur Individuel',
    [BusinessType.OTHER]: 'Autre',
  };

  const farmerSpecializationLabels = {
    [FarmerSpecialization.CEREALS]: 'Céréales',
    [FarmerSpecialization.VEGETABLES]: 'Légumes',
    [FarmerSpecialization.FRUITS]: 'Fruits',
    [FarmerSpecialization.LIVESTOCK]: 'Élevage',
    [FarmerSpecialization.DAIRY]: 'Produits Laitiers',
    [FarmerSpecialization.VITICULTURE]: 'Viticulture',
    [FarmerSpecialization.ORGANIC]: 'Agriculture Biologique',
    [FarmerSpecialization.POULTRY]: 'Volaille',
    [FarmerSpecialization.MIXED]: 'Polyculture-Élevage',
    [FarmerSpecialization.OTHER]: 'Autre',
  };

  const logisticsSpecializationLabels = {
    [LogisticsSpecialization.REFRIGERATED]: 'Transport Frigorifique',
    [LogisticsSpecialization.DRY_GOODS]: 'Marchandises Sèches',
    [LogisticsSpecialization.BULK]: 'Transport en Vrac',
    [LogisticsSpecialization.PERISHABLES]: 'Denrées Périssables',
    [LogisticsSpecialization.HAZMAT]: 'Matières Dangereuses',
    [LogisticsSpecialization.LIVESTOCK_TRANSPORT]: 'Transport d\'Animaux',
    [LogisticsSpecialization.MULTIMODAL]: 'Transport Multimodal',
    [LogisticsSpecialization.OTHER]: 'Autre',
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom *</Label>
          <Input
            id="firstName"
            placeholder="Jean"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom *</Label>
          <Input
            id="lastName"
            placeholder="Dupont"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+33 6 12 34 56 78"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          required
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Format international requis (ex: +33612345678)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="accountType">Type de compte *</Label>
        <Select
          value={data.accountType}
          onValueChange={(value) => onChange({ accountType: value as UserRole })}
          disabled={isLoading}
        >
          <SelectTrigger id="accountType">
            <SelectValue placeholder="Sélectionnez votre type de compte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.FARMER}>{accountTypeLabels[UserRole.FARMER]}</SelectItem>
            <SelectItem value={UserRole.BUYER}>{accountTypeLabels[UserRole.BUYER]}</SelectItem>
            <SelectItem value={UserRole.TRANSPORTER}>{accountTypeLabels[UserRole.TRANSPORTER]}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Business Type (for Farmer and Transporter) */}
      {(data.accountType === UserRole.FARMER || data.accountType === UserRole.TRANSPORTER) && (
        <div className="space-y-2">
          <Label htmlFor="businessType">Type d'entreprise *</Label>
          <Select
            value={data.businessType}
            onValueChange={(value) => onChange({ businessType: value as BusinessType })}
            disabled={isLoading}
          >
            <SelectTrigger id="businessType">
              <SelectValue placeholder="Sélectionnez le type d'entreprise" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(businessTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Farmer-specific fields */}
      {data.accountType === UserRole.FARMER && (
        <>
          <div className="space-y-2">
            <Label htmlFor="farmerSpecialization">Spécialisation principale</Label>
            <Select
              value={data.farmerSpecialization}
              onValueChange={(value) => onChange({ farmerSpecialization: value as FarmerSpecialization })}
              disabled={isLoading}
            >
              <SelectTrigger id="farmerSpecialization">
                <SelectValue placeholder="Choisissez votre spécialisation" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(farmerSpecializationLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="farmSize">Taille de l'exploitation (hectares)</Label>
            <Input
              id="farmSize"
              type="number"
              placeholder="50"
              value={data.farmSize || ''}
              onChange={(e) => onChange({ farmSize: parseFloat(e.target.value) || undefined })}
              disabled={isLoading}
              min="0"
              step="0.1"
            />
          </div>
        </>
      )}

      {/* Transporter-specific fields */}
      {data.accountType === UserRole.TRANSPORTER && (
        <div className="space-y-2">
          <Label htmlFor="logisticsSpecialization">Spécialisation logistique *</Label>
          <Select
            value={data.logisticsSpecialization}
            onValueChange={(value) => onChange({ logisticsSpecialization: value as LogisticsSpecialization })}
            disabled={isLoading}
          >
            <SelectTrigger id="logisticsSpecialization">
              <SelectValue placeholder="Sélectionnez votre spécialisation" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(logisticsSpecializationLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}

// Step 3 Component - Terms and Preferences
interface Step3FormProps {
  data: any;
  onChange: (data: any) => void;
  isLoading: boolean;
  onLogin: () => void;
}

function Step3Form({ data, onChange, isLoading, onLogin }: Step3FormProps) {
  return (
    <>
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <h3 className="font-semibold text-sm">Conditions d'utilisation et préférences</h3>
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={data.acceptTerms}
            onCheckedChange={(checked) => onChange({ acceptTerms: checked === true })}
            required
            disabled={isLoading}
          />
          <label htmlFor="terms" className="text-sm leading-none cursor-pointer">
            J'accepte les{' '}
            <button
              type="button"
              onClick={() => window.open('/terms', '_blank')}
              className="text-[#2563eb] hover:underline"
            >
              Conditions Générales d'Utilisation
            </button>{' '}
            et la{' '}
            <button
              type="button"
              onClick={() => window.open('/privacy', '_blank')}
              className="text-[#2563eb] hover:underline"
            >
              Politique de Confidentialité
            </button>{' '}
            d'AgroLogistic *
          </label>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="newsletter"
            checked={data.newsletterSubscribed}
            onCheckedChange={(checked) => onChange({ newsletterSubscribed: checked === true })}
            disabled={isLoading}
          />
          <label htmlFor="newsletter" className="text-sm leading-none cursor-pointer">
            Je souhaite recevoir les actualités et offres exclusives d'AgroLogistic par email
          </label>
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>🎉 Bienvenue dans la communauté AgroLogistic !</strong>
          <br />
          En créant votre compte, vous rejoignez plus de 5 000 professionnels qui révolutionnent
          la chaîne d'approvisionnement agricole.
        </p>
      </div>
    </>
  );
}
