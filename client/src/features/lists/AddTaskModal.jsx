import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Modal from './Modal'
import { addTask } from '../../app/actions'

const AddTaskModal = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch()
  const [taskValue, setTaskValue] = useState('')

  const onModalClose = type => {
    if (type === 'cancel') {
      setTaskValue('')
      setIsOpen(false)
      return
    }

    if (taskValue) {
      dispatch(addTask(taskValue))
      setTaskValue('')
      setIsOpen(false)
    }
  }

  return (
    <Modal isOpen={isOpen}>
      <h2 className="text-2xl font-semibold leading-none">Add Task</h2>
      <textarea
        className="input max-w-64 h-32 my-4 resize-none"
        value={taskValue}
        onChange={e => setTaskValue(e.target.value)}
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

AddTaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired
}

export default AddTaskModal
