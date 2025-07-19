import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { API_URL } from '../config'

function Get() {
  const [bookings, setBookings] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [bookingToDelete, setBookingToDelete] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetch(`${API_URL}/bookings`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error('Error fetching bookings:', err))
  }, [])

  useEffect(() => {
    if (location.state?.success) {
      setSuccessMessage(location.state.success)
      setTimeout(() => setSuccessMessage(''), 3000)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const confirmDelete = async () => {
    if (!bookingToDelete) return
    try {
      const res = await fetch(
        `${API_URL}/bookings/${bookingToDelete.id}`,
        {
          method: 'DELETE'
        }
      )
      if (res.ok) {
        setBookings(bookings.filter((b) => b.id !== bookingToDelete.id))
        setSuccessMessage('Booking cancelled successfully!')
      } else {
        alert('Failed to cancel booking')
      }
    } catch (err) {
      console.error('Error deleting booking:', err)
      alert('Error occurred while cancelling booking')
    } finally {
      setBookingToDelete(null)
    }
  }

  const handleEdit = (id) => {
    navigate(`/editBooking/${id}`)
  }

  return (
    <>
      {/* Modal Overlay */}
      {bookingToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Confirm Cancellation</h2>
            <p>
              Are you sure you want to cancel the booking for{' '}
              <strong>{bookingToDelete.user_name}</strong> at{' '}
              <strong>{bookingToDelete.salon_name}</strong>?
            </p>
            <div className="modal-buttons">
              <button className="btn-action delete" onClick={confirmDelete}>
                Confirm Cancel
              </button>
              <button
                className="btn-action"
                onClick={() => setBookingToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`customer-table-container ${
          bookingToDelete ? 'blur-background' : ''
        }`}
      >
        {successMessage && (
          <div className="success-banner">{successMessage}</div>
        )}

        <div className="customer-table-header">
          <h2>All Bookings</h2>
          <Link to="/createBookings" className="add-button">
            +
          </Link>
        </div>

        <table className="customer-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Salon</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.user_name}</td>
                <td>{booking.salon_name}</td>
                <td>{booking.service}</td>
                <td>{booking.booking_date}</td>
                <td>{booking.booking_time}</td>
                <td>
                  <button
                    className="btn-action warning"
                    onClick={() => handleEdit(booking.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => setBookingToDelete(booking)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Get
