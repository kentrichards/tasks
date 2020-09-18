import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import TaskItem from './TaskItem'
import Button from '../../common/Button'
import AddTaskModal from './AddTaskModal'
import NonIdealState from './NonIdealState'
import { HamburgerIcon } from '../../common/Icons'
import { selectCurrentList } from '../../app/selectors'

const TaskView = ({ openSidebar }) => {
  const [showModal, setShowModal] = useState(false)

  // Sort the tasks so completed tasks are at the bottom
  const currentList = useSelector(selectCurrentList)

  let tasks = []
  if (currentList) {
    tasks = currentList.tasks.slice().sort((x, y) => x.completed - y.completed)
  }

  return (
    <div className="max-w-2xl flex-auto overflow-auto bg-white p-3 sm:p-6 sm:pt-16 shadow">
      <AddTaskModal
        isOpen={showModal}
        setIsOpen={setShowModal}
        listId={currentList.id}
      />
      <button
        type="button"
        className="sm:hidden p-1 rounded hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
        onClick={() => openSidebar()}
      >
        <HamburgerIcon />
      </button>
      {currentList ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1
              className="text-4xl font-bold truncate"
              title={currentList.name}
            >
              {currentList.name}
            </h1>
            <Button
              text="Add task"
              styles="shadow flex-shrink-0 ml-2"
              handleClick={() => setShowModal(true)}
            />
          </div>

          <ul>
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} completed={task.completed} />
            ))}
          </ul>
        </div>
      ) : (
        <NonIdealState />
      )}
    </div>
  )
}

TaskView.propTypes = {
  openSidebar: PropTypes.func.isRequired
}

export default TaskView
