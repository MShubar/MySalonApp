import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleNavbar = () => setIsOpen(!isOpen)

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <h1 className="navbar-brand">Salon Admin</h1>

      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleNavbar}
        aria-controls="navbarNav"
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}
        id="navbarNav"
      >
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/dashboard"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/bookings"
              onClick={() => setIsOpen(false)}
            >
              Bookings
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link"
              to="/profile"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
