import { UserRole } from '../enums/user-role.enum';

export enum Permission {
  // Product permissions
  CREATE_PRODUCT = 'create_product',
  EDIT_OWN_PRODUCT = 'edit_own_product',
  DELETE_OWN_PRODUCT = 'delete_own_product',
  VIEW_ALL_PRODUCTS = 'view_all_products',
  EDIT_ANY_PRODUCT = 'edit_any_product',
  DELETE_ANY_PRODUCT = 'delete_any_product',

  // Order permissions
  CREATE_ORDER = 'create_order',
  VIEW_OWN_ORDERS = 'view_own_orders',
  VIEW_ALL_ORDERS = 'view_all_orders',
  MANAGE_ORDERS = 'manage_orders',

  // Logistics permissions
  VIEW_DELIVERY_ORDERS = 'view_delivery_orders',
  UPDATE_DELIVERY_STATUS = 'update_delivery_status',
  MANAGE_LOGISTICS = 'manage_logistics',

  // User management
  VIEW_USERS = 'view_users',
  EDIT_USERS = 'edit_users',
  DELETE_USERS = 'delete_users',

  // Analytics & Reports
  VIEW_ANALYTICS = 'view_analytics',
  VIEW_FINANCIAL_REPORTS = 'view_financial_reports',
  EXPORT_REPORTS = 'export_reports',

  // System
  MANAGE_SETTINGS = 'manage_settings',
  MANAGE_CATEGORIES = 'manage_categories',
  MANAGE_PLATFORM = 'manage_platform',
}

export class Permissions {
  private readonly permissions: Set<Permission>;

  constructor(permissions: Permission[]) {
    this.permissions = new Set(permissions);
  }

  public static forRole(role: UserRole): Permissions {
    const permissionMap: Record<UserRole, Permission[]> = {
      [UserRole.ADMIN]: [
        // Admin has all permissions
        ...Object.values(Permission),
      ],

      [UserRole.FARMER]: [
        // Product management (own products)
        Permission.CREATE_PRODUCT,
        Permission.EDIT_OWN_PRODUCT,
        Permission.DELETE_OWN_PRODUCT,
        Permission.VIEW_ALL_PRODUCTS,

        // Order management (own orders)
        Permission.VIEW_OWN_ORDERS,

        // Analytics (limited)
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_FINANCIAL_REPORTS,
        Permission.EXPORT_REPORTS,
      ],

      [UserRole.BUYER]: [
        // Product viewing and ordering
        Permission.VIEW_ALL_PRODUCTS,
        Permission.CREATE_ORDER,
        Permission.VIEW_OWN_ORDERS,

        // Analytics (limited to own data)
        Permission.VIEW_ANALYTICS,
      ],

      [UserRole.TRANSPORTER]: [
        // Logistics operations
        Permission.VIEW_DELIVERY_ORDERS,
        Permission.UPDATE_DELIVERY_STATUS,
        Permission.VIEW_ALL_PRODUCTS, // To see what they're transporting

        // Order viewing (deliveries only)
        Permission.VIEW_OWN_ORDERS,

        // Analytics (delivery-focused)
        Permission.VIEW_ANALYTICS,
      ],

      [UserRole.GUEST]: [
        // Very limited access
        Permission.VIEW_ALL_PRODUCTS,
      ],
    };

    return new Permissions(permissionMap[role] || []);
  }

  public has(permission: Permission): boolean {
    return this.permissions.has(permission);
  }

  public hasAny(...permissions: Permission[]): boolean {
    return permissions.some((p) => this.permissions.has(p));
  }

  public hasAll(...permissions: Permission[]): boolean {
    return permissions.every((p) => this.permissions.has(p));
  }

  public toArray(): Permission[] {
    return Array.from(this.permissions);
  }

  public grant(permission: Permission): Permissions {
    const newPermissions = new Set(this.permissions);
    newPermissions.add(permission);
    return new Permissions(Array.from(newPermissions));
  }

  public revoke(permission: Permission): Permissions {
    const newPermissions = new Set(this.permissions);
    newPermissions.delete(permission);
    return new Permissions(Array.from(newPermissions));
  }
}
