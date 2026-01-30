import request from 'supertest';
import app from '../../app';
import AdminUser, { AdminRole } from '../../models/AdminUser';
import { sign } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

describe('Users API', () => {
  let authToken: string;
  let testUser: AdminUser;

  beforeEach(async () => {
    // Create test user
    testUser = await AdminUser.create({
      email: 'admin@test.com',
      name: 'Test Admin',
      password_hash: await AdminUser.hashPassword('password123'),
      role: AdminRole.ADMIN,
      is_active: true,
      two_factor_enabled: false,
    });

    // Generate test token (mock - in real tests, use actual auth-service)
    authToken = 'Bearer test-token';
  });

  describe('GET /api/v1/admin/users', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/v1/admin/users')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('should filter users by role', async () => {
      await AdminUser.create({
        email: 'support@test.com',
        name: 'Support User',
        password_hash: await AdminUser.hashPassword('password123'),
        role: AdminRole.SUPPORT,
        is_active: true,
      });

      const response = await request(app)
        .get('/api/v1/admin/users?role=SUPPORT')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(1);
      expect(response.body.users[0].role).toBe(AdminRole.SUPPORT);
    });

    it('should paginate results', async () => {
      // Create multiple users
      for (let i = 0; i < 25; i++) {
        await AdminUser.create({
          email: `user${i}@test.com`,
          name: `User ${i}`,
          password_hash: await AdminUser.hashPassword('password123'),
          role: AdminRole.SUPPORT,
          is_active: true,
        });
      }

      const response = await request(app)
        .get('/api/v1/admin/users?page=1&limit=10')
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(10);
      expect(response.body.total).toBeGreaterThan(10);
    });
  });

  describe('POST /api/v1/admin/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        email: 'newuser@test.com',
        name: 'New User',
        password: 'password123',
        role: AdminRole.SUPPORT,
      };

      const response = await request(app)
        .post('/api/v1/admin/users')
        .set('Authorization', authToken)
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(newUser.email);
      expect(response.body).not.toHaveProperty('password_hash');
    });

    it('should reject duplicate email', async () => {
      const duplicateUser = {
        email: testUser.email,
        name: 'Duplicate User',
        password: 'password123',
        role: AdminRole.SUPPORT,
      };

      const response = await request(app)
        .post('/api/v1/admin/users')
        .set('Authorization', authToken)
        .send(duplicateUser);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate required fields', async () => {
      const invalidUser = {
        email: 'invalid-email',
        // missing name and password
      };

      const response = await request(app)
        .post('/api/v1/admin/users')
        .set('Authorization', authToken)
        .send(invalidUser);

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/v1/admin/users/:id', () => {
    it('should update user details', async () => {
      const updates = {
        name: 'Updated Name',
        phone: '+1234567890',
      };

      const response = await request(app)
        .patch(`/api/v1/admin/users/${testUser.id}`)
        .set('Authorization', authToken)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updates.name);
      expect(response.body.phone).toBe(updates.phone);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .patch('/api/v1/admin/users/non-existent-id')
        .set('Authorization', authToken)
        .send({ name: 'Test' });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/v1/admin/users/:id/suspend', () => {
    it('should suspend user', async () => {
      const response = await request(app)
        .post(`/api/v1/admin/users/${testUser.id}/suspend`)
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.is_active).toBe(false);
    });
  });

  describe('POST /api/v1/admin/users/:id/activate', () => {
    it('should activate suspended user', async () => {
      await testUser.update({ is_active: false });

      const response = await request(app)
        .post(`/api/v1/admin/users/${testUser.id}/activate`)
        .set('Authorization', authToken);

      expect(response.status).toBe(200);
      expect(response.body.is_active).toBe(true);
    });
  });

  describe('DELETE /api/v1/admin/users/:id', () => {
    it('should delete user', async () => {
      const response = await request(app)
        .delete(`/api/v1/admin/users/${testUser.id}`)
        .set('Authorization', authToken);

      expect(response.status).toBe(204);

      const deletedUser = await AdminUser.findByPk(testUser.id);
      expect(deletedUser).toBeNull();
    });
  });
});
