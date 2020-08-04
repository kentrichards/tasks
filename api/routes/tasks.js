const taskRouter = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const { createTask, deleteTask, updateTask } = require('../controllers/tasks');

taskRouter.post('/', verifyToken, createTask);
taskRouter.delete('/:id', verifyToken, deleteTask);
taskRouter.put('/:id', verifyToken, updateTask);

module.exports = taskRouter;
