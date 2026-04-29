import { Router } from 'express';
import { authenticate } from '../middlewares/auth-middleware.js';
import { validateCreateTodo, validateUpdateTodo } from '../middlewares/validators/todo-validator.js';
import * as todoController from '../controllers/todo-controller.js';

const router = Router();

router.use(authenticate);

router.get('/', todoController.getTodos);
router.post('/', validateCreateTodo, todoController.createTodo);
router.get('/:id', todoController.getTodoById);
router.put('/:id', validateUpdateTodo, todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.patch('/:id/complete', todoController.completeTodo);
router.patch('/:id/uncomplete', todoController.uncompleteTodo);

export default router;
