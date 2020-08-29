import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import MainLayout from './MainLayout'
import PrivateRoute from './PrivateRoute'
import Login from '../features/user/Login'
import Register from '../features/user/Register'

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <PrivateRoute path="*">
        <MainLayout />
      </PrivateRoute>
    </Switch>
  </BrowserRouter>
)

export default App
