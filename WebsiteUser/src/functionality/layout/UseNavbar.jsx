import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../config';
import { UserContext } from '../../context/UserContext'; // Import UserContext

const useNavbar = () => {
  const { user } = useContext(UserContext); // Access user from UserContext
  const { setUser } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const [types, setTypes] = useState([]);
  const [currentIcon, setCurrentIcon] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios
      .get(`${API_URL}/types`)
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setTypes(data);
          const selected = data.find((t) => t.type_name === user?.type);
          if (selected) setCurrentIcon(selected.image_url);
        }
      })
      .catch((err) => {
        setTypes(new Set());
      });
  }, [user?.type]); // Add `user?.type` as a dependency

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.body.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', newLang);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null); // Now using UserContext's setUser
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Nearest Salons' },
    { to: '/bookings', label: 'Bookings & Orders' },
    { to: '/products', label: 'Products' },
    { to: '/packages', label: 'Packages' },
    { to: '/training', label: 'Training' },

    ...(user?.type === 'women' || user?.type === 'men'
      ? [{ to: '/training', label: 'Training' }]
      : []),
  ];

  return {
    t,
    i18n,
    types,
    currentIcon,
    setCurrentIcon,
    toggleLanguage,
    handleLogout,
    navLinks,
    navigate,
    location,
    user,
  };
};

export default useNavbar;
