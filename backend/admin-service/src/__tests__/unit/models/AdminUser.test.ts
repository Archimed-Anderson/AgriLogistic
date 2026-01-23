import AdminUser, { AdminRole } from '../../models/AdminUser';

describe('AdminUser Model', () => {
  describe('Password hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testpassword123';
      const hash = await AdminUser.hashPassword(password);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it('should validate correct password', async () => {
      const password = 'testpassword123';
      const user = await AdminUser.create({
        email: 'test@example.com',
        name: 'Test User',
        password_hash: await AdminUser.hashPassword(password),
        role: AdminRole.SUPPORT,
        is_active: true,
      });

      const isValid = await user.validatePassword(password);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const user = await AdminUser.create({
        email: 'test@example.com',
        name: 'Test User',
        password_hash: await AdminUser.hashPassword('correctpassword'),
        role: AdminRole.SUPPORT,
        is_active: true,
      });

      const isValid = await user.validatePassword('wrongpassword');
      expect(isValid).toBe(false);
    });
  });

  describe('User creation', () => {
    it('should create user with valid data', async () => {
      const userData = {
        email: 'newuser@example.com',
        name: 'New User',
        password_hash: await AdminUser.hashPassword('password123'),
        role: AdminRole.MANAGER,
        is_active: true,
      };

      const user = await AdminUser.create(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe(userData.role);
      expect(user.created_at).toBeDefined();
    });

    it('should enforce unique email constraint', async () => {
      const email = 'duplicate@example.com';

      await AdminUser.create({
        email,
        name: 'User 1',
        password_hash: await AdminUser.hashPassword('password123'),
        role: AdminRole.SUPPORT,
        is_active: true,
      });

      await expect(
        AdminUser.create({
          email,
          name: 'User 2',
          password_hash: await AdminUser.hashPassword('password123'),
          role: AdminRole.SUPPORT,
          is_active: true,
        })
      ).rejects.toThrow();
    });

    it('should validate email format', async () => {
      await expect(
        AdminUser.create({
          email: 'invalid-email',
          name: 'Test User',
          password_hash: await AdminUser.hashPassword('password123'),
          role: AdminRole.SUPPORT,
          is_active: true,
        })
      ).rejects.toThrow();
    });
  });

  describe('toJSON method', () => {
    it('should exclude sensitive fields', async () => {
      const user = await AdminUser.create({
        email: 'test@example.com',
        name: 'Test User',
        password_hash: await AdminUser.hashPassword('password123'),
        role: AdminRole.SUPPORT,
        is_active: true,
        two_factor_secret: 'secret123',
      });

      const json = user.toJSON();

      expect(json).not.toHaveProperty('password_hash');
      expect(json).not.toHaveProperty('two_factor_secret');
      expect(json).toHaveProperty('email');
      expect(json).toHaveProperty('name');
    });
  });
});
