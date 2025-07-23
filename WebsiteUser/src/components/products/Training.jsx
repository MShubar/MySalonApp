import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import Navbar from '../layout/Navbar'

const Container = styled.div`
  padding: 1rem;

  @media (min-width: var(--breakpoint-md)) {
    padding: 2rem;
  }
`

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;

  @media (max-width: var(--breakpoint-sm)) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`

const Title = styled.h6`
  font-weight: 700;
  margin: 0;
  color: #f0f8ff;

  @media (max-width: var(--breakpoint-sm)) {
    font-size: 1rem;
  }
`

const FilterButton = styled.button`
  background: transparent;
  border: 1px solid #777;
  color: #ccc;
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease, color 0.3s ease;

  &:hover {
    background: #4f8ef7;
    color: #fff;
    border-color: #4f8ef7;
  }

  @media (max-width: var(--breakpoint-sm)) {
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
  }
`

const Training = () => {
  const [showFilters, setShowFilters] = useState(false)
  const { t } = useTranslation()

  return (
    <Container>
      <Navbar />
      <HeaderRow>
        <Title>{t('training')}</Title>
        <FilterButton
          onClick={() => setShowFilters(!showFilters)}
          aria-expanded={showFilters}
        >
          <i className="bi bi-funnel-fill"></i>
        </FilterButton>
      </HeaderRow>

      {showFilters && (
        <div style={{ color: '#ccc' }}>
          {/* Add your filters here */}
          <p>Filters go here</p>
        </div>
      )}
    </Container>
  )
}

export default Training
