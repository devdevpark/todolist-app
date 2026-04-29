import request from 'supertest';
import app from '../../src/app.js';
import { clearDatabase, createTestUser, closeDatabase } from '../helpers/test-setup.js';

describe('Admin API Integration', () => {
  let admin;
  let adminToken;
  let user;
  let userToken;

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    ({ user: admin, token: adminToken } = await createTestUser('admin_user', 'ADMIN'));
    ({ user, token: userToken } = await createTestUser('normal_user', 'USER'));
  });

  describe('GET /api/admin/users', () => {
    test('ADMIN은 모든 사용자 목록을 가져올 수 있다', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      // admin, admin_user, normal_user 총 3명
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);
    });

    test('USER는 관리자 API에 접근할 수 없다', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/admin/users/:id/status', () => {
    test('사용자 상태를 비활성화한다', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${user.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });

      expect(res.status).toBe(200);
      expect(res.body.data.isActive).toBe(false);
    });

    test('비활성화된 사용자는 로그인할 수 없다', async () => {
      // 상태 비활성화
      await request(app)
        .patch(`/api/admin/users/${user.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });

      // 로그인 시도
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'normal_user', password: 'password123' });

      expect(res.status).toBe(401);
      expect(res.body.error.code).toBe('ACCOUNT_DISABLED');
    });
  });
});
