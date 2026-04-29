import { signToken, verifyToken } from './jwt-utils.js';
import jwt from 'jsonwebtoken';

describe('jwt-utils', () => {
  beforeAll(() => {
    process.env.JWT_SECRET =
      'test-secret-key-for-testing-purposes-must-be-long-enough-for-hs512';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  describe('signToken', () => {
    test('signToken이 유효한 JWT 문자열을 반환한다', () => {
      const token = signToken({ id: 1, username: 'test', role: 'USER' });
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    test('생성된 토큰이 HS512 알고리즘을 사용한다', () => {
      const token = signToken({ id: 1 });
      const decoded = jwt.decode(token, { complete: true });
      expect(decoded.header.alg).toBe('HS512');
    });

    test('payload에 전달한 필드가 토큰에 포함된다', () => {
      const payload = { id: 42, username: 'alice', role: 'ADMIN' };
      const token = signToken(payload);
      const decoded = jwt.decode(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.username).toBe(payload.username);
      expect(decoded.role).toBe(payload.role);
    });
  });

  describe('verifyToken', () => {
    test('verifyToken이 유효한 토큰을 디코딩하고 payload 필드를 반환한다', () => {
      const payload = { id: 1, username: 'test', role: 'USER' };
      const token = signToken(payload);
      const decoded = verifyToken(token);
      expect(decoded.id).toBe(payload.id);
      expect(decoded.username).toBe(payload.username);
      expect(decoded.role).toBe(payload.role);
    });

    test('verifyToken이 잘못된 서명의 토큰에서 오류를 throw한다', () => {
      const fakeToken =
        'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.' +
        'eyJpZCI6MX0.' +
        'invalidsignature';
      expect(() => verifyToken(fakeToken)).toThrow();
    });

    test('verifyToken이 만료된 토큰에서 오류를 throw한다', () => {
      const expiredToken = jwt.sign(
        { id: 1 },
        process.env.JWT_SECRET,
        { algorithm: 'HS512', expiresIn: -1 }
      );
      expect(() => verifyToken(expiredToken)).toThrow();
    });

    test('verifyToken이 완전히 잘못된 문자열에서 오류를 throw한다', () => {
      expect(() => verifyToken('not-a-token')).toThrow();
    });
  });
});
