import React from 'react'
import { Helmet } from 'react-helmet'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  color: #ddd;
`

const Heading = styled.h2`
  color: #222;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
`

const Paragraph = styled.p`
  line-height: 1.6;
  margin-bottom: 1rem;
`

const About = () => {
  const { t } = useTranslation()

  return (
    <Container>
      <Helmet>
        <title>{t('About')}</title>
      </Helmet>
      <Heading>{t('About')}</Heading>
      <Paragraph>
        MySalon connects you with trusted salons and stylists for quality beauty
        and grooming services.
      </Paragraph>
      <Paragraph>
        Discover exclusive offers and book appointments effortlessly to keep you
        looking your best.
      </Paragraph>
    </Container>
  )
}

export default About
