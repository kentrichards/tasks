const taskRouter = require('express').Router();

taskRouter.get('/', (_request, response) => {
  response.send('default task route');
});

module.exports = taskRouter;
