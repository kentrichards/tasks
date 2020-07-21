const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./utils/logger');
const config = require('./utils/config');
const tasksRouter = require('./routes/tasksRouter');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const unknownEndpoint = require('./middleware/unknownEndpoint');

const app = express();

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('connected to MongoDB\n');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

// Enables cross-origin resource sharing
app.use(cors());

// Enable 'json-parser' in Express
// Used for parsing incoming requests with JSON payloads
app.use(express.json());

app.use(requestLogger);

// App routes
app.use('/api/tasks', tasksRouter);

app.use(unknownEndpoint);

app.use(errorHandler);

module.exports = app;
