import { jest } from '@jest/globals';
import { validateCreateTodo, validateUpdateTodo } from './todo-validator.js';
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

describe('validateCreateTodo', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('title이 없으면 400 VALIDATION_ERROR를 반환한다', () => {
    req.body = {};
    validateCreateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('title이 빈 문자열이면 400을 반환한다', () => {
    req.body = { title: '   ' };
    validateCreateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('title이 201자이면 400을 반환한다', () => {
    req.body = { title: 'a'.repeat(201) };
    validateCreateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('description이 1001자이면 400을 반환한다', () => {
    req.body = { title: '정상 제목', description: 'a'.repeat(1001) };
    validateCreateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('정상 입력이면 next()를 호출한다', () => {
    req.body = { title: '정상 제목', description: '정상 설명' };
    validateCreateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('description 없이 title만 있어도 next()를 호출한다', () => {
    req.body = { title: '제목만' };
    validateCreateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});

describe('validateUpdateTodo', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('title이 빈 문자열이면 400을 반환한다', () => {
    req.body = { title: '' };
    validateUpdateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('title이 공백만 있으면 400을 반환한다', () => {
    req.body = { title: '   ' };
    validateUpdateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('title이 201자이면 400을 반환한다', () => {
    req.body = { title: 'a'.repeat(201) };
    validateUpdateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('description이 1001자이면 400을 반환한다', () => {
    req.body = { description: 'a'.repeat(1001) };
    validateUpdateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('정상 입력이면 next()를 호출한다', () => {
    req.body = { title: '수정된 제목' };
    validateUpdateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('title 없이 빈 body도 next()를 호출한다 (선택 필드)', () => {
    req.body = {};
    validateUpdateTodo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
