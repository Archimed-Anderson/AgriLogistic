/**
 * Admin Permissions System
 * Defines all granular permissions for the admin dashboard
 */

export enum AdminPermission {
  // Users
  USERS_VIEW = 'users:view',
  USERS_VIEW_DETAILS = 'users:view_details',
  USERS_CREATE = 'users:create',
  USERS_EDIT = 'users:edit',
  USERS_DELETE = 'users:delete',
  USERS_SUSPEND = 'users:suspend',
  USERS_ACTIVATE = 'users:activate',
  USERS_RESET_PASSWORD = 'users:reset_password',
  USERS_MANAGE_ROLES = 'users:manage_roles',
  USERS_VIEW_SESSIONS = 'users:view_sessions',
  USERS_TERMINATE_SESSION = 'users:terminate_session',
  USERS_EXPORT = 'users:export',
  USERS_IMPORT = 'users:import',

  // Products
  PRODUCTS_VIEW = 'products:view',
  PRODUCTS_VIEW_DETAILS = 'products:view_details',
  PRODUCTS_CREATE = 'products:create',
  PRODUCTS_EDIT = 'products:edit',
  PRODUCTS_DELETE = 'products:delete',
  PRODUCTS_PUBLISH = 'products:publish',
  PRODUCTS_UNPUBLISH = 'products:unpublish',
  PRODUCTS_MANAGE_INVENTORY = 'products:manage_inventory',
  PRODUCTS_MANAGE_PRICING = 'products:manage_pricing',
  PRODUCTS_MANAGE_CATEGORIES = 'products:manage_categories',
  PRODUCTS_EXPORT = 'products:export',
  PRODUCTS_IMPORT = 'products:import',

  // Orders
  ORDERS_VIEW = 'orders:view',
  ORDERS_VIEW_DETAILS = 'orders:view_details',
  ORDERS_EDIT = 'orders:edit',
  ORDERS_CANCEL = 'orders:cancel',
  ORDERS_REFUND = 'orders:refund',
  ORDERS_CHANGE_STATUS = 'orders:change_status',
  ORDERS_ASSIGN_DELIVERY = 'orders:assign_delivery',
  ORDERS_VIEW_PAYMENTS = 'orders:view_payments',
  ORDERS_EXPORT = 'orders:export',

  // Analytics
  ANALYTICS_VIEW_DASHBOARD = 'analytics:view_dashboard',
  ANALYTICS_VIEW_USERS = 'analytics:view_users',
  ANALYTICS_VIEW_REVENUE = 'analytics:view_revenue',
  ANALYTICS_VIEW_PRODUCTS = 'analytics:view_products',
  ANALYTICS_VIEW_ORDERS = 'analytics:view_orders',
  ANALYTICS_CREATE_REPORT = 'analytics:create_report',
  ANALYTICS_EXPORT_DATA = 'analytics:export_data',
  ANALYTICS_SCHEDULE_REPORT = 'analytics:schedule_report',

  // System
  SYSTEM_VIEW_HEALTH = 'system:view_health',
  SYSTEM_VIEW_METRICS = 'system:view_metrics',
  SYSTEM_VIEW_LOGS = 'system:view_logs',
  SYSTEM_MANAGE_SERVICES = 'system:manage_services',
  SYSTEM_MANAGE_CONFIG = 'system:manage_config',
  SYSTEM_MANAGE_ENV = 'system:manage_env',
  SYSTEM_VIEW_DATABASE = 'system:view_database',
  SYSTEM_BACKUP = 'system:backup',
  SYSTEM_RESTORE = 'system:restore',

  // Security
  SECURITY_VIEW_AUDIT_LOGS = 'security:view_audit_logs',
  SECURITY_EXPORT_AUDIT_LOGS = 'security:export_audit_logs',
  SECURITY_MANAGE_PERMISSIONS = 'security:manage_permissions',
  SECURITY_MANAGE_ROLES = 'security:manage_roles',
  SECURITY_VIEW_SESSIONS = 'security:view_sessions',
  SECURITY_TERMINATE_SESSIONS = 'security:terminate_sessions',
  SECURITY_MANAGE_2FA = 'security:manage_2fa',
  SECURITY_VIEW_ALERTS = 'security:view_alerts',
  SECURITY_MANAGE_ALERTS = 'security:manage_alerts',

