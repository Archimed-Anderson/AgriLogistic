export type UserRole = 'admin' | 'buyer' | 'farmer' | 'transporter';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  permissions?: string[];
}

export interface Permission {
  id: string;
  name: string;
  category: 'Analytics' | 'Finances' | 'Users' | 'System';
  description?: string;
}

export type AuditAction =
  | 'IMPERSONATE_START'
  | 'IMPERSONATE_STOP'
  | 'ROLE_UPDATE'
  | 'PERMISSION_UPDATE'
  | 'USER_SUSPEND'
  | 'LOGIN';

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: AuditAction;
  targetUserId: string;
  targetUserName?: string;
  timestamp: string;
  details: string;
}
