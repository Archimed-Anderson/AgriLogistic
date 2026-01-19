import { PermissionService } from '../../../src/services/permission.service';
import { UserRole, getPermissionsByRole } from '../../../src/models/permission.model';

describe('PermissionService', () => {
  let permissionService: PermissionService;

  beforeEach(() => {
    permissionService = new PermissionService();
  });

  describe('getPermissionsForRole', () => {
    it('should return admin permissions', async () => {
      const permissions = await permissionService.getPermissionsForRole(UserRole.ADMIN);
      
      expect(permissions).toContain('*');
    });

    it('should return buyer permissions', async () => {
      const permissions = await permissionService.getPermissionsForRole(UserRole.BUYER);
      
      expect(permissions).toContain('product:browse');
      expect(permissions).toContain('order:create');
      expect(permissions).toContain('cart:manage');
      expect(permissions).not.toContain('*');
    });

    it('should return transporter permissions', async () => {
      const permissions = await permissionService.getPermissionsForRole(UserRole.TRANSPORTER);
      
      expect(permissions).toContain('delivery:view_assigned');
      expect(permissions).toContain('delivery:update_status');
      expect(permissions).not.toContain('*');
    });
  });

  describe('hasPermission', () => {
    it('should return true for admin with any permission', () => {
      const adminPermissions = ['*'];
      const hasPermission = permissionService.hasPermission(adminPermissions, 'product:create');
      
      expect(hasPermission).toBe(true);
    });

    it('should return true for user with specific permission', () => {
      const userPermissions = ['product:browse', 'order:create'];
      const hasPermission = permissionService.hasPermission(userPermissions, 'product:browse');
      
      expect(hasPermission).toBe(true);
    });

    it('should return false for user without permission', () => {
      const userPermissions = ['product:browse'];
      const hasPermission = permissionService.hasPermission(userPermissions, 'order:create');
      
      expect(hasPermission).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('should return true if user has any of the required permissions', () => {
      const userPermissions = ['product:browse', 'order:create'];
      const required = ['product:create', 'product:browse'];
      const hasAny = permissionService.hasAnyPermission(userPermissions, required);
      
      expect(hasAny).toBe(true);
    });

    it('should return false if user has none of the required permissions', () => {
      const userPermissions = ['product:browse'];
      const required = ['order:create', 'order:cancel'];
      const hasAny = permissionService.hasAnyPermission(userPermissions, required);
      
      expect(hasAny).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('should return true if user has all required permissions', () => {
      const userPermissions = ['product:browse', 'order:create', 'cart:manage'];
      const required = ['product:browse', 'order:create'];
      const hasAll = permissionService.hasAllPermissions(userPermissions, required);
      
      expect(hasAll).toBe(true);
    });

    it('should return false if user is missing any required permission', () => {
      const userPermissions = ['product:browse', 'order:create'];
      const required = ['product:browse', 'order:create', 'cart:manage'];
      const hasAll = permissionService.hasAllPermissions(userPermissions, required);
      
      expect(hasAll).toBe(false);
    });
  });
});

describe('Permission Model Helpers', () => {
  describe('getPermissionsByRole', () => {
    it('should return admin permissions', () => {
      const permissions = getPermissionsByRole(UserRole.ADMIN);
      expect(permissions).toEqual(['*']);
    });

    it('should return buyer permissions', () => {
      const permissions = getPermissionsByRole(UserRole.BUYER);
      expect(permissions).toContain('product:browse');
      expect(permissions).toContain('order:create');
    });

    it('should return transporter permissions', () => {
      const permissions = getPermissionsByRole(UserRole.TRANSPORTER);
      expect(permissions).toContain('delivery:view_assigned');
      expect(permissions).toContain('delivery:update_status');
    });
  });
});
