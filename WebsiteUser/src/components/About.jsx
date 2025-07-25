import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  max-width: 700px;
  padding: 3rem 2rem;
  border-radius: 1rem;
  text-align: left;
`;

const Heading = styled.h2`
  color: #4f8ef7;
  margin-bottom: 1.5rem;
  font-weight: 700;
  text-align: center;
`;

const Description = styled.p`
  font-size: 1.05rem;
  color: #333;
  line-height: 1.8;
  margin-bottom: 1.25rem;
`;

const About = () => (
  <>
    <Helmet>
      <title>About MySalon</title>
      <meta
        name="description"
        content="Learn more about MySalon and our commitment to premium beauty services."
      />
    </Helmet>
    <Wrapper>
      <Card>
        <Heading>About MySalon</Heading>
        <Description>
          Welcome to MySalon — a modern, relaxing destination where beauty and
          care go hand-in-hand. We believe that self-care isn't a luxury — it's
          a necessity. That’s why we offer a wide range of high-end beauty
          services that cater to every individual’s needs.
        </Description>
        <Description>
          Whether you're preparing for a special event, looking to refresh your
          style, or simply want to treat yourself to some well-deserved
          pampering, our skilled team of professionals is here to help you look
          and feel your best. At MySalon, our commitment to excellence is
          reflected in every service we provide.
        </Description>
        <Description>
          From hair styling and coloring to facials, manicures, massages, and
          skincare consultations, we bring together the latest trends and
          techniques with a warm and welcoming environment. Our salon is
          equipped with premium tools and top-tier products to ensure every
          visit exceeds expectations.
        </Description>
        <Description>
          What truly sets us apart is our personalized approach — we take the
          time to understand your preferences, lifestyle, and vision, then
          tailor our services to match. At MySalon, beauty is not just
          skin-deep; it's an experience that starts with genuine care.
        </Description>
        <Description>
          Thank you for choosing MySalon. We’re excited to be part of your
          journey toward confidence, wellness, and style. Book your appointment
          today and let us bring out the best in you.
        </Description>
      </Card>
    </Wrapper>
  </>
);

export default About;
