const wrapAsync = require('../middleware/wrapAsync');
const List = require('../models/list');

const createList = wrapAsync(async (request, response) => {
  const newList = new List({ name: request.body.name });
  const result = await newList.save();

  // Returns '201 Created' on success
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

const fetchLists = wrapAsync(async (_request, response) => {
  const lists = await List.find({});

  response.json(lists);
});

const deleteList = wrapAsync(async (request, response) => {
  await List.findByIdAndRemove(request.params.id);

  // Return '204 No Content' in all cases
  response.status(204).end();
});

module.exports = { createList, fetchList, fetchLists, deleteList };
