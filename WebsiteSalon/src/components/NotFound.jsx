import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
    <h2 className="mb-3">404 - Page Not Found</h2>
    <p className="mb-4">The page you are looking for does not exist.</p>
    <Link to="/" className="btn btn-primary">Go Home</Link>
  </div>
)

export default NotFound
