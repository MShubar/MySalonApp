import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const useAccount = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    document.body.style.backgroundColor = '#121212';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const goToEditProfile = () => navigate('/edit-profile');
  const goToChangePassword = () => navigate('/change-password');

  return { t, goToEditProfile, goToChangePassword };
};

export default useAccount;
