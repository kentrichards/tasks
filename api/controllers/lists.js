const wrapAsync = require('../middleware/wrapAsync');
const User = require('../models/user');
const List = require('../models/list');
const Task = require('../models/task');

const createList = wrapAsync(async (request, response, next) => {
  const { body } = request;

  // Ensure the user who owns the list exists
  // TODO: Update so a user can only create lists for themselves
  const user = await User.findById(body.user);

  if (user) {
    const newList = new List({ name: body.name, user: user._id });
    const result = await newList.save();

    user.lists = await user.lists.concat(newList._id);
    await user.save();

    // Returns '201 Created' on success
    response.status(201).json(result);
  } else {
    next({
      message: `there is no user with id ${body.user}`,
      statusCode: 400,
    });
  }
});

const fetchList = wrapAsync(async (request, response, next) => {
  const list = await List.findById(request.params.id).populate('tasks', { list: 0 });

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
  const lists = await List.find({}).populate('tasks', { list: 0 });

  response.json(lists);
});

const deleteList = wrapAsync(async (request, response) => {
  // Remove the list and all of the tasks on it
  // TODO: Convert to schema middleware (listSchema.pre('remove', ...))
  await List.findByIdAndRemove(request.params.id);
  await Task.deleteMany({ list: request.params.id });

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
