import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { API_URL } from '../config'
import capitalizeName from '../utils/capitalizeName'

export default function BookingsPage() {
  const [bookings, setBookings] = useState([])
  const { auth } = useAuth()

  const fetchBookings = () => {
    axios.get(`${API_URL}/bookings`).then((res) => {
      const filtered = res.data
        .filter((b) => b.salon_name === auth.name)
        .sort((a, b) => {
          const statusOrder = {
            active: 0,
            pending: 1,
            completed: 2,
            Cancelled: 2
          }
          if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status]
          }
          const aDateTime = new Date(`${a.booking_date}T${a.booking_time}`)
          const bDateTime = new Date(`${b.booking_date}T${b.booking_time}`)
          return aDateTime - bDateTime
        })
      setBookings(filtered)
    })
  }

  useEffect(() => {
    fetchBookings()
  }, [auth.name])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return timeString?.slice(0, 5) || ''
  }

  const markAsCompleted = async (id) => {
    try {
      await axios.put(`${API_URL}/bookings/${id}`, {
        status: 'completed'
      })
      fetchBookings()
    } catch (err) {
      console.error('Failed to update status:', err.message)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge bg-info text-dark">Active</span>
      case 'completed':
        return <span className="badge bg-success">Completed</span>
      case 'Cancelled':
        return <span className="badge bg-secondary">Cancelled</span>
      case 'pending':
        return <span className="badge bg-warning text-dark">Pending</span>
      default:
        return <span className="badge bg-dark">Unknown</span>
    }
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">📅 All Bookings</h2>
          <p className="text-muted">
            View and manage bookings for <strong>{capitalizeName(auth.name)}</strong>
          </p>
        </div>

        {bookings.length === 0 ? (
          <p className="text-center text-muted">No bookings found.</p>
        ) : (
          <div className="row g-4">
            {bookings.map((b) => (
              <div key={b.id} className="col-md-6 col-lg-4">
                <div
                  className="card shadow-sm border-0 h-100 text-white"
                  style={{
                    background: '#1e1e2f',
                    borderRadius: '12px'
                  }}
                >
                  <div className="card-body d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h5 className="mb-1">{capitalizeName(b.user_name)}</h5>
                        <p
                          className="text-light mb-0"
                          style={{ fontSize: '0.9rem' }}
                        >
                          📅 {formatDate(b.booking_date)} | ⏰{' '}
                          {formatTime(b.booking_time)}
                        </p>
                      </div>
                      <div>{getStatusBadge(b.status)}</div>
                    </div>

                    <div className="mt-3">
                      <h6 className="text-uppercase text-secondary mb-1">
                        Services
                      </h6>
                      <p className="mb-3">{b.service_name}</p>

                      {b.status === 'active' && (
                        <button
                          className="btn btn-sm btn-success w-100 mt-auto"
                          onClick={() => markAsCompleted(b.id)}
                        >
                          ✅ Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
