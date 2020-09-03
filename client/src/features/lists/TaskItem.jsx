import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Dropdown from './Dropdown'
import EditTaskModal from './EditTaskModal'
import { toggleCompleted } from '../../app/actions'
import { CircleIcon, CheckIcon, MenuIcon } from '../../common/Icons'

const TaskItem = ({ taskId, text, completed }) => {
  const dispatch = useDispatch()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  const onEditClicked = () => {
    setShowEditModal(true)
    setDropdownOpen(false)
  }

  return (
    <>
      <li className="flex items-center mb-2 text-lg">
        <EditTaskModal
          taskId={taskId}
          initialText={text}
          isOpen={showEditModal}
          setIsOpen={setShowEditModal}
        />
        <button
          type="button"
          className="flex-shrink-0"
          onClick={() => dispatch(toggleCompleted(taskId))}
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
              <Dropdown
                taskId={taskId}
                text={text}
                onEditClicked={() => onEditClicked()}
              />
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
  completed: PropTypes.bool.isRequired
}

export default TaskItem
