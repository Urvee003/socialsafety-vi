// middleware/errorMiddleware.js---Express does it automatically by:Comparing URL, Comparing HTTP method
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);      //Makes a custom error message
  res.status(404);
  next(error);                                                    //Passes error to next middleware (errorHandler)
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };                     //Makes both functions usable in your main server file
