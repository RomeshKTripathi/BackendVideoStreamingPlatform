class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong",
    errorCode,
    data = null,
    errors = [],
    stack = ""
  ) {
    super(message);
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.data = data;
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
