import { jest } from '@jest/globals';
import { validateCreateCategory, validateUpdateCategory } from './category-validator.js';
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

describe('validateCreateCategory', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('name이 없으면 400 VALIDATION_ERROR를 반환한다', () => {
    req.body = { colorCode: '#FF0000' };
    validateCreateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('name이 51자이면 400을 반환한다', () => {
    req.body = { name: 'a'.repeat(51), colorCode: '#FF0000' };
    validateCreateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('colorCode가 없으면 400을 반환한다', () => {
    req.body = { name: '카테고리명' };
    validateCreateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('colorCode가 잘못된 형식이면 400을 반환한다', () => {
    req.body = { name: '카테고리명', colorCode: 'FF0000' };
    validateCreateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('colorCode가 3자리 hex이면 400을 반환한다', () => {
    req.body = { name: '카테고리명', colorCode: '#F00' };
    validateCreateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('정상 입력이면 next()를 호출한다', () => {
    req.body = { name: '카테고리명', colorCode: '#FF0000' };
    validateCreateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('소문자 hex colorCode도 정상 처리된다', () => {
    req.body = { name: '카테고리명', colorCode: '#ff0000' };
    validateCreateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});

describe('validateUpdateCategory', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('name이 있는데 빈 문자열이면 400을 반환한다', () => {
    req.body = { name: '' };
    validateUpdateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('name이 있는데 51자이면 400을 반환한다', () => {
    req.body = { name: 'a'.repeat(51) };
    validateUpdateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('colorCode가 있는데 잘못된 형식이면 400을 반환한다', () => {
    req.body = { colorCode: 'INVALID' };
    validateUpdateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ERROR_CODES.VALIDATION_ERROR);
  });

  test('정상 입력이면 next()를 호출한다', () => {
    req.body = { name: '수정된 카테고리', colorCode: '#00FF00' };
    validateUpdateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('빈 body도 next()를 호출한다 (모든 필드 선택)', () => {
    req.body = {};
    validateUpdateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('name만 있는 경우 next()를 호출한다', () => {
    req.body = { name: '카테고리명' };
    validateUpdateCategory(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
