import { isOverdue } from './date-utils.js';
import { TODO_STATUS } from '../constants/todo-status.js';
import { jest } from '@jest/globals';

describe('date-utils', () => {
  describe('isOverdue', () => {
    describe('status가 PENDING이 아닌 경우', () => {
      test('status가 COMPLETED이면 dueDate가 과거여도 false를 반환한다', () => {
        const pastDate = new Date(Date.now() - 86400000).toISOString();
        expect(isOverdue(pastDate, TODO_STATUS.COMPLETED)).toBe(false);
      });

      test('status가 OVERDUE이면 dueDate가 과거여도 false를 반환한다', () => {
        const pastDate = new Date(Date.now() - 86400000).toISOString();
        expect(isOverdue(pastDate, TODO_STATUS.OVERDUE)).toBe(false);
      });
    });

    describe('dueDate가 없는 경우', () => {
      test('dueDate가 null이면 false를 반환한다', () => {
        expect(isOverdue(null, TODO_STATUS.PENDING)).toBe(false);
      });

      test('dueDate가 undefined이면 false를 반환한다', () => {
        expect(isOverdue(undefined, TODO_STATUS.PENDING)).toBe(false);
      });
    });

    describe('status가 PENDING인 경우', () => {
      test('dueDate가 과거이고 status가 PENDING이면 true를 반환한다', () => {
        jest.useFakeTimers();
        const now = new Date('2026-04-29T12:00:00Z');
        jest.setSystemTime(now);

        const pastDate = '2026-04-28T12:00:00Z';
        expect(isOverdue(pastDate, TODO_STATUS.PENDING)).toBe(true);

        jest.useRealTimers();
      });

      test('dueDate가 미래이고 status가 PENDING이면 false를 반환한다', () => {
        jest.useFakeTimers();
        const now = new Date('2026-04-29T12:00:00Z');
        jest.setSystemTime(now);

        const futureDate = '2026-04-30T12:00:00Z';
        expect(isOverdue(futureDate, TODO_STATUS.PENDING)).toBe(false);

        jest.useRealTimers();
      });

      test('dueDate가 정확히 현재 시각과 같으면 false를 반환한다', () => {
        jest.useFakeTimers();
        const now = new Date('2026-04-29T12:00:00Z');
        jest.setSystemTime(now);

        expect(isOverdue(now.toISOString(), TODO_STATUS.PENDING)).toBe(false);

        jest.useRealTimers();
      });
    });
  });
});
