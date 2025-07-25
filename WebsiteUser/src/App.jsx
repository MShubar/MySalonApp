import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary.jsx';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({ showSpinner: false });
import './styles/variables.css';
import { AnimatePresence, motion } from 'framer-motion';

// Layout
import Navbar from './components/layout/Navbar';
import TopBar from './components/layout/TopBar';

// Auth
import SignIn from './components/auth/Signin';
import SignUp from './components/auth/Signup';
import Account from './components/auth/Account';
import EditProfile from './components/auth/EditProfile';
import ChangePassword from './components/auth/ChangePassword';

// Salons
import NearestSalon from './components/salons/NearestSalon';
import SalonDetails from './components/salons/SalonDetails';

// Orders & Bookings
import SalonBooking from './components/orders/SalonBooking';
import MyBookings from './components/orders/MyBookings';
import BookingDetailsPage from './components/orders/BookingDetailsPage';
import OrderDetailsPage from './components/orders/OrderDetailsPage';

// Products & Packages
import Products from './components/products/Products';
import Packages from './components/products/Packages';
import Favorites from './components/products/Favorites';
import Training from './components/products/Training';
import ProductDetails from './components/products/ProductDetails';
import About from './components/About';
import ContactUs from './components/contact/ContactUs';
import FAQ from './components/FAQ';
import Privacy from './components/legal/Privacy';

// Cart & Checkout
import Cart from './components/cart/Cart';
import Checkout from './components/cart/Checkout';
import AddressPage from './components/cart/AddressPage';
import PaymentSuccess from './components/cart/PaymentSuccessful';
import NotFound from './components/NotFound';

// Misc
import backgroundImage from './assets/Background.png';
import { AppContext } from './context/AppContext';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition.jsx';

const App = () => {
  const location = useLocation();
  const [userType, setUserType] = useState('Women');
  const { user, authLoaded } = useContext(AppContext);

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const showNavbar = ![
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
  ].includes(location.pathname);
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
  ].includes(location.pathname);

  const userId = user?.id;

  if (!authLoaded) return null;

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {showNavbar && (
        <Navbar user={user} userType={userType} setUserType={setUserType} />
      )}
      {showTopBar && <TopBar />}

      <div style={{ padding: '1rem', paddingBottom: '80px', maxWidth: '100%' }}>
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <NearestSalon userType={userType} userId={userId} />
                  </PageTransition>
                }
              />
              <Route
                path="/salon/:id"
                element={
                  <PageTransition>
                    <SalonDetails userId={userId} />
                  </PageTransition>
                }
              />
              <Route
                path="/salon/:id/book"
                element={
                  <PageTransition>
                    <SalonBooking userId={userId} />
                  </PageTransition>
                }
              />
              <Route
                path="/bookings"
                element={
                  <PageTransition>
                    <MyBookings />
                  </PageTransition>
                }
              />
              <Route
                path="/bookings/:id"
                element={
                  <PageTransition>
                    <BookingDetailsPage />
                  </PageTransition>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <PageTransition>
                    <OrderDetailsPage />
                  </PageTransition>
                }
              />
              <Route
                path="/products"
                element={
                  <PageTransition>
                    <Products />
                  </PageTransition>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <PageTransition>
                    <ProductDetails />
                  </PageTransition>
                }
              />
              <Route
                path="/packages"
                element={
                  <PageTransition>
                    <Packages />
                  </PageTransition>
                }
              />
              <Route
                path="/favorites"
                element={
                  <PageTransition>
                    <Favorites userId={userId} userType={userType} />
                  </PageTransition>
                }
              />
              <Route
                path="/about"
                element={
                  <PageTransition>
                    <About />
                  </PageTransition>
                }
              />
              <Route
                path="/faq"
                element={
                  <PageTransition>
                    <FAQ />
                  </PageTransition>
                }
              />
              <Route
                path="/training"
                element={
                  <PageTransition>
                    <Training />
                  </PageTransition>
                }
              />
              <Route
                path="/contact"
                element={
                  <PageTransition>
                    <ContactUs />
                  </PageTransition>
                }
              />
              <Route
                path="/account"
                element={
                  <PageTransition>
                    <Account user={user} />
                  </PageTransition>
                }
              />
              <Route
                path="/signin"
                element={
                  <PageTransition>
                    <SignIn />
                  </PageTransition>
                }
              />
              <Route
                path="/signup"
                element={
                  <PageTransition>
                    <SignUp />
                  </PageTransition>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <PageTransition>
                    <EditProfile userId={userId} />
                  </PageTransition>
                }
              />
              <Route
                path="/change-password"
                element={
                  <PageTransition>
                    <ChangePassword userId={userId} />
                  </PageTransition>
                }
              />
              <Route
                path="/cart"
                element={
                  <PageTransition>
                    <Cart />
                  </PageTransition>
                }
              />
              <Route
                path="/checkout"
                element={
                  <PageTransition>
                    <Checkout />
                  </PageTransition>
                }
              />
              <Route
                path="/address"
                element={
                  <PageTransition>
                    <AddressPage />
                  </PageTransition>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <PageTransition>
                    <PaymentSuccess />
                  </PageTransition>
                }
              />
              <Route
                path="/privacy"
                element={
                  <PageTransition>
                    <Privacy />
                  </PageTransition>
                }
              />
              <Route
                path="*"
                element={
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </div>

      <ScrollToTop />
    </div>
  );
};

export default App;
