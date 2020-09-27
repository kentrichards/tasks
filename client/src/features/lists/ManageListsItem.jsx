import React from 'react'
import PropTypes from 'prop-types'

import { EditIcon, DeleteIcon } from '../../common/Icons'

const ManageListsItem = ({ list }) => {
  return (
    <li className="select-item">
      <span className="flex-grow">{list.name}</span>
      <button type="button">
        <EditIcon>
          <title>Edit list</title>
        </EditIcon>
      </button>
      <button type="button">
        <DeleteIcon>
          <title>Delete list</title>
        </DeleteIcon>
      </button>
    </li>
  )
}

ManageListsItem.propTypes = {
  list: PropTypes.shape({
    name: PropTypes.string
  }).isRequired
}

export default ManageListsItem
