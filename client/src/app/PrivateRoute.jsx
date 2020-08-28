import React from 'react'
import PropTypes from 'prop-types'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ path, children }) => {
  let isLoggedIn = false
  if (window.localStorage.getItem('savedUserJSON')) {
    isLoggedIn = true
  }

  return (
    <Route path={path}>
      {isLoggedIn ? children : <Redirect to="/login" />}
    </Route>
  )
}

PrivateRoute.propTypes = {
  path: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
}

export default PrivateRoute
