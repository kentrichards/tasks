const bcrypt = require('bcrypt');
const wrapAsync = require('../middleware/wrapAsync');
const User = require('../models/user');

const createUser = wrapAsync(async (request, response, next) => {
  const { username, password } = request.body;

  if (!username) {
    next({
      message: 'username missing or invalid',
      statusCode: 400,
    });
  }

  if (!password || password.length < 8 || password.length > 128) {
    next({
      message: 'password must be between 8 and 128 characters',
      statusCode: 400,
    });
  }

  // Generate password hash
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Don't save the password to the database, just the hash
  const user = new User({ username, passwordHash });
  const result = await user.save();

  response.json(result);
});

const fetchUser = wrapAsync(async (request, response) => {
  const userWithData = await User.findById(request.params.id).populate({
    path: 'lists',
    select: { user: 0 },
    populate: {
      path: 'tasks',
      model: 'Task',
      select: { list: 0 },
    },
  });

  response.json(userWithData);
});

const deleteUser = wrapAsync(async (request, response, next) => {
  const userToRemove = await User.findById(request.params.id);

  if (!userToRemove) {
    next({
      message: `cannot find user with id ${request.params.id} to delete`,
      statusCode: 404,
    });

    return;
  }

  await userToRemove.remove();

  /// Return '204 No Content'
  response.status(204).end();
});

module.exports = { createUser, fetchUser, deleteUser };
