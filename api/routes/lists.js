const listRouter = require('express').Router();
const { createList, deleteList, updateList } = require('../controllers/lists');

listRouter.post('/', createList);
listRouter.delete('/:id', deleteList);
listRouter.put('/:id', updateList);

module.exports = listRouter;
