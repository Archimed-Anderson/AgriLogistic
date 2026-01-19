import { AuthPort } from '../../application/ports/auth.port';
import { AuthProvider } from './auth-provider.interface';
import { RegisterRequestDTO } from '../../application/dto/request/register-request.dto';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { PhoneNumber } from '../../domain/value-objects/phone-number.vo';
import { UserRole } from '../../domain/enums/user-role.enum';

// In-memory user storage for mock authentication
interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  businessType?: string;
  farmSize?: number;
  farmerSpecialization?: string;
  logisticsSpecialization?: string;
  emailVerified: boolean;
  newsletterSubscribed: boolean;
  createdAt: Date;
}

// Mock user database
const mockUserDatabase: Map<string, StoredUser> = new Map();

// Pre-populate with demo users for each role
const initializeMockUsers = () => {
  const demoUsers: Partial<StoredUser>[] = [
    {
      id: 'admin-001',
      email: 'admin@AgroLogistic.com',
      passwordHash: 'hashed-admin123',
      firstName: 'Admin',
      lastName: 'AgroLogistic',
      phone: '+33600000001',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
    {
      id: 'farmer-001',
      email: 'farmer@AgroLogistic.com',
      passwordHash: 'hashed-farmer123',
      firstName: 'Pierre',
      lastName: 'Dupont',
      phone: '+33600000002',
      role: UserRole.FARMER,
      farmSize: 50,
      farmerSpecialization: 'cereals',
      emailVerified: true,
    },
    {
      id: 'buyer-001',
      email: 'buyer@AgroLogistic.com',
      passwordHash: 'hashed-buyer123',
      firstName: 'Marie',
      lastName: 'Martin',
      phone: '+33600000003',
      role: UserRole.BUYER,
      emailVerified: true,
    },
    {
      id: 'transporter-001',
      email: 'transporter@AgroLogistic.com',
      passwordHash: 'hashed-transporter123',
      firstName: 'Jean',
      lastName: 'Logistique',
      phone: '+33600000004',
      role: UserRole.TRANSPORTER,
      logisticsSpecialization: 'refrigerated',
      emailVerified: true,
    },
    {
      id: 'demo-001',
      email: 'demo@AgroLogistic.com',
      passwordHash: 'hashed-any-password',
      firstName: 'Demo',
      lastName: 'User',
      phone: '+33600000000',
      role: UserRole.ADMIN,
      emailVerified: true,
    },
  ];

  demoUsers.forEach(user => {
    mockUserDatabase.set(user.email!, {
      ...user,
      newsletterSubscribed: false,
      createdAt: new Date(),
    } as StoredUser);
  });
  
  console.log('🔧 [MockAuth] Initialized with demo users:', Array.from(mockUserDatabase.keys()));
};

// Initialize on module load
initializeMockUsers();

export class MockAuthAdapter implements AuthPort, AuthProvider {
  readonly name = 'mock';
  private currentUser: User | null = null;
  private readonly tokenPrefix = 'mock-jwt-token-';

  private generateToken(userId: string): string {
    return `${this.tokenPrefix}${userId}-${Date.now()}`;
  }

  private createUserFromStored(stored: StoredUser): User {
    const user = User.create({
      firstName: stored.firstName,
      lastName: stored.lastName,
      email: new Email(stored.email),
      phone: new PhoneNumber(stored.phone),
      role: stored.role,
      businessType: stored.businessType as any,
      farmSize: stored.farmSize,
      farmerSpecialization: stored.farmerSpecialization as any,
      logisticsSpecialization: stored.logisticsSpecialization as any,
      emailVerified: stored.emailVerified,
      newsletterSubscribed: stored.newsletterSubscribed,
      avatarUrl: this.getAvatarForRole(stored.role),
    });

    // Set the ID
    Object.defineProperty(user, 'id', {
      value: stored.id,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    return user;
  }

  private getAvatarForRole(role: UserRole): string {
    const avatars: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=b6e3f4',
      [UserRole.FARMER]: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farmer&backgroundColor=c0aede',
      [UserRole.BUYER]: 'https://api.dicebear.com/7.x/avataaars/svg?seed=buyer&backgroundColor=d1d4f9',
      [UserRole.TRANSPORTER]: 'https://api.dicebear.com/7.x/avataaars/svg?seed=transporter&backgroundColor=ffd5dc',
      [UserRole.GUEST]: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest&backgroundColor=ffdfbf',
    };
    return avatars[role] || avatars[UserRole.GUEST];
  }

  async login(email: string, _password: string): Promise<{ user: User; token: string }> {
    console.log(`🔐 [MockAuth] Login attempt for: ${email}`);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check for error test case
    if (email === 'error@test.com') {
      console.log('❌ [MockAuth] Test error triggered');
      throw new Error('Identifiants invalides');
    }

    // Look up user in mock database
    const storedUser = mockUserDatabase.get(email.toLowerCase());
    
    if (storedUser) {
      console.log(`✅ [MockAuth] User found: ${storedUser.firstName} ${storedUser.lastName} (${storedUser.role})`);
      const user = this.createUserFromStored(storedUser);
      this.currentUser = user;
      const token = this.generateToken(storedUser.id);
      localStorage.setItem('accessToken', token);
      
      return { user, token };
    }

    // Allow any email to login for demo purposes
    console.log(`⚠️ [MockAuth] User not found, creating temporary session for: ${email}`);
    const tempUser = User.create({
      firstName: email.split('@')[0],
      lastName: 'User',
      email: new Email(email),
      role: UserRole.BUYER,
      avatarUrl: this.getAvatarForRole(UserRole.BUYER),
    });
    
    this.currentUser = tempUser;
    const token = this.generateToken('temp-' + Date.now());
    localStorage.setItem('accessToken', token);
    
    return { user: tempUser, token };
  }

  async register(request: RegisterRequestDTO): Promise<{ user: User; token: string }> {
    console.log('📝 [MockAuth] Registration attempt:', {
      email: request.email,
      role: request.accountType,
      firstName: request.firstName,
      lastName: request.lastName,
    });
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if email already exists
    if (mockUserDatabase.has(request.email.toLowerCase())) {
      console.log('❌ [MockAuth] Email already exists:', request.email);
      throw new Error('Un compte avec cet email existe déjà');
    }

    // Validate required fields
    if (!request.email || !request.password) {
      throw new Error('Email et mot de passe requis');
    }

    if (!request.firstName || !request.lastName) {
      throw new Error('Prénom et nom requis');
    }

    // Generate unique ID
    const userId = `${request.accountType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create stored user record
    const storedUser: StoredUser = {
      id: userId,
      email: request.email.toLowerCase(),
      passwordHash: `hashed-${request.password}`, // In real app, use bcrypt
      firstName: request.firstName,
      lastName: request.lastName,
      phone: request.phone || '+33600000000',
      role: request.accountType || UserRole.BUYER,
      businessType: request.businessType,
      farmSize: request.farmSize,
      farmerSpecialization: request.farmerSpecialization,
      logisticsSpecialization: request.logisticsSpecialization,
      emailVerified: false,
      newsletterSubscribed: request.newsletterSubscribed || false,
      createdAt: new Date(),
    };

    // Store in mock database
    mockUserDatabase.set(storedUser.email, storedUser);
    
    console.log('✅ [MockAuth] User registered successfully:', {
      id: userId,
      email: storedUser.email,
      role: storedUser.role,
      totalUsers: mockUserDatabase.size,
    });

    // Create User entity
    const user = this.createUserFromStored(storedUser);
    user.acceptTerms();
    
    this.currentUser = user;
    
    // Generate token
    const token = this.generateToken(userId);
    localStorage.setItem('accessToken', token);

    // Simulate email verification sending
    this.simulateEmailVerificationSend(request.email, request.firstName);

    return { user, token };
  }

  private simulateEmailVerificationSend(email: string, firstName: string): void {
    console.log(`📧 [MockAuth] Verification email sent to: ${email}`);
    console.log(`📧 [MockAuth] Email content preview:`);
    console.log(`   Subject: Vérifiez votre email - AgroLogistic`);
    console.log(`   Body: Bonjour ${firstName}, cliquez sur le lien pour vérifier votre compte.`);
    console.log(`   Link: /api/auth/verify-email?token=verify-${Date.now()}`);
  }

  async logout(): Promise<void> {
    console.log('🚪 [MockAuth] Logging out user:', this.currentUser?.email?.value);
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.currentUser = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('accessToken');
    if (!token || !token.startsWith(this.tokenPrefix)) {
      return null;
    }
    return this.currentUser;
  }

  async verifyEmail(token: string): Promise<boolean> {
    console.log(`✉️ [MockAuth] Email verification with token: ${token}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // In a real implementation, this would verify the token and update the user
    if (this.currentUser) {
      // Mark as verified
      console.log('✅ [MockAuth] Email verified successfully');
      return true;
    }
    
    return false;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    console.log(`🔑 [MockAuth] Password reset requested for: ${email}`);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const user = mockUserDatabase.get(email.toLowerCase());
    if (user) {
      console.log(`📧 [MockAuth] Password reset email sent to: ${email}`);
      console.log(`📧 [MockAuth] Reset link: /reset-password?token=reset-${Date.now()}`);
    } else {
      // Don't reveal if email exists or not for security
      console.log(`📧 [MockAuth] Password reset email processed for: ${email}`);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    console.log(`🔐 [MockAuth] Password reset with token: ${token}`);
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log(`✅ [MockAuth] Password updated (${newPassword.length} chars)`);
  }

  async isConfigured(): Promise<boolean> {
    // Mock provider is always configured
    return true;
  }

  // Utility method to list all registered users (for debugging)
  static listUsers(): StoredUser[] {
    return Array.from(mockUserDatabase.values());
  }

  // Utility method to get user count
  static getUserCount(): number {
    return mockUserDatabase.size;
  }
}
