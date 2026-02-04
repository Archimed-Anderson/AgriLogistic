import { create } from 'zustand';

export type Action = 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export' | 'assign';
export type Resource =
  | 'Parcels'
  | 'Offers'
  | 'Contracts'
  | 'Trucks'
  | 'Users'
  | 'Financial_Transactions'
  | 'System_Config';
export type Scope = 'Own' | 'Team' | 'Region' | 'Global';

export interface Permission {
  resource: Resource;
  actions: Action[];
  scope: Scope;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem?: boolean;
  inheritedFrom?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  roleName: string;
  action: Action;
  resource: Resource;
  targetId: string;
  timestamp: string;
  status: 'allowed' | 'denied';
  metadata?: any;
}

interface RbacStore {
  roles: Role[];
  selectedRole: Role | null;
  auditLogs: AuditLog[];
  impersonatingAs: string | null; // Role ID

  selectRole: (role: Role | null) => void;
  updatePermission: (roleId: string, resource: Resource, action: Action, enabled: boolean) => void;
  updateScope: (roleId: string, resource: Resource, scope: Scope) => void;
  addRole: (role: Role) => void;
  setImpersonation: (roleId: string | null) => void;
}

export const useRbacStore = create<RbacStore>((set) => ({
  roles: [
    {
      id: 'role-admin',
      name: 'Admin',
      description: 'Accès total au système, gestion des configurations critiques.',
      isSystem: true,
      permissions: [
        {
          resource: 'Parcels',
          actions: ['create', 'read', 'update', 'delete', 'approve', 'export'],
          scope: 'Global',
        },
        {
          resource: 'Users',
          actions: ['create', 'read', 'update', 'delete', 'assign'],
          scope: 'Global',
        },
        { resource: 'System_Config', actions: ['read', 'update'], scope: 'Global' },
      ],
    },
    {
      id: 'role-ops',
      name: 'Ops Manager',
      description: 'Supervision des opérations logistiques et validation des contrats.',
      permissions: [
        { resource: 'Trucks', actions: ['read', 'update', 'assign'], scope: 'Region' },
        { resource: 'Contracts', actions: ['read', 'approve'], scope: 'Region' },
      ],
    },
    {
      id: 'role-auditor',
      name: 'Auditor',
      description: 'Consultation et export des données pour audit de conformité.',
      permissions: [
        { resource: 'Financial_Transactions', actions: ['read', 'export'], scope: 'Global' },
      ],
    },
  ],
  selectedRole: null,
  impersonatingAs: null,
  auditLogs: [
    {
      id: 'audit-1',
      userId: 'u-452',
      userName: 'Mamadou Diallo',
      roleName: 'Support',
      action: 'read',
      resource: 'Financial_Transactions',
      targetId: 'TX-9908',
      timestamp: '2024-03-21T10:15:00Z',
      status: 'denied',
      metadata: { reason: 'Unauthorized sensitive data access' },
    },
  ],

  selectRole: (role) => set({ selectedRole: role }),

  updatePermission: (roleId, resource, action, enabled) =>
    set((state) => ({
      roles: state.roles.map((role) => {
        if (role.id !== roleId) return role;
        const permissions = [...role.permissions];
        const permIndex = permissions.findIndex((p) => p.resource === resource);

        if (permIndex > -1) {
          const actions = enabled
            ? [...new Set([...permissions[permIndex].actions, action])]
            : permissions[permIndex].actions.filter((a) => a !== action);
          permissions[permIndex] = { ...permissions[permIndex], actions };
        } else if (enabled) {
          permissions.push({ resource, actions: [action], scope: 'Own' });
        }

        return { ...role, permissions };
      }),
    })),

  updateScope: (roleId, resource, scope) =>
    set((state) => ({
      roles: state.roles.map((role) => {
        if (role.id !== roleId) return role;
        const permissions = role.permissions.map((p) =>
          p.resource === resource ? { ...p, scope } : p
        );
        return { ...role, permissions };
      }),
    })),

  addRole: (role) => set((state) => ({ roles: [...state.roles, role] })),
  setImpersonation: (roleId) => set({ impersonatingAs: roleId }),
}));
