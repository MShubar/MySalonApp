import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { motion as Motion } from 'framer-motion';
import styled from 'styled-components';
import useTraining from '../../functionality/products/UseTraining';
import { useNavigate } from 'react-router-dom';
import NoDataView from '../NoDataView';

const Container = styled.div`
  color: #ddd;
`;

const Header = styled.h2`
  color: #222;
  font-weight: 700;
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
  background-color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
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
  const { trainingPrograms = [], enrolledPrograms = [] } = useTraining();
  const [showMyCourses, setShowMyCourses] = useState(false);
  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/training/${id}`);
  };

  const programsToDisplay = showMyCourses ? enrolledPrograms : trainingPrograms;

  return (
    <Container className="container mt-4">
      <Helmet>
        <title>{t('Training')}</title>
        <meta
          name="description"
          content="Explore training sessions and tutorials provided by MySalon."
        />
      </Helmet>

      <Header className="text-center mb-4">{t('Training Programs')}</Header>

      <div className="d-flex justify-content-between mb-3 align-items-center gap-2 flex-wrap">
        <ToggleButton onClick={() => setShowMyCourses(!showMyCourses)}>
          {showMyCourses
            ? t('Show All Training Courses')
            : t('Show My Courses')}
        </ToggleButton>
      </div>

      {programsToDisplay.length === 0 ? (
        <NoDataView
          message={
            showMyCourses
              ? t('No enrolled courses found.')
              : t('No training courses available.')
          }
        />
      ) : (
        <div className="row">
          {programsToDisplay.map((program) => (
            <Motion.div
              key={program.id}
              className="col-md-4 mb-4"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <CardStyled className="card h-100 shadow-sm">
                {program.image ? (
                  <CardImage src={program.image} alt={program.name} />
                ) : (
                  <Placeholder>{program.name?.charAt(0) || 'T'}</Placeholder>
                )}

                <div className="card-body d-flex flex-column">
                  <CardTitle className="card-title mb-2">
                    {program.name}
                  </CardTitle>
                  <CardDescription className="mb-3">
                    {program.description}
                  </CardDescription>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleViewDetails(program.id)}
                    >
                      {t('View Details')}
                    </button>
                  </div>
                </div>
              </CardStyled>
            </Motion.div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Training;
