class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    // stack tress for code (on which line error found)
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
