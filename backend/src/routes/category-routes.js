import { Router } from 'express';
import { authenticate } from '../middlewares/auth-middleware.js';
import {
  validateCreateCategory,
  validateUpdateCategory,
} from '../middlewares/validators/category-validator.js';
import * as categoryController from '../controllers/category-controller.js';

const router = Router();

router.use(authenticate);
router.get('/', categoryController.getCategories);
router.post('/', validateCreateCategory, categoryController.createCategory);
router.put('/:id', validateUpdateCategory, categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
