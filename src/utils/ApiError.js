class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    errorCode,
    errors = [],
    stack = ""
  ) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
