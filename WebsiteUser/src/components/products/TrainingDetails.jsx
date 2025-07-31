import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import useTrainingDetails from '../../functionality/products/UseTrainingDetails';
import { motion as Motion } from 'framer-motion';
import LoadingView from '../LoadingView';

const Container = styled.div`
  color: #000;
  padding: 2rem 1rem;
  background-color: #fff;
  border-radius: 16px;
  max-width: 800px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const Header = styled.h2`
  color: #2b2b2b;
  font-weight: 700;
  text-align: center;
`;

const Section = styled.div`
  margin: 1.5rem 0;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: #444;
`;

const Value = styled.div`
  font-size: 1.05rem;
  color: #111;
`;

const VideoWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
`;

const BackButton = styled.button`
  background: #444;
  color: #fff;
  padding: 0.6rem 1.4rem;
  border: none;
  border-radius: 8px;
  margin-top: 2rem;
  transition: 0.3s;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background-color: #000;
  }
`;

const TrainingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { training, loading, error } = useTrainingDetails(id);

  if (loading) return <LoadingView />;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Helmet>
        <title>{training?.title}</title>
        <meta name="description" content={training?.description} />
      </Helmet>

      <Container>
        <Header>{training.title}</Header>

        <Section>
          <Label>Description:</Label>
          <Value>{training.description}</Value>
        </Section>

        <Section>
          <Label>Duration:</Label>
          <Value>{training.duration} hours</Value>
        </Section>

        <Section>
          <Label>Price:</Label>
          <Value>{training.price} BHD</Value>
        </Section>

        <Section>
          <Label>Type:</Label>
          <Value>
            {training.is_live ? 'Live Bootcamp' : 'Recorded Course'}
          </Value>
        </Section>

        {training.video_url && (
          <Section>
            <Label>Preview:</Label>
            <VideoWrapper className="ratio ratio-16x9">
              <iframe
                src={training.video_url}
                title="Training Preview"
                allowFullScreen
              ></iframe>
            </VideoWrapper>
          </Section>
        )}

        <BackButton onClick={() => navigate(-1)}>Back</BackButton>
      </Container>
    </Motion.div>
  );
};

export default TrainingDetails;
