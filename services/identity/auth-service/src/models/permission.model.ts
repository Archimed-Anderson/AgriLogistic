export enum UserRole {
  ADMIN = 'admin',
  BUYER = 'buyer',
  TRANSPORTER = 'transporter',
}
export enum PermissionCategory {
  USER_MANAGEMENT = 'user_management',
  PRODUCT_MANAGEMENT = 'product_management',
  ORDER_MANAGEMENT = 'order_management',
  DELIVERY_MANAGEMENT = 'delivery_management',
  CART_MANAGEMENT = 'cart_management',
  PROFILE_MANAGEMENT = 'profile_management',
  REVIEW_MANAGEMENT = 'review_management',
  ANALYTICS = 'analytics',
  SYSTEM_MANAGEMENT = 'system_management',
}
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: PermissionCategory;
  createdAt: Date;
}
export interface RolePermission {
  role: UserRole;
  permissionId: string;
  createdAt: Date;
}
// Admin permissions (all permissions)
export const AdminPermissions = ['*'];
// Buyer permissions
export const BuyerPermissions = [
  'product:browse',
  'product:search',
  'order:create',
  'order:view_own',
  'order:cancel_own',
  'delivery:track',
  'cart:manage',
  'wishlist:manage',
  'profile:view_own',
  'profile:update_own',
  'review:create',
  'review:update_own',
];
// Transporter permissions
export const TransporterPermissions = [
  'delivery:view_assigned',
  'delivery:update_status',
  'delivery:track',
  'delivery:confirm',
  'profile:view_own',
  'profile:update_own',
];
// Helper function to get permissions by role
export function getPermissionsByRole(role: UserRole): string[] {
  switch (role) {
    case UserRole.ADMIN:
      return AdminPermissions;
    case UserRole.BUYER:
      return BuyerPermissions;
    case UserRole.TRANSPORTER:
      return TransporterPermissions;
    default:
      return [];
  }
}
// Permission check helper
export function hasPermission(userPermissions: string[], required: string): boolean {
  // Admin has all permissions
  if (userPermissions.includes('*')) {
    return true;
  }
  // Check exact permission
  if (userPermissions.includes(required)) {
    return true;
  }
  // Check wildcard permission (e.g., "product:*" matches "product:create")
  const [category] = required.split(':');
  return userPermissions.includes(`${category}:*`);
}
// Permission validation
export function isValidPermission(permission: string): boolean {
  const permissionPattern = /^[a-z_]+:[a-z_*]+$/;
  return permissionPattern.test(permission);
}
