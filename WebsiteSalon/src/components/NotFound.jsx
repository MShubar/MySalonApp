import React from 'react'
import { Link } from 'react-router-dom'
import notFoundImg from '../assets/NotFound.svg'

const NotFound = () => (
  <div
    className="d-flex flex-column align-items-center justify-content-center text-center py-5"
    style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
  >
    <img src={notFoundImg} alt="Page not found" className="mb-4" style={{ maxWidth: '240px' }} />
    <h2 className="mb-3">404 - Page Not Found</h2>
    <p className="mb-4">The page you are looking for does not exist.</p>
    <Link to="/login" className="btn btn-primary">
      Go Home
    </Link>
  </div>
)

export default NotFound
