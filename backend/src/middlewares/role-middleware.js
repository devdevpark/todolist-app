import { USER_ROLE } from '../constants/user-role.js';
import { ERROR_CODES } from '../constants/error-codes.js';
import { AppError } from './error-handler.js';

export function requireAdmin(req, res, next) {
  if (req.user?.role !== USER_ROLE.ADMIN) {
    return next(new AppError('Forbidden', ERROR_CODES.FORBIDDEN, 403));
  }
  next();
}
