const tasksRouter = require('express').Router();

tasksRouter.get('/', (_request, response) => {
  response.send('hello world!');
});

module.exports = tasksRouter;
