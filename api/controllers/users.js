const bcrypt = require('bcrypt');
const wrapAsync = require('../middleware/wrapAsync');
const User = require('../models/user');

const createUser = wrapAsync(async (request, response, next) => {
  const { username, password } = request.body;

  if (!password || password.length < 8 || password.length > 128) {
    next({
      message: 'password must be between 8 and 128 characters',
      statusCode: 400,
    });

    return;
  }

  // Generate password hash
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Don't save the password to the database, just the hash
  const user = new User({ username, passwordHash });
  const result = await user.save();

  response.json(result);
});

const fetchUser = wrapAsync(async (request, response, next) => {
  if (request.params.id !== request.user._id) {
    next({
      message: "cannot fetch another user's data",
      statusCode: 403,
    });

    return;
  }

  const userWithData = await User.findById(request.params.id).populate({
    path: 'lists',
    select: { user: 0 },
    populate: {
      path: 'tasks',
      model: 'Task',
      select: { list: 0, user: 0 },
    },
  });

  response.json(userWithData);
});

module.exports = { createUser, fetchUser };
