const jwt = require('jsonwebtoken');
const wrapAsync = require('./wrapAsync');
const User = require('../models/user');

const verifyToken = wrapAsync(async (request, _response, next) => {
  let token = null;
  const authorization = request.get('authorization');

  // Separate the token from the authorization header
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7);
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    next({
      message: 'token missing or invalid',
      statusCode: 401,
    });

    return;
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    next({
      message: `no user found with id ${decodedToken.id}`,
      statusCode: 404,
    });

    return;
  }

  // If the user field doesn't match the token (in the case of a task or a list)
  // and the id parameter also doesn't match (in the case of a user), reject the
  // request, because it is trying to access a different user's content
  if (request.body.user !== decodedToken.id && request.params.id !== decodedToken.id) {
    next({
      message: "cannot access, modify, or delete another user's resources",
      statusCode: 403,
    });

    return;
  }

  // Make the current user available to controllers by adding it to the request
  request.user = user;
  next();
});

module.exports = verifyToken;
