const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, requireAnyRole } = require('shared-utils');

const requireAdmin = requireAnyRole('admin', 'super_admin');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/', authMiddleware, orderController.listMyOrders);
router.get('/admin/all', authMiddleware, requireAdmin, orderController.listAllOrders);
router.get('/:id', authMiddleware, orderController.getOrder);
router.patch('/:id/status', authMiddleware, requireAdmin, orderController.updateStatus);

module.exports = router;
