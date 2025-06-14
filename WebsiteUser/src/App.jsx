import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import SignIn from './components/Signin'
import SignUp from './components/Signup'
import NearestSalon from './components/NearestSalon'
import SalonDetails from './components/SalonDetails'
import SalonBooking from './components/SalonBooking'
import MyBookings from './components/MyBookings'
import Products from './components/Products'
import Packages from './components/Packages'
import Favorites from './components/Favorites'
import Training from './components/Training'
import Account from './components/Account'
import Home from './components/Home'
import EditProfile from './components/EditProfile'
import ChangePassword from './components/ChangePassword'
import backgroundImage from './assets/Background.png'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import AddressPage from './components/AddressPage'
import PaymentSuccess from './components/PaymentSuccessful'

const App = () => {
  const location = useLocation()
  const [userType, setUserType] = useState('Women')
  const [user, setUser] = useState(null)
  const [isUserLoaded, setIsUserLoaded] = useState(false)

  const showNavbar = !['/signin', '/signup', '/home'].includes(
    location.pathname
  )

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch {
        setUser(null)
      }
    } else {
      setUser(null)
    }
    setIsUserLoaded(true)
  }, [location])

  const userId = user?.id
  if (!isUserLoaded) return null

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      {showNavbar && (
        <Navbar
          user={user}
          setUser={setUser}
          userType={userType}
          setUserType={setUserType}
        />
      )}

      <div
        style={{
          padding: '1rem',
          paddingBottom: '80px',
          maxWidth: '100%'
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<NearestSalon userType={userType} userId={userId} />}
          />
          <Route path="/salon/:id" element={<SalonDetails userId={userId} />} />
          <Route
            path="/salon/:id/book"
            element={<SalonBooking userId={userId} />}
          />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/products" element={<Products />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/favorites" element={<Favorites userId={userId} />} />
          <Route path="/training" element={<Training />} />
          <Route path="/account" element={<Account user={user} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
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
        </Routes>
      </div>
    </div>
  )
}

export default App
