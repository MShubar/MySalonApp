import { useLocation } from 'react-router-dom';

const useNavbarVisibility = () => {
  const location = useLocation();
  const isDesktop = window.innerWidth > 768; // Detect if the screen is desktop size

  const showNavbar =
    isDesktop ||
    ![
      '/signin',
      '/signup',
      '/checkout',
      '/address',
      '/about',
      '/account',
      '/faq',
      '/contact',
      '/edit-profile',
      '/change-password',
      '/privacy',
      '/cart',
    ].some(
      (route) =>
        location.pathname.startsWith(route) ||
        location.pathname.match(/^\/bookings\/\d+/) ||
        location.pathname.match(/^\/orders\/\d+/) ||
        location.pathname.match(/^\/salon\/\d+/) ||
        location.pathname.match(/^\/products\/\d+/)
    );

  return showNavbar;
};

export default useNavbarVisibility;
