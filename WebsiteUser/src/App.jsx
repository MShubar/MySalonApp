import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary.jsx';
import { AnimatePresence } from 'framer-motion';
import './styles/variables.css';
import { UserContext } from './context/UserContext';
import AppRoutes from './routes/AppRoutes';
import useProgressBar from './logic/UseProgressBar';
import AppLayout from './layouts/AppLayout';

export default function App() {
  const location = useLocation();
  const { authLoaded } = useContext(UserContext);
  const [userType, setUserType] = useState(
    () => localStorage.getItem('userType') || 'women'
  );

  useProgressBar(location.pathname);

  if (!authLoaded) return null;

  return (
    <AppLayout userType={userType} setUserType={setUserType}>
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <AppRoutes userType={userType} />
        </AnimatePresence>
      </ErrorBoundary>
    </AppLayout>
  );
}
