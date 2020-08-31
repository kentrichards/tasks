import React from 'react'
import PropTypes from 'prop-types'

const MenuItem = ({ text, icon, handleClick, count }) => (
  <li>
    <button
      type="button"
      className="menu-item"
      title={text}
      onClick={handleClick}
    >
      <span className="flex items-center justify-center text-xl">{icon}</span>
      <span className="flex-grow ml-3 truncate text-left text-gray-800">
        {text}
      </span>
      <span className="text-sm text-blue-900 font-semibold ml-3">
        {count || null}
      </span>
    </button>
  </li>
)

MenuItem.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  handleClick: PropTypes.func,
  count: PropTypes.number
}

MenuItem.defaultProps = {
  handleClick: () => {},
  count: 0
}

export default MenuItem
