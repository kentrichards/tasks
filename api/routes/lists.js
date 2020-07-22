const listRouter = require('express').Router();
const wrapAsync = require('../middleware/wrapAsync');
const List = require('../models/list');

listRouter.get('/', (_request, response) => {
  response.send('default list route');
});

// Create a new list
const createList = wrapAsync(async (request, response) => {
  const newList = new List({ name: request.body.name });
  const result = await newList.save();
  response.status(201).json(result);
});
listRouter.post('/', createList);

// Fetch an individual list
const fetchList = wrapAsync(async (request, response, next) => {
  const list = await List.findById(request.params.id);

  if (list) {
    response.json(list);
  } else {
    next({
      message: `no list found with id ${request.params.id}`,
      statusCode: 404,
    });
  }
});
listRouter.get('/:id', fetchList);

module.exports = listRouter;
