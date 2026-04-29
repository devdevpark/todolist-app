import { jest } from '@jest/globals';

beforeAll(() => {
  process.env.DB_HOST = 'test';
  process.env.DB_USER = 'test';
  process.env.DB_PASSWORD = 'test';
  process.env.DB_NAME = 'test';
  process.env.JWT_SECRET = 'test-secret-key-must-be-long-enough-for-hs512-algorithm-64chars-min';
  process.env.NODE_ENV = 'test';
});

const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDeleteById = jest.fn();
const mockComplete = jest.fn();
const mockUncomplete = jest.fn();
const mockIsOverdue = jest.fn();

await jest.unstable_mockModule('../repositories/todo-repository.js', () => ({
  findAll: mockFindAll,
  findById: mockFindById,
  create: mockCreate,
  update: mockUpdate,
  deleteById: mockDeleteById,
  complete: mockComplete,
  uncomplete: mockUncomplete,
}));

await jest.unstable_mockModule('../utils/date-utils.js', () => ({
  isOverdue: mockIsOverdue,
}));

const {
  toTodoDto,
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  completeTodo,
  uncompleteTodo,
} = await import('./todo-service.js');
const { ERROR_CODES } = await import('../constants/error-codes.js');

// 기본 todo row 팩토리
function makeTodoRow(overrides = {}) {
  return {
    id: 1,
    user_id: 10,
    title: '제목',
    description: null,
    status: 'PENDING',
    due_date: null,
    completed_at: null,
    category_id: null,
    category_name: null,
    category_color_code: null,
    created_at: new Date('2026-01-01'),
    updated_at: new Date('2026-01-01'),
    ...overrides,
  };
}

const normalUser = { id: 10, role: 'USER' };
const adminUser = { id: 99, role: 'ADMIN' };
const otherUser = { id: 20, role: 'USER' };

// ─────────────────────────────────────────────
// toTodoDto
// ─────────────────────────────────────────────
describe('toTodoDto', () => {
  beforeEach(() => {
    mockIsOverdue.mockReset();
  });

  test('PENDING 상태 + isOverdue=true → status가 OVERDUE', () => {
    mockIsOverdue.mockReturnValue(true);
    const row = makeTodoRow({ status: 'PENDING' });
    const dto = toTodoDto(row);
    expect(dto.status).toBe('OVERDUE');
  });

  test('PENDING 상태 + isOverdue=false → status가 PENDING', () => {
    mockIsOverdue.mockReturnValue(false);
    const row = makeTodoRow({ status: 'PENDING' });
    const dto = toTodoDto(row);
    expect(dto.status).toBe('PENDING');
  });

  test('category_id가 null이면 category: null', () => {
    mockIsOverdue.mockReturnValue(false);
    const row = makeTodoRow({ category_id: null });
    const dto = toTodoDto(row);
    expect(dto.category).toBeNull();
  });

  test('category_id가 있으면 category: { id, name, colorCode } 객체', () => {
    mockIsOverdue.mockReturnValue(false);
    const row = makeTodoRow({
      category_id: 5,
      category_name: '업무',
      category_color_code: '#FF0000',
    });
    const dto = toTodoDto(row);
    expect(dto.category).toEqual({ id: 5, name: '업무', colorCode: '#FF0000' });
    expect(dto.categoryId).toBe(5);
  });
});

