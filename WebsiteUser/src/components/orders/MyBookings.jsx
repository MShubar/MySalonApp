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
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { SkeletonLoader } from '../SkeletonLoader';
import ErrorComponent from '../ErrorComponent';

// === STYLED COMPONENTS ===

const customSelectStyles = {
  container: (base) => ({
    ...base,
    width: '100%',
  }),
  control: (base) => ({
    ...base,
    backgroundColor: '#1f1f1f',
    borderColor: '#555',
    color: '#fff',
    minHeight: '38px',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#2a2a2a',
    zIndex: 100,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#333' : '#2a2a2a',
    color: '#fff',
    cursor: 'pointer',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#aaa',
  }),
  input: (base) => ({
    ...base,
    color: '#fff',
  }),
};

const Container = styled.div`
  color: #ddd;
  padding-left: 1rem;
  padding-right: 1rem;

  @media (min-width: 992px) {
    padding-left: 3rem;
    padding-right: 3rem;
  }
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
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (min-width: 1200px) {
    padding: 0.75rem;
  }
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

const FilterContainer = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 16px;

  grid-template-columns: 1fr;

  @media (min-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  label {
    color: #ccc;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    display: block;
  }
`;

const ResponsiveGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 576px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// === MAIN COMPONENT ===

const MyBookings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));

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
    bookingsRetry,
    ordersRetry,
  } = useMyBookings(t, user);

  const { searchQuery, setSearchQuery } = useSearchFilter(
    bookingsAndOrders,
    'salon_name'
  );

  const toSelectOptions = (arr) =>
    arr.map((item) => ({ label: t(item), value: item }));

  const handleSelectChange = (setter) => (selected) => setter(selected.value);

  const filteredBookingsAndOrders = bookingsAndOrders.filter((item) =>
    item.type === 'booking'
      ? item.salon_name.toLowerCase().includes(searchQuery.toLowerCase())
      : item.id.toString().includes(searchQuery)
  );

  if (!user?.id) {
    return (
      <Container className="container mt-5 text-center">
        <Helmet>
          <title>{t('My Bookings & Orders')}</title>
        </Helmet>
        <Header>{t('Access Restricted')}</Header>
        <p className="text-danger mt-5">
          {t('Please sign in or create an account.')}
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

  if (bookingsLoading || ordersLoading)
    return (
      <ResponsiveGrid>
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonLoader />
        ))}
      </ResponsiveGrid>
    );

  if (bookingsError || ordersError) {
    const isServerError =
      bookingsError?.response?.status === 500 ||
      ordersError?.response?.status === 500;
    return isServerError ? (
      <ServerError onRetry={bookingsError ? bookingsRetry : ordersRetry} />
    ) : (
      <ErrorComponent
        message="Failed to load salons. Please try again later."
        onRetry={bookingsError ? bookingsRetry : ordersRetry}
        loading={bookingsLoading || ordersLoading}
      />
    );
  }

  return (
    <Container className="container mt-4">
      <Helmet>
        <title>{t('My Bookings & Orders')}</title>
      </Helmet>

      <Header className="text-center mb-4">{t('My Bookings & Orders')}</Header>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholderKey={t('Search bookings and orders')}
      />

      <div className="d-flex justify-content-between mb-3">
        <FilterButton
          showFilters={showFilters}
          toggleFilters={() => setShowFilters(!showFilters)}
        />
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
          >
            <FilterContainer>
              <div>
                <label>{t('Type')}</label>
                <Select
                  value={{
                    label: t(activeTypeFilter),
                    value: activeTypeFilter,
                  }}
                  onChange={handleSelectChange(setActiveTypeFilter)}
                  options={toSelectOptions(['All', 'Bookings', 'Orders'])}
                  styles={customSelectStyles}
                />
              </div>

              <div>
                <label>{t('Status')}</label>
                <Select
                  value={{
                    label: t(activeStatusFilter),
                    value: activeStatusFilter,
                  }}
                  onChange={handleSelectChange(setActiveStatusFilter)}
                  options={toSelectOptions([
                    'All',
                    'Pending',
                    'Active',
                    'Completed',
                    'Delivered',
                    'Cancelled',
                    'Complaint',
                  ])}
                  styles={customSelectStyles}
                />
              </div>
            </FilterContainer>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredBookingsAndOrders.length === 0 ? (
        <NoDataView message={t('No Bookings or Orders Found')} />
      ) : (
        <ResponsiveGrid>
          {filteredBookingsAndOrders.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              onClick={() =>
                navigate(
                  item.type === 'booking'
                    ? `/bookings/${item.id}`
                    : `/orders/${item.id}`
                )
              }
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                delay: idx * 0.04,
              }}
              className="card h-100 shadow-sm"
            >
              <CardStyled>
                <CardTitle>
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
                            <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
                              {itm.quantity} x {Number(itm.price).toFixed(2)}{' '}
                              {t('BHD')}
                            </div>
                          </div>
                        </ItemRow>
                      ))}
                    </ItemList>
                  </div>
                )}

                <Total className="mb-2">
                  {t('Total')}: {Number(item.total).toFixed(2)} {t('BHD')}
                </Total>

                <div className="mb-2">
                  <CardText>
                    <strong>{t('Status')}:</strong>{' '}
                    {getStatusBadge(item.status?.toLowerCase())}
                  </CardText>
                </div>
                <div style={{ flexGrow: 1 }} />

                {['booking', 'order'].includes(item.type) &&
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
              </CardStyled>
            </motion.div>
          ))}
        </ResponsiveGrid>
      )}
    </Container>
  );
};

export default MyBookings;
