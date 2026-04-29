import * as adminService from '../services/admin-service.js';
import * as todoService from '../services/todo-service.js';

export async function listUsers(req, res, next) {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
}

export async function listTodos(req, res, next) {
  try {
    const { categoryId, status } = req.query;
    const filters = {};
    if (categoryId !== undefined) filters.categoryId = categoryId;
    if (status !== undefined) filters.status = status;

    const todos = await todoService.getTodos(req.user, filters);
    res.status(200).json({ success: true, data: todos });
  } catch (err) {
    next(err);
  }
}

export async function updateUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await adminService.updateUserStatus(id, isActive);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}