// ─────────────────────────────────────────────
// getTodos
// ─────────────────────────────────────────────
describe('getTodos', () => {
  beforeEach(() => {
    mockFindAll.mockReset();
    mockIsOverdue.mockReset();
  });

  test('status=OVERDUE 필터: findAll은 dbStatus=PENDING으로 호출, OVERDUE인 것만 반환', async () => {
    const overdueRow = makeTodoRow({ id: 1 });
    const pendingRow = makeTodoRow({ id: 2 });
    mockFindAll.mockResolvedValue([overdueRow, pendingRow]);
    // 첫 번째 row는 overdue, 두 번째는 pending
    mockIsOverdue.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = await getTodos(normalUser, { status: 'OVERDUE' });

    expect(mockFindAll).toHaveBeenCalledWith(normalUser.id, { dbStatus: 'PENDING' });
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('OVERDUE');
  });

  test('status=PENDING 필터: findAll은 dbStatus=PENDING으로 호출, OVERDUE가 아닌 것만 반환', async () => {
    const overdueRow = makeTodoRow({ id: 1 });
    const pendingRow = makeTodoRow({ id: 2 });
    mockFindAll.mockResolvedValue([overdueRow, pendingRow]);
    mockIsOverdue.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const result = await getTodos(normalUser, { status: 'PENDING' });

    expect(mockFindAll).toHaveBeenCalledWith(normalUser.id, { dbStatus: 'PENDING' });
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('PENDING');
  });

  test('status=COMPLETED 필터: findAll은 dbStatus=COMPLETED로 호출', async () => {
    const completedRow = makeTodoRow({ id: 1, status: 'COMPLETED' });
    mockFindAll.mockResolvedValue([completedRow]);
    mockIsOverdue.mockReturnValue(false);

    const result = await getTodos(normalUser, { status: 'COMPLETED' });

    expect(mockFindAll).toHaveBeenCalledWith(normalUser.id, { dbStatus: 'COMPLETED' });
    expect(result).toHaveLength(1);
  });

  test('필터 없을 때: findAll을 빈 필터로 호출', async () => {
    mockFindAll.mockResolvedValue([]);

    await getTodos(normalUser, {});

    expect(mockFindAll).toHaveBeenCalledWith(normalUser.id, {});
  });

  test('admin user → userId=null로 findAll 호출', async () => {
    mockFindAll.mockResolvedValue([]);

    await getTodos(adminUser, {});

    expect(mockFindAll).toHaveBeenCalledWith(null, {});
  });

  test('일반 user → userId=user.id로 findAll 호출', async () => {
    mockFindAll.mockResolvedValue([]);

    await getTodos(normalUser, {});

    expect(mockFindAll).toHaveBeenCalledWith(10, {});
  });
});

// ─────────────────────────────────────────────
// getTodoById
// ─────────────────────────────────────────────
describe('getTodoById', () => {
  beforeEach(() => {
    mockFindById.mockReset();
    mockIsOverdue.mockReset();
  });

  test('존재하지 않으면 NOT_FOUND(404) throw', async () => {
    mockFindById.mockResolvedValue(null);

    await expect(getTodoById(normalUser, 999)).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
    });
  });

  test('타인의 todo → NOT_FOUND(404) throw', async () => {
    mockFindById.mockResolvedValue(makeTodoRow({ user_id: 99 }));

    await expect(getTodoById(normalUser, 1)).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
    });
  });

  test('admin은 타인 todo 조회 가능', async () => {
    mockIsOverdue.mockReturnValue(false);
    mockFindById.mockResolvedValue(makeTodoRow({ user_id: 10 }));

    const result = await getTodoById(adminUser, 1);

    expect(result).toHaveProperty('id', 1);
  });

  test('본인 todo 조회 성공', async () => {
    mockIsOverdue.mockReturnValue(false);
    mockFindById.mockResolvedValue(makeTodoRow({ user_id: normalUser.id }));

    const result = await getTodoById(normalUser, 1);

    expect(result).toHaveProperty('id', 1);
  });
});

// ─────────────────────────────────────────────
// createTodo
// ─────────────────────────────────────────────
describe('createTodo', () => {
  beforeEach(() => {
    mockCreate.mockReset();
    mockIsOverdue.mockReset();
  });

  test('todoRepository.create 호출 후 DTO 반환', async () => {
    const data = { title: '새 할일', description: '내용' };
    const row = makeTodoRow({ title: '새 할일', description: '내용', user_id: normalUser.id });
    mockCreate.mockResolvedValue(row);
    mockIsOverdue.mockReturnValue(false);

    const result = await createTodo(normalUser, data);

    expect(mockCreate).toHaveBeenCalledWith(normalUser.id, data);
    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('title', '새 할일');
  });
});

