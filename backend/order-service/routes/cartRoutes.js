const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authMiddleware } = require('shared-utils');

router.get('/', authMiddleware, cartController.getCart);
router.post('/items', authMiddleware, cartController.addItem);
router.put('/items/:variantId', authMiddleware, cartController.updateItem);
router.delete('/items/:variantId', authMiddleware, cartController.removeItem);

module.exports = router;
