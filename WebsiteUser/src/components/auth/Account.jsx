import React from 'react'
import styled from 'styled-components'
import useAccount from '../../functionality/auth/UseAccount'
import { Helmet } from 'react-helmet'

const Container = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  max-width: 600px;
  border-radius: 0.25rem;
  color: #f0f0f0;
  margin-left: auto;
  margin-right: auto;
`

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 1rem;
  color: #222;
  font-weight: 700;
`

const StyledCard = styled.div`
  background-color: #2a2a2a;
  color: #fff;
  margin-bottom: 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  padding: 1rem;
  font-weight: 500;
`

function Account() {
  const { t, goToEditProfile, goToChangePassword } = useAccount()

  return (
    <Container>
      <Helmet>
        <title>{t('Account Settings')}</title>
      </Helmet>
      <Heading>{t('Account Settings')}</Heading>

      <StyledCard onClick={goToEditProfile}>{t('Edit Profile')}</StyledCard>

      <StyledCard onClick={goToChangePassword}>
        {t('Change Password')}
      </StyledCard>
    </Container>
  )
}

export default Account
