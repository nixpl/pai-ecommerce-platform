const { AppError, buildApiError } = require('./errors/AppError');
const { SharedApiErrors } = require('./errors/sharedApiErrors');
const { createErrorHandler } = require('./errors/errorHandler');
const { ValidationErrorDetail } = require('./validation/ValidationErrorDetail');
const { sanitizeHTML, sanitizeObject } = require('./validation/sanitizer');
const { ValidationErrors } = require('./validation/validationErrors');
const { validateRequired, validateEmail, validatePassword, validatePhone, validateZip } = require('./validation/validators');
const { sanitizeMiddleware } = require('./middlewares/sanitizeMiddleware');
const { authMiddleware, requireAnyRole } = require('./middlewares/authMiddleware');

module.exports = {
  AppError,
  buildApiError,
  SharedApiErrors,
  createErrorHandler,
  ValidationErrorDetail,
  sanitizeHTML,
  sanitizeObject,
  ValidationErrors,
  validateRequired,
  validateEmail,
  validatePassword,
  validatePhone,
  validateZip,
  sanitizeMiddleware,
  authMiddleware,
  requireAnyRole
};