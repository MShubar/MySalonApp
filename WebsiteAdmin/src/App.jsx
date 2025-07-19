import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './authPage/ProtectedRoute'

import AuthPage from './authPage/AuthPage'
import CreateSalons from './addingSalon/Create'
import EditSalons from './addingSalon/Edit'
import GetSalons from './addingSalon/Get'
import ApprovalHistory from './addingSalon/ApprovalHistory'

import CreateUsers from './addingUser/Create'
import EditUsers from './addingUser/Edit'
import GetUsers from './addingUser/Get'

import CreateAdmins from './addingAdmin/Create'
import EditAdmins from './addingAdmin/Edit'
import GetAdmins from './addingAdmin/Get'

import CreateBookings from './booking/Create'
import EditBookings from './booking/Edit'
import GetBookings from './booking/Get'

import GetContact from './contacts/Get'

import CreatePackages from './package/Create'
import EditPackages from './package/Edit'
import GetPackages from './package/Get'

import CreateProducts from './product/Create'
import EditProducts from './product/Edit'
import GetProducts from './product/Get'

import CreateTypes from './types/Create'
import EditTypes from './types/Edit'
import GetTypes from './types/Get'

import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      setIsAuthenticated(true)
    }
  }, []) // This will run once after the component mounts

  const handleLogout = () => {
    // Remove the auth token from localStorage and immediately update the state
    localStorage.removeItem('authToken')
    setIsAuthenticated(false) // Immediately set authenticated to false
  }

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <div className="sidebar">
            <Sidebar handleLogout={handleLogout} />
          </div>
        )}
        <div className="content">
          <Routes>
            {/* Public Login Page */}
            <Route
              path="/"
              element={
                <AuthPage
                  setIsAuthenticated={setIsAuthenticated}
                  setAuthToken={() => {}}
                />
              }
            />

            {/* Salons */}
            <Route
              path="/getSalons"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <GetSalons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/createSalons"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CreateSalons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editSalons/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <EditSalons />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approvalHistory/:salonId"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ApprovalHistory />
                </ProtectedRoute>
              }
            />

            {/* Users */}
            <Route
              path="/createUsers"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CreateUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/getUsers"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <GetUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editUsers/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <EditUsers />
                </ProtectedRoute>
              }
            />

            {/* Admins */}
            <Route
              path="/createAdmins"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CreateAdmins />
                </ProtectedRoute>
              }
            />
            <Route
              path="/getAdmins"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <GetAdmins />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editAdmins/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <EditAdmins />
                </ProtectedRoute>
              }
            />

            {/* Bookings */}
            <Route
              path="/createBookings"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CreateBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/getBookings"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <GetBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editBooking/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <EditBookings />
                </ProtectedRoute>
              }
            />

            {/* Contacts */}
            <Route
              path="/getContacts"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <GetContact />
                </ProtectedRoute>
              }
            />

            {/* Packages */}
            <Route
              path="/createPackages"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CreatePackages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/getPackages"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <GetPackages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editPackages/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <EditPackages />
                </ProtectedRoute>
              }
            />

            {/* Products */}
            <Route
              path="/createProduct"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CreateProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/getProduct"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <GetProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editProduct/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <EditProducts />
                </ProtectedRoute>
              }
            />

            {/* Types */}
            <Route
              path="/createTypes"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CreateTypes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/getTypes"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <GetTypes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editTypes/:id"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <EditTypes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
