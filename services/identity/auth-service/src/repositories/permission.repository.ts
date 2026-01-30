import { Pool } from 'pg';
import { Database } from '../config/database';
import { Permission, PermissionCategory, UserRole } from '../models/permission.model';
export class PermissionRepository {
  private pool: Pool;
  constructor() {
    this.pool = Database.getInstance();
  }
  /**
   * Get all permissions for a specific role
   */
  async findByRole(role: UserRole | string): Promise<string[]> {
    try {
      const result = await this.pool.query(
        `SELECT p.name 
         FROM permissions p
         JOIN role_permissions rp ON p.id = rp.permission_id
         WHERE rp.role = $1
         ORDER BY p.category, p.name`,
        [role]
      );
      return result.rows.map(row => row.name);
    } catch (error) {
      console.error('Error fetching permissions by role:', error);
      return [];
    }
  }
  /**
   * Get all permissions in the system
   */
  async findAll(): Promise<Permission[]> {
    try {
      const result = await this.pool.query(
        `SELECT id, name, description, category, created_at as "createdAt"
         FROM permissions 
         ORDER BY category, name`
      );
      return result.rows.map(row => ({
        ...row,
        category: row.category as PermissionCategory,
      }));
    } catch (error) {
      console.error('Error fetching all permissions:', error);
      return [];
    }
  }
  /**
   * Get all permissions by category
   */
  async findByCategory(category: PermissionCategory): Promise<Permission[]> {
    try {
      const result = await this.pool.query(
        `SELECT id, name, description, category, created_at as "createdAt"
         FROM permissions 
         WHERE category = $1
         ORDER BY name`,
        [category]
      );
      return result.rows.map(row => ({
        ...row,
        category: row.category as PermissionCategory,
      }));
    } catch (error) {
      console.error('Error fetching permissions by category:', error);
      return [];
    }
  }
  /**
   * Check if a role has a specific permission
   */
  async checkPermission(role: UserRole | string, permissionName: string): Promise<boolean> {
    try {
      // Admin has all permissions
      if (role === UserRole.ADMIN) {
        return true;
      }
      const result = await this.pool.query(
        `SELECT EXISTS(
          SELECT 1
          FROM permissions p
          JOIN role_permissions rp ON p.id = rp.permission_id
          WHERE rp.role = $1 AND p.name = $2
        ) as has_permission`,
        [role, permissionName]
      );
      
      return result.rows[0]?.has_permission || false;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }
  /**
   * Get permission by name
   */
  async findByName(name: string): Promise<Permission | null> {
    try {
      const result = await this.pool.query(
        `SELECT id, name, description, category, created_at as "createdAt"
         FROM permissions 
         WHERE name = $1`,
        [name]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      return {
        ...result.rows[0],
        category: result.rows[0].category as PermissionCategory,
      };
    } catch (error) {
      console.error('Error fetching permission by name:', error);
      return null;
    }
  }
}
