const wrapAsync = require('../middleware/wrapAsync');
const List = require('../models/list');

const createList = wrapAsync(async (request, response) => {
  const newList = new List({ name: request.body.name });
  const result = await newList.save();

  response.status(201).json(result);
});

const fetchList = wrapAsync(async (request, response, next) => {
  const list = await List.findById(request.params.id);

  if (!list) {
    next({
      message: `no list found with id ${request.params.id}`,
      statusCode: 404,
    });
  }

  response.json(list);
});

module.exports = { createList, fetchList };
