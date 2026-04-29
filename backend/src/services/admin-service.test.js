import { jest } from '@jest/globals';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockUpdateStatus = jest.fn();

await jest.unstable_mockModule('../repositories/user-repository.js', () => ({
  findAll: mockFindAll,
  findById: mockFindById,
  updateStatus: mockUpdateStatus,
}));

const { getAllUsers, updateUserStatus } = await import('./admin-service.js');

describe('admin-service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    test('모든 유저 목록을 가져온다', async () => {
      const mockRows = [
        { id: '1', username: 'user1', role: 'USER', is_active: true, created_at: new Date() },
        { id: '2', username: 'admin', role: 'ADMIN', is_active: true, created_at: new Date() },
      ];
      mockFindAll.mockResolvedValue(mockRows);

      const result = await getAllUsers();

      expect(result).toHaveLength(2);
      expect(result[0].username).toBe('user1');
      expect(result[1].username).toBe('admin');
    });
  });

  describe('updateUserStatus', () => {
    const userId = 'user-uuid';

    test('유저 상태를 성공적으로 업데이트한다', async () => {
      mockFindById.mockResolvedValue({ id: userId, username: 'user1' });
      mockUpdateStatus.mockResolvedValue({
        id: userId,
        username: 'user1',
        role: 'USER',
        is_active: false,
        created_at: new Date(),
      });

      const result = await updateUserStatus(userId, false);

      expect(result.isActive).toBe(false);
      expect(mockUpdateStatus).toHaveBeenCalledWith(userId, false);
    });

    test('유저가 없으면 404 에러를 던진다', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(updateUserStatus(userId, false)).rejects.toThrow('유저를 찾을 수 없습니다.');
    });

    test('어드민 계정을 비활성화하려고 하면 에러를 던진다', async () => {
      mockFindById.mockResolvedValue({ id: userId, username: 'admin' });

      await expect(updateUserStatus(userId, false)).rejects.toThrow(
        '관리자 계정은 비활성화할 수 없습니다.'
      );
    });
  });
});
