import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

const Sidebar = () => {
  const [active, setActive] = useState('User Management')
  const navigate = useNavigate()

  const navItem = (label, icon, route) => (
    <div
      className={`sidebar-item ${active === label ? 'active' : ''}`}
      onClick={() => {
        setActive(label)
        navigate(route)
      }}
    >
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
    </div>
  )

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken')
    try {
      await axios.post(
        'http://localhost:5000/admins/logout',
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
