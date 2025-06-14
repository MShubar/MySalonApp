import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

const Checkout = () => {
  const { t } = useTranslation()
  const [cart, setCart] = useState([])
  const [address, setAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [successMsg, setSuccessMsg] = useState(false)

  const deliveryTime = '60-120 mins'

  useEffect(() => {
    const storedCart = localStorage.getItem('cart')
    const storedAddr = localStorage.getItem('deliveryAddress')
    if (storedCart) setCart(JSON.parse(storedCart))
    if (storedAddr) setAddress(JSON.parse(storedAddr))
  }, [])

  const subtotal = cart.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0),
    0
  )
  const tax = subtotal * 0.1
  const deliveryFee = 1
  const total = subtotal + tax + deliveryFee

  const placeOrder = async () => {
    if (!address) {
      alert(t('Address not set'))
      return
    }

    const orderPayload = {
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
        'response-url':
          'http://localhost:3000/payment-success?redirect=bookings'
      }).toString()

      window.location.href = `https://mock-benefit-gateway.com/pay?${query}`
    } else {
      try {
        await axios.post('http://localhost:5000/orders', orderPayload)
        setSuccessMsg(true)
        setTimeout(() => {
          localStorage.removeItem('cart')
          localStorage.removeItem('deliveryAddress')
          setCart([])
          window.location.href = '/bookings'
        }, 2000)
      } catch (err) {
        console.error('Failed to place order:', err)
        alert(t('Failed to place order'))
      }
    }
  }

  return (
    <div className="container mt-4" style={{ color: '#ddd' }}>
      {successMsg && (
        <div
          className="alert alert-success text-center fw-bold"
          role="alert"
          style={{ fontSize: '1.1rem' }}
        >
          {t('Order placed successfully. Redirecting to your orders...')}
        </div>
      )}

      <h2 className="text-center mb-4" style={{ color: '#80b3ff' }}>
        {t('Checkout')}
      </h2>

      {/* Delivery Address section */}
      <div
        className="border rounded p-3 mb-4"
        style={{ background: '#2a2a2a' }}
      >
        <h5>{t('Delivery Address')}</h5>
        {address ? (
          <>
            <p>
              {t('Building')}: {address.buildingNumber}, {t('Apt')}:{' '}
              {address.apartmentNumber || '—'}
            </p>
            <p>
              {t('Street')}: {address.street}, {t('Block')}: {address.block}
            </p>
            {address.note && (
              <p>
                {t('Note')}: {address.note}
              </p>
            )}
            <p>
              {t('Coordinates')}: {address.latLng[0].toFixed(4)},{' '}
              {address.latLng[1].toFixed(4)}
            </p>
            <div
              className="my-2"
              style={{ height: '200px', borderRadius: '10px' }}
            >
              <MapContainer
                center={address.latLng}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={address.latLng} />
              </MapContainer>
            </div>
            <button
              className="btn btn-sm btn-outline-light mt-2"
              onClick={() => (window.location.href = '/address')}
            >
              {t('Change Address')}
            </button>
          </>
        ) : (
          <>
            <p className="text-warning">{t('No address selected')}</p>
            <button
              className="btn btn-sm btn-outline-primary mt-2"
              onClick={() => (window.location.href = '/address')}
            >
              {t('Choose Address')}
            </button>
          </>
        )}
      </div>

      {/* Payment Method section */}
      <div
        className="border p-3 rounded mb-4"
        style={{ background: '#2a2a2a', color: '#f0f0f0' }}
      >
        <h5 className="mb-3">{t('Payment Method')}</h5>
        <div className="form-check form-check-inline">
          <input
            type="radio"
            id="benefit"
            value="benefit"
            checked={paymentMethod === 'benefit'}
            onChange={() => setPaymentMethod('benefit')}
            className="form-check-input"
          />
          <label htmlFor="benefit" className="form-check-label">
            {t('Benefit')}
          </label>
        </div>
        <div className="form-check form-check-inline ms-4">
          <input
            type="radio"
            id="cash"
            value="cash"
            checked={paymentMethod === 'cash'}
            onChange={() => setPaymentMethod('cash')}
            className="form-check-input"
          />
          <label htmlFor="cash" className="form-check-label">
            {t('Cash on Delivery')}
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div
        className="border p-4 rounded mb-4"
        style={{ background: '#1f1f1f' }}
      >
        <h5>{t('Order Summary')}</h5>
        <p>
          {t('Subtotal')}: {subtotal.toFixed(2)} BD
        </p>
        <p>
          {t('VAT (10%)')}: {tax.toFixed(2)} BD
        </p>
        <p>
          {t('Delivery Fee')}: {deliveryFee.toFixed(2)} BD
        </p>
        <hr />
        <h4>
          {t('Total')}: {total.toFixed(2)} BD
        </h4>
        <p className="mt-2">
          {t('Estimated delivery time')}: {deliveryTime}
        </p>
        <button
          className="btn btn-lg btn-primary mt-3 px-5"
          onClick={placeOrder}
        >
          {t('Place Order')}
        </button>
      </div>
    </div>
  )
}

export default Checkout
