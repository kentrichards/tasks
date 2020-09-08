import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Modal from '../../common/Modal'
import { editTask } from '../../app/actions'

const EditTaskModal = ({ taskId, initialText, isOpen, setIsOpen }) => {
  const dispatch = useDispatch()
  const [taskText, setTaskText] = useState(initialText)

  const onClose = () => {
    setTaskText(initialText)
    setIsOpen(false)
  }

  const onSubmit = () => {
    if (taskText) {
      dispatch(editTask({ id: taskId, text: taskText }))
      setTaskText('')
      setIsOpen(false)
    }
  }

  return (
    <Modal isOpen={isOpen} handleClose={onClose} handleSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold leading-none">Edit Task</h2>
      <textarea
        className="input max-w-64 h-32 my-4 resize-none"
        value={taskText}
        onChange={e => setTaskText(e.target.value)}
      />
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
