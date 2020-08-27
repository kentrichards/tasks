const listRouter = require('express').Router()
const verifyToken = require('../middleware/verifyToken')
const { createList, deleteList, updateList } = require('../controllers/lists')

listRouter.post('/', verifyToken, createList)
listRouter.delete('/:id', verifyToken, deleteList)
listRouter.put('/:id', verifyToken, updateList)

module.exports = listRouter
