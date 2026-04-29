import * as categoryService from '../services/category-service.js';

export async function getCategories(req, res, next) {
  try {
    const categories = await categoryService.getCategories(req.user.id);
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, colorCode } = req.body;
    const category = await categoryService.createCategory(req.user.id, name, colorCode);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, colorCode } = req.body;
    const category = await categoryService.updateCategory(req.user.id, id, name, colorCode);
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(req.user.id, id);
    res.status(200).json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
}
