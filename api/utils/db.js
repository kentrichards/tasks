const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');

const connectToDb = async () => {
  logger.info('connecting to', config.MONGODB_URI);

  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    logger.info('connected to MongoDB\n');
  } catch (error) {
    logger.error('error connecting to MongoDB:', error.message);
  }
};

module.exports = connectToDb;
