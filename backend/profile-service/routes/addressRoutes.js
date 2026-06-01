const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { authMiddleware } = require('shared-utils');

router.post('/', authMiddleware, addressController.createAddress);

router.get('/', authMiddleware, addressController.listAddresses);
router.put('/:id', authMiddleware, addressController.updateAddress);
router.delete('/:id', authMiddleware, addressController.deleteAddress);

module.exports = router;
