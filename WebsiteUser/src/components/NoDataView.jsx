import React from 'react';
import styled from 'styled-components';
import { MdSearchOff } from 'react-icons/md'; // Importing the "Search Off" icon

const NoDataContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #ccc;
  flex-direction: column;
  text-align: center;
`;

const NoDataIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
  color: #000; /* Black color for the icon */
`;

const NoDataMessage = styled.p`
  font-size: 1.2rem;
  color: #000; /* Black color for the text */
  margin: 0;
`;

const NoDataView = ({ message }) => {
  return (
    <NoDataContainer>
      <NoDataIcon>
        <MdSearchOff /> {/* Using the "Search Off" icon */}
      </NoDataIcon>
      <NoDataMessage>{message || 'No data found'}</NoDataMessage>
    </NoDataContainer>
  );
};

export default NoDataView;
