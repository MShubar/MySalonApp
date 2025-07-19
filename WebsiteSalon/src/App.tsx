import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import NotFound from './components/NotFound'
import Login from './pages/Login'
import SignupStep1 from './pages/SignupStep1'
import SignupStep2 from './pages/SignupStep2'
import SignupStep3 from './pages/SignupStep3'
import PendingApproval from './pages/PendingApproval'
import Dashboard from './pages/Dashboard'
import { useAuth } from './context/AuthContext'
import BookingsPage from './pages/Bookings'
import SalonProfile from './pages/SalonProfile'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function App() {
  const { auth } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupStep1 />} />
      <Route path="/signup/step2" element={<SignupStep2 />} />
      <Route path="/signup/step3" element={<SignupStep3 />} />
      <Route path="/pending" element={<PendingApproval />} />
      <Route
        path="/dashboard"
        element={
          auth?.is_approved ? (
            <Dashboard />
          ) : auth ? (
            <Navigate to="/pending" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/profile"
        element={auth ? <SalonProfile /> : <Navigate to="/login" />}
      />
      <Route path="/bookings" element={<BookingsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
