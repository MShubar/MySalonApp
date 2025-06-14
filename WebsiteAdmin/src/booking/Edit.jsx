import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Edit() {
  const [userId, setUserId] = useState('')
  const [salonId, setSalonId] = useState('')
  const [service, setService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`http://localhost:5000/bookings/${id}`)
        const data = await res.json()
        if (res.ok) {
          setUserId(data.user_id)
          setSalonId(data.salon_id)
          setService(data.service)
          setDate(data.booking_date)
          setTime(data.booking_time)
        } else {
          alert('Failed to fetch booking data')
        }
      } catch (err) {
        console.error('Error fetching booking:', err)
        alert('Something went wrong while fetching data.')
      }
    }

    fetchBooking()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:5000/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          salon_id: salonId,
          service,
          booking_date: date,
          booking_time: time
        })
      })

      if (res.ok) {
        navigate('/getBookings', {
          state: { success: 'Booking updated successfully!' }
        })
        setUserId('')
        setSalonId('')
        setService('')
        setDate('')
        setTime('')
      } else {
        alert('Failed to update booking')
      }
    } catch (err) {
      console.error('Error updating booking:', err)
      alert('Something went wrong. Check the console for details.')
    }
  }

  return (
    <div className="container mt-4">
      <h2>Edit Booking</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>User ID</label>
          <input
            type="number"
            className="form-control"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label>Salon ID</label>
          <input
            type="number"
            className="form-control"
            value={salonId}
            onChange={(e) => setSalonId(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label>Service</label>
          <input
            type="text"
            className="form-control"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group mt-2">
          <label>Time</label>
          <input
            type="time"
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Booking
        </button>
      </form>
    </div>
  )
}

export default Edit
