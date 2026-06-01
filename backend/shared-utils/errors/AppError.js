class AppError extends Error {
  constructor(apiError, details = []) {
    super(apiError.message);
    this.apiError = apiError;
    this.details = details;
  }
}

const buildApiError = (res, apiError, reqPath, details = []) => {
  return res.status(apiError.status).json({
    error: {
      status: apiError.status,
      code: apiError.code,
      message: apiError.message,
      timestamp: new Date().toISOString(),
      path: reqPath,
      details: details
    }
  });
};

module.exports = { buildApiError, AppError };
