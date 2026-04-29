import { TODO_STATUS } from '../constants/todo-status.js';

export function isOverdue(dueDate, status) {
  if (status !== TODO_STATUS.PENDING) return false;
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}
