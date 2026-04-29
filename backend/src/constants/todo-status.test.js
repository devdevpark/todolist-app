import { TODO_STATUS } from './todo-status.js';

describe('todo-status 상수', () => {
  test('TODO_STATUS가 PENDING, COMPLETED, OVERDUE를 포함한다', () => {
    expect(TODO_STATUS).toHaveProperty('PENDING');
    expect(TODO_STATUS).toHaveProperty('COMPLETED');
    expect(TODO_STATUS).toHaveProperty('OVERDUE');
  });

  test('TODO_STATUS.PENDING 값이 "PENDING"이다', () => {
    expect(TODO_STATUS.PENDING).toBe('PENDING');
  });

  test('TODO_STATUS.COMPLETED 값이 "COMPLETED"이다', () => {
    expect(TODO_STATUS.COMPLETED).toBe('COMPLETED');
  });

  test('TODO_STATUS.OVERDUE 값이 "OVERDUE"이다', () => {
    expect(TODO_STATUS.OVERDUE).toBe('OVERDUE');
  });
});
