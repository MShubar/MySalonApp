import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Spinner, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const SalonBooking = ({ userId }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [salon, setSalon] = useState(null)
  const [loading, setLoading] = useState(true)

  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [services, setServices] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [notes, setNotes] = useState('')
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30'
  ]

  useEffect(() => {
    const fetchSalonAndServices = async () => {
      try {
        const [salonRes, servicesRes] = await Promise.all([
          axios.get(`http://localhost:5000/salons/${id}`),
          axios.get(`http://localhost:5000/services/salon/${id}`)
        ])
        setSalon(salonRes.data)
        setServices(servicesRes.data)
      } catch (err) {
        console.error('Error fetching salon or services:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSalonAndServices()
  }, [id])

  useEffect(() => {
    const totalPrice = selectedServices.reduce((sum, sid) => {
      const service = services.find((s) => s.id === sid)
      return sum + (Number(service?.price) || 0)
    }, 0)
    console.log('Updated total price:', totalPrice)
    setTotal(totalPrice)
  }, [selectedServices, services])

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!date || !time) {
      setError(t('Please select a date and time'))
      return
    }

    if (selectedServices.length === 0) {
      setError(t('Please select at least one service'))
      return
    }

    try {
      await axios.post(`http://localhost:5000/bookings`, {
        user_id: userId,
        salon_id: id,
        service: selectedServices.join(','),
        booking_date: date,
        booking_time: time,
        notes,
        amount: total
      })
      setSuccess(t('Booking successful!'))
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(t('Failed to book. Please try again.'))
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner animation="border" variant="light" />
      </div>
    )
  }

  if (!salon) {
    return <p className="text-center text-muted mt-5">{t('Salon not found')}</p>
  }

  return (
    <div
      className="container mt-4"
      style={{
        color: '#ddd',
        backgroundColor: '#121212',
        minHeight: '80vh',
        padding: '1.5rem',
        borderRadius: '8px'
      }}
    >
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate(-1)}
        style={{ backgroundColor: '#333', border: 'none' }}
      >
        {t('Back')}
      </Button>

      <Row className="gy-4">
        <Col md={5} lg={4}>
          <Card
            className="shadow-sm"
            style={{ backgroundColor: '#222', border: 'none' }}
          >
            <Card.Img
              variant="top"
              src={salon.image_url ?? '/placeholder-salon.jpg'}
              alt={salon.name}
              style={{
                objectFit: 'cover',
                height: '300px',
                borderRadius: '8px'
              }}
            />
          </Card>
        </Col>

        <Col md={7} lg={8}>
          <h2 className="mb-3" style={{ color: '#fff' }}>
            {t('Book Appointment at')} {salon.name}
          </h2>
          <p>
            <strong>{t('Type')}:</strong> {salon.type || t('N/A')}
          </p>
          <p>
            <strong>{t('Rating')}:</strong> {salon.rating ?? t('No rating')}
          </p>
          <p>
            <strong>{t('Location')}:</strong>{' '}
            {salon.location?.latitude && salon.location?.longitude
              ? `${Number(salon.location.latitude).toFixed(3)}, ${Number(
                  salon.location.longitude
                ).toFixed(3)}`
              : t('Not specified')}
          </p>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Card
            className="mt-4 p-3"
            style={{ backgroundColor: '#222', border: '1px solid #444' }}
          >
            <Form onSubmit={handleBookingSubmit}>
              <Form.Group className="mb-3" controlId="bookingDate">
                <Form.Label style={{ color: '#ddd' }}>
                  {t('Select Date')}
                </Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  max={
                    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split('T')[0]
                  }
                  required
                  style={{
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    color: '#eee'
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookingTime">
                <Form.Label style={{ color: '#ddd' }}>
                  {t('Select Time')}
                </Form.Label>
                <Form.Select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  style={{
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    color: '#eee'
                  }}
                >
                  <option value="" disabled>
                    {t('Choose a time')}
                  </option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookingServices">
                <Form.Label style={{ color: '#ddd' }}>
                  {t('Select Services')}
                </Form.Label>
                {services.length === 0 ? (
                  <div className="text-muted">{t('No services available')}</div>
                ) : (
                  services.map((service) => (
                    <Form.Check
                      key={service.id}
                      type="checkbox"
                      id={`service-${service.id}`}
                      label={`${service.name} (${Number(service.price).toFixed(
                        2
                      )} BHD)`}
                      checked={selectedServices.includes(service.id)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...selectedServices, service.id]
                          : selectedServices.filter((sid) => sid !== service.id)
                        setSelectedServices(updated)
                      }}
                      style={{ color: '#ccc' }}
                    />
                  ))
                )}

                <div className="mt-3 fw-bold text-info">
                  {t('Total')}: {Number(total || 0).toFixed(2)} BHD
                </div>
              </Form.Group>

              <Form.Group className="mb-3" controlId="bookingNotes">
                <Form.Label style={{ color: '#ddd' }}>
                  {t('Notes (optional)')}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t('Any additional details')}
                  style={{
                    backgroundColor: '#333',
                    border: '1px solid #555',
                    color: '#eee'
                  }}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="success"
                className="w-100"
                style={{ backgroundColor: '#28a745', border: 'none' }}
              >
                {t('Confirm Booking')}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SalonBooking
