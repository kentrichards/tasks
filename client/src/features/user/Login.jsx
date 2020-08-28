import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

import loginAPI from './loginAPI'
import Form from './Form'
import Button from '../../common/Button'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const history = useHistory()

  useEffect(() => {
    // Check if there is already a user signed in in this browser
    const loggedInUser = window.localStorage.getItem('savedUserJSON')
    if (loggedInUser) {
      history.push('/')
    }
  }, [history])

  const signInUser = async event => {
    event.preventDefault()
    event.stopPropagation()

    setSubmitting(true)
    setErrorMessage(null)

    // Attempt to log in using the provided credentials
    const result = await loginAPI.login(username, password)

    setSubmitting(false)

    // Login failed, display error to user
    if (result.error) {
      setErrorMessage(result.error)
      return
    }

    // Save the user's token and id to localStorage
    window.localStorage.setItem('savedUserJSON', JSON.stringify(result))

    // User is signed in, redirect them to the app
    history.push('/')
  }

  return (
    <div className="max-w-md mx-auto my-16">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Sign in to your account
        </h1>
        <p className="mt-1">
          Or&nbsp;
          <Link className="link" to="/register">
            create a new account
          </Link>
          &nbsp;now
        </p>
      </div>
      <form
        onSubmit={signInUser}
        className="mt-8 mx-4 p-6 sm:p-8 rounded shadow bg-white"
      >
        <Form
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          errorMessage={errorMessage}
        />
        <Button styles="w-full mt-6" text="Sign in" isLoading={submitting} />
      </form>
    </div>
  )
}

export default Login
