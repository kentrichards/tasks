const logger = require('../utils/logger');

const errorHandler = (error, _request, response) => {
  logger.error(error.message);

  // Use default values if the error does not include them
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

  return response.status(statusCode).send({ error: message });
};

module.exports = errorHandler;
