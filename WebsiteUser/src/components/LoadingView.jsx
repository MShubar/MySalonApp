// LoadingView.jsx
import React from 'react';
import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  100% {
    transform: translateX(100%);
  }
`;

const LoadingCard = styled.div`
  height: 250px;
  border-radius: 16px;
  background-color: #333;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    animation: ${shimmer} 1.5s infinite;
  }
`;

const LoadingView = ({ count }) => {
  return (
    <div className="row">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="col-md-4 mb-4">
          <LoadingCard />
        </div>
      ))}
    </div>
  );
};

export default LoadingView;
