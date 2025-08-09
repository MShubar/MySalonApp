import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { API_URL, APP_URL } from '../../config';
import { UserContext } from '../../context/UserContext'; // Import UserContext

const useCheckout = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext); // Access user from UserContext
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [successMsg, setSuccessMsg] = useState(false);
  const [logoutMsg, setLogoutMsg] = useState(false);

  const deliveryTime = '60-120 mins';

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedAddr = localStorage.getItem('deliveryAddress');
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedAddr) setAddress(JSON.parse(storedAddr));

    if (!user || !user.id) {
      setLogoutMsg(true);
      setTimeout(() => setLogoutMsg(false), 2500);
    }
  }, [user]); // Dependency on user from context

  const subtotal = cart.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0),
    0
  );
  const tax = subtotal * 0.1;
  const deliveryFee = 1;
  const total = subtotal + tax + deliveryFee;

  const placeOrder = async () => {
    if (!address) {
      showOverlay(t('Address not set'));
      return;
    }

    if (!user || !user.id) {
      showOverlay(t('User not logged in'));
      return;
    }

    const orderPayload = {
      user_id: user.id,
      items: cart,
      coordinates: { lat: address.latLng[0], lng: address.latLng[1] },
      address,
      paymentMethod,
      total,
      deliveryTime,
    };

    if (paymentMethod === 'benefit') {
      const query = new URLSearchParams({
        amount: total.toFixed(2),
        orderId: 'mock123456',
        'response-url': `${APP_URL}/payment-success?redirect=bookings`,
      }).toString();

      window.location.href = `https://mock-benefit-gateway.com/pay?${query}`;
    } else {
      try {
        await axios.post(`${API_URL}/orders`, orderPayload);
        setSuccessMsg(true);
        setTimeout(() => {
          localStorage.removeItem('cart');
          localStorage.removeItem('deliveryAddress');
          setCart([]);
          window.location.href = '/bookings';
        }, 2000);
      } catch (err) {
        console.error(
          'Failed to place order:',
          err.response?.data || err.message
        );
        showOverlay(t('Failed to place order'));
      }
    }
  };

  const showOverlay = (message) => {
    setLogoutMsg(message);
    setTimeout(() => setLogoutMsg(false), 2500);
  };

  return {
    t,
    cart,
    address,
    paymentMethod,
    setPaymentMethod,
    successMsg,
    logoutMsg,
    subtotal,
    tax,
    deliveryFee,
    total,
    deliveryTime,
    placeOrder,
  };
};

export default useCheckout;
