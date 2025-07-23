import { useParams, useNavigate } from 'react-router-dom'
import { Button, Alert, Row, Col, Card } from 'react-bootstrap'
import LoadingSpinner from '../LoadingSpinner'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import PropTypes from 'prop-types'
import { useSalonBooking } from '../../functionality/orders/UseSalonBooking'

const SalonBooking = ({ userId }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    salon,
    loading,
    date,
    setDate,
    time,
    setTime,
    services,
    selectedServices,
    setSelectedServices,
    notes,
    setNotes,
    total,
    error,
    success,
    slotsWithStatus,
    handleBookingSubmit
  } = useSalonBooking({ salonId: id, userId, t, navigate })

  if (loading) {
    return <LoadingSpinner className="mt-5" />
  }

  if (!salon) {
    return <p className="text-center text-muted mt-5">{t('Salon not found')}</p>
  }

  return (
    <div
      className="container mt-4"
      style={{
        color: '#f0f8ff',
        backgroundColor: '#1f1f1f',
        minHeight: '80vh',
        padding: '1.5rem',
        borderRadius: '12px'
      }}
    >
      <Button
        variant="outline-light"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        ← {t('Back')}
      </Button>

      <h2 style={{ color: '#a3c1f7' }}>
        {t('Book Appointment at')} {salon.name}
      </h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <form onSubmit={handleBookingSubmit}>
        <Row className="gy-4">
          <Col md={6}>
            <Card
              className="p-3"
              style={{ backgroundColor: '#2a2a2a', border: 'none' }}
            >
              <h5 style={{ color: '#f0e68c' }}>{t('Select Date')}</h5>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={moment().format('YYYY-MM-DD')}
                max={moment().add(14, 'days').format('YYYY-MM-DD')}
                required
                className="form-control mt-2"
                style={{
                  backgroundColor: '#333',
                  border: '1px solid #555',
                  color: '#f0f8ff'
                }}
              />
            </Card>
          </Col>

          <Col md={6}>
            <Card
              className="p-3"
              style={{ backgroundColor: '#2a2a2a', border: 'none' }}
            >
              <h5 style={{ color: '#f0e68c' }}>{t('Select Time')}</h5>
              <div
                className="d-flex gap-2 mt-2"
                style={{
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  paddingBottom: '0.5rem'
                }}
              >
                {slotsWithStatus.map(
                  ({ time: slotTime, disabled, withinSelectedRange }) => (
                    <label
                      key={slotTime}
                      className="btn"
                      style={{
                        backgroundColor: disabled
                          ? '#555'
                          : withinSelectedRange
                          ? '#00796b'
                          : '#333',
                        color: '#f0f8ff',
                        borderRadius: '8px',
                        border: '1px solid #555',
                        minWidth: '70px',
                        textAlign: 'center',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        flex: '0 0 auto',
                        padding: '8px 12px',
                        opacity: disabled ? 0.6 : 1,
                        fontWeight: withinSelectedRange ? 'bold' : 'normal'
                      }}
                    >
                      <input
                        type="radio"
                        name="bookingTime"
                        value={slotTime}
                        checked={time === slotTime}
                        onChange={() => !disabled && setTime(slotTime)}
                        disabled={disabled}
                        style={{ display: 'none' }}
                      />
                      {slotTime}
                    </label>
                  )
                )}
              </div>
            </Card>
          </Col>

          <Col md={12}>
            <Card
              className="p-3"
              style={{ backgroundColor: '#2a2a2a', border: 'none' }}
            >
              <h5 style={{ color: '#f0e68c' }}>{t('Select Services')}</h5>
              <div className="d-flex flex-wrap gap-3 mt-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() =>
                      setSelectedServices((prev) =>
                        prev.includes(service.id)
                          ? prev.filter((sid) => sid !== service.id)
                          : [...prev, service.id]
                      )
                    }
                    style={{
                      backgroundColor: selectedServices.includes(service.id)
                        ? '#00bcd4'
                        : '#333',
                      color: '#f0f8ff',
                      borderRadius: '10px',
                      padding: '10px',
                      cursor: 'pointer',
                      flex: '1 0 45%',
                      border: '1px solid #555',
                      textAlign: 'center'
                    }}
                  >
                    <strong>{t(service.name)}</strong>
                    <div>{Number(service.price).toFixed(2)} BHD</div>
                    <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
                      {service.duration || 0} {t('mins')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 fw-bold text-info">
                {t('Total')}: {Number(total || 0).toFixed(2)} BHD
              </div>
            </Card>
          </Col>

          <Col md={12}>
            <Card
              className="p-3"
              style={{ backgroundColor: '#2a2a2a', border: 'none' }}
            >
              <h5 style={{ color: '#f0e68c' }}>{t('Notes (optional)')}</h5>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={t('Any additional details')}
                className="form-control mt-2"
                style={{
                  backgroundColor: '#333',
                  border: '1px solid #555',
                  color: '#f0f8ff'
                }}
              />
            </Card>
          </Col>
        </Row>

        <Button
          type="submit"
          variant="success"
          className="mt-4 w-100"
          style={{
            backgroundColor: '#00bcd4',
            border: 'none',
            fontWeight: 'bold',
            boxShadow: '0 0 10px rgba(0, 188, 212, 0.6)'
          }}
        >
          {t('Confirm Booking')}
        </Button>
      </form>
    </div>
  )
}

SalonBooking.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

export default SalonBooking
