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

const mockFindByUsername = jest.fn();
const mockCreateUser = jest.fn();
const mockHashPassword = jest.fn();
const mockComparePassword = jest.fn();
const mockSignToken = jest.fn();

await jest.unstable_mockModule('../repositories/user-repository.js', () => ({
  findByUsername: mockFindByUsername,
  createUser: mockCreateUser,
}));

await jest.unstable_mockModule('../utils/password-utils.js', () => ({
  hashPassword: mockHashPassword,
  comparePassword: mockComparePassword,
}));

await jest.unstable_mockModule('../utils/jwt-utils.js', () => ({
  signToken: mockSignToken,
  verifyToken: jest.fn(),
}));

const { register, login } = await import('./auth-service.js');
const { ERROR_CODES } = await import('../constants/error-codes.js');
const { AppError } = await import('../middlewares/error-handler.js');

describe('register', () => {
  beforeEach(() => {
    mockFindByUsername.mockReset();
    mockCreateUser.mockReset();
    mockHashPassword.mockReset();
  });

  test('이미 존재하는 username이면 CONFLICT(409)를 throw한다', async () => {
    mockFindByUsername.mockResolvedValue({ id: 1, username: 'existinguser' });

    await expect(register('existinguser', 'pass1234')).rejects.toMatchObject({
      code: ERROR_CODES.CONFLICT,
      statusCode: 409,
    });

    expect(mockFindByUsername).toHaveBeenCalledWith('existinguser');
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test('성공하면 { id, username, role, isActive, createdAt }을 반환한다', async () => {
    mockFindByUsername.mockResolvedValue(null);
    mockHashPassword.mockResolvedValue('hashed_password');
    mockCreateUser.mockResolvedValue({
      id: 1,
      username: 'newuser',
      role: 'USER',
      is_active: true,
      created_at: new Date('2026-01-01'),
    });

    const result = await register('newuser', 'pass1234');

    expect(result).toEqual({
      id: 1,
      username: 'newuser',
      role: 'USER',
      isActive: true,
      createdAt: new Date('2026-01-01'),
    });
    expect(mockHashPassword).toHaveBeenCalledWith('pass1234');
    expect(mockCreateUser).toHaveBeenCalledWith('newuser', 'hashed_password');
  });
});

describe('login', () => {
  beforeEach(() => {
    mockFindByUsername.mockReset();
    mockComparePassword.mockReset();
    mockSignToken.mockReset();
  });

  test('존재하지 않는 username이면 UNAUTHORIZED(401)를 throw한다', async () => {
    mockFindByUsername.mockResolvedValue(null);

    await expect(login('nouser', 'pass1234')).rejects.toMatchObject({
      code: ERROR_CODES.UNAUTHORIZED,
      statusCode: 401,
    });

    expect(mockFindByUsername).toHaveBeenCalledWith('nouser');
  });

  test('is_active가 false이면 ACCOUNT_DISABLED(401)를 throw한다', async () => {
    mockFindByUsername.mockResolvedValue({
      id: 1,
      username: 'disableduser',
      password: 'hashed',
      role: 'USER',
      is_active: false,
    });

    await expect(login('disableduser', 'pass1234')).rejects.toMatchObject({
      code: ERROR_CODES.ACCOUNT_DISABLED,
      statusCode: 401,
    });

    expect(mockComparePassword).not.toHaveBeenCalled();
  });

  test('비밀번호가 불일치하면 UNAUTHORIZED(401)를 throw한다', async () => {
    mockFindByUsername.mockResolvedValue({
      id: 1,
      username: 'activeuser',
      password: 'hashed',
      role: 'USER',
      is_active: true,
    });
    mockComparePassword.mockResolvedValue(false);

    await expect(login('activeuser', 'wrongpass')).rejects.toMatchObject({
      code: ERROR_CODES.UNAUTHORIZED,
      statusCode: 401,
    });

    expect(mockSignToken).not.toHaveBeenCalled();
  });

  test('성공하면 { token }을 반환한다', async () => {
    mockFindByUsername.mockResolvedValue({
      id: 1,
      username: 'activeuser',
      password: 'hashed',
      role: 'USER',
      is_active: true,
    });
    mockComparePassword.mockResolvedValue(true);
    mockSignToken.mockReturnValue('jwt.token.here');

    const result = await login('activeuser', 'correctpass');

    expect(result).toEqual({
      token: 'jwt.token.here',
      user: {
        id: 1,
        username: 'activeuser',
        role: 'USER',
      },
    });
    expect(mockSignToken).toHaveBeenCalledWith({
      id: 1,
      username: 'activeuser',
      role: 'USER',
    });
  });
});
