import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SUPPORT = 'SUPPORT',
}

interface AdminUserAttributes {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: AdminRole;
  is_active: boolean;
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  phone?: string;
  avatar?: string;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

interface AdminUserCreationAttributes extends Optional<AdminUserAttributes, 'id' | 'created_at' | 'updated_at' | 'last_login'> {}

class AdminUser extends Model<AdminUserAttributes, AdminUserCreationAttributes> implements AdminUserAttributes {
  public id!: string;
  public email!: string;
  public name!: string;
  public password_hash!: string;
  public role!: AdminRole;
  public is_active!: boolean;
  public two_factor_enabled!: boolean;
  public two_factor_secret?: string;
  public phone?: string;
  public avatar?: string;
  public last_login?: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Methods
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }

  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  public toJSON(): Partial<AdminUserAttributes> {
    const values = { ...this.get() };
    delete (values as any).password_hash;
    delete (values as any).two_factor_secret;
    return values;
  }
}

AdminUser.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(AdminRole)),
      allowNull: false,
      defaultValue: AdminRole.SUPPORT,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    two_factor_secret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'admin_users',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default AdminUser;
