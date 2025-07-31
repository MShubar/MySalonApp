import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// Styled component for the input
const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  font-size: 1rem;
  border: 2px solid #444;
  border-radius: 30px;
  background-color: #222;
  color: #fff;
  transition: all 0.3s ease;

  &::placeholder {
    color: #888;
  }

  &:focus {
    outline: none;
    border-color: #f0e68c;
  }

  &:hover {
    border-color: #f0e68c;
  }
`;

// Container to align the search bar
const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
`;

const SearchBar = ({ searchQuery, setSearchQuery, placeholderKey }) => {
  const { t } = useTranslation();

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder={t(placeholderKey)}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </SearchContainer>
  );
};

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  placeholderKey: PropTypes.string,
};

export default SearchBar;
