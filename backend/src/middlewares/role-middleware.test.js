import { jest } from '@jest/globals';
import { requireAdmin } from './role-middleware.js';
import { AppError } from './error-handler.js';
import { USER_ROLE } from '../constants/user-role.js';
import { ERROR_CODES } from '../constants/error-codes.js';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-key-must-be-long-enough-for-hs512-algorithm-64chars-min';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.DB_HOST = 'test';
  process.env.DB_USER = 'test';
  process.env.DB_PASSWORD = 'test';
  process.env.DB_NAME = 'test';
  process.env.NODE_ENV = 'test';
});

describe('requireAdmin 미들웨어', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: undefined };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('req.user.role이 ADMIN이면 next()를 호출한다', () => {
    req.user = { id: 1, username: 'admin', role: USER_ROLE.ADMIN };
    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('req.user.role이 USER이면 next(AppError) 403 FORBIDDEN을 호출한다', () => {
    req.user = { id: 2, username: 'user', role: USER_ROLE.USER };
    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe(ERROR_CODES.FORBIDDEN);
  });

  test('req.user가 undefined이면 next(AppError) 403 FORBIDDEN을 호출한다', () => {
    req.user = undefined;
    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe(ERROR_CODES.FORBIDDEN);
  });
});
