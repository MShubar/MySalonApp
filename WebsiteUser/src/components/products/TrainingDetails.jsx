import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import useTrainingDetails from '../../functionality/products/UseTrainingDetails';
import { motion as Motion } from 'framer-motion';
import LoadingView from '../LoadingView';
import axios from 'axios';

// Styled components
const Container = styled.div`
  color: #000;
  padding: 3rem 2rem;
  background-color: #fff;
  border-radius: 16px;
  max-width: 900px;
  margin: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const Header = styled.h2`
  color: #2b2b2b;
  font-weight: 700;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Section = styled.div`
  margin: 2rem 0;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  color: #444;
`;

const Value = styled.div`
  font-size: 1.05rem;
  color: #111;
  margin-top: 0.5rem;
`;

const VideoWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1.5rem;
`;

const EnrollButton = styled.button`
  background: #4caf50;
  color: #fff;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  margin-top: 2rem;
  display: block;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.2rem;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #45a049;
  }
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

const SectionTitle = styled.h5`
  margin-top: 1.5rem;
  font-size: 1.4rem;
  color: #2b2b2b;
`;

const Lecture = styled.div`
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #555;
`;

const Duration = styled.span`
  font-weight: bold;
  margin-left: 10px;
`;

const TrainingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { training, loading, error, enrolled, handleEnroll, errorMessage } =
    useTrainingDetails(id);
  const [expandedSections, setExpandedSections] = useState({});

  if (loading) return <LoadingView />;
  if (error) return <p className="text-center text-danger">{error}</p>;

  // Toggle section visibility
  const toggleSection = (sectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Calculate total duration for each section
  const calculateSectionDuration = (section) => {
    return section.lectures.reduce(
      (total, lecture) => total + (lecture.duration || 0),
      0
    );
  };

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

        {/* Trailer Video */}
        {training.trailer_video_url && (
          <Section>
            <Label>Course Trailer:</Label>
            <VideoWrapper className="ratio ratio-16x9">
              <iframe
                src={training.trailer_video_url}
                title="Course Trailer"
                allowFullScreen
              ></iframe>
            </VideoWrapper>
          </Section>
        )}

        {/* Description */}
        <Section>
          <Label>Description:</Label>
          <Value>{training.description}</Value>
        </Section>

        {/* Course Details */}
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

        {/* Topics */}
        <Section>
          <Label>Topics Covered:</Label>
          <Value>{training.topics.join(', ')}</Value>
        </Section>

        {/* Language */}
        <Section>
          <Label>Language:</Label>
          <Value>{training.language}</Value>
        </Section>

        {/* Requirements */}
        <Section>
          <Label>Requirements:</Label>
          <Value>{training.requirements.join(', ')}</Value>
        </Section>

        {/* Course Includes */}
        <Section>
          <Label>Course Includes:</Label>
          <Value>{training.course_includes.join(', ')}</Value>
        </Section>

        {/* Rating */}
        <Section>
          <Label>Rating:</Label>
          <Value>{training.rating}</Value>
        </Section>

        {/* Number of Times Bought */}
        <Section>
          <Label>Number of Times Bought:</Label>
          <Value>{training.num_times_bought}</Value>
        </Section>

        {/* Trainer */}
        <Section>
          <Label>Trainer:</Label>
          <Value>{training.trainer_name}</Value>
        </Section>

        {/* Enroll Button */}
        {!enrolled && (
          <EnrollButton onClick={handleEnroll}>Enroll in Course</EnrollButton>
        )}

        {/* Show sections and lectures only if enrolled */}
        {enrolled && training.sections && (
          <Section>
            <SectionTitle>Sections:</SectionTitle>
            {Object.keys(training.sections).map((sectionKey) => {
              const section = training.sections[sectionKey];
              const totalDuration = calculateSectionDuration(section);
              return (
                <div key={sectionKey}>
                  <h5
                    onClick={() => toggleSection(sectionKey)}
                    style={{ cursor: 'pointer' }}
                  >
                    {section.title} - Total Duration: {totalDuration} mins
                  </h5>

                  {expandedSections[sectionKey] && (
                    <div>
                      {section.lectures.map((lecture, index) => (
                        <Lecture key={index}>
                          <strong>{lecture.title}</strong> -{' '}
                          <Duration>{lecture.duration} mins</Duration>
                          <a
                            href={lecture.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Watch Video
                          </a>
                        </Lecture>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </Section>
        )}

        {errorMessage && <p className="text-danger">{errorMessage}</p>}

        <BackButton onClick={() => navigate(-1)}>Back</BackButton>
      </Container>
    </Motion.div>
  );
};

export default TrainingDetails;
