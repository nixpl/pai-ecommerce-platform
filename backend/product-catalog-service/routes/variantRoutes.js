const express = require('express');
const router = express.Router();
const variantController = require('../controllers/variantController');
const { authMiddleware, requireAnyRole } = require('shared-utils');

const requireAdmin = requireAnyRole('admin', 'super_admin');

router.put('/:id', authMiddleware, requireAdmin, variantController.updateVariant);
router.patch('/:id/stock', authMiddleware, requireAdmin, variantController.updateStock);
router.delete('/:id', authMiddleware, requireAdmin, variantController.deleteVariant);

module.exports = router;
