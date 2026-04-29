import request from 'supertest';
import app from '../../src/app.js';
import { clearDatabase, closeDatabase } from '../helpers/test-setup.js';

describe('Auth API Integration', () => {
  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/auth/register', () => {
    test('성공적으로 회원가입한다', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.username).toBe('newuser');
      expect(res.body.data.password).toBeUndefined();
    });

    test('중복된 username은 409를 반환한다', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'user1', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'user1', password: 'password123' });

      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    test('성공적으로 로그인한다', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'user1', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'user1', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.username).toBe('user1');
    });

    test('잘못된 비밀번호는 401을 반환한다', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'user1', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'user1', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });
  });
});
