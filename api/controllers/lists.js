const wrapAsync = require('../middleware/wrapAsync');
const List = require('../models/list');

const createList = wrapAsync(async (request, response) => {
  // TODO: Update so a user can only create lists for themselves
  const newList = new List({ ...request.body, user: request.user._id });
  const result = await newList.save();

  // Returns '201 Created' on success
  response.status(201).json(result);
});

const deleteList = wrapAsync(async (request, response, next) => {
  const listToRemove = await List.findById(request.params.id);

  if (!listToRemove) {
    next({
      message: `cannot find list with id ${request.params.id} to delete`,
      statusCode: 404,
    });

    return;
  }

  // The list is removed from its user, and its tasks are deleted is listSchema
  await listToRemove.remove();

  // Return '204 No Content' in all cases
  response.status(204).end();
});

const updateList = wrapAsync(async (request, response) => {
  const changedFields = {};

  if (request.body.name) {
    changedFields.name = request.body.name;
  }

  // { new: true } tells Mongoose to return the updated list, not the original
  const result = await List.findByIdAndUpdate(request.params.id, changedFields, { new: true });

  response.json(result);
});

module.exports = { createList, deleteList, updateList };
