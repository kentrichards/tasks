import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Modal from './Modal'
import { editTask } from '../../app/actions'

const EditTaskModal = ({ taskId, initialText, isOpen, setIsOpen }) => {
  const dispatch = useDispatch()
  const [taskText, setTaskText] = useState(initialText)

  const onModalClose = type => {
    if (type === 'cancel') {
      setTaskText(initialText)
      setIsOpen(false)
      return
    }

    if (taskText) {
      dispatch(editTask({ id: taskId, text: taskText }))
      setTaskText('')
      setIsOpen(false)
    }
  }

  return (
    <Modal isOpen={isOpen}>
      <h2 className="text-2xl font-semibold leading-none">Edit Task</h2>
      <textarea
        className="input max-w-64 h-32 my-4 resize-none"
        value={taskText}
        onChange={e => setTaskText(e.target.value)}
      />
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

EditTaskModal.propTypes = {
  taskId: PropTypes.string.isRequired,
  initialText: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired
}

export default EditTaskModal
