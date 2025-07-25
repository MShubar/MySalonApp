import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import useMyBookings from '../../functionality/orders/UseMyBookings'
import ServerError from '../ServerError'

const Container = styled.div`
  color: #ddd;
`

const Header = styled.h2`
  color: #222;
  font-weight: 700;
`

const CardStyled = styled.div`
  background-color: #1f1f1f;
  border: 1px solid #333;
  border-radius: 16px;
  cursor: pointer;
`

const CardTitle = styled.h5`
  color: #f0f8ff;
  text-transform: capitalize;
`

const CardText = styled.p`
  color: #ccc;
  margin-bottom: 4px;
`

const OrderItemImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 8px;
  border: 1px solid #444;
`

const Total = styled.div`
  color: #f0e68c;
  font-weight: 600;
`

const Status = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${(props) =>
    props.$status === 'cancelled'
      ? '#f44336'
      : props.$status === 'completed'
      ? '#4caf50'
      : '#ccc'};
`

const ItemList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-left: 0;
`

const ItemRow = styled.li`
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 4px;
  background-color: #2a2a2a;

  &:nth-child(even) {
    background-color: #252525;
  }
`

const MyBookings = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')))

  const {
    showFilters,
    setShowFilters,
    activeTypeFilter,
    setActiveTypeFilter,
    activeDateFilter,
    setActiveDateFilter,
    activeStatusFilter,
    setActiveStatusFilter,
    bookingsLoading,
    ordersLoading,
    bookingsError,
    ordersError,
    filteredData,
    formatDate,
    formatTime,
    groupOrderItems,
    handleRequestCancel,
    handleRequestCancelOrder,
    bookingsRetry,
    ordersRetry
  } = useMyBookings(t, user)

  const typeFilters = ['All', 'Bookings', 'Orders']
  const dateFilters = ['All', 'Today', 'Upcoming', 'Past']
  const statusFilters = [
    'All',
    'Pending',
    'Active',
    'Completed',
    'Delivered',
    'Cancelled',
    'Complaint'
  ]

  if (!user || !user.id) {
    return (
      <Container className="container mt-5 text-center">
        <Helmet>
          <title>{t('My Bookings & Orders')}</title>
        </Helmet>
        <Header>{t('Access Restricted')}</Header>
        <p className="text-center text-danger mt-5">
          {t(
            'Please sign in or create an account to view your bookings and orders.'
          )}
        </p>
        <a href="/signin" className="btn btn-primary m-2">
          {t('Sign In')}
        </a>
        <a href="/signup" className="btn btn-secondary m-2">
          {t('Sign Up')}
        </a>
      </Container>
    )
  }

  if (bookingsLoading || ordersLoading) {
    return <p className="text-center mt-5">{t('Loading...')}</p>
  }

  if (bookingsError || ordersError) {
    if (bookingsError?.response?.status === 500 || ordersError?.response?.status === 500) {
      return <ServerError onRetry={bookingsError ? bookingsRetry : ordersRetry} />
    }
    return (
      <p className="text-center text-danger mt-5">
        {t('Failed to load bookings or orders.')}
      </p>
    )
  }

  return (
    <Container className="container mt-4">
      <Helmet>
        <title>{t('My Bookings & Orders')}</title>
      </Helmet>

      <Header className="text-center mb-4">
        📖 {t('My Bookings & Orders')} 📖
      </Header>

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <i className="bi bi-funnel-fill fs-5"></i> {t('Filters')}
        </button>
      </div>

      {showFilters && (
        <div className="mb-3 px-2">
          {[typeFilters, dateFilters, statusFilters].map((filters, index) => (
            <div
              key={index}
              className="mb-2 d-flex overflow-auto flex-nowrap gap-3 pb-2"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  className={`btn btn-sm text-capitalize ${
                    (index === 0 && activeTypeFilter === filter) ||
                    (index === 1 && activeDateFilter === filter) ||
                    (index === 2 && activeStatusFilter === filter)
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  }`}
                  onClick={() => {
                    if (index === 0) setActiveTypeFilter(filter)
                    if (index === 1) setActiveDateFilter(filter)
                    if (index === 2) setActiveStatusFilter(filter)
                  }}
                >
                  {t(filter)}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {filteredData.length === 0 ? (
        <p className="text-center text-muted fst-italic">
          {t('No Bookings or Orders Found')}
        </p>
      ) : (
        <div className="row">
          {filteredData.map((item, idx) => (
            <div
              key={item.id || idx}
              className="col-md-4 mb-4"
              onClick={() =>
                navigate(
                  item.type === 'booking'
                    ? `/bookings/${item.id}`
                    : `/orders/${item.id}`
                )
              }
            >
              <CardStyled className="card h-100 shadow-sm">
                <div className="card-body">
                  <CardTitle className="card-title mb-2">
                    {item.type === 'booking'
                      ? `${t('Booking at')} ${item.salon_name}`
                      : `${t('Order')} #${item.id}`}
                  </CardTitle>

                  {item.type === 'booking' && (
                    <>
                      <CardText>
                        <strong>{t('Date')}:</strong>{' '}
                        {formatDate(item.booking_date)}
                      </CardText>
                      <CardText>
                        <strong>{t('Time')}:</strong>{' '}
                        {formatTime(item.booking_time)}
                      </CardText>
                    </>
                  )}

                  {item.type === 'order' && (
                    <div className="mb-2">
                      <span className="text-secondary">{t('Items')}:</span>
                      <ItemList className="ms-2 mt-1">
                        {groupOrderItems(item.items).map((itm, i) => (
                          <ItemRow key={i}>
                            {itm.image_url && (
                              <OrderItemImage
                                src={itm.image_url}
                                alt={itm.name}
                              />
                            )}
                            <div>
                              <div style={{ color: '#ddd' }}>{itm.name}</div>
                              <div
                                style={{ fontSize: '0.85rem', color: '#ccc' }}
                              >
                                {itm.quantity} x {Number(itm.price).toFixed(2)}{' '}
                                BHD
                              </div>
                            </div>
                          </ItemRow>
                        ))}
                      </ItemList>
                    </div>
                  )}

                  <Total className="mb-2">
                    {t('Total')}: {Number(item.total).toFixed(2)} BHD
                  </Total>

                  <Status className="mb-2" $status={item.status?.toLowerCase()}>
                    {t('Status')}: {t(item.status || 'Unknown')}
                  </Status>

                  {item.type === 'booking' &&
                    ['active', 'pending'].includes(
                      item.status?.toLowerCase()
                    ) && (
                      <button
                        className="btn btn-danger mt-3 w-100"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRequestCancel(item.id)
                        }}
                      >
                        {t('Cancel')}
                      </button>
                    )}

                  {item.type === 'order' &&
                    item.status?.toLowerCase() === 'pending' && (
                      <button
                        className="btn btn-danger w-100 mt-3"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRequestCancelOrder(item.id)
                        }}
                      >
                        {t('Cancel')}
                      </button>
                    )}
                </div>
              </CardStyled>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

export default MyBookings
