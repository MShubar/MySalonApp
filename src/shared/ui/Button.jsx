import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  padding: ${({ size }) =>
    size === 'large'
      ? '0.75rem 1.5rem'
      : size === 'small'
      ? '0.4rem 1rem'
      : '0.6rem 1.2rem'};
  font-size: 1rem;
  background-color: ${({ type }) =>
    type === 'primary' ? '#4f8ef7' : type === 'danger' ? '#f44336' : '#ccc'};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    background-color: #888;
    cursor: not-allowed;
  }
`;

export default function Button({
  type = 'primary',
  size = 'middle',
  children,
  ...props
}) {
  return (
    <StyledButton type={type} size={size} {...props}>
      {children}
    </StyledButton>
  );
}
