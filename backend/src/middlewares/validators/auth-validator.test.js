import { jest } from '@jest/globals';
import { validateRegister, validateLogin } from './auth-validator.js';
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

describe('validateRegister', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('username이 없으면 400 VALIDATION_ERROR를 반환한다', () => {
    req.body = { password: 'pass1234' };
    validateRegister(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('password가 없으면 400 VALIDATION_ERROR를 반환한다', () => {
    req.body = { username: 'validuser' };
    validateRegister(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('username이 3자(4자 미만)이면 400을 반환한다', () => {
    req.body = { username: 'abc', password: 'pass1234' };
    validateRegister(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('username이 21자(20자 초과)이면 400을 반환한다', () => {
    req.body = { username: 'a'.repeat(21), password: 'pass1234' };
    validateRegister(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('username에 특수문자가 포함되면 400을 반환한다', () => {
    req.body = { username: 'user@name', password: 'pass1234' };
    validateRegister(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('password가 3자(4자 미만)이면 400을 반환한다', () => {
    req.body = { username: 'validuser', password: 'abc' };
    validateRegister(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('정상 입력이면 next()를 호출한다', () => {
    req.body = { username: 'validuser', password: 'pass1234' };
    validateRegister(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});

describe('validateLogin', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('username이 없으면 400 VALIDATION_ERROR를 반환한다', () => {
    req.body = { password: 'pass1234' };
    validateLogin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('password가 없으면 400 VALIDATION_ERROR를 반환한다', () => {
    req.body = { username: 'validuser' };
    validateLogin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('정상 입력이면 next()를 호출한다', () => {
    req.body = { username: 'validuser', password: 'pass1234' };
    validateLogin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
