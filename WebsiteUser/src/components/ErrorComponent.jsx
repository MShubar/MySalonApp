import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import styled, { keyframes } from 'styled-components';

// === ANIMATION ===
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
`;

// === STYLED COMPONENTS ===
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  color: #fff;
  padding: 4rem;
  animation: ${fadeIn} 1s ease-out;

  @media (min-width: 768px) {
    padding: 6rem;
  }
`;

const ErrorIcon = styled.div`
  font-size: 5rem;
  color: #ff5c5c;
  margin-bottom: 2rem;
  animation: ${bounce} 1s ease-in-out infinite;
`;

const ErrorMessage = styled.p`
  font-size: 1.5rem;
  color: black;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.8;
`;

const RetryButton = styled.button`
  background-color: #ff5c5c;
  color: #fff;
  padding: 15px 40px;
  font-size: 1.2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(255, 92, 92, 0.4);
  margin-top: 20px;

  &:hover {
    background-color: #ff3b3b;
    transform: translateY(-4px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 92, 92, 0.6);
  }
`;

const ContactButton = styled.a`
  background-color: #444;
  color: #fff;
  padding: 15px 40px;
  font-size: 1.2rem;
  border: none;
  border-radius: 50px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(68, 68, 68, 0.3);

  &:hover {
    background-color: #333;
    transform: translateY(-4px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(68, 68, 68, 0.6);
  }
`;

// === MAIN COMPONENT ===
const ErrorComponent = ({ onRetry, contactLink = '/contact' }) => {
  const { t } = useTranslation();

  return (
    <ErrorContainer>
      <Helmet>
        <title>{t('error.title')}</title>
        <meta name="description" content={t('error.message')} />
      </Helmet>
      <ErrorIcon>
        <i className={`bi ${t('error.icon')}`} />
      </ErrorIcon>
      <ErrorMessage>{t('error.message')}</ErrorMessage>
      {onRetry && (
        <RetryButton onClick={onRetry}>{t('error.retryText')}</RetryButton>
      )}
      <br />
      <ContactButton href={contactLink}>{t('error.contactText')}</ContactButton>
    </ErrorContainer>
  );
};

export default ErrorComponent;
