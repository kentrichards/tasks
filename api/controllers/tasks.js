const wrapAsync = require('../middleware/wrapAsync');
const Task = require('../models/task');

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

module.exports = { fetchTask, fetchTasks, deleteTask };
