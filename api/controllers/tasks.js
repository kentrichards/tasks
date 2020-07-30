const wrapAsync = require('../middleware/wrapAsync');
const Task = require('../models/task');
const List = require('../models/list');

const createTask = wrapAsync(async (request, response, next) => {
  const { text, important, list } = request.body;

  // Ensure the list the task is being created on exists
  const listExists = await List.exists({ _id: list });

  if (listExists) {
    // 'date' and 'completed' will be given default values
    // If 'important' is undefined, it will default to false
    const newTask = new Task({
      text,
      important,
      list,
    });
    const result = await newTask.save();

    // Returns '201 Created' on success
    response.status(201).json(result);
  } else {
    next({
      message: `there is no list with id ${list}`,
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

const deleteTask = wrapAsync(async (request, response) => {
  await Task.findByIdAndRemove(request.params.id);

  // Return '204 No Content' in all cases
  response.status(204).end();
});

const updateTask = wrapAsync(async (request, response) => {
  // { new: true } tells Mongoose to return the updated list, not the original
  const result = await Task.findByIdAndUpdate(request.params.id, request.body, { new: true });

  response.json(result);
});

module.exports = { createTask, fetchTask, fetchTasks, deleteTask, updateTask };
