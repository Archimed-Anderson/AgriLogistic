export interface User {
  id: string;
  email: string;
  passwordHash: string | null;
  firstName: string;
  lastName: string;
  role: 'admin' | 'buyer' | 'transporter';
  emailVerified: boolean;
  phone: string | null;
  phoneVerified: boolean;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateUserDTO {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  role?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export interface Session {
  id: string;
  userId: string;
  tokenHash: string;
  refreshTokenHash: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  createdAt: Date;
}

export interface CreateSessionDTO {
  userId: string;
  tokenHash: string;
  refreshTokenHash?: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}

export interface OAuthAccount {
  id: string;
  userId: string;
  provider: 'google' | 'facebook';
  providerAccountId: string;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
  createdAt: Date;
}

export interface CreateOAuthAccountDTO {
  userId: string;
  provider: 'google' | 'facebook';
  providerAccountId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}
