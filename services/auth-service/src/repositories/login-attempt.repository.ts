import { Pool } from 'pg';
import { Database } from '../config/database';

export interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  success: boolean;
  attemptedAt: Date;
}

export interface CreateLoginAttemptDTO {
  email: string;
  ipAddress: string;
  success: boolean;
}

export class LoginAttemptRepository {
  private db: Pool;

  constructor() {
    this.db = Database.getInstance();
  }

  /**
   * Record a login attempt
   */
  async recordAttempt(data: CreateLoginAttemptDTO): Promise<LoginAttempt> {
    const query = `
      INSERT INTO login_attempts (email, ip_address, success)
      VALUES ($1, $2, $3)
      RETURNING id, email, ip_address as "ipAddress", success, attempted_at as "attemptedAt"
    `;

    const result = await this.db.query(query, [
      data.email,
      data.ipAddress,
      data.success,
    ]);

    return result.rows[0];
  }

  /**
   * Get failed login attempts for an email in the last N minutes
   * @param email - Email address
   * @param minutes - Number of minutes to look back (default: 15)
   */
  async getFailedAttempts(email: string, minutes: number = 15): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM login_attempts
      WHERE email = $1
        AND success = false
        AND attempted_at > NOW() - INTERVAL '${minutes} minutes'
    `;

    const result = await this.db.query(query, [email]);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Get failed login attempts for an IP address in the last N minutes
   * @param ipAddress - IP address
   * @param minutes - Number of minutes to look back (default: 15)
   */
  async getFailedAttemptsByIP(ipAddress: string, minutes: number = 15): Promise<number> {
    const query = `
      SELECT COUNT(*) as count
      FROM login_attempts
      WHERE ip_address = $1
        AND success = false
        AND attempted_at > NOW() - INTERVAL '${minutes} minutes'
    `;

    const result = await this.db.query(query, [ipAddress]);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Clear successful login attempts for an email (after successful login)
   */
  async clearAttempts(_email: string): Promise<void> {
    // We don't actually delete, but we could mark them as cleared
    // For now, we just rely on the time-based queries
    // This method is here for future use if needed
  }

  /**
   * Get all failed attempts for an email
   * @param email - Email address
   * @param limit - Maximum number of records to return
   */
  async getRecentFailedAttempts(email: string, limit: number = 10): Promise<LoginAttempt[]> {
    const query = `
      SELECT id, email, ip_address as "ipAddress", success, attempted_at as "attemptedAt"
      FROM login_attempts
      WHERE email = $1
        AND success = false
      ORDER BY attempted_at DESC
      LIMIT $2
    `;

    const result = await this.db.query(query, [email, limit]);
    return result.rows;
  }

  /**
   * Check if account should be locked due to too many failed attempts
   * @param email - Email address
   * @param maxAttempts - Maximum allowed attempts (default: 5)
   * @param minutes - Time window in minutes (default: 15)
   */
  async shouldLockAccount(email: string, maxAttempts: number = 5, minutes: number = 15): Promise<boolean> {
    const failedCount = await this.getFailedAttempts(email, minutes);
    return failedCount >= maxAttempts;
  }
}
