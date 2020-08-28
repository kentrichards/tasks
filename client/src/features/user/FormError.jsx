import React from 'react'
import PropTypes from 'prop-types'

const FormError = ({ errorMessage }) => {
  let renderedContent = null
  if (errorMessage) {
    renderedContent = (
      <div className="bg-red-100 min-h-10 mt-6 px-4 py-2 rounded border border-red-200">
        <p className="text-sm text-red-700">
          <span className="font-semibold">Error: </span>
          {errorMessage}
        </p>
      </div>
    )
  }

  return renderedContent
}

FormError.propTypes = {
  errorMessage: PropTypes.string
}

FormError.defaultProps = {
  errorMessage: ''
}

export default FormError
