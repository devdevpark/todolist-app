import request from 'supertest';
import app from '../../src/app.js';
import {
  clearDatabase,
  createTestUser,
  createTestCategory,
  createTestTodo,
  closeDatabase,
} from '../helpers/test-setup.js';

describe('Todos API Integration', () => {
  let user;
  let token;
  let category;

  beforeAll(async () => {
    // DB 연결이 안되면 에러가 날 수 있으니 체크가 필요함
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    ({ user, token } = await createTestUser());
    category = await createTestCategory(user.id);
  });

  describe('POST /api/todos', () => {
    test('새로운 할일을 생성한다', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Todo',
          description: 'Description',
          categoryId: category.id,
          dueDate: new Date(Date.now() + 86400000).toISOString(),
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Todo');
      expect(res.body.data.categoryId).toBe(category.id);
    });

    test('제목이 없으면 400을 반환한다', async () => {
      const res = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'No Title',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/todos', () => {
    test('본인의 할일 목록을 가져온다', async () => {
      await createTestTodo(user.id, category.id, 'Todo 1');
      await createTestTodo(user.id, category.id, 'Todo 2');

      const res = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    test('카테고리 필터가 작동한다', async () => {
      const cat2 = await createTestCategory(user.id, 'Other Cat');
      await createTestTodo(user.id, category.id, 'Todo in Cat 1');
      await createTestTodo(user.id, cat2.id, 'Todo in Cat 2');

      const res = await request(app)
        .get(`/api/todos?categoryId=${category.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].title).toBe('Todo in Cat 1');
    });
  });

  describe('PATCH /api/todos/:id/complete', () => {
    test('할일을 완료 처리한다', async () => {
      const todo = await createTestTodo(user.id, category.id);

      const res = await request(app)
        .patch(`/api/todos/${todo.id}/complete`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('COMPLETED');
      expect(res.body.data.completedAt).not.toBeNull();
    });
  });

  describe('DELETE /api/todos/:id', () => {
    test('할일을 삭제한다', async () => {
      const todo = await createTestTodo(user.id, category.id);

      const res = await request(app)
        .delete(`/api/todos/${todo.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeNull();

      const getRes = await request(app)
        .get(`/api/todos/${todo.id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(getRes.status).toBe(404);
    });
  });
});
