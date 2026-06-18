const { Category, Product } = require('../models');
const {
  AppError,
  ValidationErrorDetail,
  ValidationErrors,
  validateRequired
} = require('shared-utils');
const { ApiErrors } = require('../errors/apiErrors');

class CategoryService {
  static async _resolveParent(parentId, selfId = null) {
    if (parentId === undefined || parentId === null) return null;

    const numericParent = Number(parentId);
    if (!Number.isInteger(numericParent)) {
      throw new AppError(ApiErrors.VALIDATION_ERROR, [
        new ValidationErrorDetail(ValidationErrors.INVALID_FORMAT, 'parent_id', { format: 'liczba całkowita' })
      ]);
    }

    if (selfId !== null && numericParent === selfId) {
      throw new AppError(ApiErrors.INVALID_OPERATION);
    }

    const parent = await Category.findByPk(numericParent);
    if (!parent) throw new AppError(ApiErrors.CATEGORY_NOT_FOUND);

    return numericParent;
  }

  // Guards against assigning a parent that lives within the node's own subtree.
  static async _assertNoCycle(categoryId, candidateParentId) {
    let cursor = candidateParentId;
    while (cursor !== null && cursor !== undefined) {
      if (cursor === categoryId) {
        throw new AppError(ApiErrors.INVALID_OPERATION);
      }
      const node = await Category.findByPk(cursor);
      cursor = node ? node.parent_id : null;
    }
  }

  static async getTree() {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });

    const nodeMap = new Map();
    categories.forEach((cat) => {
      nodeMap.set(cat.id, { id: cat.id, name: cat.name, parent_id: cat.parent_id, children: [] });
    });

    const roots = [];
    nodeMap.forEach((node) => {
      if (node.parent_id !== null && node.parent_id !== undefined && nodeMap.has(node.parent_id)) {
        nodeMap.get(node.parent_id).children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  static async createCategory(data = {}) {
    const details = [];
    const nameErr = validateRequired(data.name, 'name', 1, 100);
    if (nameErr) details.push(nameErr);
    if (details.length > 0) throw new AppError(ApiErrors.VALIDATION_ERROR, details);

    const parentId = await this._resolveParent(data.parent_id);

    const category = await Category.create({ name: data.name, parent_id: parentId });
    return category;
  }

  static async updateCategory(id, data = {}) {
    const category = await Category.findByPk(id);
    if (!category) throw new AppError(ApiErrors.CATEGORY_NOT_FOUND);

    const details = [];
    if (data.name !== undefined) {
      const nameErr = validateRequired(data.name, 'name', 1, 100);
      if (nameErr) details.push(nameErr);
    }
    if (details.length > 0) throw new AppError(ApiErrors.VALIDATION_ERROR, details);

    const updates = {};
    if (data.name !== undefined) updates.name = data.name;

    if (data.parent_id !== undefined) {
      const parentId = await this._resolveParent(data.parent_id, category.id);
      if (parentId !== null) {
        await this._assertNoCycle(category.id, parentId);
      }
      updates.parent_id = parentId;
    }

    await category.update(updates);
    return category;
  }

  static async deleteCategory(id) {
    const category = await Category.findByPk(id);
    if (!category) throw new AppError(ApiErrors.CATEGORY_NOT_FOUND);

    // Detach children and products so we never orphan rows behind a dangling FK.
    await Category.update({ parent_id: null }, { where: { parent_id: category.id } });
    await Product.update({ category_id: null }, { where: { category_id: category.id } });

    await category.destroy();
  }
}

module.exports = CategoryService;
