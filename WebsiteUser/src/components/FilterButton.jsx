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
  background-color: ${({ $active }) => ($active ? '#0d6efd' : '#1a1a1a')};
  color: ${({ $active }) => ($active ? '#fff' : '#80b3ff')};
  border: 2px solid ${({ $active }) => ($active ? '#0d6efd' : '#80b3ff')};
  border-radius: 30px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: ${({ $active }) =>
    $active ? '0 0 15px rgba(13, 110, 253, 0.6)' : 'none'};
  transform: ${({ $active }) => ($active ? 'scale(0.97)' : 'scale(1)')};

  &:active {
    transform: scale(0.95);
    box-shadow: 0 0 12px rgba(128, 179, 255, 0.6);
  }

  i {
    font-size: 1.25rem;
  }
`;

const FilterButton = ({ showFilters, toggleFilters }) => {
  const { t } = useTranslation();

  return (
    <FilterButtonStyled
      onClick={toggleFilters}
      aria-expanded={showFilters}
      $active={showFilters}
    >
      <i className="bi bi-funnel-fill"></i> {t('Filters')}
    </FilterButtonStyled>
  );
};

FilterButton.propTypes = {
  showFilters: PropTypes.bool.isRequired,
  toggleFilters: PropTypes.func.isRequired,
};

export default FilterButton;
