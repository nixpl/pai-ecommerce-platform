const { ValidationErrorDetail } = require('./ValidationErrorDetail');
const { ValidationErrors } = require('./validationErrors');

const validateRequired = (value, fieldName, min = 1, max = undefined) => {
  if (value === undefined || value === null || String(value).trim() === '') {
    return new ValidationErrorDetail(ValidationErrors.EMPTY_FIELD, fieldName);
  }

  const length = String(value).length;
  if ((min !== undefined && length < min) || (max !== undefined && length > max)) {
    return new ValidationErrorDetail(ValidationErrors.INVALID_LENGTH, fieldName, { min, max });
  }

  return null;
};

const validateEmail = (email, fieldName = 'email') => {
  const reqError = validateRequired(email, fieldName, 1, 254);
  if (reqError) return reqError;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new ValidationErrorDetail(ValidationErrors.INVALID_FORMAT, fieldName, { format: 'user@example.com' });
  }
  return null;
};

const validatePassword = (password, fieldName = 'password') => {
  const reqError = validateRequired(password, fieldName, 1, 50);
  if (reqError) return reqError;

  if (password.length < 8 || password.length > 50) {
    return new ValidationErrorDetail(ValidationErrors.INVALID_LENGTH, fieldName, { min: 8, max: 50 });
  }
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  if (!passwordRegex.test(password)) {
    const requirements = "minimum 1 wielka litera, 1 mała litera, 1 cyfra i 1 znak specjalny (@$!%*?&)";
    return new ValidationErrorDetail(ValidationErrors.WEAK_PASSWORD, fieldName, { requirements });
  }
  return null;
};

const validatePhone = (phone, fieldName = 'phone') => {
  const reqError = validateRequired(phone, fieldName, 1, 15);
  if (reqError) return reqError;

  const digitsOnly = /^\d+$/;
  if (!digitsOnly.test(String(phone))) {
    return new ValidationErrorDetail(ValidationErrors.INVALID_FORMAT, fieldName, { format: 'tylko cyfry, np. 123456789' });
  }
  return null;
};

const validateZip = (zip, fieldName = 'zip_code') => {
  const reqError = validateRequired(zip, fieldName, 5, 6);
  if (reqError) return reqError;

  const zipRegex = /^(\d{2}-\d{3}|\d{5})$/;
  if (!zipRegex.test(String(zip))) {
    return new ValidationErrorDetail(ValidationErrors.INVALID_FORMAT, fieldName, { format: '12-345 lub 12345' });
  }
  return null;
};

module.exports = { validateRequired, validateEmail, validatePassword, validatePhone, validateZip };