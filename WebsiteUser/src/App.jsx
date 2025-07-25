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
import Footer from './components/layout/Footer';

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

// Cart & Checkout
import Cart from './components/cart/Cart';
import Checkout from './components/cart/Checkout';
import AddressPage from './components/cart/AddressPage';
import PaymentSuccess from './components/cart/PaymentSuccessful';
import NotFound from './components/NotFound';
import Privacy from './components/legal/Privacy';

// Misc
import backgroundImage from './assets/Background.png';
import { AppContext } from './context/AppContext';
import ScrollToTop from './components/ScrollToTop';

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

  const showNavbar = !['/signin', '/signup'].includes(location.pathname);

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

      <div
        style={{
          padding: '1rem',
          paddingBottom: '80px',
          maxWidth: '100%',
        }}
      >
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Routes>
                <Route
                  path="/"
                  element={<NearestSalon userType={userType} userId={userId} />}
                />
                <Route
                  path="/salon/:id"
                  element={<SalonDetails userId={userId} />}
                />
                <Route
                  path="/salon/:id/book"
                  element={<SalonBooking userId={userId} />}
                />
                <Route path="/bookings" element={<MyBookings />} />
                <Route path="/bookings/:id" element={<BookingDetailsPage />} />
                <Route path="/orders/:id" element={<OrderDetailsPage />} />

                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/packages" element={<Packages />} />
                <Route
                  path="/favorites"
                  element={<Favorites userId={userId} userType={userType} />}
                />
                <Route path="/about" element={<About />} />
                <Route path="/training" element={<Training />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/account" element={<Account user={user} />} />

                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                  path="/edit-profile"
                  element={<EditProfile userId={userId} />}
                />
                <Route
                  path="/change-password"
                  element={<ChangePassword userId={userId} />}
                />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/address" element={<AddressPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </div>
      <ScrollToTop />
      <Footer />
    </div>
  );
};

export default App;
