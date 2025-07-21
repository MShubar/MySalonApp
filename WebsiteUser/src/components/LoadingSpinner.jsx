import React from 'react'
import { Spinner } from 'react-bootstrap'

/**
 * Simple centered loading spinner used across the website.
 * Additional className or style can be passed through props.
 */
const LoadingSpinner = ({ className = '', style, ...props }) => (
  <div
    className={`d-flex justify-content-center align-items-center ${className}`}
    style={style}
    {...props}
  >
    <Spinner animation="border" variant="light" />
  </div>
)

export default LoadingSpinner
