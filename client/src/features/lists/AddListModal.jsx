import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

import Modal from '../../common/Modal'
import { addList } from '../../app/actions'

const AddListModal = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch()
  const [listName, setListName] = useState('')

  const onClose = () => {
    setListName('')
    setIsOpen(false)
  }

  const onSubmit = () => {
    if (listName) {
      dispatch(addList(listName))
      setListName('')
      setIsOpen(false)
    }
  }

  return (
    <Modal isOpen={isOpen} handleClose={onClose} handleSubmit={onSubmit}>
      <h2 className="text-2xl font-semibold leading-none">Add List</h2>
      <input
        className="input max-w-64 my-4"
        value={listName}
        onChange={e => setListName(e.target.value)}
      />
    </Modal>
  )
}

AddListModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired
}

export default AddListModal
