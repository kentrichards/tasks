import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import Modal from './Modal'
import TaskItem from './TaskItem'
import Button from '../../common/Button'
import { HamburgerIcon } from '../../common/Icons'

const TaskView = ({ openSidebar }) => {
  const [showModal, setShowModal] = useState(false)

  // Sort the tasks so completed tasks are at the bottom
  const currentList = useSelector(state =>
    state.lists.find(list => list.id === state.currentListId)
  )
  const tasks = currentList.tasks
    .slice()
    .sort((x, y) => x.completed - y.completed)

  return (
    <div className="max-w-2xl flex-auto overflow-auto bg-white p-3 sm:p-6 sm:pt-16 shadow">
      <Modal isOpen={showModal} onRequestClose={() => setShowModal(false)}>
        <h2 className="text-2xl font-semibold leading-none">Add Task</h2>
        <textarea className="input max-w-64 h-32 my-4 resize-none" />
        <div className="flex justify-between">
          <button
            className="btn-outline"
            type="button"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button className="btn" type="button">
            Submit
          </button>
        </div>
      </Modal>
      <button
        type="button"
        className="sm:hidden p-1 rounded hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
        onClick={() => openSidebar()}
      >
        <HamburgerIcon />
      </button>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold truncate" title={currentList.name}>
            {currentList.name}
          </h1>
          <Button
            text="Add task"
            styles="shadow flex-shrink-0"
            handleClick={() => setShowModal(true)}
          />
        </div>

        <ul>
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              taskId={task.id}
              text={task.text}
              completed={task.completed}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

TaskView.propTypes = {
  openSidebar: PropTypes.func.isRequired
}

export default TaskView
