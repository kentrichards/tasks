const loginRouter = require('express').Router()
const { loginUser } = require('../controllers/login')

loginRouter.post('/', loginUser)

module.exports = loginRouter
