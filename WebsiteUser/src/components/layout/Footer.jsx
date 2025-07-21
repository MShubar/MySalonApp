import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="bg-dark text-light text-center py-3 mt-auto">
    <div className="container">
      <Link to="/terms" className="text-secondary text-decoration-none">
        Terms
      </Link>
    </div>
  </footer>
)

export default Footer
