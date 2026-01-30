import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum AuditStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

interface AuditLogAttributes {
  id: string;
  admin_user_id: string;
  action: string;
  resource: string;
  resource_id?: string;
  status: AuditStatus;
  ip_address: string;
  user_agent: string;
  metadata?: object;
  timestamp: Date;
}

interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'timestamp'> {}

class AuditLog extends Model<AuditLogAttributes, AuditLogCreationAttributes> implements AuditLogAttributes {
  public id!: string;
  public admin_user_id!: string;
  public action!: string;
  public resource!: string;
  public resource_id?: string;
  public status!: AuditStatus;
  public ip_address!: string;
  public user_agent!: string;
  public metadata?: object;
  public readonly timestamp!: Date;
}

AuditLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    admin_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'admin_users',
        key: 'id',
      },
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resource: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resource_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AuditStatus)),
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'audit_logs',
    underscored: true,
    timestamps: false,
  }
);

export default AuditLog;
