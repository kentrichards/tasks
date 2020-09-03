import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

const Modal = props => {
  const { children, isOpen } = props

  return (
    <ReactModal
      // Appearance
      style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.50' } }}
      className="absolute w-full max-w-sm sm:max-w-md p-4 bg-white rounded shadow focus:outline-none"
      overlayClassName="fixed flex justify-center h-screen w-screen inset-0 z-50 p-8 pt-48"
      // Default functionality
      shouldCloseOnOverlayClick={false}
      // Custom functionality
      isOpen={isOpen}
    >
      {children}
    </ReactModal>
  )
}

Modal.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  isOpen: PropTypes.bool.isRequired
}

ReactModal.setAppElement('#app')

export default Modal
