import * as categoryRepository from '../repositories/category-repository.js';
import { AppError } from '../middlewares/error-handler.js';
import { ERROR_CODES } from '../constants/error-codes.js';

export function toCategoryDto(row) {
  return {
    id: row.id,
    name: row.name,
    colorCode: row.color_code,
    createdAt: row.created_at,
  };
}

export async function getCategories(userId) {
  const rows = await categoryRepository.findAllByUserId(userId);
  return rows.map(toCategoryDto);
}

export async function createCategory(userId, name, colorCode) {
  const existing = await categoryRepository.findByNameAndUserId(name, userId);
  if (existing) {
    throw new AppError('이미 존재하는 카테고리 이름입니다.', ERROR_CODES.CONFLICT, 409);
  }

  const row = await categoryRepository.create(userId, name, colorCode);
  return toCategoryDto(row);
}

export async function updateCategory(userId, id, name, colorCode) {
  const category = await categoryRepository.findById(id);

  if (!category || category.user_id !== userId) {
    throw new AppError('카테고리를 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  const nextName = name !== undefined ? name : category.name;
  const nextColorCode = colorCode !== undefined ? colorCode : category.color_code;

  if (name !== undefined && name !== category.name) {
    const duplicate = await categoryRepository.findByNameAndUserId(name, userId);
    if (duplicate) {
      throw new AppError('이미 존재하는 카테고리 이름입니다.', ERROR_CODES.CONFLICT, 409);
    }
  }

  const updated = await categoryRepository.update(id, nextName, nextColorCode);
  return toCategoryDto(updated);
}

export async function deleteCategory(userId, id) {
  const category = await categoryRepository.findById(id);

  if (!category || category.user_id !== userId) {
    throw new AppError('카테고리를 찾을 수 없습니다.', ERROR_CODES.NOT_FOUND, 404);
  }

  await categoryRepository.deleteById(id);
}
