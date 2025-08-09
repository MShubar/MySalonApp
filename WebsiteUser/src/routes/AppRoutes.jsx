import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import NearestSalon from '../components/salons/NearestSalon';
import SalonDetails from '../components/salons/SalonDetails';
import SalonBooking from '../components/orders/SalonBooking';
import MyBookings from '../components/orders/MyBookings';
import BookingDetailsPage from '../components/orders/BookingDetailsPage';
import OrderDetailsPage from '../components/orders/OrderDetailsPage';
import Products from '../components/products/Products';
import ProductDetails from '../components/products/ProductDetails';
import Packages from '../components/products/Packages';
import Favorites from '../components/products/Favorites';
import Training from '../components/products/Training';
import TrainingDetails from '../components/products/TrainingDetails';
import About from '../components/About';
import ContactUs from '../components/contact/ContactUs';
import FAQ from '../components/FAQ';
import Privacy from '../components/legal/Privacy';
import Cart from '../components/cart/Cart';
import Checkout from '../components/cart/Checkout';
import AddressPage from '../components/cart/AddressPage';
import PaymentSuccess from '../components/cart/PaymentSuccessful';
import NotFound from '../components/NotFound';
import SignIn from '../components/auth/Signin';
import SignUp from '../components/auth/Signup';
import Account from '../components/auth/Account';
import EditProfile from '../components/auth/EditProfile';
import ChangePassword from '../components/auth/ChangePassword';

const AppRoutes = ({ userType }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PageTransition>
            <NearestSalon userType={userType} />
          </PageTransition>
        }
      />
      <Route
        path="/salon/:id"
        element={
          <PageTransition>
            <SalonDetails />
          </PageTransition>
        }
      />
      <Route
        path="/salon/:id/book"
        element={
          <PageTransition>
            <SalonBooking />
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
            <Favorites userType={userType} />
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
        path="/training/:id"
        element={
          <PageTransition>
            <TrainingDetails />
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
            <Account />
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
            <EditProfile />
          </PageTransition>
        }
      />
      <Route
        path="/change-password"
        element={
          <PageTransition>
            <ChangePassword />
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
  );
};

export default AppRoutes;
