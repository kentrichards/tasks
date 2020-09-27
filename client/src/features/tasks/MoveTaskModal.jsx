import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import Modal from '../../common/Modal'
import { moveTask } from '../../app/actions'
import { selectCurrentList, selectOtherLists } from '../../app/selectors'

const MoveTaskModal = ({ task, isOpen, setIsOpen }) => {
  const dispatch = useDispatch()
  const [selectedList, setSelectedList] = useState(null)

  const currentList = useSelector(selectCurrentList)
  const otherLists = useSelector(selectOtherLists)

  const onClose = () => {
    setSelectedList(null)
    setIsOpen(false)
  }

  const onSubmit = () => {
    if (selectedList) {
      dispatch(moveTask({ taskToMove: task, newListId: selectedList }))
      setIsOpen(false)
    }
  }

  return (
    <Modal isOpen={isOpen} handleClose={onClose} handleSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold leading-none">Move Task</h2>
      <div className="pt-4">
        <h3 className="text-lg font-semibold text-blue-700">Current List</h3>
        <p>{currentList.name}</p>
      </div>
      <div className="py-4">
        <h3 className="text-lg font-semibold text-blue-700">Select New List</h3>
        <ul className="h-40 border rounded overflow-y-auto">
          {otherLists.map(list => (
            <button
              key={list.id}
              className={
                selectedList === list.id
                  ? 'select-item bg-gray-300 hover:bg-gray-300 focus:bg-gray-300'
                  : 'select-item'
              }
              type="button"
              onClick={() => setSelectedList(list.id)}
            >
              {list.name}
            </button>
          ))}
        </ul>
      </div>
    </Modal>
  )
}

MoveTaskModal.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired
}

export default MoveTaskModal
