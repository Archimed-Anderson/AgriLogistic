/**
 * Audit Log Entity
 * Tracks all administrative actions for security and compliance
 */
export class AuditLog {
  constructor(
    public readonly id: string,
    public readonly timestamp: Date,
    public readonly adminUserId: string,
    public readonly adminUserEmail: string,
    public readonly action: string,
    public readonly resource: string,
    public readonly resourceId: string | null,
    public readonly changes: Record<string, any> | null,
    public readonly ipAddress: string,
    public readonly userAgent: string,
    public readonly status: 'success' | 'failure',
    public readonly errorMessage?: string
  ) {}

  /**
   * Create a new audit log entry
   */
  static create(data: {
    id: string;
    adminUserId: string;
    adminUserEmail: string;
    action: string;
    resource: string;
    resourceId?: string;
    changes?: Record<string, any>;
    ipAddress: string;
    userAgent: string;
    status: 'success' | 'failure';
    errorMessage?: string;
  }): AuditLog {
    return new AuditLog(
      data.id,
      new Date(),
      data.adminUserId,
      data.adminUserEmail,
      data.action,
      data.resource,
      data.resourceId || null,
      data.changes || null,
      data.ipAddress,
      data.userAgent,
      data.status,
      data.errorMessage
    );
  }

  /**
   * Check if this is a critical action
   */
  isCritical(): boolean {
    const criticalActions = [
      'delete_user',
      'assign_admin_role',
      'manage_permissions',
      'system_config_change',
      'backup_create',
      'backup_restore',
    ];

    return criticalActions.some((action) => this.action.toLowerCase().includes(action));
  }

  /**
   * Check if action was successful
   */
  isSuccess(): boolean {
    return this.status === 'success';
  }

  /**
   * Check if action failed
   */
  isFailure(): boolean {
    return this.status === 'failure';
  }

  /**
   * Get formatted timestamp
   */
  getFormattedTimestamp(): string {
    return this.timestamp.toISOString();
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp.toISOString(),
      adminUserId: this.adminUserId,
      adminUserEmail: this.adminUserEmail,
      action: this.action,
      resource: this.resource,
      resourceId: this.resourceId,
      changes: this.changes,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      status: this.status,
      errorMessage: this.errorMessage,
    };
  }
}
