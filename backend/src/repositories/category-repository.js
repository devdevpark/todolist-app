import { pool } from '../config/database.js';

export async function findAllByUserId(userId) {
  const result = await pool.query(
    'SELECT * FROM categories WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

export async function findById(id) {
  const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0] ?? null;
}

export async function findByNameAndUserId(name, userId) {
  const result = await pool.query(
    'SELECT * FROM categories WHERE name = $1 AND user_id = $2',
    [name, userId]
  );
  return result.rows[0] ?? null;
}

export async function create(userId, name, colorCode) {
  const result = await pool.query(
    `INSERT INTO categories (user_id, name, color_code)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, name, colorCode]
  );
  return result.rows[0];
}

export async function update(id, name, colorCode) {
  const result = await pool.query(
    `UPDATE categories
     SET name = $1, color_code = $2
     WHERE id = $3
     RETURNING *`,
    [name, colorCode, id]
  );
  return result.rows[0] ?? null;
}

export async function deleteById(id) {
  await pool.query('DELETE FROM categories WHERE id = $1', [id]);
}
