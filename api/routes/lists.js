const listRouter = require('express').Router();
const {
  createList,
  fetchList,
  fetchLists,
  deleteList,
  updateList,
} = require('../controllers/lists');

listRouter.post('/', createList);
listRouter.get('/:id', fetchList);
listRouter.get('/', fetchLists);
listRouter.delete('/:id', deleteList);
listRouter.put('/:id', updateList);

module.exports = listRouter;
