import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import Modal from '../../common/Modal'
import { moveTask } from '../../app/actions'

const MoveTaskModal = ({ task, isOpen, setIsOpen }) => {
  const dispatch = useDispatch()
  const [selectedList, setSelectedList] = useState(null)

  const lists = useSelector(state => state.lists)
  const currentList = useSelector(state =>
    state.lists.find(list => list.id === state.currentListId)
  )
  const otherLists = lists.filter(list => list.id !== currentList.id)

  const onModalClose = type => {
    if (type === 'cancel') {
      setSelectedList(null)
      setIsOpen(false)
      return
    }

    if (selectedList) {
      dispatch(moveTask({ taskToMove: task, newListId: selectedList }))
      setIsOpen(false)
    }
  }

  return (
    <Modal isOpen={isOpen}>
      <h2 className="text-2xl font-semibold leading-none">Move Task</h2>
      <div className="pt-4">
        <h3 className="text-lg font-semibold text-blue-700">Current List</h3>
        <p>{currentList.name}</p>
      </div>
      <div className="py-4">
        <h3 className="text-lg font-semibold text-blue-700">Select New List</h3>
        <ul className="h-20 border rounded overflow-y-auto">
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
      <div className="flex justify-between">
        <button
          className="btn-outline"
          type="button"
          onClick={() => onModalClose('cancel')}
        >
          Cancel
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => onModalClose('submit')}
        >
          Submit
        </button>
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
