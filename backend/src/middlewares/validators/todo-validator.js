import { AppError } from '../error-handler.js';
import { ERROR_CODES } from '../../constants/error-codes.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateCreateTodo(req, res, next) {
  const { title, description, categoryId, dueDate } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return next(new AppError('title은 필수입니다.', ERROR_CODES.VALIDATION_ERROR, 400));
  }

  if (title.length > 200) {
    return next(
      new AppError('title은 200자를 초과할 수 없습니다.', ERROR_CODES.VALIDATION_ERROR, 400)
    );
  }

  if (description !== undefined && description !== null && description.length > 1000) {
    return next(
      new AppError(
        'description은 1000자를 초과할 수 없습니다.',
        ERROR_CODES.VALIDATION_ERROR,
        400
      )
    );
  }

  if (categoryId && !UUID_REGEX.test(categoryId)) {
    return next(
      new AppError('categoryId는 유효한 UUID여야 합니다.', ERROR_CODES.VALIDATION_ERROR, 400)
    );
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    return next(
      new AppError('dueDate는 유효한 날짜 형식이어야 합니다.', ERROR_CODES.VALIDATION_ERROR, 400)
    );
  }

  next();
}

export function validateUpdateTodo(req, res, next) {
  const { title, description, categoryId, dueDate } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      return next(
        new AppError('title은 비어있을 수 없습니다.', ERROR_CODES.VALIDATION_ERROR, 400)
      );
    }
    if (title.length > 200) {
      return next(
        new AppError('title은 200자를 초과할 수 없습니다.', ERROR_CODES.VALIDATION_ERROR, 400)
      );
    }
  }

  if (description !== undefined && description !== null && description.length > 1000) {
    return next(
      new AppError(
        'description은 1000자를 초과할 수 없습니다.',
        ERROR_CODES.VALIDATION_ERROR,
        400
      )
    );
  }

  if (categoryId && !UUID_REGEX.test(categoryId)) {
    return next(
      new AppError('categoryId는 유효한 UUID여야 합니다.', ERROR_CODES.VALIDATION_ERROR, 400)
    );
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    return next(
      new AppError('dueDate는 유효한 날짜 형식이어야 합니다.', ERROR_CODES.VALIDATION_ERROR, 400)
    );
  }

  next();
}
