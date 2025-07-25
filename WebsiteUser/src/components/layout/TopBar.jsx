import React from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { FaGlobe } from 'react-icons/fa'
import styled from 'styled-components'
import useTopBar from '../../functionality/layout/UseTopbar'

const Container = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1;

  @media (max-width: var(--breakpoint-sm)) {
    flex-direction: column;
    gap: 0.5rem;
  }
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: #222;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #4f8ef7;
  }
`

const LangButton = styled.button`
  background: #1f1f1f;
  color: #f0f8ff;
  border: none;
  border-radius: 999px;
  padding: 0.4rem 0.8rem;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #4f8ef7;
    color: #fff;
  }

  @media (max-width: var(--breakpoint-sm)) {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
  }
`

const TopBar = () => {
  const { goBack, currentLang, toggleLanguage } = useTopBar()

  return (
    <Container>
      <BackButton onClick={goBack} aria-label="Back">
        <BiArrowBack size={24} />
      </BackButton>

      <LangButton onClick={toggleLanguage}>
        <span>{currentLang === 'en' ? 'العربية' : 'English'}</span>
        <FaGlobe />
      </LangButton>
    </Container>
  )
}

export default TopBar
