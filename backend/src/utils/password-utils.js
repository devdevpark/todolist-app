import bcrypt from 'bcrypt';

export async function hashPassword(password) {
  const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
  return bcrypt.hash(password, rounds);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
