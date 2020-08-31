import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Dropdown from './Dropdown'
import { toggleCompleted } from './listsSlice'
import { CircleIcon, CheckIcon, MenuIcon } from '../../common/Icons'

const TaskItem = ({ taskId, text, completed, listId }) => {
  const dispatch = useDispatch()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <>
      <li className="flex items-center mb-2 text-lg">
        <button
          type="button"
          className="flex-shrink-0"
          onClick={() => dispatch(toggleCompleted({ taskId, listId }))}
        >
          {completed ? <CheckIcon /> : <CircleIcon />}
        </button>
        <span
          className={
            completed
              ? 'flex-grow mx-3 text-gray-400 line-through'
              : 'flex-grow mx-3'
          }
        >
          {text}
        </span>
        <button
          type="button"
          className="flex-shrink-0 relative inline-block text-left"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <MenuIcon styles={completed ? 'text-gray-400' : ''} />
          {dropdownOpen && <Dropdown />}
        </button>
      </li>
      <hr className="task-divider mb-2" />
    </>
  )
}

TaskItem.propTypes = {
  taskId: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  listId: PropTypes.string.isRequired
}

export default TaskItem
