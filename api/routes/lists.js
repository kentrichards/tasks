const listRouter = require('express').Router();
const List = require('../models/list');

listRouter.get('/', (_request, response) => {
  response.send('default list route');
});

// Create a new list
listRouter.post('/', async (request, response, next) => {
  try {
    const newList = new List({ name: request.body.name });
    const result = await newList.save();
    response.status(201).json(result);
  } catch (exception) {
    next(exception);
  }
});

// Fetch an individual list
listRouter.get('/:id', async (request, response, next) => {
  try {
    const list = await List.findById(request.params.id);

    if (list) {
      response.json(list);
    } else {
      response.status(404).send({ error: `no list found with id ${request.params.id}` });
    }
  } catch (exception) {
    next(exception);
  }
});

module.exports = listRouter;