  // Content
  CONTENT_VIEW_BLOG = 'content:view_blog',
  CONTENT_CREATE_BLOG = 'content:create_blog',
  CONTENT_EDIT_BLOG = 'content:edit_blog',
  CONTENT_DELETE_BLOG = 'content:delete_blog',
  CONTENT_PUBLISH_BLOG = 'content:publish_blog',
  CONTENT_MANAGE_ACADEMY = 'content:manage_academy',
  CONTENT_MANAGE_MEDIA = 'content:manage_media',

  // Finance
  FINANCE_VIEW_DASHBOARD = 'finance:view_dashboard',
  FINANCE_VIEW_TRANSACTIONS = 'finance:view_transactions',
  FINANCE_VIEW_REVENUE = 'finance:view_revenue',
  FINANCE_MANAGE_INVOICES = 'finance:manage_invoices',
  FINANCE_PROCESS_REFUNDS = 'finance:process_refunds',
  FINANCE_EXPORT_DATA = 'finance:export_data',
  FINANCE_MANAGE_SETTINGS = 'finance:manage_settings',
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SUPPORT = 'SUPPORT',
}

/**
 * Role hierarchy levels
 */
export const ROLE_LEVELS: Record<AdminRole, number> = {
  [AdminRole.SUPER_ADMIN]: 3,
  [AdminRole.ADMIN]: 2,
  [AdminRole.MANAGER]: 1,
  [AdminRole.SUPPORT]: 0,
};

/**
 * Permissions mapped to roles
 */
export const ROLE_PERMISSIONS: Record<AdminRole, AdminPermission[]> = {
  [AdminRole.SUPER_ADMIN]: Object.values(AdminPermission),

  [AdminRole.ADMIN]: [
    // Users (all)
    ...Object.values(AdminPermission).filter((p) => p.startsWith('users:')),
    // Products (all)
    ...Object.values(AdminPermission).filter((p) => p.startsWith('products:')),
    // Orders (all)
    ...Object.values(AdminPermission).filter((p) => p.startsWith('orders:')),
    // Analytics (all)
    ...Object.values(AdminPermission).filter((p) => p.startsWith('analytics:')),
    // System (limited)
    AdminPermission.SYSTEM_VIEW_HEALTH,
    AdminPermission.SYSTEM_VIEW_METRICS,
    AdminPermission.SYSTEM_VIEW_LOGS,
    AdminPermission.SYSTEM_VIEW_DATABASE,
    // Security (all)
    ...Object.values(AdminPermission).filter((p) => p.startsWith('security:')),
    // Content (all)
    ...Object.values(AdminPermission).filter((p) => p.startsWith('content:')),
    // Finance (all)
    ...Object.values(AdminPermission).filter((p) => p.startsWith('finance:')),
  ],

  [AdminRole.MANAGER]: [
    // Users (limited)
    AdminPermission.USERS_VIEW,
    AdminPermission.USERS_VIEW_DETAILS,
    AdminPermission.USERS_CREATE,
    AdminPermission.USERS_EDIT,
    AdminPermission.USERS_SUSPEND,
    AdminPermission.USERS_ACTIVATE,
    AdminPermission.USERS_RESET_PASSWORD,
    AdminPermission.USERS_VIEW_SESSIONS,
    AdminPermission.USERS_TERMINATE_SESSION,
    AdminPermission.USERS_EXPORT,

    // Products (limited)
    AdminPermission.PRODUCTS_VIEW,
    AdminPermission.PRODUCTS_VIEW_DETAILS,
    AdminPermission.PRODUCTS_CREATE,
    AdminPermission.PRODUCTS_EDIT,
    AdminPermission.PRODUCTS_PUBLISH,
    AdminPermission.PRODUCTS_UNPUBLISH,
    AdminPermission.PRODUCTS_MANAGE_INVENTORY,
    AdminPermission.PRODUCTS_MANAGE_PRICING,
    AdminPermission.PRODUCTS_MANAGE_CATEGORIES,
    AdminPermission.PRODUCTS_EXPORT,

    // Orders (limited)
    AdminPermission.ORDERS_VIEW,
    AdminPermission.ORDERS_VIEW_DETAILS,
    AdminPermission.ORDERS_EDIT,
    AdminPermission.ORDERS_CANCEL,
    AdminPermission.ORDERS_REFUND,
    AdminPermission.ORDERS_CHANGE_STATUS,
    AdminPermission.ORDERS_ASSIGN_DELIVERY,
    AdminPermission.ORDERS_VIEW_PAYMENTS,
    AdminPermission.ORDERS_EXPORT,

    // Analytics (limited)
    AdminPermission.ANALYTICS_VIEW_DASHBOARD,
    AdminPermission.ANALYTICS_VIEW_USERS,
    AdminPermission.ANALYTICS_VIEW_REVENUE,
    AdminPermission.ANALYTICS_VIEW_PRODUCTS,
    AdminPermission.ANALYTICS_VIEW_ORDERS,
    AdminPermission.ANALYTICS_CREATE_REPORT,
    AdminPermission.ANALYTICS_EXPORT_DATA,

    // System (view only)
    AdminPermission.SYSTEM_VIEW_HEALTH,
    AdminPermission.SYSTEM_VIEW_METRICS,

    // Security (view only)
    AdminPermission.SECURITY_VIEW_AUDIT_LOGS,
    AdminPermission.SECURITY_VIEW_SESSIONS,
    AdminPermission.SECURITY_VIEW_ALERTS,

    // Content (limited)
    AdminPermission.CONTENT_VIEW_BLOG,
    AdminPermission.CONTENT_CREATE_BLOG,
    AdminPermission.CONTENT_EDIT_BLOG,
    AdminPermission.CONTENT_PUBLISH_BLOG,
    AdminPermission.CONTENT_MANAGE_ACADEMY,
    AdminPermission.CONTENT_MANAGE_MEDIA,

    // Finance (limited)
    AdminPermission.FINANCE_VIEW_DASHBOARD,
    AdminPermission.FINANCE_VIEW_TRANSACTIONS,
    AdminPermission.FINANCE_VIEW_REVENUE,
    AdminPermission.FINANCE_MANAGE_INVOICES,
    AdminPermission.FINANCE_PROCESS_REFUNDS,
  ],

  [AdminRole.SUPPORT]: [
    // Users (read only)
    AdminPermission.USERS_VIEW,
    AdminPermission.USERS_VIEW_DETAILS,
    AdminPermission.USERS_RESET_PASSWORD,
    AdminPermission.USERS_VIEW_SESSIONS,

    // Products (read only)
    AdminPermission.PRODUCTS_VIEW,
    AdminPermission.PRODUCTS_VIEW_DETAILS,

    // Orders (read only)
    AdminPermission.ORDERS_VIEW,
    AdminPermission.ORDERS_VIEW_DETAILS,
    AdminPermission.ORDERS_VIEW_PAYMENTS,

    // Analytics (read only)
    AdminPermission.ANALYTICS_VIEW_DASHBOARD,
    AdminPermission.ANALYTICS_VIEW_USERS,
    AdminPermission.ANALYTICS_VIEW_PRODUCTS,
    AdminPermission.ANALYTICS_VIEW_ORDERS,

    // System (health only)
    AdminPermission.SYSTEM_VIEW_HEALTH,

    // Content (read only)
    AdminPermission.CONTENT_VIEW_BLOG,
  ],
};

