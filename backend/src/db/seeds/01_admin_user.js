import bcrypt from 'bcrypt';
import { pool } from '../../config/database.js';

const seedAdminUser = async () => {
  const username = 'admin';
  const plainPassword = 'admin';
  const role = 'ADMIN';
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

  try {
    // 1. 기존 유저 확인
    const checkRes = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

    if (checkRes.rows.length > 0) {
      console.log(`Admin user '${username}' already exists. Skipping seed.`);
      return;
    }

    // 2. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // 3. 인서트
    await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3)',
      [username, hashedPassword, role]
    );

    console.log(`Admin user '${username}' seeded successfully.`);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  }
};

// 직접 실행될 경우
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  seedAdminUser()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default seedAdminUser;
