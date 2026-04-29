import { pool } from '../../src/config/database.js';
import { signToken } from '../../src/utils/jwt-utils.js';
import { hashPassword } from '../../src/utils/password-utils.js';

export async function clearDatabase() {
  await pool.query('DELETE FROM todos');
  await pool.query('DELETE FROM categories');
  await pool.query('DELETE FROM users WHERE username != $1', ['admin']);
}

export async function createTestUser(username, role = 'USER') {
  const actualUsername = username || `user_${Math.random().toString(36).substring(7)}`;
  const password = await hashPassword('password123');
  const result = await pool.query(
    'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
    [actualUsername, password, role]
  );
  const user = result.rows[0];
  const token = signToken({ id: user.id, username: user.username, role: user.role });
  return { user, token };
}

export async function createTestCategory(userId, name = 'Test Category') {
  const result = await pool.query(
    'INSERT INTO categories (user_id, name, color_code) VALUES ($1, $2, $3) RETURNING *',
    [userId, name, '#FF0000']
  );
  return result.rows[0];
}

export async function createTestTodo(userId, categoryId, title = 'Test Todo') {
  const result = await pool.query(
    'INSERT INTO todos (user_id, category_id, title) VALUES ($1, $2, $3) RETURNING *',
    [userId, categoryId, title]
  );
  return result.rows[0];
}

export async function closeDatabase() {
  await pool.end();
}
