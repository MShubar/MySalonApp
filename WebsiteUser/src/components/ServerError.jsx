import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

// === ANIMATION ===
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 10px rgba(255, 92, 92, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 92, 92, 1);
  }
  100% {
    box-shadow: 0 0 10px rgba(255, 92, 92, 0.6);
  }
`;

// === STYLED COMPONENTS ===
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e2f, #2b3a42);
  color: #fff;
  padding: 4rem;
  animation: ${fadeIn} 1s ease-out;

  @media (min-width: 768px) {
    padding: 6rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #ff5c5c;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0px 0px 15px rgba(255, 92, 92, 0.8);
`;

const ErrorMessage = styled.p`
  font-size: 1.3rem;
  color: #ddd;
  margin-bottom: 3rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.9;
`;

const RetryButton = styled.button`
  background-color: #ff5c5c;
  color: #fff;
  padding: 18px 40px;
  font-size: 1.1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin-bottom: 25px;
  transition: all 0.4s ease;
  box-shadow: 0 0 10px rgba(255, 92, 92, 0.4);

  &:hover {
    background-color: #ff3b3b;
    transform: translateY(-4px);
    animation: ${glow} 1.5s infinite;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 92, 92, 0.6);
  }
`;

const ContactButton = styled(Link)`
  background-color: #444;
  color: #fff;
  padding: 18px 40px;
  font-size: 1.1rem;
  border: none;
  border-radius: 50px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.4s ease;
  box-shadow: 0 0 10px rgba(68, 68, 68, 0.3);

  &:hover {
    background-color: #333;
    transform: translateY(-4px);
    animation: ${glow} 1.5s infinite;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(68, 68, 68, 0.6);
  }
`;

// === MAIN COMPONENT ===
const ServerError = ({ onRetry }) => (
  <ErrorContainer>
    <Helmet>
      <title>Server Error</title>
      <meta
        name="description"
        content="An unexpected error occurred on MySalon. Please try again."
      />
    </Helmet>
    <ErrorTitle>Oh no, something went wrong!</ErrorTitle>
    <ErrorMessage>
      Our servers encountered an issue. Please try again later, or contact
      support if the problem persists. We’re working hard to resolve it!
    </ErrorMessage>
    {onRetry && <RetryButton onClick={onRetry}>Retry</RetryButton>}
    <ContactButton to="/contact">Contact Support</ContactButton>
  </ErrorContainer>
);

export default ServerError;
