import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Banner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  color: #fff;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  z-index: 1050;
`;

const Button = styled.button`
  background-color: var(--primary);
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover {
    background-color: var(--primary-hover);
  }
`;

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <Banner role="dialog" aria-live="polite">
      <span>We use cookies to enhance your experience.</span>
      <Button onClick={handleAccept}>Got it</Button>
    </Banner>
  );
};

export default CookieConsent;
