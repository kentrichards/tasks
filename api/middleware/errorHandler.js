const logger = require('../utils/logger');

// '_next' is necessary for Express to recognize this an error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (error, _request, response, _next) => {
  logger.error(error.message);

  let message;
  let statusCode;

  switch (error.name) {
    case 'CastError':
      // CastError is thrown when Mongoose fails to cast a value (e.g., an id)
      message = 'malformed id';
      statusCode = 400;
      break;

    case 'ValidationError':
      // Database entry failed to meet the constraints defined by the schema
      message = error.message || 'database entry does not meet schema requirements';
      statusCode = 400;
      break;

    default:
      message = error.message || 'Internal server error';
      statusCode = error.statusCode || 500;
  }

  response.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
