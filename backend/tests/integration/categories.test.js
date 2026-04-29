import request from 'supertest';
import app from '../../src/app.js';
import { clearDatabase, createTestUser, closeDatabase, createTestCategory } from '../helpers/test-setup.js';
import { pool } from '../../src/config/database.js';

describe('Categories API Integration', () => {
  let user;
  let token;

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
    ({ user, token } = await createTestUser());
  });

  describe('POST /api/categories', () => {
    test('새로운 카테고리를 생성한다', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Work',
          colorCode: '#FF0000',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Work');
    });

    test('중복된 이름의 카테고리는 생성할 수 없다', async () => {
      await createTestCategory(user.id, 'Work');

      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Work',
          colorCode: '#00FF00',
        });

      expect(res.status).toBe(409);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    test('카테고리를 삭제하면 연결된 할일의 categoryId가 null이 된다', async () => {
      const category = await createTestCategory(user.id);
      const todoResult = await pool.query(
        'INSERT INTO todos (user_id, category_id, title) VALUES ($1, $2, $3) RETURNING *',
        [user.id, category.id, 'Test Todo']
      );
      const todoId = todoResult.rows[0].id;

      const res = await request(app)
        .delete(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);

      const checkTodo = await pool.query('SELECT category_id FROM todos WHERE id = $1', [todoId]);
      expect(checkTodo.rows[0].category_id).toBeNull();
    });
  });
});
