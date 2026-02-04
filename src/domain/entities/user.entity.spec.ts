import { describe, it, expect } from 'vitest';
import { User } from './user.entity';
import { Email } from '../value-objects/email.vo';
import { UserRole } from '../enums/user-role.enum';

describe('User Entity', () => {
  it('should create a valid user', () => {
    const emailStr = 'test@example.com';
    const email = new Email(emailStr);

    const user = User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: email,
      role: UserRole.FARMER,
    });

    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.fullName).toBe('John Doe');
    expect(user.role).toBe(UserRole.FARMER);
    expect(user.email.value).toBe(emailStr);
    expect(user.id).toBeDefined();
  });

  it('should update profile correctly', () => {
    const user = User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: new Email('john@test.com'),
      role: UserRole.BUYER,
    });

    user.updateProfile('Jane', 'Smith', 'New bio');

    expect(user.firstName).toBe('Jane');
    expect(user.lastName).toBe('Smith');
    expect(user.fullName).toBe('Jane Smith');
  });

  it('should throw error for invalid email', () => {
    expect(() => {
      new Email('invalid-email');
    }).toThrow('Invalid email address');
  });
});
