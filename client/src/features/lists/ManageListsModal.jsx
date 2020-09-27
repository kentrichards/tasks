import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import Modal from '../../common/Modal'
import ManageListsItem from './ManageListsItem'
import { selectLists } from '../../app/selectors'

const ManageListsModal = ({ isOpen, setIsOpen }) => {
  const lists = useSelector(selectLists)

  const onClose = () => {
    setIsOpen(false)
  }

  const onSubmit = () => {}

  return (
    <Modal isOpen={isOpen} handleClose={onClose} handleSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold leading-none">Manage Lists</h2>
      <ul className="h-40 my-4 border rounded overflow-y-auto">
        {lists.map(list => (
          <ManageListsItem key={list.id} list={list} />
        ))}
      </ul>
    </Modal>
  )
}

ManageListsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired
}

export default ManageListsModal
