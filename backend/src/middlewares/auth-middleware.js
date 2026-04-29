import { verifyToken } from '../utils/jwt-utils.js';
import { ERROR_CODES } from '../constants/error-codes.js';
import { AppError } from './error-handler.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', ERROR_CODES.UNAUTHORIZED, 401));
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.id, username: payload.username, role: payload.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', ERROR_CODES.TOKEN_EXPIRED, 401));
    }
    return next(new AppError('Invalid token', ERROR_CODES.INVALID_TOKEN, 401));
  }
}
