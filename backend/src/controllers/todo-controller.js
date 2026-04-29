import * as todoService from '../services/todo-service.js';

export async function getTodos(req, res, next) {
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

export async function getTodoById(req, res, next) {
  try {
    const todo = await todoService.getTodoById(req.user, req.params.id);
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

export async function createTodo(req, res, next) {
  try {
    const { title, description, categoryId, dueDate } = req.body;
    const todo = await todoService.createTodo(req.user, { title, description, categoryId, dueDate });
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

export async function updateTodo(req, res, next) {
  try {
    const { title, description, categoryId, dueDate } = req.body;
    const todo = await todoService.updateTodo(req.user, req.params.id, {
      title,
      description,
      categoryId,
      dueDate,
    });
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

export async function deleteTodo(req, res, next) {
  try {
    await todoService.deleteTodo(req.user, req.params.id);
    res.status(200).json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}

export async function completeTodo(req, res, next) {
  try {
    const todo = await todoService.completeTodo(req.user, req.params.id);
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

export async function uncompleteTodo(req, res, next) {
  try {
    const todo = await todoService.uncompleteTodo(req.user, req.params.id);
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}
