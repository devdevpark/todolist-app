import { ERROR_CODES } from './error-codes.js';

describe('error-codes 상수', () => {
  test('ERROR_CODES가 인증/인가 관련 코드를 포함한다', () => {
    expect(ERROR_CODES).toHaveProperty('UNAUTHORIZED');
    expect(ERROR_CODES).toHaveProperty('FORBIDDEN');
  });

  test('ERROR_CODES가 리소스 관련 코드를 포함한다', () => {
    expect(ERROR_CODES).toHaveProperty('NOT_FOUND');
    expect(ERROR_CODES).toHaveProperty('CONFLICT');
  });

  test('ERROR_CODES가 유효성 검사 및 서버 오류 코드를 포함한다', () => {
    expect(ERROR_CODES).toHaveProperty('VALIDATION_ERROR');
    expect(ERROR_CODES).toHaveProperty('INTERNAL_ERROR');
  });

  test('ERROR_CODES가 토큰 관련 코드를 포함한다', () => {
    expect(ERROR_CODES).toHaveProperty('TOKEN_EXPIRED');
    expect(ERROR_CODES).toHaveProperty('INVALID_TOKEN');
  });

  test('ERROR_CODES 각 값이 문자열이다', () => {
    Object.values(ERROR_CODES).forEach((value) => {
      expect(typeof value).toBe('string');
    });
  });

  test('ERROR_CODES.UNAUTHORIZED 값이 "UNAUTHORIZED"이다', () => {
    expect(ERROR_CODES.UNAUTHORIZED).toBe('UNAUTHORIZED');
  });

  test('ERROR_CODES.FORBIDDEN 값이 "FORBIDDEN"이다', () => {
    expect(ERROR_CODES.FORBIDDEN).toBe('FORBIDDEN');
  });

  test('ERROR_CODES.NOT_FOUND 값이 "NOT_FOUND"이다', () => {
    expect(ERROR_CODES.NOT_FOUND).toBe('NOT_FOUND');
  });
});
