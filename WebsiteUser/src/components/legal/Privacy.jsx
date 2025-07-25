import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 4rem auto 2rem;
  color: #000;
`;

const Heading = styled.h2`
  color: #4f8ef7;
  text-align: center;
  margin-bottom: 2rem;
`;

const Paragraph = styled.p`
  line-height: 1.6;
  margin-bottom: 1.2rem;
  color: #000;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - MySalon</title>
      </Helmet>
      <Container>
        <Heading>Privacy Policy</Heading>

        <Section>
          <Paragraph>
            At MySalon, we take your privacy seriously. This policy explains how
            we collect, use, and protect your personal information.
          </Paragraph>
          <Paragraph>
            We collect information when you register, book services, or contact
            us. This may include your name, email, phone number, location, and
            service preferences.
          </Paragraph>
        </Section>

        <Section>
          <Paragraph>
            Your data is used to provide services, personalize your experience,
            and improve our platform. We never sell your data to third parties.
          </Paragraph>
          <Paragraph>
            We use encryption and secure protocols to protect your information.
            However, no method is 100% secure, so we encourage you to protect
            your login credentials.
          </Paragraph>
        </Section>

        <Section>
          <Paragraph>
            If you have any questions or wish to delete your account and data,
            please contact us via the Contact Us page.
          </Paragraph>
        </Section>
      </Container>
    </>
  );
};

export default Privacy;
