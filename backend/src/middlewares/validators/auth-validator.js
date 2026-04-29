import { AppError } from '../error-handler.js';
import { ERROR_CODES } from '../../constants/error-codes.js';

const USERNAME_REGEX = /^[a-zA-Z0-9]{4,20}$/;

export function validateRegister(req, res, next) {
  const { username, password } = req.body;

  if (!username || !USERNAME_REGEX.test(username)) {
    return next(
      new AppError(
        'username은 4~20자의 영문 및 숫자만 허용됩니다.',
        ERROR_CODES.VALIDATION_ERROR,
        400
      )
    );
  }

  if (!password || password.length < 4) {
    return next(
      new AppError('password는 4자 이상이어야 합니다.', ERROR_CODES.VALIDATION_ERROR, 400)
    );
  }

  next();
}

export function validateLogin(req, res, next) {
  const { username, password } = req.body;

  if (!username) {
    return next(new AppError('username은 필수입니다.', ERROR_CODES.VALIDATION_ERROR, 400));
  }

  if (!password) {
    return next(new AppError('password는 필수입니다.', ERROR_CODES.VALIDATION_ERROR, 400));
  }

  next();
}
