const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, requireAnyRole } = require('shared-utils');

const requireAdmin = requireAnyRole('admin', 'super_admin');

router.get('/', categoryController.getCategoryTree);

router.post('/', authMiddleware, requireAdmin, categoryController.createCategory);
router.put('/:id', authMiddleware, requireAdmin, categoryController.updateCategory);
router.delete('/:id', authMiddleware, requireAdmin, categoryController.deleteCategory);

module.exports = router;
