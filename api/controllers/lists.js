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

  if (list) {
    response.json(list);
  } else {
    next({
      message: `no list found with id ${request.params.id}`,
      statusCode: 404,
    });
  }
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

// TODO: Ensure only supplied properties are updated
// TODO: Ensure 'name' is not set to null or some other non-string value
const updateList = wrapAsync(async (request, response) => {
  const list = { name: request.body.name };

  // { new: true } tells Mongoose to return the updated list, not the original
  const result = await List.findByIdAndUpdate(request.params.id, list, { new: true });

  response.json(result);
});

module.exports = { createList, fetchList, fetchLists, deleteList, updateList };
