import React from 'react'
import PropTypes from 'prop-types'

const LinkButton = ({ text, handleClick, styles }) => (
  <button
    type="button"
    onClick={handleClick}
    className={`link cursor-pointer ${styles}`}
  >
    {text}
  </button>
)

LinkButton.propTypes = {
  text: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  styles: PropTypes.string
}

LinkButton.defaultProps = {
  styles: ''
}

export default LinkButton
