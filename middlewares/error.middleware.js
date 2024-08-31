const errorMiddleware = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Something went wrong!";

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
};

export default errorMiddleware;
