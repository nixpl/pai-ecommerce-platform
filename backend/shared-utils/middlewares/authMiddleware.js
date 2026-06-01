const jwt = require('jsonwebtoken');
const { AppError } = require('../errors/AppError');
const { SharedApiErrors } = require('../errors/sharedApiErrors');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(SharedApiErrors.MISSING_TOKEN));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.account = decoded;
    next();
  } catch (error) {
    return next(new AppError(SharedApiErrors.INVALID_TOKEN));
  }
};

const requireAnyRole = (...roles) => {
  return (req, res, next) => {
    if (!req.account || !roles.includes(req.account.role)) {
      return next(new AppError(SharedApiErrors.FORBIDDEN));
    }
    next();
  };
};

module.exports = { authMiddleware, requireAnyRole };