/**
 * Permissions that require 2FA
 */
export const CRITICAL_PERMISSIONS = new Set<AdminPermission>([
  AdminPermission.USERS_DELETE,
  AdminPermission.USERS_MANAGE_ROLES,
  AdminPermission.SYSTEM_MANAGE_SERVICES,
  AdminPermission.SYSTEM_MANAGE_CONFIG,
  AdminPermission.SYSTEM_BACKUP,
  AdminPermission.SYSTEM_RESTORE,
  AdminPermission.SECURITY_MANAGE_PERMISSIONS,
  AdminPermission.SECURITY_MANAGE_ROLES,
]);

/**
 * Permissions that support rollback
 */
export const ROLLBACK_PERMISSIONS = new Set<AdminPermission>([
  AdminPermission.USERS_DELETE,
  AdminPermission.USERS_MANAGE_ROLES,
  AdminPermission.PRODUCTS_DELETE,
  AdminPermission.SYSTEM_MANAGE_CONFIG,
  AdminPermission.SECURITY_MANAGE_PERMISSIONS,
]);

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: AdminRole, permission: AdminPermission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return rolePermissions.includes(permission);
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: AdminRole, permissions: AdminPermission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: AdminRole, permissions: AdminPermission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Check if a permission requires critical authentication (2FA)
 */
export function requiresCriticalAuth(permission: AdminPermission): boolean {
  return CRITICAL_PERMISSIONS.has(permission);
}

/**
 * Check if a permission supports rollback
 */
export function supportsRollback(permission: AdminPermission): boolean {
  return ROLLBACK_PERMISSIONS.has(permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: AdminRole): AdminPermission[] {
  return ROLE_PERMISSIONS[role];
}

/**
 * Check if role1 has higher level than role2
 */
export function hasHigherRole(role1: AdminRole, role2: AdminRole): boolean {
  return ROLE_LEVELS[role1] > ROLE_LEVELS[role2];
}
