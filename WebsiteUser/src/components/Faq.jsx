import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Accordion from 'react-bootstrap/Accordion';

const Wrapper = styled.div`
  padding: 6rem 1rem 3rem;
  display: flex;
  justify-content: center;
  background: transparent;
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background-color: #1f1f1f;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(79, 142, 247, 0.2);
  color: #f0f8ff;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #4f8ef7;
  font-weight: 700;
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

const Faq = () => (
  <>
    <Helmet>
      <title>FAQ - MySalon</title>
      <meta
        name="description"
        content="Frequently asked questions about MySalon."
      />
    </Helmet>
    <Wrapper>
      <Container>
        <Heading>Frequently Asked Questions</Heading>
        <StyledAccordion flush defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>How do I book an appointment?</Accordion.Header>
            <Accordion.Body>
              To book an appointment, simply navigate to the salon's page,
              browse the available services, and select your preferred date and
              time. You’ll receive a confirmation once the booking is completed.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Can I cancel or reschedule?</Accordion.Header>
            <Accordion.Body>
              Yes, you can cancel or reschedule any upcoming appointment
              directly from your bookings dashboard. Please note that
              cancellation policies vary by salon.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="2">
            <Accordion.Header>Do you offer home service?</Accordion.Header>
            <Accordion.Body>
              Some of our partner salons do offer home service. You can filter
              for this option while browsing or check the salon's profile for
              home service availability.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="3">
            <Accordion.Header>
              Is there a membership or loyalty program?
            </Accordion.Header>
            <Accordion.Body>
              Yes! Our loyalty program lets you earn points on every booking,
              which you can redeem for discounts or special offers.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="4">
            <Accordion.Header>
              What payment methods are accepted?
            </Accordion.Header>
            <Accordion.Body>
              Most salons accept online payments, credit/debit cards, and
              sometimes cash at the salon. You’ll see payment options at
              checkout.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="5">
            <Accordion.Header>
              Can I leave a review after my appointment?
            </Accordion.Header>
            <Accordion.Body>
              Absolutely. After your visit, you’ll be prompted to leave a review
              to help others and improve service quality.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="6">
            <Accordion.Header>Are the salons verified?</Accordion.Header>
            <Accordion.Body>
              Yes, every salon listed on our platform goes through a
              verification process to ensure professionalism, hygiene, and
              service quality.
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="7">
            <Accordion.Header>
              What if I face an issue with my booking?
            </Accordion.Header>
            <Accordion.Body>
              Contact our support team anytime through the contact page — we’re
              here 7 days a week to help you.
            </Accordion.Body>
          </Accordion.Item>
        </StyledAccordion>
      </Container>
    </Wrapper>
  </>
);

export default Faq;
