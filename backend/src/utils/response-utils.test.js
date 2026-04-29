import { successResponse, errorResponse } from './response-utils.js';

describe('response-utils', () => {
  describe('successResponse', () => {
    test('{ success: true, data } 구조를 반환한다', () => {
      const data = { id: 1, title: 'Test Todo' };
      const result = successResponse(data);
      expect(result).toEqual({ success: true, data });
    });

    test('data가 배열일 때도 올바른 구조를 반환한다', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const result = successResponse(data);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    });

    test('data가 null일 때도 { success: true, data: null }을 반환한다', () => {
      const result = successResponse(null);
      expect(result).toEqual({ success: true, data: null });
    });
  });

  describe('errorResponse', () => {
    test('{ success: false, error: { code, message } } 구조를 반환한다', () => {
      const result = errorResponse('NOT_FOUND', '리소스를 찾을 수 없습니다.');
      expect(result).toEqual({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '리소스를 찾을 수 없습니다.',
        },
      });
    });

    test('success 필드가 반드시 false이다', () => {
      const result = errorResponse('UNAUTHORIZED', '인증이 필요합니다.');
      expect(result.success).toBe(false);
    });

    test('error.code와 error.message가 전달한 값과 일치한다', () => {
      const code = 'VALIDATION_ERROR';
      const message = '입력값이 올바르지 않습니다.';
      const result = errorResponse(code, message);
      expect(result.error.code).toBe(code);
      expect(result.error.message).toBe(message);
    });
  });
});
