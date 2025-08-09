import { useLocation } from 'react-router-dom';

const useTopBarVisibility = () => {
  const location = useLocation();

  const showTopBar = [
    '/faq',
    '/account',
    '/about',
    '/checkout',
    '/address',
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

  return showTopBar;
};

export default useTopBarVisibility;
