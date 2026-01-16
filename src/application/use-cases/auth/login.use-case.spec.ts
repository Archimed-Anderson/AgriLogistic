import { describe, it, expect, vi } from 'vitest';
import { LoginUseCase } from './login.use-case';
import { AuthPort } from '../../ports/auth.port';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserRole } from '../../../domain/enums/user-role.enum';

describe('LoginUseCase', () => {
  it('should successfully login a user', async () => {
    // Mock user
    const mockUser = User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: new Email('test@test.com'),
      role: UserRole.FARMER,
    });

    // Mock response
    const mockResponse = {
      user: mockUser,
      token: 'mock-jwt-token',
    };

    // Mock port
    const mockAuthPort: AuthPort = {
      login: vi.fn().mockResolvedValue(mockResponse),
      register: vi.fn(),
      logout: vi.fn(),
      getCurrentUser: vi.fn(),
    };

    const useCase = new LoginUseCase(mockAuthPort);
    
    const result = await useCase.execute({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(mockAuthPort.login).toHaveBeenCalledWith('test@test.com', 'password123');
    expect(result.token).toBe('mock-jwt-token');
    expect(result.user.email.value).toBe('test@test.com');
  });

  it('should validate inputs', async () => {
    const mockAuthPort = {} as AuthPort; // Not needed
    const useCase = new LoginUseCase(mockAuthPort);

    await expect(useCase.execute({
      email: '',
      password: '123'
    })).rejects.toThrow('Email and password are required');
  });
});
