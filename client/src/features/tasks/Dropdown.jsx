import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import { deleteTask } from '../../app/actions'
import { EditIcon, MoveIcon, DeleteIcon } from '../../common/Icons'

const Dropdown = ({ taskId, onEditClicked, onMoveClicked }) => {
  const dispatch = useDispatch()

  return (
    <div className="absolute right-0 top-0 mr-6 w-32 rounded shadow z-20">
      <div className="rounded bg-white border">
        <button
          type="button"
          className="dropdown-item rounded-t"
          onClick={() => onEditClicked()}
        >
          <EditIcon />
          <span className="pl-2">Edit</span>
        </button>
        <button
          type="button"
          className="dropdown-item"
          onClick={() => onMoveClicked()}
        >
          <MoveIcon />
          <span className="pl-2">Move</span>
        </button>
        <button
          type="button"
          className="dropdown-item rounded-b"
          onClick={() => dispatch(deleteTask(taskId))}
        >
          <DeleteIcon />
          <span className="pl-2">Delete</span>
        </button>
      </div>
    </div>
  )
}

Dropdown.propTypes = {
  taskId: PropTypes.string.isRequired,
  onEditClicked: PropTypes.func.isRequired,
  onMoveClicked: PropTypes.func.isRequired
}

export default Dropdown
