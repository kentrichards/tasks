import React from 'react'
import PropTypes from 'prop-types'

import Spinner from './Spinner'

const Button = ({ text, handleClick, styles, isLoading }) => (
  <button type="submit" onClick={handleClick} className={`btn ${styles}`}>
    {isLoading ? <Spinner /> : text}
  </button>
)

Button.propTypes = {
  text: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
  styles: PropTypes.string,
  isLoading: PropTypes.bool
}

Button.defaultProps = {
  handleClick: () => {},
  styles: '',
  isLoading: false
}

export default Button
