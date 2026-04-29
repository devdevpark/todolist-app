import { describe, it, expect } from 'vitest';
import { validateUsername, validatePassword } from './validators';

describe('validateUsername', () => {
  it('빈 값이면 에러 메시지를 반환한다', () => {
    expect(validateUsername('')).toBe('아이디를 입력해 주세요.');
    expect(validateUsername('   ')).toBe('아이디를 입력해 주세요.');
    expect(validateUsername(null)).toBe('아이디를 입력해 주세요.');
  });

  it('3자(짧음)이면 에러 메시지를 반환한다', () => {
    expect(validateUsername('abc')).toBe('아이디는 4~20자여야 합니다.');
  });

  it('21자(긺)이면 에러 메시지를 반환한다', () => {
    expect(validateUsername('a'.repeat(21))).toBe('아이디는 4~20자여야 합니다.');
  });

  it('특수문자가 포함되면 에러 메시지를 반환한다', () => {
    expect(validateUsername('user!name')).toBe('아이디는 영문과 숫자만 사용할 수 있습니다.');
    expect(validateUsername('user_name')).toBe('아이디는 영문과 숫자만 사용할 수 있습니다.');
  });

  it('4자 영숫자는 유효하다', () => {
    expect(validateUsername('user')).toBeNull();
    expect(validateUsername('user1')).toBeNull();
  });

  it('20자 영숫자는 유효하다', () => {
    expect(validateUsername('a'.repeat(20))).toBeNull();
    expect(validateUsername('abc1'.repeat(5))).toBeNull();
  });
});

describe('validatePassword', () => {
  it('빈 값이면 에러 메시지를 반환한다', () => {
    expect(validatePassword('')).toBe('비밀번호를 입력해 주세요.');
    expect(validatePassword('   ')).toBe('비밀번호를 입력해 주세요.');
    expect(validatePassword(null)).toBe('비밀번호를 입력해 주세요.');
  });

  it('3자(짧음)이면 에러 메시지를 반환한다', () => {
    expect(validatePassword('abc')).toBe('비밀번호는 4자 이상이어야 합니다.');
  });

  it('4자는 유효하다', () => {
    expect(validatePassword('abcd')).toBeNull();
  });

  it('8자는 유효하다', () => {
    expect(validatePassword('abcd1234')).toBeNull();
  });
});
