const userRouter = require('express').Router();
const verifyToken = require('../middleware/verifyToken');
const { createUser, fetchUser } = require('../controllers/users');

userRouter.post('/', createUser);
userRouter.get('/:id', verifyToken, fetchUser);

module.exports = userRouter;
