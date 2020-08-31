import React from 'react'

import { EditIcon, MoveIcon, DeleteIcon } from '../../common/Icons'

const Dropdown = () => (
  <div className="absolute right-0 mr-6 -mt-6 w-32 rounded shadow z-50">
    <div className="rounded bg-white border">
      <button type="button" className="dropdown-item rounded-t">
        <EditIcon />
        <span className="pl-2">Edit</span>
      </button>
      <button type="button" className="dropdown-item">
        <MoveIcon />
        <span className="pl-2">Move</span>
      </button>
      <button type="button" className="dropdown-item rounded-b">
        <DeleteIcon />
        <span className="pl-2">Delete</span>
      </button>
    </div>
  </div>
)

export default Dropdown
