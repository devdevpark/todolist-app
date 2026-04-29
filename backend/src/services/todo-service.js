import * as todoRepository from '../repositories/todo-repository.js';
import { isOverdue } from '../utils/date-utils.js';
import { TODO_STATUS } from '../constants/todo-status.js';
import { USER_ROLE } from '../constants/user-role.js';
import { AppError } from '../middlewares/error-handler.js';
import { ERROR_CODES } from '../constants/error-codes.js';

export function toTodoDto(row) {
  const status = isOverdue(row.due_date, row.status) ? TODO_STATUS.OVERDUE : row.status;

  const category = row.category_id
    ? {
        id: row.category_id,
        name: row.category_name,
        colorCode: row.category_color_code,
        createdAt: row.category_created_at,
      }
    : null;

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status,
    dueDate: row.due_date,
    completedAt: row.completed_at,
    categoryId: row.category_id,
    category,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getTodos(user, filters = {}) {
  const { categoryId, status } = filters;
  const userId = user.role === USER_ROLE.ADMIN ? null : user.id;

  const repoFilters = {};
  if (categoryId !== undefined) {
    repoFilters.categoryId = categoryId;
  }

  if (status === TODO_STATUS.OVERDUE) {
    repoFilters.dbStatus = TODO_STATUS.PENDING;
    const rows = await todoRepository.findAll(userId, repoFilters);
    return rows.map(toTodoDto).filter((dto) => dto.status === TODO_STATUS.OVERDUE);
  }

  if (status === TODO_STATUS.PENDING) {
    repoFilters.dbStatus = TODO_STATUS.PENDING;
    const rows = await todoRepository.findAll(userId, repoFilters);
    return rows.map(toTodoDto).filter((dto) => dto.status === TODO_STATUS.PENDING);
  }

  if (status === TODO_STATUS.COMPLETED) {
    repoFilters.dbStatus = TODO_STATUS.COMPLETED;
    const rows = await todoRepository.findAll(userId, repoFilters);
    return rows.map(toTodoDto);
  }

  const rows = await todoRepository.findAll(userId, repoFilters);
  return rows.map(toTodoDto);
}

export async function getTodoById(user, id) {
  const row = await todoRepository.findById(id);

  if (!row) {
    throw new AppError('할일을 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  if (user.role !== USER_ROLE.ADMIN && row.user_id !== user.id) {
    throw new AppError('할일을 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  return toTodoDto(row);
}

export async function createTodo(user, data) {
  const row = await todoRepository.create(user.id, data);
  return toTodoDto(row);
}

export async function updateTodo(user, id, data) {
  const existing = await todoRepository.findById(id);

  if (!existing) {
    throw new AppError('할일을 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  if (user.role !== USER_ROLE.ADMIN && existing.user_id !== user.id) {
    throw new AppError('할일을 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  const merged = {
    title: data.title ?? existing.title,
    description: data.description !== undefined ? data.description : existing.description,
    categoryId: data.categoryId !== undefined ? data.categoryId : existing.category_id,
    dueDate: data.dueDate !== undefined ? data.dueDate : existing.due_date,
  };

  const row = await todoRepository.update(id, merged);
  return toTodoDto(row);
}

export async function deleteTodo(user, id) {
  const existing = await todoRepository.findById(id);

  if (!existing) {
    throw new AppError('할일을 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  if (user.role !== USER_ROLE.ADMIN && existing.user_id !== user.id) {
    throw new AppError('할일을 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  await todoRepository.deleteById(id);
}

export async function completeTodo(user, id) {
  const existing = await todoRepository.findById(id);

  if (!existing) {
    throw new AppError('할일을 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  if (user.role !== USER_ROLE.ADMIN && existing.user_id !== user.id) {
    throw new AppError('할일을 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  const row = await todoRepository.complete(id);
  return toTodoDto(row);
}

export async function uncompleteTodo(user, id) {
  const existing = await todoRepository.findById(id);

  if (!existing) {
    throw new AppError('할일을 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  if (user.role !== USER_ROLE.ADMIN && existing.user_id !== user.id) {
    throw new AppError('할일을 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  const row = await todoRepository.uncomplete(id);
  return toTodoDto(row);
}
