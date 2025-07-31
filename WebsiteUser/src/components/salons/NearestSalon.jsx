import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import useNearestSalons from '../../functionality/salons/useNearestSalons';
import ServerError from '../ServerError';
import LoadingView from '../LoadingView';
import NoDataView from '../NoDataView';
import FilterButton from '../FilterButton';
import SearchBar from '../SearchBar';
import { useSearchFilter } from '../../functionality/UseSearchFilter';
import ButtonWithIcon from '../ButtonWithIcon';

const Container = styled.div`
  color: #ddd;
`;

const Header = styled.h2`
  color: #222;
  font-weight: 700;
`;

const FilterContainer = styled.div`
  background-color: #2a2a2a;
`;

const CardStyled = styled.div`
  background-color: #242424;
  color: #f0f8ff;
  border: 1px solid #444;
  border-radius: 16px;
  overflow: hidden;
`;

const CardImage = styled.img`
  height: 200px;
  object-fit: cover;
`;

const Placeholder = styled.div`
  height: 200px;
  font-size: 72px;
  color: #ddd;
`;

const CardTitle = styled.h5`
  color: #a3c1f7;
  font-weight: bold;
`;

const RatingDistance = styled.div`
  font-size: 0.95rem;
`;

const ServiceBadge = styled.span`
  border-radius: 20px;
  background-color: #254d8f;
  color: #f0f8ff;
  font-size: 0.8rem;
`;

const shimmer = keyframes`
  100% {
    transform: translateX(100%);
  }
`;

const LoadingCard = styled.div`
  height: 250px;
  border-radius: 16px;
  background-color: #333;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

const NearestSalon = ({ userType, userId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const {
    loading,
    error,
    salons,
    favorites,
    minRating,
    setMinRating,
    maxDistance,
    setMaxDistance,
    sortBy,
    setSortBy,
    toggleFavorite,
    retry,
  } = useNearestSalons(userType, userId);

  const { searchQuery, setSearchQuery, filteredData } = useSearchFilter(
    salons,
    'name'
  );

  const sortedSalons = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distance - b.distance;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });
  }, [filteredData, sortBy]);

  if (loading) {
    return <LoadingView count={6} />;
  }

  if (error) {
    if (error.response?.status === 500) {
      return <ServerError onRetry={retry} />;
    }
    return (
      <div className="text-center mt-5 text-danger">
        {t('Failed to load salons')}
      </div>
    );
  }

  return (
    <Container className="container mt-4">
      <Helmet>
        <title>{t('Nearest Salons')}</title>
        <meta
          name="description"
          content="Find salons closest to you and book an appointment."
        />
      </Helmet>

      <Header className="text-center mb-4"> {t('Nearest Salons')} </Header>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholderKey="Search salons"
      />

      {/* Filter and Sort Buttons */}
      <div className="d-flex justify-content-between mb-3 align-items-center gap-2 flex-wrap">
        <FilterButton
          showFilters={showFilters}
          toggleFilters={() => setShowFilters(!showFilters)}
        />

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() =>
            setSortBy((prev) => (prev === 'distance' ? 'rating' : 'distance'))
          }
        >
          {sortBy === 'distance' ? (
            <>
              <i className="bi bi-sort-numeric-up"></i> {t('Sort by Distance')}
            </>
          ) : (
            <>
              <i className="bi bi-star-fill"></i> {t('Sort by Rating')}
            </>
          )}
        </button>
      </div>

      {showFilters && (
        <FilterContainer className="mb-4 p-3 border rounded">
          <div className="mb-3">
            <label
              htmlFor="minRating"
              className="form-label"
              style={{ color: '#ccc' }}
            >
              {t('Minimum Rating')}
            </label>
            <select
              id="minRating"
              className="form-select"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              {[0, 1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star === 0 ? t('No minimum') : `${star} ${t('stars')}`}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label
              htmlFor="maxDistance"
              className="form-label"
              style={{ color: '#ccc' }}
            >
              {t('Maximum Distance (km)')}
            </label>
            <input
              id="maxDistance"
              type="number"
              className="form-control"
              min={0}
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
            />
          </div>
        </FilterContainer>
      )}

      {/* Salon Cards */}
      {sortedSalons.length === 0 ? (
        <NoDataView message={t('No Salons Found')} />
      ) : (
        <div className="row">
          {sortedSalons.map((salon) => {
            const isFavorited = favorites.has(salon.id);
            return (
              <Motion.div
                key={salon.id}
                className="col-md-4 mb-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <CardStyled className="card h-100 shadow-sm">
                  {salon.image_url ? (
                    <CardImage
                      src={salon.image_url}
                      alt={`${salon.name} logo`}
                      className="card-img-top"
                    />
                  ) : (
                    <Placeholder className="d-flex justify-content-center align-items-center bg-secondary">
                      {salon.name.charAt(0)}
                    </Placeholder>
                  )}

                  <div className="card-body d-flex flex-column">
                    <CardTitle className="card-title mb-2">
                      {salon.name}
                    </CardTitle>

                    <RatingDistance className="mb-2">
                      <strong style={{ color: '#f0e68c' }}>
                        {t('Rating')}:
                      </strong>{' '}
                      ⭐ {salon.rating} &nbsp;
                      <strong style={{ color: '#f0e68c' }}>
                        {t('Distance')}:
                      </strong>{' '}
                      {salon.distance !== null
                        ? `${salon.distance.toFixed(2)} ${t('km')}`
                        : t('Unknown')}
                    </RatingDistance>

                    {salon.services && salon.services.length > 0 && (
                      <div className="mb-2">
                        <strong style={{ color: '#f0e68c' }}>
                          {t('Services')}:
                        </strong>
                        <div className="mt-1 d-flex flex-wrap gap-2">
                          {salon.services.map((service, i) => (
                            <ServiceBadge key={i} className="badge px-2 py-1">
                              {t(service.name)}
                            </ServiceBadge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto d-flex gap-2">
                      <ButtonWithIcon
                        type="save"
                        onClick={() => toggleFavorite(salon.id)}
                        width="100%"
                      >
                        {t('Save')}
                      </ButtonWithIcon>
                      <ButtonWithIcon
                        type="view"
                        onClick={() => navigate(`/salon/${salon.id}`)}
                        width="100%"
                      >
                        {t('View')}
                      </ButtonWithIcon>

                      <ButtonWithIcon
                        type="book"
                        onClick={() => navigate(`/salon/${salon.id}/book`)}
                        width="100%"
                      >
                        {t('Book')}
                      </ButtonWithIcon>
                    </div>
                  </div>
                </CardStyled>
              </Motion.div>
            );
          })}
        </div>
      )}
    </Container>
  );
};

NearestSalon.propTypes = {
  userType: PropTypes.string,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

NearestSalon.defaultProps = {
  userType: 'regular', // Default value for userType
};

export default NearestSalon;
