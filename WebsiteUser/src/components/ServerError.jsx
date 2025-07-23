import React from 'react'
import { Helmet } from 'react-helmet'

const ServerError = ({ onRetry }) => (
  <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
    <Helmet>
      <title>Server Error</title>
      <meta
        name="description"
        content="An unexpected error occurred on MySalon. Please try again."
      />
    </Helmet>
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
