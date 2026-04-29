import { Router } from 'express';
import { authenticate } from '../middlewares/auth-middleware.js';
import { requireAdmin } from '../middlewares/role-middleware.js';
import { validateUpdateUserStatus } from '../middlewares/validators/admin-validator.js';
import * as adminController from '../controllers/admin-controller.js';

const router = Router();

router.use(authenticate, requireAdmin);
router.get('/users', adminController.listUsers);
router.get('/todos', adminController.listTodos);
router.patch('/users/:id/status', validateUpdateUserStatus, adminController.updateUserStatus);

export default router;
