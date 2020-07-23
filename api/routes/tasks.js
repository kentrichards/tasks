const taskRouter = require('express').Router();
const { createTask, fetchTask, fetchTasks, deleteTask } = require('../controllers/tasks');

taskRouter.post('/', createTask);
taskRouter.get('/:id', fetchTask);
taskRouter.get('/', fetchTasks);
taskRouter.delete('/:id', deleteTask);

module.exports = taskRouter;
