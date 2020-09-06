import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

const Modal = props => {
  const { children, isOpen } = props

  return (
    <ReactModal
      // Appearance
      style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.50' } }}
      className="absolute w-full max-w-md focus:outline-none"
      overlayClassName="fixed flex justify-center h-screen w-screen inset-0 z-50 pt-48"
      // Default functionality
      shouldCloseOnOverlayClick={false}
      // Custom functionality
      isOpen={isOpen}
    >
      <div className="mx-4 p-6 bg-white rounded shadow">{children}</div>
    </ReactModal>
  )
}

Modal.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  isOpen: PropTypes.bool.isRequired
}

ReactModal.setAppElement('#app')

export default Modal
