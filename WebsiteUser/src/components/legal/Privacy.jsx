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
    padding: 1rem;
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

const Paragraph = styled.p`
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

const Section = styled.div`
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }

  @media (max-width: 600px) {
    margin-bottom: 1rem;
  }
`;

const Privacy = () => {
  const { t } = useTranslation(); // Initialize the translation hook

  return (
    <>
      <Helmet>
        <title>{t('Privacy Policy - MySalon')}</title>
      </Helmet>
      <Wrapper>
        <Card>
          <Heading>{t('Privacy Policy')}</Heading>

          <Section>
            <Paragraph>
              {t(
                'At MySalon, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.'
              )}
            </Paragraph>
            <Paragraph>
              {t(
                'We collect information when you register, book services, or contact us. This may include your name, email, phone number, location, and service preferences.'
              )}
            </Paragraph>
          </Section>

          <Section>
            <Paragraph>
              {t(
                'Your data is used to provide services, personalize your experience, and improve our platform. We never sell your data to third parties.'
              )}
            </Paragraph>
            <Paragraph>
              {t(
                'We use encryption and secure protocols to protect your information. However, no method is 100% secure, so we encourage you to protect your login credentials.'
              )}
            </Paragraph>
          </Section>

          <Section>
            <Paragraph>
              {t(
                'If you have any questions or wish to delete your account and data, please contact us via the Contact Us page.'
              )}
            </Paragraph>
          </Section>
        </Card>
      </Wrapper>
    </>
  );
};

export default Privacy;
