const logger = require('../utils/logger');

// '_next' is necessary for Express to recognize this an error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, _request, response, _next) => {
  logger.error(error.message);

  let message = error.message || 'Internal server error';
  let statusCode = error.statusCode || 500;

  // CastError is thrown when Mongoose fails to cast a value (e.g., an id)
  if (error.name === 'CastError') {
    message = 'malformed id';
    statusCode = 400;
  }

  // Database entry failed to meet the constraints defined by the schema
  if (error.name === 'ValidationError') {
    message = 'database entry does not meet schema requirements';
    statusCode = 400;
  }

  response.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
