const logger = require('../utils/logger');

const errorHandler = (error, _request, response, next) => {
  logger.error(error.message);

  // CastError is thrown when Mongoose fails to cast a value (e.g., an id)
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformed id' });
    return;
  }

  // Database entry failed to meet the constraints defined by the schema
  if (error.name === 'ValidationError') {
    response.status(400).send({ error: 'database entry does not meet schema requirements' });
    return;
  }

  // Pass the error to Express's default handler if we don't recognize it
  next(error);
};

module.exports = errorHandler;
