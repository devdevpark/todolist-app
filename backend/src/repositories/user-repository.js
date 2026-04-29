import { pool } from '../config/database.js';

export async function findByUsername(username) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0] ?? null;
}

export async function createUser(username, hashedPassword) {
  const result = await pool.query(
    `INSERT INTO users (username, password, role)
     VALUES ($1, $2, 'USER')
     RETURNING id, username, role, is_active, created_at`,
    [username, hashedPassword]
  );
  return result.rows[0];
}

export async function findById(id) {
  const result = await pool.query(
    'SELECT id, username, role, is_active, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] ?? null;
}

export async function findAll() {
  const result = await pool.query(
    'SELECT id, username, role, is_active, created_at FROM users ORDER BY created_at ASC'
  );
  return result.rows;
}

export async function updateStatus(id, isActive) {
  const result = await pool.query(
    `UPDATE users SET is_active = $1 WHERE id = $2
     RETURNING id, username, role, is_active, created_at`,
    [isActive, id]
  );
  return result.rows[0] ?? null;
}
