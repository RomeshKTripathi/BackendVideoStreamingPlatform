export const GlobalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    statusCode,
    success: false,
    error: {
      message: err.message || "Internal Server Error",
      code: err.errorCode || "ERR_UNKNOWN",
      details: err.details || null,
    },
  });
};
