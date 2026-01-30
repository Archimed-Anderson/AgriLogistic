import AdminUser from './AdminUser';
import AuditLog from './AuditLog';

// Define associations
AdminUser.hasMany(AuditLog, {
  foreignKey: 'admin_user_id',
  as: 'auditLogs',
});

AuditLog.belongsTo(AdminUser, {
  foreignKey: 'admin_user_id',
  as: 'adminUser',
});

export { AdminUser, AuditLog };
