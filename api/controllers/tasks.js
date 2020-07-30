const wrapAsync = require('../middleware/wrapAsync');
const Task = require('../models/task');
const List = require('../models/list');

const createTask = wrapAsync(async (request, response, next) => {
  const { body } = request;

  // Ensure the list the task is being created on exists
  const list = await List.findById(body.list);

  if (list) {
    // 'date' and 'completed' will be given default values
    // If 'important' is undefined, it will default to false
    const newTask = new Task({
      text: body.text,
      important: body.important || false,
      list: list._id,
    });
    const result = await newTask.save();

    list.tasks = list.tasks.concat(newTask._id);
    await list.save();

    // Returns '201 Created' on success
    response.status(201).json(result);
  } else {
    next({
      message: `there is no list with id ${body.list}`,
      statusCode: 400,
    });
  }
});

const fetchTask = wrapAsync(async (request, response, next) => {
  const task = await Task.findById(request.params.id);

  if (task) {
    response.json(task);
  } else {
    next({
      message: `no task found with id ${request.params.id}`,
      statusCode: 404,
    });
  }
});

const fetchTasks = wrapAsync(async (_request, response) => {
  const tasks = await Task.find({});

  response.json(tasks);
});

const deleteTask = wrapAsync(async (request, response, next) => {
  const removedTask = await Task.findByIdAndRemove(request.params.id);

  if (!removedTask) {
    next({
      message: `cannot find task with id ${request.params.id} to delete`,
      statusCode: 404,
    });
  }

  // Remove the task from the List.tasks array it was part of
  // TODO: Convert to schema middleware (taskSchema.pre('remove', ...))
  await List.findByIdAndUpdate(removedTask.list, { $pull: { tasks: removedTask._id } });

  // Return '204 No Content' in all cases
  response.status(204).end();
});

const updateTask = wrapAsync(async (request, response) => {
  // { new: true } tells Mongoose to return the updated list, not the original
  const result = await Task.findByIdAndUpdate(request.params.id, request.body, { new: true });

  response.json(result);
});

module.exports = { createTask, fetchTask, fetchTasks, deleteTask, updateTask };
