import { findByUsername, createUser } from '../repositories/user-repository.js';
import { hashPassword, comparePassword } from '../utils/password-utils.js';
import { signToken } from '../utils/jwt-utils.js';
import { AppError } from '../middlewares/error-handler.js';
import { ERROR_CODES } from '../constants/error-codes.js';

export async function register(username, password) {
  const existing = await findByUsername(username);
  if (existing) {
    throw new AppError('이미 사용 중인 username입니다.', ERROR_CODES.CONFLICT, 409);
  }

  const hashedPassword = await hashPassword(password);
  const user = await createUser(username, hashedPassword);

  return {
    id: user.id,
    username: user.username,
    role: user.role,
    isActive: user.is_active,
    createdAt: user.created_at,
  };
}

export async function login(username, password) {
  const user = await findByUsername(username);
  if (!user) {
    throw new AppError('username 또는 password가 올바르지 않습니다.', ERROR_CODES.UNAUTHORIZED, 401);
  }

  if (!user.is_active) {
    throw new AppError('비활성화된 계정입니다.', ERROR_CODES.ACCOUNT_DISABLED, 401);
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new AppError('username 또는 password가 올바르지 않습니다.', ERROR_CODES.UNAUTHORIZED, 401);
  }

  const token = signToken({ id: user.id, username: user.username, role: user.role });
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };
}
