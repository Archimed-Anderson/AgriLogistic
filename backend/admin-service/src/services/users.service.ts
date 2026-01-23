import AdminUser, { AdminRole } from '../models/AdminUser';
import { Op } from 'sequelize';

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: AdminRole;
  status?: string;
}

export class UsersService {
  async listUsers(params: ListUsersParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (params.search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${params.search}%` } },
        { name: { [Op.iLike]: `%${params.search}%` } },
      ];
    }

    if (params.role) {
      where.role = params.role;
    }

    if (params.status) {
      where.is_active = params.status === 'active';
    }

    const { count, rows } = await AdminUser.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return {
      users: rows,
      total: count,
      page,
      limit,
    };
  }

  async getUser(id: string) {
    const user = await AdminUser.findByPk(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async createUser(data: {
    email: string;
    name: string;
    password: string;
    role: AdminRole;
    phone?: string;
  }) {
    const existingUser = await AdminUser.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const password_hash = await AdminUser.hashPassword(data.password);

    const user = await AdminUser.create({
      ...data,
      password_hash,
      is_active: true,
      two_factor_enabled: false,
    });

    return user;
  }

  async updateUser(id: string, data: {
    name?: string;
    role?: AdminRole;
    phone?: string;
    is_active?: boolean;
  }) {
    const user = await this.getUser(id);
    await user.update(data);
    return user;
  }

  async deleteUser(id: string) {
    const user = await this.getUser(id);
    await user.destroy();
  }

  async suspendUser(id: string) {
    const user = await this.getUser(id);
    await user.update({ is_active: false });
    return user;
  }

  async activateUser(id: string) {
    const user = await this.getUser(id);
    await user.update({ is_active: true });
    return user;
  }

  async assignRole(id: string, role: AdminRole) {
    const user = await this.getUser(id);
    await user.update({ role });
    return user;
  }

  async resetPassword(id: string) {
    const user = await this.getUser(id);
    const temporaryPassword = Math.random().toString(36).slice(-12);
    const password_hash = await AdminUser.hashPassword(temporaryPassword);
    await user.update({ password_hash });
    return { temporaryPassword };
  }
}

export default new UsersService();
