import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Modal from './Modal'
import { addTask } from '../../app/actions'

const AddTask = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch()
  const [addTaskValue, setAddTaskValue] = useState('')

  const onModalClose = type => {
    if (type === 'cancel') {
      setAddTaskValue('')
      setIsOpen(false)
      return
    }

    if (addTaskValue) {
      dispatch(addTask(addTaskValue))
      setAddTaskValue('')
      setIsOpen(false)
    }
  }

  return (
    <Modal isOpen={isOpen}>
      <h2 className="text-2xl font-semibold leading-none">Add Task</h2>
      <textarea
        className="input max-w-64 h-32 my-4 resize-none"
        value={addTaskValue}
        onChange={e => setAddTaskValue(e.target.value)}
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

AddTask.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired
}

export default AddTask
