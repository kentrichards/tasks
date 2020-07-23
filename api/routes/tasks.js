const taskRouter = require('express').Router();
const {
  createTask,
  fetchTask,
  fetchTasks,
  deleteTask,
  updateTask,
} = require('../controllers/tasks');

taskRouter.post('/', createTask);
taskRouter.get('/:id', fetchTask);
taskRouter.get('/', fetchTasks);
taskRouter.delete('/:id', deleteTask);
taskRouter.put('/:id', updateTask);

module.exports = taskRouter;
