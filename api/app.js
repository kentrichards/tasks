const cors = require('cors');
const express = require('express');
const requestLogger = require('./middleware/requestLogger');
const tasksRouter = require('./routes/tasksRouter');
const unknownEndpoint = require('./middleware/unknownEndpoint');
const errorHandler = require('./middleware/errorHandler');

const app = express();

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
