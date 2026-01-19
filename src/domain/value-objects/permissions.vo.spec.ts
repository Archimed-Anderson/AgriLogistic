import { describe, it, expect } from 'vitest';
import { Permissions, Permission } from './permissions.vo';
import { UserRole } from '../enums/user-role.enum';

describe('Permissions Value Object', () => {
  describe('Role-based permissions', () => {
    it('should grant all permissions to ADMIN', () => {
      const adminPermissions = Permissions.forRole(UserRole.ADMIN);
      
      expect(adminPermissions.has(Permission.MANAGE_PLATFORM)).toBe(true);
      expect(adminPermissions.has(Permission.DELETE_ANY_PRODUCT)).toBe(true);
      expect(adminPermissions.has(Permission.VIEW_USERS)).toBe(true);
    });

    it('should grant appropriate permissions to FARMER', () => {
      const farmerPermissions = Permissions.forRole(UserRole.FARMER);
      
      expect(farmerPermissions.has(Permission.CREATE_PRODUCT)).toBe(true);
      expect(farmerPermissions.has(Permission.EDIT_OWN_PRODUCT)).toBe(true);
      expect(farmerPermissions.has(Permission.VIEW_ANALYTICS)).toBe(true);
      expect(farmerPermissions.has(Permission.DELETE_ANY_PRODUCT)).toBe(false);
      expect(farmerPermissions.has(Permission.MANAGE_PLATFORM)).toBe(false);
    });

    it('should grant appropriate permissions to BUYER', () => {
      const buyerPermissions = Permissions.forRole(UserRole.BUYER);
      
      expect(buyerPermissions.has(Permission.VIEW_ALL_PRODUCTS)).toBe(true);
      expect(buyerPermissions.has(Permission.CREATE_ORDER)).toBe(true);
      expect(buyerPermissions.has(Permission.VIEW_OWN_ORDERS)).toBe(true);
      expect(buyerPermissions.has(Permission.CREATE_PRODUCT)).toBe(false);
      expect(buyerPermissions.has(Permission.MANAGE_LOGISTICS)).toBe(false);
    });

    it('should grant appropriate permissions to TRANSPORTER', () => {
      const transporterPermissions = Permissions.forRole(UserRole.TRANSPORTER);
      
      expect(transporterPermissions.has(Permission.VIEW_DELIVERY_ORDERS)).toBe(true);
      expect(transporterPermissions.has(Permission.UPDATE_DELIVERY_STATUS)).toBe(true);
      expect(transporterPermissions.has(Permission.CREATE_PRODUCT)).toBe(false);
      expect(transporterPermissions.has(Permission.CREATE_ORDER)).toBe(false);
    });

    it('should grant minimal permissions to GUEST', () => {
      const guestPermissions = Permissions.forRole(UserRole.GUEST);
      
      expect(guestPermissions.has(Permission.VIEW_ALL_PRODUCTS)).toBe(true);
      expect(guestPermissions.has(Permission.CREATE_ORDER)).toBe(false);
      expect(guestPermissions.has(Permission.CREATE_PRODUCT)).toBe(false);
    });
  });

  describe('Permission checks', () => {
    const farmerPermissions = Permissions.forRole(UserRole.FARMER);

    it('should check single permission correctly', () => {
      expect(farmerPermissions.has(Permission.CREATE_PRODUCT)).toBe(true);
      expect(farmerPermissions.has(Permission.DELETE_ANY_PRODUCT)).toBe(false);
    });

    it('should check if has any of multiple permissions', () => {
      expect(farmerPermissions.hasAny(
        Permission.CREATE_PRODUCT,
        Permission.DELETE_ANY_PRODUCT
      )).toBe(true);

      expect(farmerPermissions.hasAny(
        Permission.DELETE_ANY_PRODUCT,
        Permission.MANAGE_PLATFORM
      )).toBe(false);
    });

    it('should check if has all of multiple permissions', () => {
      expect(farmerPermissions.hasAll(
        Permission.CREATE_PRODUCT,
        Permission.VIEW_ALL_PRODUCTS
      )).toBe(true);

      expect(farmerPermissions.hasAll(
        Permission.CREATE_PRODUCT,
        Permission.DELETE_ANY_PRODUCT
      )).toBe(false);
    });
  });

  describe('Permission management', () => {
    it('should grant additional permission', () => {
      const permissions = Permissions.forRole(UserRole.BUYER);
      const updated = permissions.grant(Permission.CREATE_PRODUCT);
      
      expect(permissions.has(Permission.CREATE_PRODUCT)).toBe(false);
      expect(updated.has(Permission.CREATE_PRODUCT)).toBe(true);
    });

    it('should revoke permission', () => {
      const permissions = Permissions.forRole(UserRole.FARMER);
      const updated = permissions.revoke(Permission.CREATE_PRODUCT);
      
      expect(permissions.has(Permission.CREATE_PRODUCT)).toBe(true);
      expect(updated.has(Permission.CREATE_PRODUCT)).toBe(false);
    });

    it('should convert to array', () => {
      const permissions = Permissions.forRole(UserRole.BUYER);
      const array = permissions.toArray();
      
      expect(Array.isArray(array)).toBe(true);
      expect(array).toContain(Permission.VIEW_ALL_PRODUCTS);
      expect(array).toContain(Permission.CREATE_ORDER);
    });
  });
});
