import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import useNearestSalons from '../../functionality/salons/useNearestSalons';
import ServerError from '../ServerError';
import LoadingView from '../LoadingView';
import { SkeletonLoader } from '../SkeletonLoader';
import NoDataView from '../NoDataView';
import FilterButton from '../FilterButton';
import SearchBar from '../SearchBar';
import { useSearchFilter } from '../../functionality/UseSearchFilter';
import ButtonWithIcon from '../ButtonWithIcon';
import SalonServices from './components/SalonServices';
import Select from 'react-select';
import ErrorComponent from '../ErrorComponent';

// Styled components
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
  padding: 1rem;
  @media (min-width: 992px) {
    padding: 3rem;
  }
`;

const Header = styled.h2`
  color: #222;
  font-weight: 700;
`;

const FilterContainer = styled.div`
  background-color: #2a2a2a;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const ResponsiveGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 520px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (min-width: 568px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 1900px) {
    grid-template-columns: repeat(5, 1fr);
  }
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
  width: 100%;

  @media (min-width: 768px) {
    height: 180px;
  }

  @media (min-width: 992px) {
    height: 160px;
  }
`;

const Placeholder = styled.div`
  height: 200px;
  font-size: 72px;
  color: #ffffff;
  width: 100%;
`;

const CardTitle = styled.h5`
  color: #a3c1f7;
  font-weight: bold;
`;

const RatingDistance = styled.div`
  font-size: 0.95rem;
`;

const ToggleFavoritesButton = styled.button`
  width: 100%;
  background-color: ${(props) => (props.$active ? '#007bff' : 'transparent')};
  color: ${(props) => (props.$active ? '#fff' : '#007bff')};
  border: 1.5px solid #007bff;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: #007bff;
    color: #fff;
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
  }
`;

const ButtonsColumn = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  margin-top: auto;

  & > * {
    flex: 1;
  }
`;

const NearestSalon = ({ userType, userId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

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

  const visibleSalons = useMemo(() => {
    const baseList = showOnlyFavorites
      ? filteredData.filter((salon) => favorites.has(Number(salon.id)))
      : filteredData;

    return baseList.sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [filteredData, sortBy, showOnlyFavorites, favorites]);

  if (loading)
    return (
      <ResponsiveGrid>
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonLoader />
        ))}
      </ResponsiveGrid>
    );
  if (error) {
    if (error.response?.status === 500) return <ServerError onRetry={retry} />;
    return (
      <ErrorComponent
        message="Failed to load salons. Please try again later."
        onRetry={retry}
        loading={loading}
      />
    );
  }

  return (
    <Container>
      <Helmet>
        <title>{t('Nearest Salons')}</title>
        <meta
          name="description"
          content="Find salons closest to you and book an appointment."
        />
      </Helmet>

      <Header className="text-center mb-4">{t('Nearest Salons')}</Header>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholderKey="Search salons"
      />

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
            <i className="bi bi-sort-numeric-up"></i>
          ) : (
            <i className="bi bi-star-fill"></i>
          )}
          {t(sortBy === 'distance' ? 'Sort by Distance' : 'Sort by Rating')}
        </button>

        <Motion.div
          layout
          className="d-flex justify-content-between mb-3 align-items-center gap-2 flex-wrap"
        >
          <ToggleFavoritesButton
            $active={showOnlyFavorites}
            onClick={() => setShowOnlyFavorites((prev) => !prev)}
          >
            {showOnlyFavorites
              ? t('Show All Salons')
              : t('Show Favorites Only')}
          </ToggleFavoritesButton>
        </Motion.div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
          >
            <FilterContainer className="mb-4 p-3 border rounded">
              <div className="mb-3">
                <label
                  htmlFor="minRating"
                  className="form-label"
                  style={{ color: '#ccc' }}
                >
                  {t('Minimum Rating')}
                </label>
                <Select
                  value={{
                    label:
                      minRating === 0
                        ? t('No minimum')
                        : `${minRating} ${t('stars')}`,
                    value: minRating,
                  }}
                  onChange={(selected) => setMinRating(Number(selected.value))}
                  options={[0, 1, 2, 3, 4, 5].map((star) => ({
                    label:
                      star === 0 ? t('No minimum') : `${star} ${t('stars')}`,
                    value: star,
                  }))}
                  styles={customSelectStyles}
                />
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
          </Motion.div>
        )}
      </AnimatePresence>

      {visibleSalons.length === 0 ? (
        <NoDataView message={t('No Salons Found')} />
      ) : (
        <ResponsiveGrid>
          {visibleSalons.map((salon, idx) => {
            const isFavorited = favorites.has(Number(salon.id));
            return (
              <Motion.div
                key={salon.id}
                className="card h-100 shadow-sm"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: idx * 0.04,
                }}
              >
                <CardStyled>
                  {salon.image_url ? (
                    <CardImage src={salon.image_url} alt={salon.name} />
                  ) : (
                    <Placeholder className="d-flex justify-content-center align-items-center bg-secondary">
                      {salon.name.charAt(0)}
                    </Placeholder>
                  )}

                  <div className="card-body d-flex flex-column">
                    <CardTitle>{salon.name}</CardTitle>
                    <RatingDistance>
                      <strong>{t('Rating')}: </strong> ⭐ {salon.rating} &nbsp;
                      <strong>{t('Distance')}: </strong>{' '}
                      {salon.distance !== null
                        ? `${salon.distance.toFixed(2)} ${t('km')}`
                        : t('Unknown')}
                    </RatingDistance>

                    {salon.services && salon.services.length > 0 && (
                      <div className="mb-2">
                        <strong>{t('Services')}: </strong>
                        <SalonServices services={salon.services} t={t} />
                      </div>
                    )}

                    <ButtonsColumn>
                      <ButtonWithIcon
                        type="save"
                        onClick={() => toggleFavorite(salon.id)}
                      >
                        {isFavorited ? t('Saved') : t('Save')}
                      </ButtonWithIcon>

                      <ButtonWithIcon
                        type="view"
                        onClick={() => navigate(`/salon/${salon.id}`)}
                      >
                        {t('View')}
                      </ButtonWithIcon>

                      <ButtonWithIcon
                        type="book"
                        onClick={() => navigate(`/salon/${salon.id}/book`)}
                      >
                        {t('Book')}
                      </ButtonWithIcon>
                    </ButtonsColumn>
                  </div>
                </CardStyled>
              </Motion.div>
            );
          })}
        </ResponsiveGrid>
      )}
    </Container>
  );
};

NearestSalon.propTypes = {
  userType: PropTypes.string,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

NearestSalon.defaultProps = {
  userType: 'regular',
};

export default NearestSalon;
