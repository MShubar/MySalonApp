import React, { useState } from 'react';
import styled from 'styled-components';
import {
  MdCancel,
  MdShoppingCart,
  MdVisibility,
  MdStar,
  MdLogin,
  MdPersonAdd,
} from 'react-icons/md'; // Importing MdLogin and MdPersonAdd

// Styled button component with dynamic width
const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 12px;
  gap: 10px; /* Space between icon and text */
  text-transform: capitalize;
  border: none;
  cursor: pointer;
  white-space: nowrap; /* Prevents text from wrapping */

  /* Dynamic width based on prop */
  width: ${(props) =>
    props.width || '100%'}; /* Full width for mobile-friendly design */

  /* Default button styles */
  transition: all 0.3s ease; /* Smooth transition for hover and focus effects */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Light shadow by default */

  /* Button color styles */
  &.cancel {
    background-color: #e53935;
    color: white;
    &:hover {
      background-color: #c62828;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Larger shadow on hover */
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(227, 30, 36, 0.6); /* Red shadow on focus */
    }
  }

  &.book {
    background-color: #43a047;
    color: white;
    &:hover {
      background-color: #388e3c;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(67, 160, 71, 0.6);
    }
  }

  &.view {
    background-color: #1976d2;
    color: white;
    &:hover {
      background-color: #1565c0;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(25, 118, 210, 0.6);
    }
  }

  &.quickview {
    background-color: #0288d1;
    color: white;
    &:hover {
      background-color: #0277bd;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(2, 136, 209, 0.6);
    }
  }

  &.addtocart {
    background-color: #43a047;
    color: white;
    &:hover {
      background-color: #388e3c;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(67, 160, 71, 0.6);
    }
  }

  &.remove {
    background-color: #e53935;
    color: white;
    &:hover {
      background-color: #c62828;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(227, 30, 36, 0.6);
    }
  }

  &.checkout {
    background-color: #43a047;
    color: white;
    &:hover {
      background-color: #388e3c;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(67, 160, 71, 0.6);
    }
  }

  &.save {
    background-color: transparent;
    border: 2px solid #ffeb3b;
    color: #ffeb3b;
    &:hover {
      background-color: #ffeb3b;
      color: white;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(255, 235, 59, 0.6);
    }
  }

  &.signin,
  &.signup {
    background-color: #42a5f5;
    color: white;
    &:hover {
      background-color: #1e88e5;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }
    &:focus {
      outline: none;
      box-shadow: 0 0 10px rgba(66, 165, 245, 0.6);
    }
  }

  /* Media queries for smaller screens */
  @media (max-width: 600px) {
    padding: 10px 16px;
    font-size: 0.9rem;
    width: 100%; /* Full width on mobile */
  }
`;

const IconWrapper = styled.div`
  font-size: 1.3rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
`;

const ButtonWithIcon = ({ type, onClick, children, width, adjustQty }) => {
  const renderIcon = () => {
    switch (type) {
      case 'cancel':
        return <MdCancel />;
      case 'book':
        return;
      case 'view':
        return <MdVisibility />;
      case 'quickview':
        return <MdVisibility />;
      case 'addtocart':
        return <MdShoppingCart />;
      case 'remove':
        return <MdCancel />;
      case 'checkout':
        return <MdShoppingCart />;
      case 'save':
        return <MdStar />;
      case 'signin':
        return <MdLogin />;
      case 'signup':
        return <MdPersonAdd />;
      default:
        return null;
    }
  };

  if (type === 'adjust') {
    return (
      <ButtonGroup>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            adjustQty(-1);
          }}
        >
          –
        </button>
        <span className="mx-2">{children}</span>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            adjustQty(1);
          }}
        >
          +
        </button>
      </ButtonGroup>
    );
  }

  return (
    <StyledButton className={type} onClick={onClick} width={width}>
      <IconWrapper>{renderIcon()}</IconWrapper>
      {children}
    </StyledButton>
  );
};

export default ButtonWithIcon;
