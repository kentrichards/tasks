const cors = require('cors');
const express = require('express');
const connectToDb = require('./utils/db');
const listRouter = require('./routes/lists');
const taskRouter = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const unknownEndpoint = require('./middleware/unknownEndpoint');

const app = express();

connectToDb();

// Enables cross-origin resource sharing
app.use(cors());

// Enable 'json-parser' in Express
// Used for parsing incoming requests with JSON payloads
app.use(express.json());

app.use(requestLogger);

// Routers
app.use('/api/lists', listRouter);
app.use('/api/tasks', taskRouter);

app.use(unknownEndpoint);

app.use(errorHandler);

module.exports = app;
