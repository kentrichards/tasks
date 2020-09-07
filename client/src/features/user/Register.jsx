import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

import userAPI from './userAPI'
import Form from './Form'
import Button from '../../common/Button'

const CreateAccount = () => {
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

  const registerUser = async event => {
    event.preventDefault()
    event.stopPropagation()

    setSubmitting(true)
    setErrorMessage(null)

    // Attempt to register a new account
    const result = await userAPI.register(username, password)

    setSubmitting(false)

    // Registration failed, display error to user
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
    <div className="max-w-md mx-auto py-16">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Create a new account
        </h1>
        <p className="mt-1">
          Already registered?&nbsp;
          <Link className="link" to="/login">
            Sign in
          </Link>
        </p>
      </div>
      <form
        onSubmit={registerUser}
        className="mt-8 mx-4 p-6 sm:p-8 rounded shadow bg-white"
      >
        <Form
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          errorMessage={errorMessage}
        />
        <div className="bg-gray-100 mt-6 px-4 py-2 rounded border">
          <p className="text-sm">Account requirements:</p>
          <ul className="text-sm list-disc ml-6">
            <li>Username must be at least 4 characters</li>
            <li>Password must be at least 8 characters</li>
          </ul>
        </div>
        <Button styles="w-full mt-6" text="Register" isLoading={submitting} />
      </form>
    </div>
  )
}

export default CreateAccount
