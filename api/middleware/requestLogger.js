const logger = require('../utils/logger')

const requestLogger = (request, _response, next) => {
  logger.info('---')
  logger.info('Method:', request.method)
  logger.info('Path:', request.path)
  logger.info('Body:', request.body)

  next()
}

module.exports = requestLogger
