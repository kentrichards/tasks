import React from 'react'
import PropTypes from 'prop-types'

import { CircleIcon, CheckIcon, MenuIcon } from '../../common/Icons'

const TaskItem = ({ task }) => (
  <>
    <li className="flex items-center mb-2 text-lg">
      <button type="button" className="flex-shrink-0">
        {task.completed ? <CheckIcon /> : <CircleIcon />}
      </button>
      <span
        className={
          task.completed
            ? 'flex-grow mx-3 text-gray-400 line-through'
            : 'flex-grow mx-3'
        }
      >
        {task.text}
      </span>
      <button type="button" className="flex-shrink-0">
        <MenuIcon styles={task.completed ? 'text-gray-400' : ''} />
      </button>
    </li>
    <hr className="task-divider mb-2" />
  </>
)

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    date: PropTypes.string,
    important: PropTypes.bool,
    completed: PropTypes.bool
  }).isRequired
}

export default TaskItem
