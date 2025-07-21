import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="bg-dark text-light py-3 mt-4">
    <div className="container text-center">
      <span className="me-2">&copy; {new Date().getFullYear()} MySalon</span>
      <Link to="/privacy" className="text-decoration-none text-light">
        Privacy Policy
      </Link>
    </div>
  </footer>
)

export default Footer
