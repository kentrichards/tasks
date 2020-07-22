const listRouter = require('express').Router();
const { createList, fetchList } = require('../controllers/lists');

listRouter.post('/', createList);
listRouter.get('/:id', fetchList);

module.exports = listRouter;
