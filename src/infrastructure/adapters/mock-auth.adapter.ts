import { AuthPort } from '../../application/ports/auth.port';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserRole } from '../../domain/enums/user-role.enum';

export class MockAuthAdapter implements AuthPort {
  private readonly mockUser: User;
  private readonly token = 'mock-jwt-token-123456';

  constructor() {
    this.mockUser = User.create({
      firstName: 'Demo',
      lastName: 'User',
      email: new Email('demo@agrodeep.com'),
      role: UserRole.ADMIN,
      avatarUrl: 'https://github.com/shadcn.png',
    });
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === 'error@test.com') {
      throw new Error('Invalid credentials');
    }

    return {
      user: this.mockUser,
      token: this.token,
    };
  }

  async register(firstName: string, lastName: string, email: string, password: string): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser = User.create({
      firstName,
      lastName,
      email: new Email(email),
      role: UserRole.FARMER, // Default role
    });

    return {
      user: newUser,
      token: this.token,
    };
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Logged out');
  }

  async getCurrentUser(): Promise<User | null> {
    return this.mockUser;
  }
}
