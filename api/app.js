const express = require('express');
const tasksRouter = require('./routes/tasksRouter');

const app = express();

// App routes
app.use('/api/tasks', tasksRouter);

module.exports = app;
