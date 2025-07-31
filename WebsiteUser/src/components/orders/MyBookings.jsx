import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useMyBookings from '../../functionality/orders/UseMyBookings';
import ServerError from '../ServerError';
import capitalizeName from '../../utils/capitalizeName';
import FilterButton from '../FilterButton';
import SearchBar from '../SearchBar';
import { useSearchFilter } from '../../functionality/UseSearchFilter';
import NoDataView from '../NoDataView';
import ButtonWithIcon from '../ButtonWithIcon';
const Container = styled.div`
  color: #ddd;
`;

const Header = styled.h2`
  color: #222;
  font-weight: 700;
`;

const CardStyled = styled.div`
  background-color: #1f1f1f;
  border: 1px solid #333;
  border-radius: 16px;
  cursor: pointer;
`;

const CardTitle = styled.h5`
  color: #f0f8ff;
  text-transform: capitalize;
`;

const CardText = styled.p`
  color: #ccc;
  margin-bottom: 4px;
`;

const OrderItemImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 8px;
  border: 1px solid #444;
`;

const Total = styled.div`
  color: #f0e68c;
  font-weight: 600;
`;

const ItemList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-left: 0;
`;

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
`;

const MyBookings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));

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
    filteredData: bookingsAndOrders,
    formatDate,
    formatTime,
    groupOrderItems,
    handleRequestCancel,
    handleRequestCancelOrder,
    bookingsRetry,
    ordersRetry,
  } = useMyBookings(t, user);

  // Integrating the search filter with the filtered data
  const {
    searchQuery,
    setSearchQuery,
    filteredData: searchFilteredData,
  } = useSearchFilter(
    bookingsAndOrders,
    'salon_name' // Adjust the field for filtering as needed
  );

  const typeFilters = ['All', 'Bookings', 'Orders'];
  const dateFilters = ['All', 'Today', 'Upcoming', 'Past'];
  const statusFilters = [
    'All',
    'Pending',
    'Active',
    'Completed',
    'Delivered',
    'Cancelled',
    'Complaint',
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="badge bg-warning text-dark">{t('Pending')}</span>
        );
      case 'active':
        return <span className="badge bg-info text-dark">{t('Active')}</span>;
      case 'completed':
        return <span className="badge bg-success">{t('Completed')}</span>;
      case 'delivered':
        return <span className="badge bg-primary">{t('Delivered')}</span>;
      case 'cancelled':
        return <span className="badge bg-secondary">{t('Cancelled')}</span>;
      case 'complaint':
        return <span className="badge bg-danger">{t('Complaint')}</span>;
      default:
        return <span className="badge bg-dark">{t('Unknown')}</span>;
    }
  };

  if (!user || !user.id) {
    return (
      <Container className="container mt-5 text-center">
        <Helmet>
          <title>{t('My Bookings & Orders')}</title>
          <meta
            name="description"
            content="Review your salon bookings and product orders with MySalon."
          />
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
    );
  }

  if (bookingsLoading || ordersLoading) {
    return <p className="text-center mt-5">{t('Loading...')}</p>;
  }

  if (bookingsError || ordersError) {
    if (
      bookingsError?.response?.status === 500 ||
      ordersError?.response?.status === 500
    ) {
      return (
        <ServerError onRetry={bookingsError ? bookingsRetry : ordersRetry} />
      );
    }
    return (
      <p className="text-center text-danger mt-5">
        {t('Failed to load bookings or orders.')}
      </p>
    );
  }

  // Filter the bookings and orders based on search query
  const filteredBookingsAndOrders = searchFilteredData.filter((item) =>
    item.type === 'booking'
      ? item.salon_name.toLowerCase().includes(searchQuery.toLowerCase())
      : item.id.toString().includes(searchQuery)
  );

  return (
    <Container className="container mt-4">
      <Helmet>
        <title>{t('My Bookings & Orders')}</title>
        <meta
          name="description"
          content="Review your salon bookings and product orders with MySalon."
        />
      </Helmet>

      <Header className="text-center mb-4">
        📖 {t('My Bookings & Orders')} 📖
      </Header>

      {/* Search Bar */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholderKey="Search bookings and orders"
      />

      <div className="d-flex justify-content-between mb-3">
        <FilterButton
          showFilters={showFilters}
          toggleFilters={() => setShowFilters(!showFilters)}
        />
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
                    if (index === 0) setActiveTypeFilter(filter);
                    if (index === 1) setActiveDateFilter(filter);
                    if (index === 2) setActiveStatusFilter(filter);
                  }}
                >
                  {t(filter)}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {filteredBookingsAndOrders.length === 0 ? (
        <NoDataView message={t('No Bookings or Orders Found')} />
      ) : (
        <div className="row">
          {filteredBookingsAndOrders.map((item, idx) => (
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
                      ? `${t('Booking at')} ${capitalizeName(item.salon_name)}`
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

                  <div className="mb-2">
                    <CardText>
                      <strong>{t('Status')}:</strong>{' '}
                      {getStatusBadge(item.status?.toLowerCase())}
                    </CardText>
                  </div>

                  {item.type === 'booking' &&
                    ['active', 'pending'].includes(
                      item.status?.toLowerCase()
                    ) && (
                      <ButtonWithIcon
                        type="cancel"
                        onClick={handleRequestCancel}
                        width="100%"
                      >
                        {t('Cancel')}
                      </ButtonWithIcon>
                    )}

                  {item.type === 'order' &&
                    item.status?.toLowerCase() === 'pending' && (
                      <ButtonWithIcon
                        type="cancel"
                        onClick={handleRequestCancel}
                        width="100%"
                      >
                        {t('Cancel')}
                      </ButtonWithIcon>
                    )}
                </div>
              </CardStyled>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default MyBookings;
