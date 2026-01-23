import { AdminRole } from '../permissions';

/**
 * Admin User Entity
 * Represents an administrative user in the system
 */
export class AdminUser {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: AdminRole,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly lastLoginAt?: Date,
    public readonly avatar?: string,
    public readonly phone?: string,
    public readonly twoFactorEnabled: boolean = false
  ) {}

  /**
   * Create a new admin user
   */
  static create(data: {
    id: string;
    email: string;
    name: string;
    role: AdminRole;
    avatar?: string;
    phone?: string;
  }): AdminUser {
    return new AdminUser(
      data.id,
      data.email,
      data.name,
      data.role,
      true, // Active by default
      new Date(),
      new Date(),
      undefined,
      data.avatar,
      data.phone,
      false
    );
  }

  /**
   * Check if user is a super admin
   */
  isSuperAdmin(): boolean {
    return this.role === AdminRole.SUPER_ADMIN;
  }

  /**
   * Check if user is an admin (ADMIN or SUPER_ADMIN)
   */
  isAdmin(): boolean {
    return this.role === AdminRole.ADMIN || this.role === AdminRole.SUPER_ADMIN;
  }

  /**
   * Check if user can manage another user
   */
  canManage(otherUser: AdminUser): boolean {
    // Super admin can manage anyone
    if (this.isSuperAdmin()) {
      return true;
    }

    // Admin can manage non-admins
    if (this.role === AdminRole.ADMIN) {
      return !otherUser.isAdmin();
    }

    // Others cannot manage
    return false;
  }

  /**
   * Update last login timestamp
   */
  updateLastLogin(): AdminUser {
    return new AdminUser(
      this.id,
      this.email,
      this.name,
      this.role,
      this.isActive,
      this.createdAt,
      new Date(),
      new Date(),
      this.avatar,
      this.phone,
      this.twoFactorEnabled
    );
  }

  /**
   * Activate user
   */
  activate(): AdminUser {
    return new AdminUser(
      this.id,
      this.email,
      this.name,
      this.role,
      true,
      this.createdAt,
      new Date(),
      this.lastLoginAt,
      this.avatar,
      this.phone,
      this.twoFactorEnabled
    );
  }

  /**
   * Deactivate user
   */
  deactivate(): AdminUser {
    return new AdminUser(
      this.id,
      this.email,
      this.name,
      this.role,
      false,
      this.createdAt,
      new Date(),
      this.lastLoginAt,
      this.avatar,
      this.phone,
      this.twoFactorEnabled
    );
  }

  /**
   * Enable 2FA
   */
  enable2FA(): AdminUser {
    return new AdminUser(
      this.id,
      this.email,
      this.name,
      this.role,
      this.isActive,
      this.createdAt,
      new Date(),
      this.lastLoginAt,
      this.avatar,
      this.phone,
      true
    );
  }

  /**
   * Disable 2FA
   */
  disable2FA(): AdminUser {
    return new AdminUser(
      this.id,
      this.email,
      this.name,
      this.role,
      this.isActive,
      this.createdAt,
      new Date(),
      this.lastLoginAt,
      this.avatar,
      this.phone,
      false
    );
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      lastLoginAt: this.lastLoginAt?.toISOString(),
      avatar: this.avatar,
      phone: this.phone,
      twoFactorEnabled: this.twoFactorEnabled,
    };
  }
}
