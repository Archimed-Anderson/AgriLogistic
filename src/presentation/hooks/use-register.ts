import { useState } from 'react';
import { RegisterRequestDTO } from '../../application/dto/request/register-request.dto';
import { UserRole } from '@domain/enums/user-role.enum';
import { BusinessType } from '@domain/enums/business-type.enum';
import { FarmerSpecialization, LogisticsSpecialization } from '@domain/enums/specialization.enum';
import { AddressProps } from '@domain/value-objects/address.vo';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { ErrorHandler } from '../utils/error-handler';

// Step management types
export type RegistrationStep = 1 | 2 | 3;

export interface Step1Data {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Step2Data {
  firstName: string;
  lastName: string;
  phone: string;
  accountType: UserRole;
  businessType?: BusinessType;
  farmSize?: number;
  farmerSpecialization?: FarmerSpecialization;
  logisticsSpecialization?: LogisticsSpecialization;
}

export interface Step3Data {
  acceptTerms: boolean;
  newsletterSubscribed?: boolean;
  defaultShippingAddress?: AddressProps;
}

export interface RegistrationFormData extends Step1Data, Step2Data, Step3Data {}

export function useRegister() {
  const { register: authRegister, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store form data for each step
  const [step1Data, setStep1Data] = useState<Step1Data>({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    firstName: '',
    lastName: '',
    phone: '',
    accountType: UserRole.BUYER,
  });

  const [step3Data, setStep3Data] = useState<Step3Data>({
    acceptTerms: false,
    newsletterSubscribed: false,
  });

  /**
   * Validate Step 1: Account credentials
   */
  const validateStep1 = (): boolean => {
    if (!step1Data.email || !step1Data.password || !step1Data.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (step1Data.password !== step1Data.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (step1Data.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    setError(null);
    return true;
  };

  /**
   * Validate Step 2: Profile information
   */
  const validateStep2 = (): boolean => {
    if (!step2Data.firstName || !step2Data.lastName || !step2Data.phone || !step2Data.accountType) {
      setError('All required fields must be filled');
      return false;
    }

    // Farmer-specific validation
    if (step2Data.accountType === UserRole.FARMER && !step2Data.businessType) {
      setError('Business type is required for farmer accounts');
      return false;
    }

    // Transporter-specific validation
    if (step2Data.accountType === UserRole.TRANSPORTER) {
      if (!step2Data.businessType || !step2Data.logisticsSpecialization) {
        setError('Business type and specialization are required for transporter accounts');
        return false;
      }
    }

    setError(null);
    return true;
  };

  /**
   * Validate Step 3: Terms and preferences
   */
  const validateStep3 = (): boolean => {
    if (!step3Data.acceptTerms) {
      setError('You must accept the terms and conditions to continue');
      return false;
    }

    setError(null);
    return true;
  };

  /**
   * Check if current step is valid (without side effects)
   */
  const isValidStep = (step: RegistrationStep): boolean => {
    switch (step) {
      case 1: {
        if (!step1Data.email || !step1Data.password || !step1Data.confirmPassword) {
          return false;
        }
        if (step1Data.password !== step1Data.confirmPassword) {
          return false;
        }
        if (step1Data.password.length < 8) {
          return false;
        }
        return true;
      }
      case 2: {
        if (!step2Data.firstName || !step2Data.lastName || !step2Data.phone || !step2Data.accountType) {
          return false;
        }
        if (step2Data.accountType === UserRole.FARMER && !step2Data.businessType) {
          return false;
        }
        if (step2Data.accountType === UserRole.TRANSPORTER) {
          if (!step2Data.businessType || !step2Data.logisticsSpecialization) {
            return false;
          }
        }
        return true;
      }
      case 3: {
        return step3Data.acceptTerms;
      }
      default:
        return false;
    }
  };

  /**
   * Navigate to next step
   */
  const nextStep = () => {
    if (isValidStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep((prev) => (prev + 1) as RegistrationStep);
      }
    }
  };

  /**
   * Navigate to previous step
   */
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as RegistrationStep);
      setError(null);
    }
  };

  /**
   * Update data for a specific step
   */
  const updateStepData = (step: RegistrationStep, data: Partial<RegistrationFormData>) => {
    setError(null);
    
    switch (step) {
      case 1:
        setStep1Data((prev) => ({ ...prev, ...data as Partial<Step1Data> }));
        break;
      case 2:
        setStep2Data((prev) => ({ ...prev, ...data as Partial<Step2Data> }));
        break;
      case 3:
        setStep3Data((prev) => ({ ...prev, ...data as Partial<Step3Data> }));
        break;
    }
  };

  /**
   * Complete registration
   */
  const register = async () => {
    // Final validation
    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestData: RegisterRequestDTO = {
        ...step1Data,
        ...step2Data,
        ...step3Data,
      };

      const response = await authRegister(requestData);
      
      toast.success(
        `Bienvenue, ${response.user.firstName} ! Votre compte a été créé avec succès.`,
        {
          description: 'Vous pouvez maintenant vous connecter.',
          duration: 4000,
        }
      );
      
      return response;
    } catch (err) {
      // Use enhanced error handler
      const friendlyError = ErrorHandler.toUserFriendly(err);
      setError(friendlyError.message);
      
      toast.error(friendlyError.title, {
        description: `${friendlyError.message}\n${friendlyError.actionable}`,
        duration: 5000,
        action: friendlyError.canRetry ? {
          label: 'Réessayer',
          onClick: () => register(),
        } : undefined,
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset the entire form
   */
  const reset = () => {
    setCurrentStep(1);
    setStep1Data({ email: '', password: '', confirmPassword: '' });
    setStep2Data({
      firstName: '',
      lastName: '',
      phone: '',
      accountType: UserRole.BUYER,
    });
    setStep3Data({ acceptTerms: false, newsletterSubscribed: false });
    setError(null);
  };

  return {
    // Current state
    currentStep,
    isLoading: isLoading || authLoading,
    error,
    
    // Step data
    step1Data,
    step2Data,
    step3Data,
    
    // Navigation
    nextStep,
    previousStep,
    
    // Data management
    updateStepData,
    
    // Validation
    isValidStep,
    
    // Actions
    register,
    reset,
    
    // Computed properties
    canGoNext: isValidStep(currentStep),
    canGoPrevious: currentStep > 1,
    isLastStep: currentStep === 3,
  };
}
