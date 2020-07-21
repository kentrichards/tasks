const tasksRouter = require('express').Router();

tasksRouter.get('/', (_req, res) => {
  res.send('hello world!');
});

module.exports = tasksRouter;
