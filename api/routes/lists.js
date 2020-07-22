const listRouter = require('express').Router();
const { createList, fetchList, fetchLists, deleteList } = require('../controllers/lists');

listRouter.post('/', createList);
listRouter.get('/:id', fetchList);
listRouter.get('/', fetchLists);
listRouter.delete('/:id', deleteList);

module.exports = listRouter;
