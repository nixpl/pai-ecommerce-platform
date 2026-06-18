const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const variantController = require('../controllers/variantController');
const { authMiddleware, requireAnyRole } = require('shared-utils');

const requireAdmin = requireAnyRole('admin', 'super_admin');

router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);

router.post('/', authMiddleware, requireAdmin, productController.createProduct);
router.put('/:id', authMiddleware, requireAdmin, productController.updateProduct);
router.delete('/:id', authMiddleware, requireAdmin, productController.deleteProduct);

router.post('/:id/variants', authMiddleware, requireAdmin, variantController.createVariant);

module.exports = router;
