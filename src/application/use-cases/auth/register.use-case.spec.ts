import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RegisterUseCase } from './register.use-case';
import { AuthPort } from '../../ports/auth.port';
import { RegisterRequestDTO } from '../../dto/request/register-request.dto';
import { UserRole } from '@domain/enums/user-role.enum';
import { BusinessType } from '@domain/enums/business-type.enum';
import { FarmerSpecialization, LogisticsSpecialization } from '@domain/enums/specialization.enum';
import { User } from '@domain/entities/user.entity';
import { Email } from '@domain/value-objects/email.vo';

describe('RegisterUseCase', () => {
  let registerUseCase: RegisterUseCase;
  let mockAuthPort: AuthPort;

  const validRegisterRequest: RegisterRequestDTO = {
    email: 'john.farmer@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Farmer',
    phone: '+33612345678',
    accountType: UserRole.FARMER,
    businessType: BusinessType.FAMILY_FARM,
    farmSize: 50,
    farmerSpecialization: FarmerSpecialization.CEREALS,
    acceptTerms: true,
    newsletterSubscribed: true,
  };

  beforeEach(() => {
    mockAuthPort = {
      login: vi.fn(),
      register: vi.fn().mockResolvedValue({
        user: User.create({
          firstName: 'John',
          lastName: 'Farmer',
          email: new Email('john.farmer@example.com'),
          role: UserRole.FARMER,
        }),
        token: 'mock-token',
      }),
      logout: vi.fn(),
      getCurrentUser: vi.fn(),
    };

    registerUseCase = new RegisterUseCase(mockAuthPort);
  });

  describe('Successful registration', () => {
    it('should register a farmer with all required fields', async () => {
      const result = await registerUseCase.execute(validRegisterRequest);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.token).toBe('mock-token');
      expect(mockAuthPort.register).toHaveBeenCalledWith(validRegisterRequest);
    });

    it('should register a buyer with minimal fields', async () => {
      const buyerRequest: RegisterRequestDTO = {
        email: 'buyer@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'Jane',
        lastName: 'Buyer',
        phone: '+33612345679',
        accountType: UserRole.BUYER,
        acceptTerms: true,
      };

      await registerUseCase.execute(buyerRequest);

      expect(mockAuthPort.register).toHaveBeenCalledWith(buyerRequest);
    });

    it('should register a transporter with specialization', async () => {
      const transporterRequest: RegisterRequestDTO = {
        email: 'transporter@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        firstName: 'Bob',
        lastName: 'Transport',
        phone: '+33612345680',
        accountType: UserRole.TRANSPORTER,
        businessType: BusinessType.SAS,
        logisticsSpecialization: LogisticsSpecialization.REFRIGERATED,
        acceptTerms: true,
      };

      await registerUseCase.execute(transporterRequest);

      expect(mockAuthPort.register).toHaveBeenCalledWith(transporterRequest);
    });
  });

  describe('Required fields validation', () => {
    it('should reject registration without email', async () => {
      const invalidRequest = { ...validRegisterRequest, email: '' };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow('email is required');
    });

    it('should reject registration without password', async () => {
      const invalidRequest = { ...validRegisterRequest, password: '' };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow('password is required');
    });

    it('should reject registration without firstName', async () => {
      const invalidRequest = { ...validRegisterRequest, firstName: '' };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow('firstName is required');
    });

    it('should reject registration without lastName', async () => {
      const invalidRequest = { ...validRegisterRequest, lastName: '' };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow('lastName is required');
    });

    it('should reject registration without phone', async () => {
      const invalidRequest = { ...validRegisterRequest, phone: '' };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow('phone is required');
    });
  });

  describe('Email validation', () => {
    it('should reject invalid email format', async () => {
      const invalidRequest = { ...validRegisterRequest, email: 'not-an-email' };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow('Invalid email format');
    });

    it('should accept valid email formats', async () => {
      const validEmails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
      ];

      for (const email of validEmails) {
        const request = { ...validRegisterRequest, email };
        await expect(registerUseCase.execute(request)).resolves.toBeDefined();
      }
    });
  });

  describe('Password validation', () => {
    it('should reject passwords that do not match', async () => {
      const invalidRequest = {
        ...validRegisterRequest,
        password: 'Password123!',
        confirmPassword: 'Different123!',
      };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow('Passwords do not match');
    });

    it('should reject passwords shorter than 8 characters', async () => {
      const invalidRequest = {
        ...validRegisterRequest,
        password: 'Short1!',
        confirmPassword: 'Short1!',
      };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow(
        'Password must be at least 8 characters long'
      );
    });

    it('should reject weak passwords', async () => {
      const weakPasswords = [
        'password', // no uppercase, no numbers, no special
        'PASSWORD', // no lowercase, no numbers, no special
        '12345678', // no letters, no special
      ];

      for (const password of weakPasswords) {
        const request = {
          ...validRegisterRequest,
          password,
          confirmPassword: password,
        };
        await expect(registerUseCase.execute(request)).rejects.toThrow(
          'Password must contain at least 3 of the following'
        );
      }
    });

    it('should accept strong passwords', async () => {
      const strongPasswords = [
        'SecurePass123!',
        'MyP@ssw0rd',
        'C0mpl3x!Pass',
      ];

      for (const password of strongPasswords) {
        const request = {
          ...validRegisterRequest,
          password,
          confirmPassword: password,
        };
        await expect(registerUseCase.execute(request)).resolves.toBeDefined();
      }
    });
  });

  describe('Phone number validation', () => {
    it('should reject invalid phone formats', async () => {
      const invalidPhones = [
        '123', // too short
        '123456789012345678', // too long
      ];

      for (const phone of invalidPhones) {
        const request = { ...validRegisterRequest, phone };
        await expect(registerUseCase.execute(request)).rejects.toThrow('Invalid phone number format');
      }
    });

    it('should normalize and accept phone numbers with letters', async () => {
      // Phone numbers with letters get normalized
      const request = { ...validRegisterRequest, phone: '+33abc123456' };
      await expect(registerUseCase.execute(request)).resolves.toBeDefined();
    });

    it('should accept valid international phone numbers', async () => {
      const validPhones = [
        '+33612345678',
        '+15551234567',
        '+447911123456',
      ];

      for (const phone of validPhones) {
        const request = { ...validRegisterRequest, phone };
        await expect(registerUseCase.execute(request)).resolves.toBeDefined();
      }
    });
  });

  describe('Account type validation', () => {
    it('should reject invalid account types', async () => {
      const invalidRequest = {
        ...validRegisterRequest,
        accountType: UserRole.ADMIN, // ADMIN not allowed for registration
      };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow(
        'Invalid account type for registration'
      );
    });

    it('should require businessType for farmers', async () => {
      const invalidRequest = {
        ...validRegisterRequest,
        accountType: UserRole.FARMER,
        businessType: undefined,
      };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow(
        'Business type is required for farmer accounts'
      );
    });

    it('should require businessType and specialization for transporters', async () => {
      const requestWithoutBusinessType = {
        ...validRegisterRequest,
        accountType: UserRole.TRANSPORTER,
        businessType: undefined,
        logisticsSpecialization: LogisticsSpecialization.REFRIGERATED,
      };

      await expect(registerUseCase.execute(requestWithoutBusinessType)).rejects.toThrow(
        'Business type is required for transporter accounts'
      );

      const requestWithoutSpecialization = {
        ...validRegisterRequest,
        accountType: UserRole.TRANSPORTER,
        businessType: BusinessType.SAS,
        logisticsSpecialization: undefined,
      };

      await expect(registerUseCase.execute(requestWithoutSpecialization)).rejects.toThrow(
        'Logistics specialization is required for transporter accounts'
      );
    });

    it('should reject negative farm size', async () => {
      const invalidRequest = {
        ...validRegisterRequest,
        farmSize: -10,
      };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow(
        'Farm size must be a positive number'
      );
    });
  });

  describe('Terms acceptance validation', () => {
    it('should reject registration without terms acceptance', async () => {
      const invalidRequest = {
        ...validRegisterRequest,
        acceptTerms: false,
      };

      await expect(registerUseCase.execute(invalidRequest)).rejects.toThrow(
        'You must accept the terms and conditions to register'
      );
    });
  });

  describe('Address validation', () => {
    it('should validate address if provided', async () => {
      const requestWithInvalidAddress = {
        ...validRegisterRequest,
        defaultShippingAddress: {
          street: '', // Invalid - empty street
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
        },
      };

      await expect(registerUseCase.execute(requestWithInvalidAddress)).rejects.toThrow(
        'Invalid address'
      );
    });

    it('should accept valid address', async () => {
      const requestWithValidAddress = {
        ...validRegisterRequest,
        defaultShippingAddress: {
          street: '123 Main Street',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
        },
      };

      await expect(registerUseCase.execute(requestWithValidAddress)).resolves.toBeDefined();
    });
  });
});
