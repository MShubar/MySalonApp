import React from 'react'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  text-align: center;
  padding: 1rem;
  background-color: #121212;
  color: #f0f8ff;
`

const TopLink = styled.a`
  color: #4f8ef7;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const Footer = () => (
  <FooterContainer>
    <TopLink
      href="#top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      Back to Top
    </TopLink>
  </FooterContainer>
)

export default Footer
