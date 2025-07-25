import React from 'react';
import styled from 'styled-components';
import useAccount from '../../functionality/auth/UseAccount';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  max-width: 600px;
  border-radius: 0.25rem;
  color: #f0f0f0;
  margin-left: auto;
  margin-right: auto;
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  color: #4f8ef7;
  font-weight: 700;
`;

const SectionTitle = styled.h4`
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #aaa;
  font-weight: 600;
  border-bottom: 1px solid #4f8ef7;
  padding-bottom: 0.5rem;
`;

const StyledCard = styled.div`
  background-color: #2a2a2a;
  color: #fff;
  margin-bottom: 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  padding: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #3a3a3a;
  }
`;

function Account() {
  const { t, goToEditProfile, goToChangePassword } = useAccount();
  const navigate = useNavigate();

  return (
    <Container>
      <Helmet>
        <title>{t('Account Settings')}</title>
      </Helmet>
      <Heading>{t('Account Settings')}</Heading>

      {/* Section 1: Account Settings */}
      <SectionTitle>{t('Profile & Security')}</SectionTitle>
      <StyledCard onClick={goToEditProfile}>{t('Edit Profile')}</StyledCard>
      <StyledCard onClick={goToChangePassword}>
        {t('Change Password')}
      </StyledCard>

      {/* Section 2: Information & Help */}
      <SectionTitle>{t('Help & Info')}</SectionTitle>
      <StyledCard onClick={() => navigate('/about')}>{t('About')}</StyledCard>
      <StyledCard onClick={() => navigate('/faq')}>{t('FAQ')}</StyledCard>
      <StyledCard onClick={() => navigate('/contact')}>
        {t('Contact Us')}
      </StyledCard>
      <StyledCard onClick={() => navigate('/privacy')}>
        {t('Privacy Policy')}
      </StyledCard>
    </Container>
  );
}

export default Account;
