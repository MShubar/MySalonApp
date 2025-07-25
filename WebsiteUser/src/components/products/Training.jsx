import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Navbar from '../layout/Navbar';

const Container = styled.div`
  padding: 1rem;

  @media (min-width: var(--breakpoint-md)) {
    padding: 2rem;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  @media (max-width: var(--breakpoint-sm)) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const Title = styled.h6`
  font-weight: 700;
  margin: 0;
  color: #f0f8ff;

  @media (max-width: var(--breakpoint-sm)) {
    font-size: 1rem;
  }
`;

const FilterButton = styled.button`
  background: transparent;
  border: 1px solid #777;
  color: #ccc;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: #4f8ef7;
    color: #fff;
    border-color: #4f8ef7;
  }

  @media (max-width: var(--breakpoint-sm)) {
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background-color: #242424;
  color: #f0f8ff;
  border: 1px solid #444;
  border-radius: 12px;
  overflow: hidden;
`;

const CardImage = styled.img`
  height: 180px;
  object-fit: cover;
  width: 100%;
  border-bottom: 1px solid #444;
`;

const Placeholder = styled.div`
  height: 180px;
  font-size: 64px;
  color: #ddd;
  border-bottom: 1px solid #444;
`;

const CardTitle = styled.h5`
  color: #a3c1f7;
  font-weight: 600;
`;

const CardDescription = styled.p`
  color: #bbb;
  font-size: 0.9rem;
`;

const Training = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  const trainingPrograms = [
    {
      id: 1,
      title: 'Hair Styling Basics',
      description: 'Learn fundamental hair styling techniques.',
    },
    {
      id: 2,
      title: 'Advanced Makeup',
      description: 'Master advanced makeup application skills.',
    },
    {
      id: 3,
      title: 'Nail Art Workshop',
      description: 'Create stunning nail art designs.',
    },
  ];

  return (
    <Container>
      <Helmet>
        <title>{t('training')}</title>
        <meta
          name="description"
          content="Explore training sessions and tutorials provided by MySalon."
        />
      </Helmet>
      <HeaderRow>
        <Title>{t('training')}</Title>
        <FilterButton
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <i className="bi bi-funnel-fill"></i>
        </FilterButton>
      </HeaderRow>

      {showFilters && (
        <div style={{ color: '#ccc' }}>
          {/* Add your filters here */}
          <p>Filters go here</p>
        </div>
      )}

      <Grid>
        {trainingPrograms.map((program) => (
          <Card key={program.id}>
            {program.image ? (
              <CardImage src={program.image} alt={program.title} />
            ) : (
              <Placeholder className="d-flex justify-content-center align-items-center bg-secondary">
                {program.title.charAt(0)}
              </Placeholder>
            )}
            <div className="p-3">
              <CardTitle className="mb-2">{program.title}</CardTitle>
              <CardDescription className="mb-0">
                {program.description}
              </CardDescription>
            </div>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default Training;
