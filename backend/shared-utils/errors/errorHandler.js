const { buildApiError, AppError } = require('./AppError');

const createErrorHandler = (serverErrorFallback) => {
  return (err, req, res, next) => {
    if (err instanceof AppError) {
      return buildApiError(res, err.apiError, req.originalUrl, err.details);
    }

    console.error(err);
    return buildApiError(res, serverErrorFallback, req.originalUrl);
  };
};

module.exports = { createErrorHandler };
