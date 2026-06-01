const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, requireAnyRole } = require('shared-utils');

router.post('/register', authController.register);

router.post('/login', authController.login);

router.patch('/accounts/:id/role', authMiddleware, requireAnyRole('super_admin'), authController.assignAdminRole);

module.exports = router;
