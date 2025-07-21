import React from 'react'

const ServerError = ({ onRetry }) => (
  <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
    <h2 className="mb-3">Server Error</h2>
    <p className="mb-4">Something went wrong on our end. Please try again.</p>
    {onRetry && (
      <button className="btn btn-primary" onClick={onRetry}>
        Retry
      </button>
    )}
  </div>
)

export default ServerError
