import { UseCase } from '../use-case.interface';
import { RegisterRequestDTO } from '../../dto/request/register-request.dto';
import { RegisterResponseDTO } from '../../dto/response/register-response.dto';
import { AuthPort } from '../../ports/auth.port';
import { Email } from '@domain/value-objects/email.vo';
import { PhoneNumber } from '@domain/value-objects/phone-number.vo';
import { Address } from '@domain/value-objects/address.vo';
import { UserRole } from '@domain/enums/user-role.enum';

export class RegisterUseCase implements UseCase<RegisterRequestDTO, RegisterResponseDTO> {
  constructor(private readonly authPort: AuthPort) {}

  async execute(request: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    // Step 1: Validate required fields
    this.validateRequiredFields(request);
    
    // Step 2: Validate email format
    this.validateEmail(request.email);
    
    // Step 3: Validate password strength
    this.validatePassword(request.password, request.confirmPassword);
    
    // Step 4: Validate phone number (international format)
    this.validatePhoneNumber(request.phone);
    
    // Step 5: Validate account type and role-specific fields
    this.validateAccountTypeFields(request);
    
    // Step 6: Validate terms acceptance
    if (!request.acceptTerms) {
      throw new Error('You must accept the terms and conditions to register');
    }
    
    // Step 7: Validate optional address if provided
    if (request.defaultShippingAddress) {
      this.validateAddress(request.defaultShippingAddress);
    }
    
    // Delegate registration to the infrastructure port
    return this.authPort.register(request);
  }

  private validateRequiredFields(request: RegisterRequestDTO): void {
    const requiredFields = [
      'email', 
      'password', 
      'confirmPassword',
      'firstName', 
      'lastName', 
      'phone', 
      'accountType'
    ];
    
    for (const field of requiredFields) {
      const value = request[field as keyof RegisterRequestDTO];
      if (!value || (typeof value === 'string' && value.trim().length === 0)) {
        throw new Error(`${field} is required`);
      }
    }
  }

  private validateEmail(email: string): void {
    try {
      new Email(email);
    } catch (error) {
      throw new Error('Invalid email format. Please provide a valid email address');
    }
  }

  private validatePassword(password: string, confirmPassword: string): void {
    // Check password match
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    // Minimum length
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Password strength requirements
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
    
    const strengthChecks = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar];
    const passedChecks = strengthChecks.filter(Boolean).length;
    
    if (passedChecks < 3) {
      throw new Error(
        'Password must contain at least 3 of the following: uppercase letter, lowercase letter, number, special character'
      );
    }
  }

  private validatePhoneNumber(phone: string): void {
    try {
      new PhoneNumber(phone);
    } catch (error) {
      throw new Error(
        'Invalid phone number format. Please provide a valid international phone number (e.g., +33612345678)'
      );
    }
  }

  private validateAccountTypeFields(request: RegisterRequestDTO): void {
    const { accountType } = request;
    
    // Validate role is allowed for registration
    const allowedRoles = [UserRole.FARMER, UserRole.BUYER, UserRole.TRANSPORTER];
    if (!allowedRoles.includes(accountType)) {
      throw new Error('Invalid account type for registration');
    }
    
    // Farmer-specific validation
    if (accountType === UserRole.FARMER) {
      if (!request.businessType) {
        throw new Error('Business type is required for farmer accounts');
      }
      
      // Farm size should be positive if provided
      if (request.farmSize !== undefined && request.farmSize <= 0) {
        throw new Error('Farm size must be a positive number');
      }
    }
    
    // Transporter-specific validation
    if (accountType === UserRole.TRANSPORTER) {
      if (!request.businessType) {
        throw new Error('Business type is required for transporter accounts');
      }
      
      if (!request.logisticsSpecialization) {
        throw new Error('Logistics specialization is required for transporter accounts');
      }
    }
  }

  private validateAddress(addressProps: any): void {
    try {
      new Address(addressProps);
    } catch (error) {
      throw new Error(`Invalid address: ${(error as Error).message}`);
    }
  }
}
