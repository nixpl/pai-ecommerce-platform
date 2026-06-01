const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const { AppError, validateRequired, validateEmail, validatePassword } = require('shared-utils');
const { ApiErrors } = require('../errors/apiErrors');
require('dotenv').config();

class AuthService {
  static async registerUser(email, password) {
    const details = [];

    const emailError = validateEmail(email, 'email');
    if (emailError) details.push(emailError);

    const passwordError = validatePassword(password, 'password');
    if (passwordError) details.push(passwordError);

    if (details.length > 0) {
      throw new AppError(ApiErrors.VALIDATION_ERROR, details);
    }

    const existingUser = await Account.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError(ApiErrors.EMAIL_ALREADY_IN_USE);
    }

    const password_hash = await bcrypt.hash(password, 10);
    const account = await Account.create({ email, password_hash });

    return {
      id: account.id,
      email: account.email,
      role: account.role
    };
  }

  static async loginUser(email, password) {
    const details = [];
    
    const emailError = validateRequired(email, 'email', 1, 254);
    if (emailError) details.push(emailError);
    
    const passwordError = validateRequired(password, 'password', 1, 50);
    if (passwordError) details.push(passwordError);

    if (details.length > 0) {
      throw new AppError(ApiErrors.VALIDATION_ERROR, details);
    }

    const account = await Account.findOne({ where: { email } });
    if (!account) {
      throw new AppError(ApiErrors.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, account.password_hash);
    if (!isPasswordValid) {
      throw new AppError(ApiErrors.INVALID_CREDENTIALS);
    }

    const token = jwt.sign(
      { id: account.id, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return token;
  }

  static async assignRole(accountId, role) {
    const account = await Account.findByPk(accountId);
    if (!account) {
      throw new AppError(ApiErrors.USER_NOT_FOUND);
    }

    if (role === 'super_admin') {
      throw new AppError(ApiErrors.INVALID_OPERATION);
    }

    if (!['admin', 'client'].includes(role)) {
      throw new AppError(ApiErrors.INVALID_OPERATION);
    }

    account.role = role;
    await account.save();

    return {
      id: account.id,
      email: account.email,
      role: account.role
    };
  }

  static async seedSuperAdmin() {
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password) {
      console.log('SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD is missing, skipping super admin seed.');
      return;
    }

    const existing = await Account.findOne({ where: { email } });
    if (existing) {
      if (existing.role !== 'super_admin') {
        existing.role = 'super_admin';
        await existing.save();
      }
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);
    await Account.create({ email, password_hash, role: 'super_admin' });
    console.log(`Super admin account seeded for ${email}`);
  }
}

module.exports = AuthService;
