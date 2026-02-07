import request from 'supertest';
import express from 'express';
import usersRouter from '../../src/routes/users.routes';
import { Database } from '../../src/config/database';

// Mock Database config
jest.mock('../../src/config/database', () => ({
  Database: {
    query: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use('/users', usersRouter);

describe('User Routes Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users/profile', () => {
    it('should return 400 if x-consumer-username header is missing', async () => {
      const res = await request(app).get('/users/profile');
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Missing consumer identity headers');
    });

    it('should return user profile if header is present (existing user)', async () => {
      // Mock DB query to return an existing user
      (Database.query as jest.Mock).mockResolvedValueOnce({
        rows: [
          { 
            id: 'user-id-123', 
            username: 'testuser', 
            email: 'testuser@local.dev',
            role: 'user'
          }
        ],
      });

      const res = await request(app)
        .get('/users/profile')
        .set('x-consumer-username', 'testuser');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe('testuser');
      expect(Database.query).toHaveBeenCalledTimes(1);
    });

    it('should create new user if not exists (stub behavior)', async () => {
      // First query returns empty (user not found)
      (Database.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      
      // Second query inserts new user
      (Database.query as jest.Mock).mockResolvedValueOnce({
        rows: [
          { 
            id: 'new-uuid', 
            username: 'newuser', 
            email: 'newuser@local.dev',
            role: 'user'
          }
        ],
      });

      const res = await request(app)
        .get('/users/profile')
        .set('x-consumer-username', 'newuser');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe('newuser');
      // Should have called SELECT then INSERT
      expect(Database.query).toHaveBeenCalledTimes(2);
    });
  });
});
