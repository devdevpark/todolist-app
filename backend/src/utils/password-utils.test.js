import { hashPassword, comparePassword } from './password-utils.js';

describe('password-utils', () => {
  describe('hashPassword', () => {
    test('hashPassword가 bcrypt 형식($2b$)으로 시작하는 해시를 반환한다', async () => {
      const hash = await hashPassword('mypassword123');
      expect(hash).toMatch(/^\$2b\$/);
    });

    test('동일한 비밀번호로 해시해도 매번 다른 해시가 생성된다', async () => {
      const hash1 = await hashPassword('samepassword');
      const hash2 = await hashPassword('samepassword');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    test('comparePassword가 일치하는 비밀번호에 true를 반환한다', async () => {
      const password = 'correct-password';
      const hash = await hashPassword(password);
      const result = await comparePassword(password, hash);
      expect(result).toBe(true);
    });

    test('comparePassword가 불일치하는 비밀번호에 false를 반환한다', async () => {
      const hash = await hashPassword('correct-password');
      const result = await comparePassword('wrong-password', hash);
      expect(result).toBe(false);
    });

    test('comparePassword가 빈 문자열과 해시를 비교할 때 false를 반환한다', async () => {
      const hash = await hashPassword('some-password');
      const result = await comparePassword('', hash);
      expect(result).toBe(false);
    });
  });
});
