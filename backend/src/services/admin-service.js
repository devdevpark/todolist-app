import { findAll, findById, updateStatus } from '../repositories/user-repository.js';
import { AppError } from '../middlewares/error-handler.js';
import { ERROR_CODES } from '../constants/error-codes.js';

export function toUserDto(row) {
  return {
    id: row.id,
    username: row.username,
    role: row.role,
    isActive: row.is_active,
    createdAt: row.created_at,
  };
}

export async function getAllUsers() {
  const rows = await findAll();
  return rows.map(toUserDto);
}

export async function updateUserStatus(id, isActive) {
  const user = await findById(id);

  if (!user) {
    throw new AppError('유저를 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  if (user.username === 'admin') {
    throw new AppError(
      '관리자 계정은 비활성화할 수 없습니다.',
      ERROR_CODES.ADMIN_DEACTIVATION_FORBIDDEN,
      400
    );
  }

  const updated = await updateStatus(id, isActive);
  return toUserDto(updated);
}
