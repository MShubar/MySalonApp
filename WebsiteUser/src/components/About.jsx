import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: transparent;
  @media (max-width: 600px) {
    padding: 0.5rem;
    margin-top: 50px;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 1500px;
  background-color: #1f1f1f;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.2);
  text-align: left;
  color: #fff;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 600px) {
    padding: 1rem;
    max-width: 100%;
  }
`;

const Heading = styled.h2`
  color: #4f8ef7;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-align: center;

  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 1.25rem;
  }
`;

const Description = styled.p`
  font-size: 1.05rem;
  color: #fff;
  line-height: 1.8;
  margin-bottom: 1.25rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 600px) {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }
`;

const About = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('About MySalon')}</title>
        <meta
          name="description"
          content={t(
            'Learn more about MySalon and our commitment to premium beauty services.'
          )}
        />
      </Helmet>
      <Wrapper>
        <Card>
          <Heading>{t('About MySalon')}</Heading>
          <Description>
            {t(
              "Welcome to MySalon — a modern, relaxing destination where beauty and care go hand-in-hand. We believe that self-care isn't a luxury — it's a necessity. That’s why we offer a wide range of high-end beauty services that cater to every individual’s needs."
            )}
          </Description>
          <Description>
            {t(
              "Whether you're preparing for a special event, looking to refresh your style, or simply want to treat yourself to some well-deserved pampering, our skilled team of professionals is here to help you look and feel your best. At MySalon, our commitment to excellence is reflected in every service we provide."
            )}
          </Description>
          <Description>
            {t(
              'From hair styling and coloring to facials, manicures, massages, and skincare consultations, we bring together the latest trends and techniques with a warm and welcoming environment. Our salon is equipped with premium tools and top-tier products to ensure every visit exceeds expectations.'
            )}
          </Description>
          <Description>
            {t(
              "What truly sets us apart is our personalized approach — we take the time to understand your preferences, lifestyle, and vision, then tailor our services to match. At MySalon, beauty is not just skin-deep; it's an experience that starts with genuine care."
            )}
          </Description>
          <Description>
            {t(
              'Thank you for choosing MySalon. We’re excited to be part of your journey toward confidence, wellness, and style. Book your appointment today and let us bring out the best in you.'
            )}
          </Description>
        </Card>
      </Wrapper>
    </>
  );
};

export default About;
