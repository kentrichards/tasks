import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Dropdown from './Dropdown'
import EditTaskModal from './EditTaskModal'
import MoveTaskModal from './MoveTaskModal'
import { toggleCompleted } from '../../app/actions'
import { CircleIcon, CheckIcon, MenuIcon } from '../../common/Icons'

const TaskItem = ({ task, completed }) => {
  const dispatch = useDispatch()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)

  const onEditClicked = () => {
    setShowEditModal(true)
    setDropdownOpen(false)
  }

  const onMoveClicked = () => {
    setShowMoveModal(true)
    setDropdownOpen(false)
  }

  return (
    <>
      <li className="flex items-center mb-2 text-lg">
        <EditTaskModal
          taskId={task.id}
          initialText={task.text}
          isOpen={showEditModal}
          setIsOpen={setShowEditModal}
        />
        <MoveTaskModal
          task={task}
          isOpen={showMoveModal}
          setIsOpen={setShowMoveModal}
        />
        <button
          type="button"
          className="flex-shrink-0"
          onClick={() => dispatch(toggleCompleted(task.id))}
        >
          {completed ? <CheckIcon /> : <CircleIcon />}
        </button>
        <span
          className={
            completed
              ? 'flex-grow mx-3 break-words text-gray-400 line-through'
              : 'flex-grow mx-3 break-words'
          }
        >
          {task.text}
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
                taskId={task.id}
                text={task.text}
                onEditClicked={() => onEditClicked()}
                onMoveClicked={() => onMoveClicked()}
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
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  completed: PropTypes.bool.isRequired
}

export default TaskItem
