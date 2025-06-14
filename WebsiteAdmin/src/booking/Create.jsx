import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
function Create() {
  const [userId, setUserId] = useState('')
  const [salonId, setSalonId] = useState('')
  const [service, setService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
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
          state: { success: 'Booking added successfully!' }
        })
        setUserId('')
        setSalonId('')
        setService('')
        setDate('')
        setTime('')
      } else {
        alert('Failed to create booking')
      }
    } catch (err) {
      console.error('Error creating booking:', err)
      alert('Something went wrong. Check the console for details.')
    }
  }

  return (
    <div className="container mt-4">
      <h2>Create New Booking</h2>
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
          Create Booking
        </button>
      </form>
    </div>
  )
}

export default Create
