const globalErrorHandler = (err, req, res, next) => {
  //status
  //message/
  //stack

  const stack = err.stack;
  const message = err.message;
  const status = err.status ? err.status : "Failed ";
  const statusCode = err.statusCode ? err.statusCode : 500;
  res.status(statusCode).json({
    status: status,
    message: message,
    stack: stack,
  });
};

module.exports = globalErrorHandler;
