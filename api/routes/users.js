const userRouter = require('express').Router();
const { createUser, fetchUser } = require('../controllers/users');

userRouter.post('/', createUser);
userRouter.get('/:id', fetchUser);

module.exports = userRouter;
