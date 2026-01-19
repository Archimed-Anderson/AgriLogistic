import request from 'supertest';
import express, { Application } from 'express';
import { Database } from '../../src/config/database';
import { UserRepository } from '../../src/repositories/user.repository';
import { PasswordService } from '../../src/services/password.service';
import authRoutes from '../../src/routes/auth.routes';

// Mock Redis service
const mockRedisService = {
  connect: async () => undefined,
  disconnect: async () => undefined,
  blacklistToken: async () => undefined,
  isTokenBlacklisted: async () => false,
  storeRefreshToken: async () => undefined,
  hasRefreshToken: async () => true,
  removeRefreshToken: async () => undefined,
  removeAllRefreshTokens: async () => undefined,
};

jest.mock('../../src/services/redis.service', () => ({
  // Do not wrap with jest.fn(): resetMocks would wipe the implementation.
  getRedisService: () => mockRedisService,
}));

describe('Auth Integration Tests', () => {
  let app: Application;
  let userRepository: UserRepository;
  let passwordService: PasswordService;
  let testUser: any;

  beforeAll(async () => {
    // Setup test database connection
    await Database.testConnection();

    app = express();
    app.use(express.json());
    app.use('/api/v1/auth', authRoutes);

    userRepository = new UserRepository();
    passwordService = new PasswordService();
  });

  beforeEach(async () => {
    // Create test user
    const passwordHash = await passwordService.hashPassword('TestPassword123!');
    testUser = await userRepository.create({
      email: `test${Date.now()}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      role: 'buyer',
      passwordHash,
    });
  });

  afterEach(async () => {
    // Cleanup test user
    if (testUser?.id) {
      await userRepository.softDelete(testUser.id);
    }
  });

  afterAll(async () => {
    await Database.close();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new buyer user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `newbuyer${Date.now()}@example.com`,
          password: 'SecurePass123!',
          firstName: 'New',
          lastName: 'Buyer',
          role: 'buyer',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.role).toBe('buyer');
      expect(response.body.user.permissions).toBeDefined();
      expect(response.body.expiresIn).toBeDefined();
    });

    it('should register a new transporter user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `newtransporter${Date.now()}@example.com`,
          password: 'SecurePass123!',
          firstName: 'New',
          lastName: 'Transporter',
          role: 'transporter',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user.role).toBe('transporter');
    });

    it('should reject registration with admin role', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `admin${Date.now()}@example.com`,
          password: 'SecurePass123!',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should reject weak password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: `weak${Date.now()}@example.com`,
          password: 'weak',
          firstName: 'Weak',
          lastName: 'Password',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBe(testUser.id);
      expect(response.body.user.permissions).toBeDefined();
      expect(response.body.expiresIn).toBeDefined();
    });

    it('should reject login with invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return current user info with valid token', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!',
        });

      const token = loginResponse.body.token;

      // Get user info
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.id).toBe(testUser.id);
      expect(response.body.user.permissions).toBeDefined();
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should logout successfully', async () => {
      // First login
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!',
        });

      const token = loginResponse.body.token;

      // Logout
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .send({
          refreshToken: loginResponse.body.refreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should refresh access token', async () => {
      // First login
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: testUser.email,
          password: 'TestPassword123!',
        });

      const refreshToken = loginResponse.body.refreshToken;

      // Refresh token
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({
          refreshToken,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.expiresIn).toBeDefined();
    });
  });
});
