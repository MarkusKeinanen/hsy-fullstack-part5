import React from 'react'
import PropTypes from 'prop-types'

const Notification = ({ message }) => {
  if (message === '') {
    return null
  }

  return (
    <div className="message">
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string.isRequired
}

export default Notification