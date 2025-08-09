import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Accordion from 'react-bootstrap/Accordion';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: transparent;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1500px;
  padding: 2rem;
  background-color: #1f1f1f;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.2);
  color: #f0f8ff;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 600px) {
    max-width: 100%;
    padding: 1rem;
  }
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #4f8ef7;
  font-weight: 700;

  @media (max-width: 600px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const StyledAccordion = styled(Accordion)`
  background-color: transparent;

  .accordion-item {
    background-color: #2b2b2b;
    border: none;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .accordion-header {
    background-color: #2b2b2b;
    color: #fff;
    font-weight: 600;
  }

  .accordion-button {
    background-color: #2b2b2b;
    color: #fff;
    font-weight: 600;

    &:focus {
      box-shadow: none;
    }

    &:not(.collapsed) {
      background-color: #3a3a3a;
      color: #4f8ef7;
    }
  }

  .accordion-body {
    background-color: #2b2b2b;
    color: #ddd;
    line-height: 1.5;
  }
`;

const Faq = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('FAQ - MySalon')}</title>
      </Helmet>
      <Wrapper>
        <Container>
          <Heading>{t('Frequently Asked Questions')}</Heading>
          <StyledAccordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                {t('How do I book an appointment?')}
              </Accordion.Header>
              <Accordion.Body>
                {t(
                  "To book an appointment, simply navigate to the salon's page, browse the available services, and select your preferred date and time. You’ll receive a confirmation once the booking is completed."
                )}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="1">
              <Accordion.Header>
                {t('Can I cancel or reschedule?')}
              </Accordion.Header>
              <Accordion.Body>
                {t(
                  'Yes, you can cancel or reschedule any upcoming appointment directly from your bookings dashboard. Please note that cancellation policies vary by salon.'
                )}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="2">
              <Accordion.Header>
                {t('Do you offer home service?')}
              </Accordion.Header>
              <Accordion.Body>
                {t(
                  "Some of our partner salons do offer home service. You can filter for this option while browsing or check the salon's profile for home service availability."
                )}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="3">
              <Accordion.Header>
                {t('Is there a membership or loyalty program?')}
              </Accordion.Header>
              <Accordion.Body>
                {t(
                  'Yes! Our loyalty program lets you earn points on every booking, which you can redeem for discounts or special offers.'
                )}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="4">
              <Accordion.Header>
                {t('What payment methods are accepted?')}
              </Accordion.Header>
              <Accordion.Body>
                {t(
                  'Most salons accept online payments, credit/debit cards, and sometimes cash at the salon. You’ll see payment options at checkout.'
                )}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="5">
              <Accordion.Header>
                {t('Can I leave a review after my appointment?')}
              </Accordion.Header>
              <Accordion.Body>
                {t(
                  'Absolutely. After your visit, you’ll be prompted to leave a review to help others and improve service quality.'
                )}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="6">
              <Accordion.Header>
                {t('Are the salons verified?')}
              </Accordion.Header>
              <Accordion.Body>
                {t(
                  'Yes, every salon listed on our platform goes through a verification process to ensure professionalism, hygiene, and service quality.'
                )}
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item eventKey="7">
              <Accordion.Header>
                {t('What if I face an issue with my booking?')}
              </Accordion.Header>
              <Accordion.Body>
                {t(
                  'Contact our support team anytime through the contact page — we’re here 7 days a week to help you.'
                )}
              </Accordion.Body>
            </Accordion.Item>
          </StyledAccordion>
        </Container>
      </Wrapper>
    </>
  );
};

export default Faq;
