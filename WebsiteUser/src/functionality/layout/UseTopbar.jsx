import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const useTopBar = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const goBack = () => navigate(-1);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang); // Change language
    document.body.dir = newLang === 'ar' ? 'rtl' : 'ltr'; // Change direction
    localStorage.setItem('language', newLang); // Store selected language in localStorage
  };

  return {
    goBack,
    currentLang: i18n.language,
    toggleLanguage,
  };
};

export default useTopBar;
