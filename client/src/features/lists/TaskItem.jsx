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
        <div className="relative flex items-center">
          <button
            type="button"
            className="flex-shrink-0 inline-block text-left"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <MenuIcon styles={completed ? 'text-gray-400' : ''} />
          </button>
          {dropdownOpen && (
            <>
              <button
                type="button"
                tabIndex="-1"
                className="fixed inset-0 h-full w-full z-10 cursor-default"
                onClick={() => setDropdownOpen(false)}
                aria-label="Close dropdown"
              />
              <Dropdown />
            </>
          )}
        </div>
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
