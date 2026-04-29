import { AppError } from '../error-handler.js';
import { ERROR_CODES } from '../../constants/error-codes.js';

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;

export function validateCreateCategory(req, res, next) {
  const { name, colorCode } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return next(new AppError('name은 필수입니다.', ERROR_CODES.VALIDATION_ERROR, 400));
  }

  if (name.length > 50) {
    return next(
      new AppError('name은 50자를 초과할 수 없습니다.', ERROR_CODES.VALIDATION_ERROR, 400)
    );
  }

  if (!colorCode || !HEX_COLOR_REGEX.test(colorCode)) {
    return next(
      new AppError(
        'colorCode는 #RRGGBB 형식의 hex 색상이어야 합니다.',
        ERROR_CODES.VALIDATION_ERROR,
        400
      )
    );
  }

  next();
}

export function validateUpdateCategory(req, res, next) {
  const { name, colorCode } = req.body;

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim().length === 0) {
      return next(
        new AppError('name은 비어있을 수 없습니다.', ERROR_CODES.VALIDATION_ERROR, 400)
      );
    }
    if (name.length > 50) {
      return next(
        new AppError('name은 50자를 초과할 수 없습니다.', ERROR_CODES.VALIDATION_ERROR, 400)
      );
    }
  }

  if (colorCode !== undefined && !HEX_COLOR_REGEX.test(colorCode)) {
    return next(
      new AppError(
        'colorCode는 #RRGGBB 형식의 hex 색상이어야 합니다.',
        ERROR_CODES.VALIDATION_ERROR,
        400
      )
    );
  }

  next();
}
