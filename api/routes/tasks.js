const taskRouter = require('express').Router();
const { createTask, deleteTask, updateTask } = require('../controllers/tasks');

taskRouter.post('/', createTask);
taskRouter.delete('/:id', deleteTask);
taskRouter.put('/:id', updateTask);

module.exports = taskRouter;
