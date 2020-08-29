import React from 'react'
import { useSelector } from 'react-redux'

import TaskItem from './TaskItem'
import Button from '../../common/Button'

const TaskView = () => {
  const currentList = useSelector(state =>
    state.lists.find(list => list.id === state.user.currentListId)
  )
  const { tasks } = currentList

  return (
    <div className="max-w-2xl flex-auto overflow-auto bg-white p-6 pt-16 shadow">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-4xl font-bold truncate" title={currentList.name}>
            {currentList.name}
          </h1>
          <Button text="Add task" styles="shadow flex-shrink-0" />
        </div>

        <ul>
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TaskView
