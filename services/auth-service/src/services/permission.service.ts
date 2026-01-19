import { PermissionRepository } from '../repositories/permission.repository';
import { UserRole, hasPermission, getPermissionsByRole } from '../models/permission.model';
export class PermissionService {
  private permissionRepository: PermissionRepository;
  constructor() {
    this.permissionRepository = new PermissionRepository();
  }
  /**
   * Get all permissions for a role from database
   */
  async getPermissionsForRole(role: UserRole): Promise<string[]> {
    try {
      // For admin, return wildcard
      if (role === UserRole.ADMIN) {
        return ['*'];
      }
      // Fetch from database
      const dbPermissions = await this.permissionRepository.findByRole(role);
      
      // If database is not set up yet, fall back to default permissions
      if (dbPermissions.length === 0) {
        return getPermissionsByRole(role);
      }
      return dbPermissions;
    } catch (error) {
      console.error('Error fetching permissions for role:', error);
      // Fallback to default permissions
      return getPermissionsByRole(role);
    }
  }
  /**
   * Check if user has a specific permission
   */
  hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    return hasPermission(userPermissions, requiredPermission);
  }
  /**
   * Check if user has any of the required permissions
   */
  hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.some(permission => 
      this.hasPermission(userPermissions, permission)
    );
  }
  /**
   * Check if user has all of the required permissions
   */
  hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every(permission => 
      this.hasPermission(userPermissions, permission)
    );
  }
  /**
   * Validate if a role has a specific permission in the database
   */
  async validateRolePermission(role: UserRole, permission: string): Promise<boolean> {
    try {
      return await this.permissionRepository.checkPermission(role, permission);
    } catch (error) {
      console.error('Error validating role permission:', error);
      return false;
    }
  }
  /**
   * Get all permissions from database
   */
  async getAllPermissions() {
    try {
      return await this.permissionRepository.findAll();
    } catch (error) {
      console.error('Error fetching all permissions:', error);
      return [];
    }
  }
}
