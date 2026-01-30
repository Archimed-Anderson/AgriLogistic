import { Pool } from 'pg';
import { Database } from '../config/database';
import { User, CreateUserDTO, UpdateUserDTO } from '../models/user.model';

export class UserRepository {
  private db: Pool;

  constructor() {
    this.db = Database.getInstance();
  }

  /**
   * Find user by ID
   */
  async findById(userId: string): Promise<User | null> {
    const query = `
      SELECT id, email, password_hash as "passwordHash", first_name as "firstName", 
             last_name as "lastName", role, email_verified as "emailVerified", 
             phone, phone_verified as "phoneVerified", avatar_url as "avatarUrl",
             created_at as "createdAt", updated_at as "updatedAt", deleted_at as "deletedAt"
      FROM users
      WHERE id = $1 AND deleted_at IS NULL
    `;
    
    const result = await this.db.query(query, [userId]);
    return result.rows[0] || null;
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, email, password_hash as "passwordHash", first_name as "firstName", 
             last_name as "lastName", role, email_verified as "emailVerified", 
             phone, phone_verified as "phoneVerified", avatar_url as "avatarUrl",
             created_at as "createdAt", updated_at as "updatedAt", deleted_at as "deletedAt"
      FROM users
      WHERE email = $1 AND deleted_at IS NULL
    `;
    
    const result = await this.db.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Create new user
   */
  async create(userData: CreateUserDTO & { passwordHash?: string }): Promise<User> {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, role, phone, avatar_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, email, password_hash as "passwordHash", first_name as "firstName", 
                last_name as "lastName", role, email_verified as "emailVerified", 
                phone, phone_verified as "phoneVerified", avatar_url as "avatarUrl",
                created_at as "createdAt", updated_at as "updatedAt", deleted_at as "deletedAt"
    `;

    const values = [
      userData.email,
      userData.passwordHash || null,
      userData.firstName,
      userData.lastName,
      userData.role || 'buyer',
      userData.phone || null,
      userData.avatarUrl || null,
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  /**
   * Update user
   */
  async update(userId: string, updates: UpdateUserDTO): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.firstName !== undefined) {
      fields.push(`first_name = $${paramIndex++}`);
      values.push(updates.firstName);
    }
    if (updates.lastName !== undefined) {
      fields.push(`last_name = $${paramIndex++}`);
      values.push(updates.lastName);
    }
    if (updates.phone !== undefined) {
      fields.push(`phone = $${paramIndex++}`);
      values.push(updates.phone);
    }
    if (updates.avatarUrl !== undefined) {
      fields.push(`avatar_url = $${paramIndex++}`);
      values.push(updates.avatarUrl);
    }
    if (updates.emailVerified !== undefined) {
      fields.push(`email_verified = $${paramIndex++}`);
      values.push(updates.emailVerified);
    }
    if (updates.phoneVerified !== undefined) {
      fields.push(`phone_verified = $${paramIndex++}`);
      values.push(updates.phoneVerified);
    }

    if (fields.length === 0) {
      return this.findById(userId);
    }

    values.push(userId);
    const query = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id, email, password_hash as "passwordHash", first_name as "firstName", 
                last_name as "lastName", role, email_verified as "emailVerified", 
                phone, phone_verified as "phoneVerified", avatar_url as "avatarUrl",
                created_at as "createdAt", updated_at as "updatedAt", deleted_at as "deletedAt"
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Soft delete user
   */
  async softDelete(userId: string): Promise<boolean> {
    const query = `
      UPDATE users
      SET deleted_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
    `;
    
    const result = await this.db.query(query, [userId]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const query = `
      SELECT 1 FROM users WHERE email = $1 AND deleted_at IS NULL
    `;
    
    const result = await this.db.query(query, [email]);
    return result.rows.length > 0;
  }

  /**
   * Update password
   */
  async updatePassword(userId: string, passwordHash: string): Promise<boolean> {
    const query = `
      UPDATE users
      SET password_hash = $1
      WHERE id = $2 AND deleted_at IS NULL
    `;
    
    const result = await this.db.query(query, [passwordHash, userId]);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * List users (with pagination)
   */
  async list(page: number = 1, limit: number = 20): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) FROM users WHERE deleted_at IS NULL';
    const countResult = await this.db.query(countQuery);
    const total = parseInt(countResult.rows[0].count, 10);

    const query = `
      SELECT id, email, password_hash as "passwordHash", first_name as "firstName", 
             last_name as "lastName", role, email_verified as "emailVerified", 
             phone, phone_verified as "phoneVerified", avatar_url as "avatarUrl",
             created_at as "createdAt", updated_at as "updatedAt", deleted_at as "deletedAt"
      FROM users
      WHERE deleted_at IS NULL
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const result = await this.db.query(query, [limit, offset]);

    return {
      users: result.rows,
      total,
    };
  }
}
