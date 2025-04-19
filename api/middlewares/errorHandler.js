class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle MongoDB duplicate key error (code 11000)
const handleDuplicateKeyError = (err) => {
// Extract field name and value from error message if keyValue is not available
if (err.keyValue) {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `The ${field} '${value}' is already taken. Please choose a different ${field}.`;
  return new AppError(message, 409);
} else if (err.errmsg) {
  // Extract collection, index name, field and value from error message
  const match = err.errmsg.match(/E11000 duplicate key error collection: ([\w.]+) index: ([\w_]+) dup key: \{ ([\w]+): "([^"]+)" \}/);
  if (match) {
    const [, collection, indexName, field, value] = match;
    const message = `Duplicate ${field} '${value}' in ${collection} collection. Please choose a different value.`;
    return new AppError(message, 409);
  }
}

// Fallback message
return new AppError('Duplicate field value entered. Please use a different value.', 409);
};

// Handle Mongoose validation errors
const handleValidationError = (err) => {
const errors = Object.values(err.errors).map(el => el.message);
const message = `Invalid input data. ${errors.join('. ')}`;
return new AppError(message, 400);
};

// Handle Mongoose CastError (invalid ID)
const handleCastError = (err) => {
const message = `Invalid ${err.path}: ${err.value}.`;
return new AppError(message, 400);
};

// Handle JWT token errors
const handleJWTError = () => {
return new AppError('Invalid token format or signature. Please log in again.', 401);
};

// Handle JWT token expiration
const handleJWTExpiredError = () => {
return new AppError('Your session has expired. Please log in again.', 401);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  
  // Handle specific error types
  if (err.name === 'CastError') error = handleCastError(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(error.statusCode).json({
      status: error.status,
      error: err,
      message: error.message,
      stack: err.stack
    });
  } else {
    // Production mode
    if (error.isOperational) {
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message
      });
    } else {
      // Programming or unknown errors
      console.error('ERROR 💥', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};

module.exports = {
  AppError,
  errorHandler
};