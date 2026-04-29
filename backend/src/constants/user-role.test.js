import { USER_ROLE } from './user-role.js';

describe('user-role 상수', () => {
  test('USER_ROLE이 ADMIN, USER를 포함한다', () => {
    expect(USER_ROLE).toHaveProperty('ADMIN');
    expect(USER_ROLE).toHaveProperty('USER');
  });

  test('USER_ROLE.ADMIN 값이 "ADMIN"이다', () => {
    expect(USER_ROLE.ADMIN).toBe('ADMIN');
  });

  test('USER_ROLE.USER 값이 "USER"이다', () => {
    expect(USER_ROLE.USER).toBe('USER');
  });
});
