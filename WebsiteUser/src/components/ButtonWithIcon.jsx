import React from 'react';
import styled from 'styled-components';
import { MdCancel, MdShoppingCart, MdVisibility, MdStar } from 'react-icons/md'; // Adding MdStar for the "Save" icon

// Styled button component with dynamic width
const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 12px;
  gap: 10px; /* Space between icon and text */
  text-transform: capitalize;
  border: none;
  cursor: pointer;
  white-space: nowrap; /* Prevents text from wrapping */

  /* Dynamic width based on prop */
  width: ${(props) =>
    props.width || 'auto'}; /* Default to 'auto' if no width is provided */

  /* Button color styles */
  &.cancel {
    background-color: #e53935;
    color: white;
    &:hover {
      background-color: #c62828;
    }
  }

  &.book {
    background-color: #43a047;
    color: white;
    &:hover {
      background-color: #388e3c;
    }
  }

  &.view {
    background-color: #1976d2;
    color: white;
    &:hover {
      background-color: #1565c0;
    }
  }

  &.quickview {
    background-color: #0288d1;
    color: white;
    &:hover {
      background-color: #0277bd;
    }
  }

  &.addtocart {
    background-color: #43a047;
    color: white;
    &:hover {
      background-color: #388e3c;
    }
  }

  &.remove {
    background-color: #e53935;
    color: white;
    &:hover {
      background-color: #c62828;
    }
  }

  &.checkout {
    background-color: #43a047;
    color: white;
    &:hover {
      background-color: #388e3c;
    }
  }

  &.save {
    background-color: transparent;
    border: 2px solid #ffeb3b; /* Yellow border */
    color: #ffeb3b; /* Yellow text color */
    &:hover {
      background-color: #ffeb3b;
      color: white;
    }
  }
`;

const IconWrapper = styled.div`
  font-size: 1.3rem;
`;

const ButtonWithIcon = ({ type, onClick, children, width }) => {
  const renderIcon = () => {
    switch (type) {
      case 'cancel':
        return <MdCancel />;
      case 'book':
        return <MdShoppingCart />;
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
      case 'save': // New case for Save
        return <MdStar />; // Yellow star icon for Save
      default:
        return null;
    }
  };

  return (
    <StyledButton className={type} onClick={onClick} width={width}>
      <IconWrapper>{renderIcon()}</IconWrapper>
      {children}
    </StyledButton>
  );
};

export default ButtonWithIcon;
