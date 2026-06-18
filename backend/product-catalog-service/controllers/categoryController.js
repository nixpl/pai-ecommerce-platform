const CategoryService = require('../services/categoryService');

const getCategoryTree = async (req, res, next) => {
  try {
    const tree = await CategoryService.getTree();
    res.json(tree);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await CategoryService.updateCategory(parseInt(req.params.id, 10), req.body);
    res.json(category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await CategoryService.deleteCategory(parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategoryTree, createCategory, updateCategory, deleteCategory };
