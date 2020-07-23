const taskRouter = require('express').Router();
const { fetchTask, fetchTasks, deleteTask } = require('../controllers/tasks');

taskRouter.get('/:id', fetchTask);
taskRouter.get('/', fetchTasks);
taskRouter.delete('/:id', deleteTask);

module.exports = taskRouter;
