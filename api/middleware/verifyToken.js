const jwt = require('jsonwebtoken')
const wrapAsync = require('./wrapAsync')
const User = require('../models/user')

const verifyToken = wrapAsync(async (request, _response, next) => {
  let token = null
  const authorization = request.get('authorization')

  // Separate the token from the authorization header
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    next({
      message: 'token missing or invalid',
      statusCode: 401
    })

    return
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    next({
      message: `no user found with id ${decodedToken.id}`,
      statusCode: 404
    })

    return
  }

  // Make the current user available to controllers by adding it to the request
  request.user = user
  next()
})

module.exports = verifyToken
