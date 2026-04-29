import { jest } from '@jest/globals';
import { AppError, errorHandler } from './error-handler.js';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-key-must-be-long-enough-for-hs512-algorithm-64chars-min';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.DB_HOST = 'test';
  process.env.DB_USER = 'test';
  process.env.DB_PASSWORD = 'test';
  process.env.DB_NAME = 'test';
  process.env.NODE_ENV = 'test';
});

describe('AppError', () => {
  test('message, code, statusCode가 올바르게 설정된다', () => {
    const err = new AppError('테스트 오류', 'TEST_CODE', 422);
    expect(err.message).toBe('테스트 오류');
    expect(err.code).toBe('TEST_CODE');
    expect(err.statusCode).toBe(422);
  });

  test('statusCode 기본값은 400이다', () => {
    const err = new AppError('오류 메시지', 'SOME_CODE');
    expect(err.statusCode).toBe(400);
  });

  test('name이 "AppError"이다', () => {
    const err = new AppError('오류', 'CODE', 400);
    expect(err.name).toBe('AppError');
  });

  test('Error를 상속한다', () => {
    const err = new AppError('오류', 'CODE', 400);
    expect(err instanceof Error).toBe(true);
  });
});

describe('errorHandler', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  test('AppError 발생 시 statusCode, code, message를 올바르게 응답한다', () => {
    const err = new AppError('인증 실패', 'UNAUTHORIZED', 401);
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'UNAUTHORIZED',
          message: '인증 실패',
        }),
      })
    );
  });

  test('일반 Error 발생 시 500을 반환한다', () => {
    const err = new Error('예기치 않은 오류');
    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({
          code: 'INTERNAL_ERROR',
        }),
      })
    );
  });

  test('production 환경에서는 stack을 포함하지 않는다', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const err = new AppError('오류', 'CODE', 400);
    errorHandler(err, req, res, next);

    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg.error.stack).toBeUndefined();

    process.env.NODE_ENV = originalEnv;
  });

  test('development 환경에서는 stack을 포함한다', () => {
    process.env.NODE_ENV = 'development';

    const err = new AppError('오류', 'CODE', 400);
    errorHandler(err, req, res, next);

    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg.error.stack).toBeDefined();

    process.env.NODE_ENV = 'test';
  });

  test('test 환경에서는 stack을 포함한다', () => {
    process.env.NODE_ENV = 'test';

    const err = new AppError('오류', 'CODE', 400);
    errorHandler(err, req, res, next);

    const jsonArg = res.json.mock.calls[0][0];
    expect(jsonArg.error.stack).toBeDefined();
  });
});
