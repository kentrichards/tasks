const wrapAsync = require('../middleware/wrapAsync');
const Task = require('../models/task');

const createTask = wrapAsync(async (request, response) => {
  const newTask = new Task(request.body);
  const result = await newTask.save();

  // Returns '201 Created' on success
  response.status(201).json(result);
});

const deleteTask = wrapAsync(async (request, response, next) => {
  const taskToRemove = await Task.findById(request.params.id);

  if (!taskToRemove) {
    next({
      message: `cannot find task with id ${request.params.id} to delete`,
      statusCode: 404,
    });

    return;
  }

  await taskToRemove.remove();

  // Return '204 No Content' in all cases
  response.status(204).end();
});

const updateTask = wrapAsync(async (request, response) => {
  // { new: true } tells Mongoose to return the updated list, not the original
  const result = await Task.findByIdAndUpdate(request.params.id, request.body, { new: true });

  response.json(result);
});

module.exports = { createTask, deleteTask, updateTask };
