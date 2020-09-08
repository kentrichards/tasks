import React from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'

const Modal = ({ isOpen, handleClose, handleSubmit, children }) => (
  <ReactModal
    // Appearance
    style={{ overlay: { backgroundColor: 'rgba(0, 0, 0, 0.25)' } }}
    className="absolute w-full max-w-md focus:outline-none"
    overlayClassName="fixed flex justify-center h-screen w-screen inset-0 z-50 pt-48"
    // Default functionality
    shouldCloseOnOverlayClick={false}
    // Custom functionality
    isOpen={isOpen}
  >
    <div className="mx-4 px-6 py-4 bg-white rounded shadow">
      {children}
      <div className="flex justify-between">
        <button
          className="btn-outline"
          type="button"
          onClick={() => handleClose()}
        >
          Cancel
        </button>
        <button className="btn" type="button" onClick={() => handleSubmit()}>
          Submit
        </button>
      </div>
    </div>
  </ReactModal>
)

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.element).isRequired
}

ReactModal.setAppElement('#app')

export default Modal
