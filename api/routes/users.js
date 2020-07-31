const userRouter = require('express').Router();
const { createUser, fetchUser, deleteUser } = require('../controllers/users');

userRouter.post('/', createUser);
userRouter.get('/:id', fetchUser);
userRouter.delete('/:id', deleteUser);

module.exports = userRouter;
