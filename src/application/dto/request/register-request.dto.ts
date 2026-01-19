import { UserRole } from '@domain/enums/user-role.enum';
import { BusinessType } from '@domain/enums/business-type.enum';
import { FarmerSpecialization, LogisticsSpecialization } from '@domain/enums/specialization.enum';
import { AddressProps } from '@domain/value-objects/address.vo';

export interface RegisterRequestDTO {
  // Step 1: Account credentials
  email: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Profile information
  firstName: string;
  lastName: string;
  phone: string;
  accountType: UserRole;
  
  // Business information (conditional based on account type)
  businessType?: BusinessType;
  farmSize?: number; // For farmers, in hectares
  farmerSpecialization?: FarmerSpecialization;
  logisticsSpecialization?: LogisticsSpecialization;
  
  // Optional shipping address
  defaultShippingAddress?: AddressProps;
  
  // Step 3: Terms and preferences
  acceptTerms: boolean;
  newsletterSubscribed?: boolean;
}
