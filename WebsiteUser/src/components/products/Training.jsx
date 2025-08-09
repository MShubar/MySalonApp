import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import useTraining from '../../functionality/products/UseTraining';
import { SkeletonLoader } from '../SkeletonLoader';
import ButtonWithIcon from '../ButtonWithIcon';
import ErrorComponent from '../ErrorComponent';
import SearchBar from '../SearchBar';
import { useSearchFilter } from '../../functionality/UseSearchFilter';
import Select from 'react-select';

// Styled components
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

const CardDescription = styled.p`
  font-size: 0.95rem;
`;

const ToggleButton = styled.button`
  background: transparent;
  border: 1px solid #777;
  color: #000;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: #4f8ef7;
    color: #fff;
    border-color: #4f8ef7;
  }
`;

const Training = () => {
  const { t } = useTranslation();
  const { trainingPrograms = [], loading, error, retry } = useTraining();
  const { searchQuery, setSearchQuery, filteredData } = useSearchFilter(
    trainingPrograms,
    'title'
  );

  const [showMyCourses, setShowMyCourses] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/training/${id}`);
  };

  // Sorting logic
  const visibleCourses = useMemo(() => {
    const baseList = filteredData;

    return baseList.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [filteredData, sortBy]);

  if (loading) {
    return (
      <ResponsiveGrid>
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonLoader key={idx} />
        ))}
      </ResponsiveGrid>
    );
  }

  if (error) {
    return (
      <ErrorComponent
        message="Failed to load training programs. Please try again later."
        onRetry={retry}
      />
    );
  }

  return (
    <Container>
      <Helmet>
        <title>{t('Training')}</title>
        <meta
          name="description"
          content="Explore training sessions and tutorials provided by MySalon."
        />
      </Helmet>

      <Header className="text-center mb-4">{t('Training Programs')}</Header>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholderKey="Search training programs"
      />

      <div className="d-flex justify-content-between mb-3 align-items-center gap-2 flex-wrap">
        <ToggleButton onClick={() => setShowMyCourses(!showMyCourses)}>
          {showMyCourses
            ? t('Show All Training Courses')
            : t('Show My Courses')}
        </ToggleButton>

        <Select
          value={{ label: t(`Sort by ${sortBy}`), value: sortBy }}
          onChange={(selected) => setSortBy(selected.value)}
          options={[
            { label: t('Sort by Rating'), value: 'rating' },
            { label: t('Sort by Price'), value: 'price' },
          ]}
        />
      </div>

      {visibleCourses.length === 0 && !loading && !error && (
        <p>{t('No training programs available.')}</p>
      )}

      <ResponsiveGrid>
        {visibleCourses.map((program, idx) => (
          <Motion.div
            key={program.id}
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
              {program.image ? (
                <CardImage src={program.image} alt={program.name} />
              ) : (
                <Placeholder>{program.name?.charAt(0) || 'T'}</Placeholder>
              )}

              <div className="card-body d-flex flex-column">
                <CardTitle>{program.name}</CardTitle>
                <CardDescription>{program.description}</CardDescription>

                <div className="mt-auto d-flex gap-2">
                  <ButtonWithIcon
                    type="book"
                    onClick={() => handleViewDetails(program.id)}
                  >
                    {t('View Details')}
                  </ButtonWithIcon>
                </div>
              </div>
            </CardStyled>
          </Motion.div>
        ))}
      </ResponsiveGrid>
    </Container>
  );
};

Training.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Training;
