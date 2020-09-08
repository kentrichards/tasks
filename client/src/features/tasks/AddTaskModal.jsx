import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Modal from '../../common/Modal'
import { addTask } from '../../app/actions'

const AddTaskModal = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch()
  const [taskText, setTaskText] = useState('')

  const onClose = () => {
    setTaskText('')
    setIsOpen(false)
  }

  const onSubmit = () => {
    if (taskText) {
      dispatch(addTask(taskText))
      setTaskText('')
      setIsOpen(false)
    }
  }

  return (
    <Modal isOpen={isOpen} handleClose={onClose} handleSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold leading-none">Add Task</h2>
      <textarea
        className="input max-w-64 h-32 my-4 resize-none"
        value={taskText}
        onChange={e => setTaskText(e.target.value)}
      />
    </Modal>
  )
}

AddTaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired
}

export default AddTaskModal
