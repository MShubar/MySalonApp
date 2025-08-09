import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ServiceBadge = styled.span`
  border-radius: 20px;
  padding: 0.5rem 1rem;
  background-color: #254d8f;
  color: #f0f8ff;
  font-size: 0.8rem;
`;

const ToggleButton = styled.button`
  background-color: #0d6efd;
  color: #fff;
  border: none;
  font-size: 0.85rem;
  margin-top: 0.75rem;
  padding: 6px 18px;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(13, 110, 253, 0.3);

  &:hover {
    background-color: #3399ff;
    box-shadow: 0 6px 14px rgba(51, 153, 255, 0.4);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.5);
  }
`;

const SalonServices = ({ services, t }) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? services : services.slice(0, 6);

  return (
    <>
      <div className="mt-1 d-flex flex-wrap gap-2">
        {visible.map((service, i) => (
          <ServiceBadge key={i}>{t(service.name)}</ServiceBadge>
        ))}
      </div>
      {services.length > 6 && (
        <ToggleButton onClick={() => setShowAll((prev) => !prev)}>
          {showAll ? t('Show Less') : t('Show More')}
        </ToggleButton>
      )}
    </>
  );
};

SalonServices.propTypes = {
  services: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default SalonServices;
