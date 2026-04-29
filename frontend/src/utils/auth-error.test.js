import { describe, it, expect } from 'vitest';
import { getAuthErrorMessage } from './auth-error';

describe('getAuthErrorMessage', () => {
  it('code가 ACCOUNT_DISABLED이면 비활성화 메시지를 반환한다', () => {
    const error = { code: 'ACCOUNT_DISABLED', message: '어떤 메시지' };
    expect(getAuthErrorMessage(error)).toBe('비활성화된 계정입니다. 관리자에게 문의하세요.');
  });

  it('code가 UNAUTHORIZED이면 아이디/비밀번호 불일치 메시지를 반환한다', () => {
    const error = { code: 'UNAUTHORIZED', message: '어떤 메시지' };
    expect(getAuthErrorMessage(error)).toBe('아이디 또는 비밀번호가 올바르지 않습니다.');
  });

  it('code가 CONFLICT이면 이미 사용 중인 사용자 이름 메시지를 반환한다', () => {
    const error = { code: 'CONFLICT', message: '어떤 메시지' };
    expect(getAuthErrorMessage(error)).toBe('이미 사용 중인 사용자 이름입니다.');
  });

  it('알 수 없는 code이고 message가 있으면 message를 반환한다', () => {
    const error = { code: 'UNKNOWN_CODE', message: '서버에서 온 에러 메시지' };
    expect(getAuthErrorMessage(error)).toBe('서버에서 온 에러 메시지');
  });

  it('알 수 없는 code이고 message가 없으면 기본 메시지를 반환한다', () => {
    const error = { code: 'UNKNOWN_CODE' };
    expect(getAuthErrorMessage(error)).toBe('오류가 발생했습니다. 다시 시도해 주세요.');
  });

  it('error가 null이면 기본 메시지를 반환한다', () => {
    expect(getAuthErrorMessage(null)).toBe('오류가 발생했습니다. 다시 시도해 주세요.');
  });

  it('error가 undefined이면 기본 메시지를 반환한다', () => {
    expect(getAuthErrorMessage(undefined)).toBe('오류가 발생했습니다. 다시 시도해 주세요.');
  });
});
