import { apiClient } from '../api-client';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  phone?: string;
  twoFactorEnabled: boolean;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface ListUsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateUserDto {
  email: string;
  name: string;
  role: string;
  password: string;
  phone?: string;
}

export interface UpdateUserDto {
  name?: string;
  role?: string;
  phone?: string;
  isActive?: boolean;
}

/**
 * Admin Users API Repository
 */
export class AdminUsersRepository {
  private readonly basePath = '/admin/users';

  /**
   * Get list of users with pagination and filters
   */
  async listUsers(params: ListUsersParams = {}): Promise<ListUsersResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.status) queryParams.append('status', params.status);

    return apiClient.get<ListUsersResponse>(
      `${this.basePath}?${queryParams.toString()}`
    );
  }

  /**
   * Get a single user by ID
   */
  async getUser(userId: string): Promise<AdminUser> {
    return apiClient.get<AdminUser>(`${this.basePath}/${userId}`);
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserDto): Promise<AdminUser> {
    return apiClient.post<AdminUser>(this.basePath, data);
  }

  /**
   * Update an existing user
   */
  async updateUser(userId: string, data: UpdateUserDto): Promise<AdminUser> {
    return apiClient.patch<AdminUser>(`${this.basePath}/${userId}`, data);
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: string): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${userId}`);
  }

  /**
   * Suspend a user
   */
  async suspendUser(userId: string): Promise<AdminUser> {
    return apiClient.post<AdminUser>(`${this.basePath}/${userId}/suspend`);
  }

  /**
   * Activate a user
   */
  async activateUser(userId: string): Promise<AdminUser> {
    return apiClient.post<AdminUser>(`${this.basePath}/${userId}/activate`);
  }

  /**
   * Assign role to user
   */
  async assignRole(userId: string, role: string): Promise<AdminUser> {
    return apiClient.post<AdminUser>(`${this.basePath}/${userId}/role`, { role });
  }

  /**
   * Reset user password
   */
  async resetPassword(userId: string): Promise<{ temporaryPassword: string }> {
    return apiClient.post<{ temporaryPassword: string }>(
      `${this.basePath}/${userId}/reset-password`
    );
  }
}

// Export singleton instance
export const adminUsersRepository = new AdminUsersRepository();
