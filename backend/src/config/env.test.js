import { jest } from '@jest/globals';

describe('env', () => {
  let validateEnv;
  let REQUIRED_ENV_VARS;

  beforeAll(async () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_USER = 'user';
    process.env.DB_PASSWORD = 'password';
    process.env.DB_NAME = 'db';
    process.env.JWT_SECRET = 'secret';
    const mod = await import('./env.js');
    validateEnv = mod.validateEnv;
    REQUIRED_ENV_VARS = mod.REQUIRED_ENV_VARS;
  });

  test('REQUIRED_ENV_VARS에 필수 키가 모두 포함된다', () => {
    expect(REQUIRED_ENV_VARS).toContain('DB_HOST');
    expect(REQUIRED_ENV_VARS).toContain('DB_USER');
    expect(REQUIRED_ENV_VARS).toContain('DB_PASSWORD');
    expect(REQUIRED_ENV_VARS).toContain('DB_NAME');
    expect(REQUIRED_ENV_VARS).toContain('JWT_SECRET');
  });

  test('모든 필수 환경변수 존재 시 process.exit 미호출', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const fullEnv = Object.fromEntries(REQUIRED_ENV_VARS.map((k) => [k, 'value']));
    validateEnv(fullEnv);
    expect(exitSpy).not.toHaveBeenCalled();
    exitSpy.mockRestore();
  });

  test('환경변수 전체 누락 시 process.exit(1) 호출', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    validateEnv({});
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(consoleSpy).toHaveBeenCalled();
    exitSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  test('일부 환경변수 누락 시 process.exit(1) 호출', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    validateEnv({ DB_HOST: 'localhost' });
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  test('누락 환경변수 목록이 에러 메시지에 포함된다', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    validateEnv({ DB_HOST: 'localhost', DB_USER: 'user' });
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('DB_PASSWORD')
    );
    exitSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
