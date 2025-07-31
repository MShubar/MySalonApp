import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Styled component for the Filter Button
const FilterButtonStyled = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 1rem;
  background-color: #1a1a1a; /* Dark background for better contrast */
  color: #f0e68c; /* Light color text for contrast */
  border: 2px solid #f0e68c;
  border-radius: 30px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #444; /* Darker background on hover */
    color: #fff; /* White text on hover */
    border-color: #fff; /* White border on hover */
  }

  &:focus {
    outline: none;
    border-color: #fff; /* White border on focus */
    box-shadow: 0 0 10px rgba(240, 230, 140, 0.6);
  }

  i {
    font-size: 1.25rem;
  }
`;

const FilterButton = ({ showFilters, toggleFilters }) => {
  const { t } = useTranslation();

  return (
    <FilterButtonStyled onClick={toggleFilters} aria-expanded={showFilters}>
      <i className="bi bi-funnel-fill"></i> {t('Filters')}
    </FilterButtonStyled>
  );
};

FilterButton.propTypes = {
  showFilters: PropTypes.bool.isRequired,
  toggleFilters: PropTypes.func.isRequired,
};

export default FilterButton;
