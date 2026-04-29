import { jest } from '@jest/globals';

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-key-must-be-long-enough-for-hs512-algorithm-64chars-min';
  process.env.JWT_EXPIRES_IN = '1h';
  process.env.DB_HOST = 'test';
  process.env.DB_USER = 'test';
  process.env.DB_PASSWORD = 'test';
  process.env.DB_NAME = 'test';
  process.env.NODE_ENV = 'test';
});

const mockVerifyToken = jest.fn();

await jest.unstable_mockModule('../utils/jwt-utils.js', () => ({
  verifyToken: mockVerifyToken,
  signToken: jest.fn(),
}));

const { authenticate } = await import('./auth-middleware.js');
const { AppError } = await import('./error-handler.js');
const { ERROR_CODES } = await import('../constants/error-codes.js');

describe('authenticate 미들웨어', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    mockVerifyToken.mockReset();
  });

  test('Authorization 헤더가 없으면 next(AppError)를 호출한다 (401, UNAUTHORIZED)', () => {
    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  test('Bearer 형식이 아닌 헤더이면 401을 반환한다', () => {
    req.headers['authorization'] = 'Basic sometoken';
    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  test('잘못된 토큰이면 401 INVALID_TOKEN을 반환한다', () => {
    req.headers['authorization'] = 'Bearer invalidtoken';
    mockVerifyToken.mockImplementation(() => {
      const err = new Error('invalid signature');
      err.name = 'JsonWebTokenError';
      throw err;
    });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe(ERROR_CODES.INVALID_TOKEN);
  });

  test('만료된 토큰이면 401 TOKEN_EXPIRED를 반환한다', () => {
    req.headers['authorization'] = 'Bearer expiredtoken';
    mockVerifyToken.mockImplementation(() => {
      const err = new Error('jwt expired');
      err.name = 'TokenExpiredError';
      throw err;
    });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe(ERROR_CODES.TOKEN_EXPIRED);
  });

  test('유효한 토큰이면 req.user를 설정하고 next()를 호출한다', () => {
    req.headers['authorization'] = 'Bearer validtoken';
    mockVerifyToken.mockReturnValue({ id: 1, username: 'testuser', role: 'USER' });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(req.user).toEqual({ id: 1, username: 'testuser', role: 'USER' });
  });
});
