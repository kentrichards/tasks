const listRouter = require('express').Router();

listRouter.get('/', (_request, response) => {
  response.send('default list route');
});

module.exports = listRouter;
