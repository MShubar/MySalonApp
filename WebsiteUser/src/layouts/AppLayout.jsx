import React from 'react';
import styled from 'styled-components';
import Navbar from '../components/layout/Navbar';
import TopBar from '../components/layout/TopBar';
import backgroundImage from '../assets/Background.png';
import ScrollToTop from '../components/ScrollToTop';
import useNavbarVisibility from '../routes/UseNavbarVisibility';
import useTopBarVisibility from '../routes/UseTopBarVisibility';

const LayoutContainer = styled.div`
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  width: 100%;
`;

const ContentWrapper = styled.div`
  padding: 1rem;
  padding-bottom: 80px;
  max-width: 100%;
`;

const AppLayout = ({ userType, setUserType, children }) => {
  const showNavbar = useNavbarVisibility();
  const showTopBar = useTopBarVisibility();

  return (
    <LayoutContainer>
      {showNavbar && <Navbar userType={userType} setUserType={setUserType} />}
      {showTopBar && <TopBar />}

      <ContentWrapper>{children}</ContentWrapper>

      <ScrollToTop />
    </LayoutContainer>
  );
};

export default AppLayout;
