import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  FaUser,
  FaSignOutAlt,
  FaCut,
  FaUsers,
  FaUserShield,
  FaBook,
  FaPhone,
  FaBox,
  FaShoppingBag,
  FaTags
} from 'react-icons/fa'
import axios from 'axios'
import { API_URL } from '../config'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItem = (label, icon, route) => {
    // Highlight the sidebar entry when the current path starts with the
    // navigation route. This ensures that nested routes such as edit or
    // create pages still highlight the parent section.
    const isActive = location.pathname.startsWith(route)
    return (
      <div
        className={`sidebar-item ${isActive ? 'active' : ''}`}
        onClick={() => {
          navigate(route)
        }}
      >
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
      </div>
    )
  }

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken')
    try {
      await axios.post(
        `${API_URL}/admins/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
    } catch (err) {
      console.error('Error logging out:', err)
    }

    localStorage.removeItem('authToken')
    navigate('/', { replace: true })
  }

  return (
    <div className="sidebar">
      <div className="logo">MySalonAdmin</div>

      {/* Salons */}
      {navItem('Salons', <FaCut />, '/getSalons')}

      {/* Users */}
      {navItem('Users', <FaUsers />, '/getUsers')}

      {/* Admins */}
      {navItem('Admins', <FaUserShield />, '/getAdmins')}

      {/* Bookings */}
      {navItem('Bookings', <FaBook />, '/getBookings')}

      {/* Contacts */}
      {navItem('Contacts', <FaPhone />, '/getContacts')}

      {/* Packages */}
      {navItem('Packages', <FaBox />, '/getPackages')}

      {/* Products */}
      {navItem('Products', <FaShoppingBag />, '/getProduct')}

      {/* Types */}
      {navItem('Types', <FaTags />, '/getTypes')}

      {navItem('Services', <FaUser />, '/getServices')}

      {/* Logout */}
      <div
        className="sidebar-item"
        onClick={handleLogout}
        style={{ marginTop: 'auto', color: 'red' }}
      >
        <span className="icon">
          <FaSignOutAlt />
        </span>
        <span className="label">Logout</span>
      </div>
    </div>
  )
}

export default Sidebar
