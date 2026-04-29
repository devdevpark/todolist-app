import { jest } from '@jest/globals';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

const mockFindAllByUserId = jest.fn();
const mockFindById = jest.fn();
const mockFindByNameAndUserId = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDeleteById = jest.fn();

await jest.unstable_mockModule('../repositories/category-repository.js', () => ({
  findAllByUserId: mockFindAllByUserId,
  findById: mockFindById,
  findByNameAndUserId: mockFindByNameAndUserId,
  create: mockCreate,
  update: mockUpdate,
  deleteById: mockDeleteById,
}));

const { getCategories, createCategory, updateCategory, deleteCategory } = await import(
  './category-service.js'
);
const { ERROR_CODES } = await import('../constants/error-codes.js');

describe('category-service', () => {
  const userId = 'user-uuid';
  const categoryId = 'category-uuid';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCategories', () => {
    test('성공적으로 카테고리 목록을 가져온다', async () => {
      const mockRows = [
        { id: '1', name: 'Work', color_code: '#FF0000', created_at: new Date() },
        { id: '2', name: 'Home', color_code: '#00FF00', created_at: new Date() },
      ];
      mockFindAllByUserId.mockResolvedValue(mockRows);

      const result = await getCategories(userId);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Work');
      expect(mockFindAllByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('createCategory', () => {
    test('성공적으로 카테고리를 생성한다', async () => {
      mockFindByNameAndUserId.mockResolvedValue(null);
      mockCreate.mockResolvedValue({
        id: categoryId,
        name: 'Work',
        color_code: '#FF0000',
        created_at: new Date(),
      });

      const result = await createCategory(userId, 'Work', '#FF0000');

      expect(result.name).toBe('Work');
      expect(mockCreate).toHaveBeenCalledWith(userId, 'Work', '#FF0000');
    });

    test('중복된 이름의 카테고리가 있으면 에러를 던진다', async () => {
      mockFindByNameAndUserId.mockResolvedValue({ id: 'existing' });

      await expect(createCategory(userId, 'Work', '#FF0000')).rejects.toThrow(
        '이미 존재하는 카테고리 이름입니다.'
      );
    });
  });

  describe('updateCategory', () => {
    test('성공적으로 카테고리를 수정한다', async () => {
      mockFindById.mockResolvedValue({ id: categoryId, user_id: userId, name: 'Old' });
      mockFindByNameAndUserId.mockResolvedValue(null);
      mockUpdate.mockResolvedValue({
        id: categoryId,
        name: 'New',
        color_code: '#0000FF',
        created_at: new Date(),
      });

      const result = await updateCategory(userId, categoryId, 'New', '#0000FF');

      expect(result.name).toBe('New');
      expect(mockUpdate).toHaveBeenCalledWith(categoryId, 'New', '#0000FF');
    });

    test('카테고리가 없으면 404 에러를 던진다', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(updateCategory(userId, categoryId, 'New', '#0000FF')).rejects.toThrow(
        '카테고리를 찾을 수 없습니다.'
      );
    });

    test('다른 사용자의 카테고리면 404 에러를 던진다', async () => {
      mockFindById.mockResolvedValue({ id: categoryId, user_id: 'other-user' });

      await expect(updateCategory(userId, categoryId, 'New', '#0000FF')).rejects.toThrow(
        '카테고리를 찾을 수 없습니다.'
      );
    });

    test('수정하려는 이름이 이미 존재하면 409 에러를 던진다', async () => {
      mockFindById.mockResolvedValue({ id: categoryId, user_id: userId, name: 'Old' });
      mockFindByNameAndUserId.mockResolvedValue({ id: 'other', name: 'Existing' });

      await expect(updateCategory(userId, categoryId, 'Existing', '#0000FF')).rejects.toThrow(
        '이미 존재하는 카테고리 이름입니다.'
      );
    });
  });

  describe('deleteCategory', () => {
    test('성공적으로 카테고리를 삭제한다', async () => {
      mockFindById.mockResolvedValue({ id: categoryId, user_id: userId });

      await deleteCategory(userId, categoryId);

      expect(mockDeleteById).toHaveBeenCalledWith(categoryId);
    });

    test('카테고리가 없으면 404 에러를 던진다', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(deleteCategory(userId, categoryId)).rejects.toThrow(
        '카테고리를 찾을 수 없습니다.'
      );
    });
  });
});