// ─────────────────────────────────────────────
// updateTodo
// ─────────────────────────────────────────────
describe('updateTodo', () => {
  beforeEach(() => {
    mockFindById.mockReset();
    mockUpdate.mockReset();
    mockIsOverdue.mockReset();
  });

  test('존재하지 않으면 NOT_FOUND(404)', async () => {
    mockFindById.mockResolvedValue(null);

    await expect(updateTodo(normalUser, 999, { title: '변경' })).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
    });
  });

  test('타인의 todo → NOT_FOUND(404)', async () => {
    mockFindById.mockResolvedValue(makeTodoRow({ user_id: 99 }));

    await expect(updateTodo(normalUser, 1, { title: '변경' })).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
    });
  });

  test('title 없으면 기존 title 유지 (null coalescing)', async () => {
    const existing = makeTodoRow({ user_id: normalUser.id, title: '기존제목' });
    mockFindById.mockResolvedValue(existing);
    const updatedRow = makeTodoRow({ title: '기존제목' });
    mockUpdate.mockResolvedValue(updatedRow);
    mockIsOverdue.mockReturnValue(false);

    await updateTodo(normalUser, 1, {});

    expect(mockUpdate).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ title: '기존제목' })
    );
  });

  test('description=null이면 null로 업데이트', async () => {
    const existing = makeTodoRow({ user_id: normalUser.id, description: '기존내용' });
    mockFindById.mockResolvedValue(existing);
    mockUpdate.mockResolvedValue(makeTodoRow({ description: null }));
    mockIsOverdue.mockReturnValue(false);

    await updateTodo(normalUser, 1, { description: null });

    expect(mockUpdate).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ description: null })
    );
  });

  test('description=undefined이면 기존 값 유지', async () => {
    const existing = makeTodoRow({ user_id: normalUser.id, description: '기존내용' });
    mockFindById.mockResolvedValue(existing);
    mockUpdate.mockResolvedValue(makeTodoRow({ description: '기존내용' }));
    mockIsOverdue.mockReturnValue(false);

    await updateTodo(normalUser, 1, {});

    expect(mockUpdate).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ description: '기존내용' })
    );
  });
});

// ─────────────────────────────────────────────
// deleteTodo
// ─────────────────────────────────────────────
describe('deleteTodo', () => {
  beforeEach(() => {
    mockFindById.mockReset();
    mockDeleteById.mockReset();
  });

  test('존재하지 않으면 NOT_FOUND(404)', async () => {
    mockFindById.mockResolvedValue(null);

    await expect(deleteTodo(normalUser, 999)).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
    });
  });

  test('타인의 todo → NOT_FOUND(404)', async () => {
    mockFindById.mockResolvedValue(makeTodoRow({ user_id: 99 }));

    await expect(deleteTodo(normalUser, 1)).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
    });
  });

  test('정상 삭제 시 deleteById 호출', async () => {
    mockFindById.mockResolvedValue(makeTodoRow({ user_id: normalUser.id }));
    mockDeleteById.mockResolvedValue(undefined);

    await deleteTodo(normalUser, 1);

    expect(mockDeleteById).toHaveBeenCalledWith(1);
  });
});

// ─────────────────────────────────────────────
// completeTodo
// ─────────────────────────────────────────────
describe('completeTodo', () => {
  beforeEach(() => {
    mockFindById.mockReset();
    mockComplete.mockReset();
    mockIsOverdue.mockReset();
  });

  test('존재하지 않으면 NOT_FOUND(404)', async () => {
    mockFindById.mockResolvedValue(null);

    await expect(completeTodo(normalUser, 999)).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
    });
  });

  test('타인의 todo → NOT_FOUND(404)', async () => {
    mockFindById.mockResolvedValue(makeTodoRow({ user_id: 99 }));

    await expect(completeTodo(normalUser, 1)).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
    });
  });

  test('정상 시 todoRepository.complete 호출', async () => {
    mockFindById.mockResolvedValue(makeTodoRow({ user_id: normalUser.id }));
    mockComplete.mockResolvedValue(makeTodoRow({ status: 'COMPLETED' }));
    mockIsOverdue.mockReturnValue(false);

    await completeTodo(normalUser, 1);

    expect(mockComplete).toHaveBeenCalledWith(1);
  });
});

// ─────────────────────────────────────────────
// uncompleteTodo
// ─────────────────────────────────────────────
describe('uncompleteTodo', () => {
  beforeEach(() => {
    mockFindById.mockReset();
    mockUncomplete.mockReset();
    mockIsOverdue.mockReset();
  });

  test('존재하지 않으면 NOT_FOUND(404)', async () => {
    mockFindById.mockResolvedValue(null);

    await expect(uncompleteTodo(normalUser, 999)).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
    });
  });

  test('타인의 todo → NOT_FOUND(404)', async () => {
    mockFindById.mockResolvedValue(makeTodoRow({ user_id: 99 }));

    await expect(uncompleteTodo(normalUser, 1)).rejects.toMatchObject({
      code: ERROR_CODES.NOT_FOUND,
      statusCode: 404,
    });
  });

  test('정상 시 todoRepository.uncomplete 호출', async () => {
    mockFindById.mockResolvedValue(makeTodoRow({ user_id: normalUser.id }));
    mockUncomplete.mockResolvedValue(makeTodoRow({ status: 'PENDING' }));
    mockIsOverdue.mockReturnValue(false);

    await uncompleteTodo(normalUser, 1);

    expect(mockUncomplete).toHaveBeenCalledWith(1);
  });
});
