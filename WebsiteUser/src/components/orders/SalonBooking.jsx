import { useParams, useNavigate } from 'react-router-dom';
import { Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import LoadingSpinner from '../LoadingSpinner';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useSalonBooking } from '../../functionality/orders/UseSalonBooking';
import NoDataView from '../NoDataView';
import LoadingView from '../LoadingView';
import ButtonWithIcon from '../ButtonWithIcon';

const SalonBooking = ({ userId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    totalDuration,
    error,
    success,
    slotsWithStatus,
    handleBookingSubmit,
  } = useSalonBooking({ salonId: id, userId, t, navigate });

  const handleAddToCalendar = () => {
    if (!salon || !date || !time) return;
    const start = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
    const end = start.clone().add(totalDuration || 60, 'minutes');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MySalonApp//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@mysalonapp`,
      `DTSTAMP:${moment().utc().format('YYYYMMDDTHHmmss')}Z`,
      `DTSTART:${start.format('YYYYMMDDTHHmmss')}`,
      `DTEND:${end.format('YYYYMMDDTHHmmss')}`,
      `SUMMARY:Appointment at ${salon.name}`,
      `DESCRIPTION:${notes || ''}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'booking.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingView className="mt-5" />;
  }

  if (!salon) {
    return <NoDataView message={'No Salon Found'} />;
  }

  return (
    <div
      className="container mt-4"
      style={{
        color: '#f0f8ff',
        backgroundColor: '#1f1f1f',
        minHeight: '80vh',
        padding: '1.5rem',
        borderRadius: '12px',
      }}
    >
      <Helmet>
        <title>
          {t('Book Appointment at')} {salon.name}
        </title>
      </Helmet>
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
      {success && (
        <>
          <Alert variant="success">{success}</Alert>
          <ButtonWithIcon
            type="book"
            onClick={handleAddToCalendar}
            width="100%"
          >
            {t('Add to calendar')}
          </ButtonWithIcon>
        </>
      )}

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
                  color: '#f0f8ff',
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
                  paddingBottom: '0.5rem',
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
                        fontWeight: withinSelectedRange ? 'bold' : 'normal',
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
                      textAlign: 'center',
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
                  color: '#f0f8ff',
                }}
              />
            </Card>
          </Col>
        </Row>

        <ButtonWithIcon type="book" onClick={handleAddToCalendar} width="100%">
          {t('Confirm Booking')}
        </ButtonWithIcon>
      </form>
    </div>
  );
};

SalonBooking.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default SalonBooking;
