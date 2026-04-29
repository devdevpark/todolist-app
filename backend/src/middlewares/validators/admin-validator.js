import { AppError } from '../error-handler.js';
import { ERROR_CODES } from '../../constants/error-codes.js';

export function validateUpdateUserStatus(req, res, next) {
  const { isActive } = req.body;

  if (isActive === undefined || isActive === null) {
    return next(new AppError('isActive는 필수입니다.', ERROR_CODES.VALIDATION_ERROR, 400));
  }

  if (typeof isActive !== 'boolean') {
    return next(
      new AppError('isActive는 boolean 타입이어야 합니다.', ERROR_CODES.VALIDATION_ERROR, 400)
    );
  }

  next();
}
