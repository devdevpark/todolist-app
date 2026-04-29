import { jest } from '@jest/globals';
import { validateUpdateUserStatus } from './admin-validator.js';
import { AppError } from '../error-handler.js';
import { ERROR_CODES } from '../../constants/error-codes.js';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-key-must-be-long-enough-for-hs512-algorithm-64chars-min';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.DB_HOST = 'test';
  process.env.DB_USER = 'test';
  process.env.DB_PASSWORD = 'test';
  process.env.DB_NAME = 'test';
  process.env.NODE_ENV = 'test';
});

describe('validateUpdateUserStatus', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('isActive가 없으면 400 VALIDATION_ERROR를 반환한다', () => {
    req.body = {};
    validateUpdateUserStatus(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('isActive가 문자열 "true"이면 400을 반환한다', () => {
    req.body = { isActive: 'true' };
    validateUpdateUserStatus(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('isActive가 문자열 "false"이면 400을 반환한다', () => {
    req.body = { isActive: 'false' };
    validateUpdateUserStatus(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('isActive가 숫자 1이면 400을 반환한다', () => {
    req.body = { isActive: 1 };
    validateUpdateUserStatus(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('isActive가 boolean true이면 next()를 호출한다', () => {
    req.body = { isActive: true };
    validateUpdateUserStatus(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('isActive가 boolean false이면 next()를 호출한다', () => {
    req.body = { isActive: false };
    validateUpdateUserStatus(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
