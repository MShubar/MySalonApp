import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'

const MyBookings = () => {
  const [showFilters, setShowFilters] = useState(false)
  const [bookings, setBookings] = useState([])
  const [cancelBookingId, setCancelBookingId] = useState(null)

  const [activeDateFilter, setActiveDateFilter] = useState('All')
  const [activeStatusFilter, setActiveStatusFilter] = useState('All')

  const { t } = useTranslation()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user || !user.username) return setBookings([])

        const response = await fetch('http://localhost:5000/bookings')
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        const userBookings = data.filter((b) => b.user_name === user.username)
        setBookings(userBookings)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }

    fetchBookings()
  }, [])

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (timeStr) => {
    return timeStr?.slice(0, 5)
  }

  const filterByDate = (booking) => {
    const today = new Date()
    const bookingDate = new Date(booking.booking_date)
    bookingDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)

    switch (activeDateFilter) {
      case 'Today':
        return bookingDate.getTime() === today.getTime()
      case 'Upcoming':
        return bookingDate.getTime() >= today.getTime()
      case 'Past':
        return bookingDate.getTime() < today.getTime()
      case 'All':
      default:
        return true
    }
  }

  const filterByStatus = (booking) => {
    if (activeStatusFilter === 'All') return true

    const status = booking.status?.toLowerCase() || ''

    switch (activeStatusFilter) {
      case 'Active':
        return status === 'active'
      case 'Completed':
        return status === 'completed'
      case 'Cancelled':
        return status === 'cancelled'
      case 'Complaint':
        return status === 'complaint'
      default:
        return true
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchStatus = activeStatusFilter === 'All' || filterByStatus(booking)
    const matchDate = activeDateFilter === 'All' || filterByDate(booking)
    return matchStatus && matchDate
  })

  // Sort filtered bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const priority = {
      active: 1,
      complaint: 2,
      completed: 3,
      cancelled: 4
    }
    const aStatus = a.status?.toLowerCase() || ''
    const bStatus = b.status?.toLowerCase() || ''

    return (priority[aStatus] || 99) - (priority[bStatus] || 99)
  })

  const handleRequestCancel = (id) => {
    setCancelBookingId(id)
  }

  const confirmCancelBooking = async () => {
    if (!cancelBookingId) return

    try {
      const response = await fetch(
        `http://localhost:5000/bookings/${cancelBookingId}`,
        { method: 'DELETE' }
      )

      if (response.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== cancelBookingId))
      } else {
        console.error('Failed to cancel booking')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setCancelBookingId(null)
    }
  }

  const cancelCancelBooking = () => {
    setCancelBookingId(null)
  }

  const dateFilters = ['All', 'Today', 'Upcoming', 'Past']
  const statusFilters = ['All', 'Active', 'Complaint', 'Completed', 'Cancelled']

  return (
    <div
      className="container mt-4"
      style={{
        color: '#ddd',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <Helmet>
        <title>My Bookings</title>
      </Helmet>

      <h1 className="text-center" style={{ color: '#222' }}>
        {t('My Bookings')}
      </h1>

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
          style={{
            fontWeight: 600,
            boxShadow: '0 0 8px rgba(79, 142, 247, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          <i className="bi bi-funnel-fill fs-5"></i> {t('Filters')}
        </button>
      </div>

      {showFilters && (
        <div className="mb-3 px-2">
          <div className="mb-2 d-flex overflow-auto flex-nowrap gap-3 pb-2">
            {dateFilters.map((filter) => (
              <button
                key={filter}
                className={`btn btn-sm text-capitalize ${
                  activeDateFilter === filter
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                }`}
                style={{
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  boxShadow:
                    activeDateFilter === filter
                      ? '0 0 10px rgba(79, 142, 247, 0.7)'
                      : '0 0 6px rgba(79, 142, 247, 0.4)'
                }}
                onClick={() => setActiveDateFilter(filter)}
                aria-pressed={activeDateFilter === filter}
                disabled={activeStatusFilter !== 'All'}
              >
                {t(filter)}
              </button>
            ))}
          </div>

          <div className="d-flex overflow-auto flex-nowrap gap-3 pb-2">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                className={`btn btn-sm text-capitalize ${
                  activeStatusFilter === filter
                    ? 'btn-primary'
                    : 'btn-outline-primary'
                }`}
                style={{
                  whiteSpace: 'nowrap',
                  fontWeight: 600,
                  boxShadow:
                    activeStatusFilter === filter
                      ? '0 0 10px rgba(79, 142, 247, 0.7)'
                      : '0 0 6px rgba(79, 142, 247, 0.4)'
                }}
                onClick={() => setActiveStatusFilter(filter)}
                aria-pressed={activeStatusFilter === filter}
              >
                {t(filter)}
              </button>
            ))}
          </div>
        </div>
      )}

      {sortedBookings.length === 0 ? (
        <p className="text-center text-muted fst-italic">
          {t('No Bookings Found')}
        </p>
      ) : (
        <div className="row">
          {sortedBookings.map((booking, idx) => (
            <div key={idx} className="col-md-4 mb-4">
              <div
                className="card h-100 shadow-sm"
                style={{
                  backgroundColor: '#1f1f1f',
                  color: '#ddd',
                  border: '1px solid #333',
                  borderRadius: '16px',
                  transition: 'transform 0.2s ease-in-out',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {booking.image_url ? (
                  <img
                    src={booking.image_url}
                    alt={`${booking.salon_name || 'Salon'} logo`}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center bg-secondary"
                    style={{
                      height: '200px',
                      fontSize: '72px',
                      color: 'white'
                    }}
                  >
                    {(booking.salon_name || 'S').charAt(0)}
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  <h5
                    className="card-title mb-2"
                    style={{
                      color: '#f0f8ff',
                      fontWeight: '700',
                      fontSize: '1.2rem'
                    }}
                  >
                    {booking.salon_name || '-'}
                  </h5>

                  <div
                    className="mb-2"
                    style={{ color: '#ccc', fontSize: '0.95rem' }}
                  >
                    {t('service')}:
                    <div className="mt-1 d-flex flex-wrap gap-2">
                      {(booking.service_name || '')
                        .split(',')
                        .map((service, i) => (
                          <span
                            key={i}
                            className="badge bg-primary-subtle text-primary px-2 py-1"
                            style={{
                              borderRadius: '20px',
                              backgroundColor: '#254d8f',
                              fontSize: '0.8rem'
                            }}
                          >
                            {service.trim()}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div
                    style={{
                      color: '#a1eafb',
                      fontWeight: '600',
                      fontSize: '0.9rem'
                    }}
                  >
                    <i className="bi bi-calendar-event me-1" />
                    {formatDate(booking.booking_date)} &nbsp;
                    <i className="bi bi-clock me-1" />
                    {formatTime(booking.booking_time)}
                  </div>
                  <div
                    style={{
                      color: '#ffd700',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      marginTop: '0.3rem'
                    }}
                  >
                    <i className="bi bi-cash-coin me-1" />
                    {t('Price')}: {Number(booking.total || 0).toFixed(2)} BHD
                  </div>

                  <div
                    style={{
                      marginTop: '0.5rem',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      color:
                        booking.status?.toLowerCase() === 'cancelled'
                          ? '#f44336'
                          : booking.status?.toLowerCase() === 'completed'
                          ? '#4caf50'
                          : booking.status?.toLowerCase() === 'active'
                          ? '#2196f3'
                          : booking.status?.toLowerCase() === 'complaint'
                          ? '#ff9800'
                          : '#ccc'
                    }}
                  >
                    {t('Status')}: {t(booking.status || 'Unknown')}
                  </div>

                  <div className="mt-3 d-flex gap-2">
                    {['active', 'pending'].includes(
                      booking.status?.toLowerCase()
                    ) && (
                      <button
                        className="btn btn-danger flex-fill"
                        style={{
                          fontWeight: 600,
                          boxShadow: '0 0 8px rgba(220, 53, 69, 0.5)',
                          transition:
                            'background-color 0.3s ease, color 0.3s ease'
                        }}
                        onClick={() => handleRequestCancel(booking.id)}
                        aria-label={t('Cancel booking')}
                      >
                        {t('Cancel')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelBookingId && (
        <div
          className="modal show d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content bg-dark text-light">
              <div className="modal-header">
                <h5 className="modal-title">{t('Confirm Cancellation')}</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label={t('Close')}
                  onClick={cancelCancelBooking}
                />
              </div>
              <div className="modal-body">
                {t('Are you sure you want to cancel this booking?')}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelCancelBooking}
                >
                  {t('No')}
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmCancelBooking}
                >
                  {t('Yes, Cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyBookings
