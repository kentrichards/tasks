const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const wrapAsync = require('../middleware/wrapAsync');
const User = require('../models/user');

const loginUser = wrapAsync(async (request, response, next) => {
  const { body } = request;

  const user = await User.findOne({ username: body.username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    next({
      message: 'invalid username or password',
      statusCode: 401,
    });

    return;
  }

  const payload = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(payload, process.env.SECRET);

  response.status(200).send({ token, username: user.username });
});

module.exports = { loginUser };
