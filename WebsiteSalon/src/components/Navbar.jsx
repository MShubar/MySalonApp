import React, { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { LayoutDashboard, CalendarCheck, User } from 'lucide-react'

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
              className="nav-link d-flex align-items-center gap-1"
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              aria-label="Dashboard"
            >
              <LayoutDashboard size={16} className="me-1" />Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link d-flex align-items-center gap-1"
              to="/bookings"
              onClick={() => setIsOpen(false)}
              aria-label="Bookings"
            >
              <CalendarCheck size={16} className="me-1" />Bookings
            </Link>
          </li>
          <li className="nav-item">
            <Link
              className="nav-link d-flex align-items-center gap-1"
              to="/profile"
              onClick={() => setIsOpen(false)}
              aria-label="Profile"
            >
              <User size={16} className="me-1" />Profile
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
