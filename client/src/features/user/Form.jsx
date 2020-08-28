import React, { useState } from 'react'
import PropTypes from 'prop-types'

import FormError from './FormError'
import LinkButton from './LinkButton'

const Form = props => {
  const { username, password, setUsername, setPassword, errorMessage } = props
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
      <label className="block" htmlFor="username-input">
        Username
      </label>
      <input
        className="input"
        type="text"
        placeholder="michael123"
        id="username-input"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <div className="mt-4 flex items-baseline justify-between">
        <label htmlFor="password-input">Password</label>
        <LinkButton
          text={showPassword ? 'Hide password' : 'Show password'}
          handleClick={() => setShowPassword(!showPassword)}
          styles="text-xs"
        />
      </div>
      <input
        className="input"
        type={showPassword ? 'text' : 'password'}
        id="password-input"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <FormError errorMessage={errorMessage} />
    </>
  )
}

Form.propTypes = {
  username: PropTypes.string.isRequired,
  setUsername: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  setPassword: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
}

Form.defaultProps = {
  errorMessage: null
}

export default Form
