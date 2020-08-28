import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import PrivateRoute from './PrivateRoute'
import Login from '../features/user/Login'
import Register from '../features/user/Register'

const App = () => (
  <BrowserRouter>
    <Switch>
      <React.StrictMode>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <PrivateRoute path="*">
          <h1>user is signed in</h1>
        </PrivateRoute>
      </React.StrictMode>
    </Switch>
  </BrowserRouter>
)

export default App
