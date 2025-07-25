import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import useBookingDetails from '../../functionality/orders/UseBookingDetails'
import ServerError from '../ServerError'
import capitalizeName from '../../utils/capitalizeName'

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  color: #f0f8ff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`

const Card = styled.div`
  background-color: #1f1f1f;
  border: 1px solid #333;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  margin-bottom: 2rem;
`

const Title = styled.h2`
  text-transform: capitalize;
  margin-bottom: 1rem;
`

const Label = styled.span`
  font-weight: 600;
`

const Status = styled.span`
  color: ${(props) =>
    props.$status === 'cancelled'
      ? '#f44336'
      : props.$status === 'completed'
      ? '#4caf50'
      : '#f0e68c'};
  text-transform: capitalize;
`

const ServiceList = styled.ul`
  list-style: none;
  padding: 0;
`

const ServiceItem = styled.li`
  background-color: #2a2a2a;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 0.5rem;
`

const Button = styled.button`
  background-color: #f44336;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;

  &:hover {
    background-color: #d32f2f;
  }
`

const ErrorText = styled.p`
  color: #f44336;
  margin-top: 1rem;
`

const InfoText = styled.p`
  color: #ccc;
`

const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 5rem;
`

const BookingDetailsPage = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const {
    booking,
    loading,
    error,
    retry,
    cancelError,
    handleCancelBooking,
    formatDate
  } = useBookingDetails(id, t)

  if (loading) {
    return (
      <LoadingContainer>
        <p>{t('Loading booking details...')}</p>
      </LoadingContainer>
    )
  }

  if (error) {
    if (error.response?.status === 500) {
      return <ServerError onRetry={retry} />
    }
    return (
      <LoadingContainer>
        <ErrorText>{t('Failed to load booking details.')}</ErrorText>
      </LoadingContainer>
    )
  }

  if (!booking) {
    return (
      <LoadingContainer>
        <p>{t('No booking found.')}</p>
      </LoadingContainer>
    )
  }

    return (
      <Container>
        <Helmet>
          <title>{`${t('Booking')} #${booking.id || t('Unknown')} ${t(
            'Details'
          )}`}</title>
          <meta
            name="description"
            content="Detailed view of your booking at MySalon."
          />
        </Helmet>

      <Card>
        <Title>
          {t('Booking')} #{booking.id}
        </Title>

          <p>
            <Label>{t('Salon')}:</Label> {capitalizeName(booking.salon_name)}
          </p>

        <p>
          <Label>{t('Status')}:</Label>{' '}
          <Status $status={booking.status.toLowerCase()}>
            {t(booking.status.toLowerCase())}
          </Status>
        </p>

        <p>
          <Label>{t('Date')}:</Label>{' '}
          {booking.booking_date ? formatDate(booking.booking_date) : t('N/A')}{' '}
          {t('at')} {booking.booking_time || t('N/A')}
        </p>

        <p style={{ color: '#f0e68c', fontWeight: '600' }}>
          {t('Total')}: {Number(booking.total).toFixed(2)} BHD
        </p>

        <h4>{t('Services')}:</h4>

        {booking.services && booking.services.length > 0 ? (
          <ServiceList>
            {booking.services.map((service, idx) => (
              <ServiceItem key={idx}>
                {t(service) !== service ? t(service) : service}
              </ServiceItem>
            ))}
          </ServiceList>
        ) : (
          <InfoText>{t('No services found for this booking.')}</InfoText>
        )}

        {cancelError && <ErrorText>{cancelError}</ErrorText>}

        {booking.status.toLowerCase() !== 'cancelled' &&
          booking.status.toLowerCase() !== 'completed' && (
            <Button onClick={handleCancelBooking}>{t('Cancel Booking')}</Button>
          )}
      </Card>
    </Container>
  )
}

export default BookingDetailsPage
