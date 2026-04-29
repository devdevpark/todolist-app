import { pool } from '../config/database.js';

export async function findAll(userId, filters = {}) {
  const conditions = [];
  const params = [];

  if (userId !== null) {
    params.push(userId);
    conditions.push(`t.user_id = $${params.length}`);
  }

  if (filters.categoryId !== undefined) {
    params.push(filters.categoryId);
    conditions.push(`t.category_id = $${params.length}`);
  }

  if (filters.dbStatus !== undefined) {
    params.push(filters.dbStatus);
    conditions.push(`t.status = $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const sql = `
    SELECT t.*, c.name AS category_name, c.color_code AS category_color_code, c.created_at AS category_created_at
    FROM todos t
    LEFT JOIN categories c ON t.category_id = c.id
    ${where}
    ORDER BY t.created_at DESC
  `;

  const result = await pool.query(sql, params);
  return result.rows;
}

export async function findById(id) {
  const sql = `
    SELECT t.*, c.name AS category_name, c.color_code AS category_color_code, c.created_at AS category_created_at
    FROM todos t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.id = $1
  `;
  const result = await pool.query(sql, [id]);
  return result.rows[0] ?? null;
}

export async function create(userId, data) {
  const { title, description, categoryId, dueDate } = data;
  const result = await pool.query(
    `INSERT INTO todos (user_id, title, description, category_id, due_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, title, description ?? null, categoryId ?? null, dueDate ?? null]
  );
  return result.rows[0];
}

export async function update(id, data) {
  const { title, description, categoryId, dueDate } = data;
  const result = await pool.query(
    `UPDATE todos
     SET title = $1, description = $2, category_id = $3, due_date = $4, updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [title, description ?? null, categoryId ?? null, dueDate ?? null, id]
  );
  return result.rows[0] ?? null;
}

export async function deleteById(id) {
  await pool.query('DELETE FROM todos WHERE id = $1', [id]);
}

export async function complete(id) {
  const result = await pool.query(
    `UPDATE todos
     SET status = 'COMPLETED', completed_at = NOW(), updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0] ?? null;
}

export async function uncomplete(id) {
  const result = await pool.query(
    `UPDATE todos
     SET status = 'PENDING', completed_at = NULL, updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0] ?? null;
}
