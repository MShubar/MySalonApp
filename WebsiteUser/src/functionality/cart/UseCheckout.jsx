import { useState, useEffect, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { API_URL, APP_URL } from '../../config'
import { ToastContext } from '../../context/ToastContext'

const useCheckout = () => {
  const { t } = useTranslation()
  const [cart, setCart] = useState([])
  const [address, setAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [successMsg, setSuccessMsg] = useState(false)
  const { success, error: toastError } = useContext(ToastContext)
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user'))
  )

  const deliveryTime = '60-120 mins'

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    const storedAddr = localStorage.getItem('deliveryAddress')
    if (storedCart) setCart(JSON.parse(storedCart))
    if (storedAddr) setAddress(JSON.parse(storedAddr))

    if (!user || !user.id) {
      toastError(t('You must be logged in to place an order'))
    }
  }, [user])

  const subtotal = cart.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0),
    0
  )
  const tax = subtotal * 0.1
  const deliveryFee = 1
  const total = subtotal + tax + deliveryFee

  const placeOrder = async () => {
    if (!address) {
      toastError(t('Address not set'))
      return
    }

    if (!user || !user.id) {
      toastError(t('User not logged in'))
      return
    }

    const orderPayload = {
      user_id: user.id,
      items: cart,
      coordinates: { lat: address.latLng[0], lng: address.latLng[1] },
      address,
      paymentMethod,
      total,
      deliveryTime
    }

    if (paymentMethod === 'benefit') {
      const query = new URLSearchParams({
        amount: total.toFixed(2),
        orderId: 'mock123456',
        'response-url': `${APP_URL}/payment-success?redirect=bookings`
      }).toString()

      window.location.href = `https://mock-benefit-gateway.com/pay?${query}`
    } else {
      try {
        await axios.post(`${API_URL}/orders`, orderPayload)
        success(t('Order placed successfully'))
        setSuccessMsg(true)
        setTimeout(() => {
          localStorage.removeItem('cart')
          localStorage.removeItem('deliveryAddress')
          setCart([])
          window.location.href = '/bookings'
        }, 2000)
      } catch (err) {
        console.error(
          'Failed to place order:',
          err.response?.data || err.message
        )
        toastError(t('Failed to place order'))
      }
    }
  }


  return {
    t,
    cart,
    address,
    paymentMethod,
    setPaymentMethod,
    successMsg,
    subtotal,
    tax,
    deliveryFee,
    total,
    deliveryTime,
    placeOrder,
    setUser
  }
}

export default useCheckout
