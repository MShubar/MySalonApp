import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" /> // Redirect to login if not authenticated
  }

  return children // Render children (protected component)
}

export default ProtectedRoute
