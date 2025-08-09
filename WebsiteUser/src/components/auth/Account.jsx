import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import useAccount from '../../functionality/auth/UseAccount';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import EditProfile from '../auth/EditProfile';
import ChangePassword from '../auth/ChangePassword';
import About from '../About';
import FAQ from '../Faq';
import ContactUs from '../contact/ContactUs';
import Privacy from '../legal/Privacy';
import {
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

const Container = styled.div`
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 200px;
  background-color: #1f1f1f;
  border-radius: 15px;
  color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  position: fixed;
`;

const DeskContainer = styled(Content)`
  padding: 0; /* Remove padding to move content to the top */
  margin-top: 0; /* Remove any margin that might push content down */
`;

const Heading = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const SectionTitle = styled.h4`
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--text-grey);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.5rem;
`;

const StyledCard = styled.div`
  background-color: var(--background);
  color: var(--white);
  margin-bottom: 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  padding: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--background-hover);
  }
`;
const MenuItem = styled.div`
  padding: 10px;
  margin: 5px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 15px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #3b3b3b;
  }

  &.active {
    background-color: #3b3b3b;
  }
`;

const Account = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [selectedKey, setSelectedKey] = useState('edit-profile');

  const { t, goToEditProfile, goToChangePassword } = useAccount();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    switch (selectedKey) {
      case 'edit-profile':
        return <EditProfile />;
      case 'change-password':
        return <ChangePassword />;
      case 'about':
        return <About />;
      case 'faq':
        return <FAQ />;
      case 'contact':
        return <ContactUs />;
      case 'privacy':
        return <Privacy />;
      default:
        return <EditProfile />;
    }
  };

  return isMobile ? (
    <Container>
      <Helmet>
        <title>{t('Account Settings')}</title>
      </Helmet>
      <Heading>{t('Account Settings')}</Heading>

      <SectionTitle>{t('Profile & Security')}</SectionTitle>
      <StyledCard onClick={goToEditProfile}>{t('Edit Profile')}</StyledCard>
      <StyledCard onClick={goToChangePassword}>
        {t('Change Password')}
      </StyledCard>

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
  ) : (
    <>
      <Helmet>
        <title>{t('Account Settings - Desktop')}</title>
      </Helmet>
      <Sidebar>
        <MenuItem
          className={selectedKey === 'edit-profile' ? 'active' : ''}
          onClick={() => setSelectedKey('edit-profile')}
        >
          <UserOutlined style={{ marginRight: '10px' }} />
          {t('Edit Profile')}
        </MenuItem>
        <MenuItem
          className={selectedKey === 'change-password' ? 'active' : ''}
          onClick={() => setSelectedKey('change-password')}
        >
          <LockOutlined style={{ marginRight: '10px' }} />
          {t('Change Password')}
        </MenuItem>
        <MenuItem
          className={selectedKey === 'about' ? 'active' : ''}
          onClick={() => setSelectedKey('about')}
        >
          <InfoCircleOutlined style={{ marginRight: '10px' }} />
          {t('About')}
        </MenuItem>
        <MenuItem
          className={selectedKey === 'faq' ? 'active' : ''}
          onClick={() => setSelectedKey('faq')}
        >
          <QuestionCircleOutlined style={{ marginRight: '10px' }} />
          {t('FAQ')}
        </MenuItem>
        <MenuItem
          className={selectedKey === 'contact' ? 'active' : ''}
          onClick={() => setSelectedKey('contact')}
        >
          <PhoneOutlined style={{ marginRight: '10px' }} />
          {t('Contact Us')}
        </MenuItem>
        <MenuItem
          className={selectedKey === 'privacy' ? 'active' : ''}
          onClick={() => setSelectedKey('privacy')}
        >
          <FileTextOutlined style={{ marginRight: '10px' }} />
          {t('Privacy Policy')}
        </MenuItem>
      </Sidebar>
      <DeskContainer>{renderContent()}</DeskContainer>
    </>
  );
};

export default Account;
